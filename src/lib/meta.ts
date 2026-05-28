export interface MetaCampaign {
  campaign_name: string;
  spend: number;
  impressions: number;
  clicks: number;
  cpc: number;
  cpm: number;
  landing_page_views: number;
}

// ── Variáveis de ambiente suportadas ─────────────────────────────
//
// Período (prioridade decrescente):
//   META_DATE_START + META_DATE_END  → range customizado (YYYY-MM-DD)
//   META_DATE_PRESET                 → preset direto da API Meta
//                                      ex: last_7d, last_30d, this_month, last_month
//   META_LOOKBACK_DAYS               → mapeia para preset last_{n}d (7/14/28/30/90)
//                                      padrão: 30
//
// Filtros adicionais:
//   META_CAMPAIGN_STATUS  → statuses separados por vírgula
//                           ex: ACTIVE  ou  ACTIVE,PAUSED
//                           padrão: sem filtro (todas)
//   META_LEVEL            → nível de agregação: campaign | adset | ad
//                           padrão: campaign
//   META_INCLUDE_TEST     → incluir campanhas com nome iniciando em "Test"
//                           padrão: false (filtradas)
// ─────────────────────────────────────────────────────────────────

const TEST_PATTERN = /^test[\s\-]/i;

const VALID_PRESETS = new Set([
  'today', 'yesterday', 'last_3d', 'last_7d', 'last_14d',
  'last_28d', 'last_30d', 'last_90d', 'this_week_mon_today',
  'last_week_mon_sun', 'this_month', 'last_month', 'this_quarter',
  'last_year', 'this_year', 'maximum',
]);

const VALID_LEVELS  = new Set(['campaign', 'adset', 'ad']);
const VALID_STATUSES = new Set(['ACTIVE', 'PAUSED', 'DELETED', 'ARCHIVED']);

function resolveTimeParam(): Record<string, string> {
  const start = process.env.META_DATE_START?.trim();
  const end   = process.env.META_DATE_END?.trim();
  if (start && end) {
    return { time_range: JSON.stringify({ since: start, until: end }) };
  }

  const preset = process.env.META_DATE_PRESET?.trim();
  if (preset && VALID_PRESETS.has(preset)) {
    return { date_preset: preset };
  }

  const days = Number(process.env.META_LOOKBACK_DAYS ?? '30') || 30;
  const mapped = `last_${days}d`;
  return { date_preset: VALID_PRESETS.has(mapped) ? mapped : 'last_30d' };
}

function resolveFiltering(): string | null {
  const raw = process.env.META_CAMPAIGN_STATUS?.trim();
  if (!raw) return null;

  const statuses = raw
    .split(',')
    .map(s => s.trim().toUpperCase())
    .filter(s => VALID_STATUSES.has(s));

  if (!statuses.length) return null;

  return JSON.stringify([
    { field: 'campaign.effective_status', operator: 'IN', value: statuses },
  ]);
}

export async function fetchMetaInsights(): Promise<MetaCampaign[]> {
  const token     = process.env.META_ACCESS_TOKEN?.trim();
  const accountId = process.env.META_AD_ACCOUNT_ID?.trim();
  if (!token || !accountId) return [];

  const level = VALID_LEVELS.has(process.env.META_LEVEL?.trim() ?? '')
    ? process.env.META_LEVEL!.trim()
    : 'campaign';

  try {
    const url = new URL(`https://graph.facebook.com/v19.0/act_${accountId}/insights`);
    url.searchParams.set('fields', 'campaign_name,spend,impressions,clicks,cpc,cpm,actions');
    url.searchParams.set('level', level);
    url.searchParams.set('access_token', token);

    const timeParam = resolveTimeParam();
    for (const [k, v] of Object.entries(timeParam)) url.searchParams.set(k, v);

    const filtering = resolveFiltering();
    if (filtering) url.searchParams.set('filtering', filtering);

    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];

    const json = await res.json() as { data?: any[]; error?: any };
    if (json.error || !Array.isArray(json.data)) return [];

    const includeTest = process.env.META_INCLUDE_TEST === 'true';

    return json.data
      .map(item => {
        const lpv = (item.actions ?? []).find(
          (a: { action_type: string; value: string }) => a.action_type === 'landing_page_view',
        );
        return {
          campaign_name:      String(item.campaign_name ?? ''),
          spend:              parseFloat(item.spend ?? '0'),
          impressions:        parseInt(item.impressions ?? '0', 10),
          clicks:             parseInt(item.clicks ?? '0', 10),
          cpc:                parseFloat(item.cpc ?? '0'),
          cpm:                parseFloat(item.cpm ?? '0'),
          landing_page_views: lpv ? parseInt(lpv.value, 10) : 0,
        };
      })
      .filter(c => includeTest || !TEST_PATTERN.test(c.campaign_name))
      .sort((a, b) => b.spend - a.spend);
  } catch {
    return [];
  }
}
