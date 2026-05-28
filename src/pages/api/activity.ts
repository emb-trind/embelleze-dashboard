import type { APIRoute } from 'astro';
import { fetchFollowupLeads } from '../../lib/db';

const ACTION_PT: Record<string, string> = {
  email_sent: 'Email enviado',
  email_opened: 'Email aberto',
  whatsapp_sent: 'WA enviado',
  whatsapp_replied: 'WA respondeu',
  sms_sent: 'SMS enviado',
  form_submit: 'Formulário',
  manual_contact: 'Contato manual',
};

export const GET: APIRoute = async () => {
  const leads = await fetchFollowupLeads();
  const items = [...leads]
    .sort((a, b) => {
      const ta = a.next_action_at ? new Date(a.next_action_at).getTime() : 0;
      const tb = b.next_action_at ? new Date(b.next_action_at).getTime() : 0;
      return tb - ta;
    })
    .slice(0, 30)
    .map(l => ({
      name: l.name ?? l.phone_e164.replace(/^\+55/, ''),
      phone: l.phone_e164.replace(/^\+55/, ''),
      status: l.status_canon,
      action: ACTION_PT[l.last_action ?? ''] ?? l.last_action ?? l.status_canon,
      attempts: l.attempt_count,
      at: l.next_action_at,
    }));

  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
};
