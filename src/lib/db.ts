import pg from 'pg';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('[DASH-DB] idle client error:', err.message);
});

const UTM_COLUMNS = ['utm_source', 'utm_medium', 'utm_campaign'] as const;
const PROBELTEC_COLUMNS = ['probeltec_status', 'probeltec_synced_at'] as const;
const OPTIONAL_LEAD_COLUMNS = [...UTM_COLUMNS, ...PROBELTEC_COLUMNS];

async function getAvailableColumns(client: pg.PoolClient, columns: string[]): Promise<Set<string>> {
  const res = await client.query<{ column_name: string }>(
    `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'leads'
        AND table_schema = ANY(current_schemas(false))
        AND column_name = ANY($1::text[])
    `,
    [columns],
  );
  return new Set(res.rows.map((row) => row.column_name));
}

export interface Lead {
  phone: string;
  name: string | null;
  origin: string | null;
  course_interest: string | null;
  status: 'NOVO' | 'QUALIFICADO' | 'INTERESSADO' | 'CHECKOUT_ENVIADO' | 'CHECKOUT_PAGO';
  last_message: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  updated_at: string;
  probeltec_synced_at: string | null;
  probeltec_status: string | null;
}

export async function fetchLeads(status?: string): Promise<Lead[]> {
  if (!process.env.DATABASE_URL) return [];

  let client;
  try {
    client = await pool.connect();
    const statuses = status
      ? status.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const where = statuses.length > 0 ? `WHERE status = ANY($1::text[])` : '';
    const params = statuses.length > 0 ? [statuses] : [];
    const availCols = await getAvailableColumns(client, OPTIONAL_LEAD_COLUMNS);
    const utmSourceSelect = availCols.has('utm_source') ? 'utm_source' : 'NULL::text AS utm_source';
    const utmMediumSelect = availCols.has('utm_medium') ? 'utm_medium' : 'NULL::text AS utm_medium';
    const utmCampaignSelect = availCols.has('utm_campaign') ? 'utm_campaign' : 'NULL::text AS utm_campaign';
    const probeltecStatusSelect = availCols.has('probeltec_status') ? 'probeltec_status' : 'NULL::text AS probeltec_status';
    const probeltecSyncedSelect = availCols.has('probeltec_synced_at') ? 'probeltec_synced_at' : 'NULL::timestamptz AS probeltec_synced_at';

    const res = await client.query<Lead>(
      `SELECT phone, name, origin, course_interest, status, last_message,
              ${utmSourceSelect}, ${utmMediumSelect}, ${utmCampaignSelect},
              COALESCE(updated_at, NOW()) AS updated_at,
              ${probeltecSyncedSelect}, ${probeltecStatusSelect}
       FROM leads
       ${where}
       ORDER BY
         CASE status
           WHEN 'PIX_PAGO'    THEN 1
           WHEN 'PIX_GERADO'  THEN 2
           WHEN 'INTERESSADO' THEN 3
           WHEN 'QUALIFICADO' THEN 4
           ELSE 5
         END,
         updated_at DESC NULLS LAST
       LIMIT 200`,
      params,
    );
    return res.rows;
  } catch (err) {
    console.error('[DASH-DB] fetchLeads error:', err);
    return [];
  } finally {
    client?.release();
  }
}

export async function countByStatus(): Promise<Record<string, number>> {
  if (!process.env.DATABASE_URL) return {};
  let client;
  try {
    client = await pool.connect();
    const res = await client.query<{ status: string; count: string }>(
      `SELECT status, COUNT(*) as count FROM leads GROUP BY status`,
    );
    return Object.fromEntries(res.rows.map((r) => [r.status, Number(r.count)]));
  } catch (err) {
    console.error('[DASH-DB] countByStatus error:', err);
    return {};
  } finally {
    client?.release();
  }
}

// ── Visão do Gestor ────────────────────────────────────────────────────────

export interface OwnerSummary {
  total: number;
  movimentados_hoje: number;
  novo: number;
  qualificado: number;
  interessado: number;
  pix_gerado: number;
  pix_pago: number;
}

export async function getOwnerSummary(): Promise<OwnerSummary> {
  const empty: OwnerSummary = {
    total: 0, movimentados_hoje: 0, novo: 0,
    qualificado: 0, interessado: 0, pix_gerado: 0, pix_pago: 0,
  };
  if (!process.env.DATABASE_URL) return empty;
  let client;
  try {
    client = await pool.connect();
    const res = await client.query<Record<string, number>>(`
      SELECT
        COUNT(*)::int                                                           AS total,
        COUNT(*) FILTER (WHERE updated_at > NOW() - INTERVAL '24 hours')::int  AS movimentados_hoje,
        COUNT(*) FILTER (WHERE status = 'NOVO')::int                            AS novo,
        COUNT(*) FILTER (WHERE status = 'QUALIFICADO')::int                     AS qualificado,
        COUNT(*) FILTER (WHERE status = 'INTERESSADO')::int                     AS interessado,
        COUNT(*) FILTER (WHERE status = 'PIX_GERADO')::int                      AS pix_gerado,
        COUNT(*) FILTER (WHERE status = 'PIX_PAGO')::int                        AS pix_pago
      FROM leads
    `);
    const r = res.rows[0];
    return {
      total:             Number(r.total),
      movimentados_hoje: Number(r.movimentados_hoje),
      novo:              Number(r.novo),
      qualificado:       Number(r.qualificado),
      interessado:       Number(r.interessado),
      pix_gerado:        Number(r.pix_gerado),
      pix_pago:          Number(r.pix_pago),
    };
  } catch (err) {
    console.error('[DASH-DB] getOwnerSummary error:', err);
    return empty;
  } finally {
    client?.release();
  }
}

export interface FunnelStep {
  status: string;
  label: string;
  count: number;
  percent: number;
}

export async function getFunnelStats(): Promise<FunnelStep[]> {
  if (!process.env.DATABASE_URL) return [];
  const STEPS = [
    { status: 'NOVO',        label: 'Novos' },
    { status: 'QUALIFICADO', label: 'Qualificados' },
    { status: 'INTERESSADO', label: 'Interessados' },
    { status: 'PIX_GERADO',  label: 'Pix Gerado' },
    { status: 'PIX_PAGO',    label: 'Pagos' },
  ];
  let client;
  try {
    client = await pool.connect();
    const res = await client.query<{ status: string; count: string }>(
      `SELECT status, COUNT(*)::int AS count FROM leads GROUP BY status`,
    );
    const counts: Record<string, number> = {};
    for (const row of res.rows) counts[row.status] = Number(row.count);
    const raw = STEPS.map((s) => ({ ...s, count: counts[s.status] ?? 0 }));
    const max = Math.max(...raw.map((s) => s.count), 1);
    return raw.map((s) => ({ ...s, percent: Math.round((s.count / max) * 100) }));
  } catch (err) {
    console.error('[DASH-DB] getFunnelStats error:', err);
    return [];
  } finally {
    client?.release();
  }
}

export interface SourceStat {
  fonte: string;
  total: number;
  matriculas: number;
  conversoes: number;
  taxa: number;
}

export async function getSourceStats(): Promise<SourceStat[]> {
  if (!process.env.DATABASE_URL) return [];
  let client;
  try {
    client = await pool.connect();
    const utmColumns = await getAvailableColumns(client, ['utm_source']);
    const sourceExpr = utmColumns.has('utm_source')
      ? `COALESCE(NULLIF(TRIM(utm_source), ''), NULLIF(TRIM(origin), ''), 'direto')`
      : `COALESCE(NULLIF(TRIM(origin), ''), 'direto')`;
    const res = await client.query<{
      fonte: string; total: number; matriculas: number; conversoes: number;
    }>(`
      SELECT
        ${sourceExpr} AS fonte,
        COUNT(*)::int                                                                AS total,
        COUNT(*) FILTER (WHERE status = 'PIX_PAGO')::int                            AS matriculas,
        COUNT(*) FILTER (WHERE status IN ('PIX_PAGO', 'PIX_GERADO'))::int           AS conversoes
      FROM leads
      GROUP BY fonte
      ORDER BY total DESC
      LIMIT 10
    `);
    return res.rows.map((r) => ({
      fonte:     r.fonte,
      total:     Number(r.total),
      matriculas: Number(r.matriculas),
      conversoes: Number(r.conversoes),
      taxa:      Number(r.total) > 0
        ? Math.round((Number(r.matriculas) / Number(r.total)) * 100)
        : 0,
    }));
  } catch (err) {
    console.error('[DASH-DB] getSourceStats error:', err);
    return [];
  } finally {
    client?.release();
  }
}

export interface StalledLead {
  phone: string;
  name: string | null;
  status: string;
  updated_at: string;
  horas_parado: number;
}

export async function getStalledLeads(): Promise<StalledLead[]> {
  if (!process.env.DATABASE_URL) return [];
  let client;
  try {
    client = await pool.connect();
    const res = await client.query<{
      phone: string; name: string | null; status: string;
      updated_at: string; horas_parado: string;
    }>(`
      SELECT
        phone,
        name,
        status,
        COALESCE(updated_at, NOW()) AS updated_at,
        ROUND(EXTRACT(EPOCH FROM (NOW() - COALESCE(updated_at, NOW()))) / 3600) AS horas_parado
      FROM leads
      WHERE status IN ('INTERESSADO', 'QUALIFICADO')
        AND COALESCE(updated_at, NOW()) < NOW() - INTERVAL '48 hours'
      ORDER BY updated_at ASC
      LIMIT 20
    `);
    return res.rows.map((r) => ({
      phone:         r.phone,
      name:          r.name,
      status:        r.status,
      updated_at:    r.updated_at,
      horas_parado:  Math.round(Number(r.horas_parado)),
    }));
  } catch (err) {
    console.error('[DASH-DB] getStalledLeads error:', err);
    return [];
  } finally {
    client?.release();
  }
}

// ── Follow-up State (control plane snapshot) ───────────────────────────────

export interface FollowupLead {
  lead_id: string;
  phone_e164: string;
  email: string | null;
  name: string | null;
  status_canon: 'novo' | 'contato' | 'matricula' | 'perdido' | 'pausado' | 'unknown_status';
  source_canon: string;
  media_canon: string;
  utm_source: string | null;
  utm_campaign: string | null;
  owner: 'bella' | 'gerente' | 'sistema';
  email_state: string;
  whatsapp_state: string;
  sms_state: string;
  next_action_at: string | null;
  next_channel: string | null;
  attempt_count: number;
  last_action: string | null;
  last_result: string | null;
  block_reason: string | null;
  probeltec_status: string | null;
}

function getFollowupStatePath(): string {
  return (
    process.env.FOLLOWUP_STATE_PATH
    || path.join(process.cwd(), 'data', 'followup-state.json')
  );
}

export async function fetchFollowupLeads(statusFilter?: string): Promise<FollowupLead[]> {
  if (!process.env.DATABASE_URL) return [];
  let client;
  try {
    client = await pool.connect();

    const availCols = await getAvailableColumns(client, [...UTM_COLUMNS, 'probeltec_status']);
    const utmSourceSel = availCols.has('utm_source') ? 'utm_source' : 'NULL::text AS utm_source';
    const utmMediumSel = availCols.has('utm_medium') ? 'utm_medium AS media_canon' : 'NULL::text AS media_canon';
    const utmCampaignSel = availCols.has('utm_campaign') ? 'utm_campaign' : 'NULL::text AS utm_campaign';
    const probeltecStatusSel = availCols.has('probeltec_status') ? 'probeltec_status' : 'NULL::text AS probeltec_status';

    // 1. Buscar leads base
    const leadsRes = await client.query(`
      SELECT phone AS lead_id, phone AS phone_e164, email, name, status,
             origin AS source_canon, ${utmMediumSel},
             ${utmSourceSel}, ${utmCampaignSel}, ${probeltecStatusSel}
      FROM leads
    `);
    
    // 2. Buscar eventos para agregação
    const eventsRes = await client.query(`
      SELECT lead_id, event_type, result, notes, created_at 
      FROM followup_events 
      ORDER BY created_at ASC
    `).catch(() => ({ rows: [] })); // Tabela pode não existir ainda

    const stateMap = new Map<string, FollowupLead>();
    
    for (const l of leadsRes.rows) {
      let canonStatus = 'novo';
      if (l.status === 'QUALIFICADO') canonStatus = 'contato';
      if (l.status === 'INTERESSADO') canonStatus = 'contato';
      if (l.status === 'PIX_GERADO') canonStatus = 'matricula';
      if (l.status === 'PIX_PAGO') canonStatus = 'matricula';
      
      stateMap.set(l.lead_id, {
        lead_id: l.lead_id,
        phone_e164: l.phone_e164,
        email: l.email,
        name: l.name,
        status_canon: canonStatus as any,
        source_canon: l.source_canon || 'direto',
        media_canon: l.media_canon || '',
        utm_source: l.utm_source,
        utm_campaign: l.utm_campaign,
        owner: 'bella',
        email_state: 'pending',
        whatsapp_state: 'pending',
        sms_state: 'pending',
        attempt_count: 0,
        next_action_at: null,
        next_channel: null,
        last_action: null,
        last_result: null,
        block_reason: null,
        probeltec_status: l.probeltec_status || null
      });
    }

    const EVENT_TO_STATE: Record<string, [string, string|null]> = {
      'email.queued': ['email_state', 'queued'],
      'email.sent': ['email_state', 'sent'],
      'email.delivered': ['email_state', 'delivered'],
      'email.opened': ['email_state', 'opened'],
      'email.clicked': ['email_state', 'clicked'],
      'email.replied': ['email_state', 'replied'],
      'email.failed': ['email_state', 'failed'],
      'whatsapp.queued': ['whatsapp_state', 'queued'],
      'whatsapp.sent': ['whatsapp_state', 'sent'],
      'whatsapp.delivered': ['whatsapp_state', 'delivered'],
      'whatsapp.replied': ['whatsapp_state', 'replied'],
      'whatsapp.failed': ['whatsapp_state', 'failed']
    };

    for (const ev of eventsRes.rows) {
      const row = stateMap.get(ev.lead_id);
      if (!row) continue;
      
      const mapping = EVENT_TO_STATE[ev.event_type];
      if (mapping) {
        const [target_key, fixed_value] = mapping;
        (row as any)[target_key] = fixed_value;
      }
      
      row.last_action = ev.event_type;
      row.last_result = ev.result || (mapping ? mapping[1] : null);
      row.attempt_count += 1;
    }

    const allRows = Array.from(stateMap.values());
    const filter = (statusFilter || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (filter.length === 0) return allRows;
    return allRows.filter((row) => filter.includes(row.status_canon));
  } catch (err) {
    console.error('[DASH-DB] fetchFollowupLeads error:', err);
    return [];
  } finally {
    client?.release();
  }
}

export async function countFollowupByStatus(): Promise<Record<string, number>> {
  const rows = await fetchFollowupLeads();
  const counts: Record<string, number> = {};
  for (const row of rows) {
    counts[row.status_canon] = (counts[row.status_canon] || 0) + 1;
  }
  return counts;
}
