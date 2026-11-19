// Configuración pública del navegador. La clave "publishable" de Supabase es pública por diseño:
// solo permite INSERT en `subscribers` (RLS + permisos por columna) y ejecutar confirm_subscription / unsubscribe.
window.AV_CONFIG = {
  SUPABASE_URL: 'https://kjbzzvewizfabigpwxvd.supabase.co',
  SUPABASE_KEY: 'sb_publishable_BfMVG_x7VFB002bki6tZSw_z1xj9lfJ',
  CONSENT_VERSION: 'v2-2026-11-11',
  // false = prototipo: la solicitud se guarda pero todavía NO se envían correos (se avisa al usuario).
  // Poner true cuando el envío esté activo (ver docs/PLAN-ENVIO.md).
  EMAIL_LIVE: true,
  // Enlaces de pago Stripe (modo real, activados el 19/11/2026 con el vale de Rubén).
  // Cada enlace lleva metadata.plan (pro|equipo); el webhook asigna el plan por client_reference_id o por email.
  STRIPE_LINKS: {
    pro: 'https://buy.stripe.com/6oU6oIeVp9ma0Dj9oqdby02',          // Profesional 19 €/mes
    pro_anual: 'https://buy.stripe.com/4gM8wQeVpdCqdq558adby03',    // Profesional 190 €/año
    equipo: 'https://buy.stripe.com/3cI7sM6oT55U99P7gidby04',       // Equipo 39 €/mes
    equipo_anual: 'https://buy.stripe.com/bJe3cwfZtdCq71H446dby05', // Equipo 390 €/año
  },
};
