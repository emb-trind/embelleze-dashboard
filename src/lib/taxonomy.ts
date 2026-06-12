export const SOURCE_LABEL_PT: Record<string, string> = {
  lp_manicure: 'LP Manicure',
  lp_cilios: 'LP Cílios',
  lp_sobrancelha: 'LP Sobrancelha',
  lp_cabeleireiro: 'LP Cabeleireiro',
  lp_transforme: 'LP Transforme',
  whatsapp_form: 'Form WhatsApp',
  lead_cadastro_manual: 'Cadastro manual',
  site_footer_form: 'Rodapé do site',
  unknown_origem: 'Origem desconhecida',
  chatgpt: 'ChatGPT Ads',
  instagram: 'Instagram',
  ig: 'Instagram',
  ig_direct: 'Instagram Direct',
  facebook: 'Facebook',
  fb: 'Facebook',
  messenger: 'Messenger',
  fb_messenger: 'Messenger',
  whatsapp_baileys: 'WhatsApp',
  landing: 'Landing Page',
  'direct-wa': 'WhatsApp Direto',
};

export function formatSource(rawSource?: string | null): string {
  if (!rawSource) return 'Origem desconhecida';
  const clean = String(rawSource).trim().toLowerCase();
  return SOURCE_LABEL_PT[clean] ?? rawSource;
}
