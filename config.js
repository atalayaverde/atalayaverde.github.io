// Configuración pública del navegador. La clave "publishable" de Supabase es pública por diseño:
// solo permite INSERT en `subscribers` (RLS + permisos por columna) y ejecutar confirm_subscription / unsubscribe.
window.AV_CONFIG = {
  SUPABASE_URL: 'https://kjbzzvewizfabigpwxvd.supabase.co',
  SUPABASE_KEY: 'sb_publishable_BfMVG_x7VFB002bki6tZSw_z1xj9lfJ',
  CONSENT_VERSION: 'v2-2026-11-11',
  // false = prototipo: la solicitud se guarda pero todavía NO se envían correos (se avisa al usuario).
  // Poner true cuando el envío esté activo (ver docs/PLAN-ENVIO.md).
  EMAIL_LIVE: true,
  // Integración de pagos (futuro): rellenar con los Payment Links de Stripe. Sin cuenta de pago creada todavía.
  STRIPE_LINKS: { pro: '', equipo: '' },
};
