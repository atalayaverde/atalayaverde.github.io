// Configuración pública del navegador. La clave "publishable" de Supabase es pública por diseño:
// no da acceso directo a ninguna tabla: solo ejecuta RPC públicas (subscribe, confirm_subscription, unsubscribe,
// request_subscription, confirm_subscription_request, portal_*) que validan cada llamada en la base de datos.
window.AV_CONFIG = {
  SUPABASE_URL: 'https://kjbzzvewizfabigpwxvd.supabase.co',
  SUPABASE_KEY: 'sb_publishable_BfMVG_x7VFB002bki6tZSw_z1xj9lfJ',
  CONSENT_VERSION: 'v2-2026-11-11',
  // false = prototipo: la solicitud se guarda pero todavía NO se envían correos (se avisa al usuario).
  // Poner true cuando el envío esté activo (ver docs/PLAN-ENVIO.md).
  EMAIL_LIVE: true,
  // Cobro aún no activo: no mostrar botones de pago ni publicar enlaces buy.stripe.com.
  // Cuando Rubén active el cobro, poner true y rellenar STRIPE_LINKS (los Payment Links
  // ya tienen metadata.plan pro|equipo). Hasta entonces el CTA es el alta de prueba gratis.
  PAYMENTS_ENABLED: false,
  STRIPE_LINKS: {},
};
