(() => {
  const CFG = window.AV_CONFIG;
  const $ = (s) => document.querySelector(s);
  const SECTORS = [['residuos', 'Residuos y economía circular'], ['forestal', 'Forestal e incendios'], ['agua', 'Agua y saneamiento'], ['medio_ambiente', 'Medio ambiente y biodiversidad'], ['energia', 'Energía y eficiencia (ayudas y fondos)']];
  const CCAA = {
    ES11: ['Galicia', ['A Coruña', 'Lugo', 'Ourense', 'Pontevedra']], ES12: ['Asturias', ['Asturias']], ES13: ['Cantabria', ['Cantabria']], ES21: ['País Vasco', ['Álava', 'Bizkaia', 'Gipuzkoa']],
    ES22: ['Navarra', ['Navarra']], ES23: ['La Rioja', ['La Rioja']], ES24: ['Aragón', ['Huesca', 'Teruel', 'Zaragoza']], ES30: ['Madrid', ['Madrid']],
    ES41: ['Castilla y León', ['Ávila', 'Burgos', 'León', 'Palencia', 'Salamanca', 'Segovia', 'Soria', 'Valladolid', 'Zamora']], ES42: ['Castilla-La Mancha', ['Albacete', 'Ciudad Real', 'Cuenca', 'Guadalajara', 'Toledo']],
    ES43: ['Extremadura', ['Badajoz', 'Cáceres']], ES51: ['Cataluña', ['Barcelona', 'Girona', 'Lleida', 'Tarragona']], ES52: ['Comunitat Valenciana', ['Alicante', 'Castellón', 'Valencia']],
    ES53: ['Illes Balears', ['Illes Balears']], ES61: ['Andalucía', ['Almería', 'Cádiz', 'Córdoba', 'Granada', 'Huelva', 'Jaén', 'Málaga', 'Sevilla']], ES62: ['Región de Murcia', ['Murcia']],
    ES63: ['Ceuta', ['Ceuta']], ES64: ['Melilla', ['Melilla']], ES70: ['Canarias', ['Las Palmas', 'Santa Cruz de Tenerife']],
  };
  const EU = { PT: 'Portugal', FR: 'Francia', IT: 'Italia', DE: 'Alemania', BE: 'Bélgica', NL: 'Países Bajos', IE: 'Irlanda', AT: 'Austria', PL: 'Polonia', GR: 'Grecia', HR: 'Croacia', RO: 'Rumanía', BG: 'Bulgaria', CZ: 'Chequia', SK: 'Eslovaquia', SI: 'Eslovenia', HU: 'Hungría', DK: 'Dinamarca', SE: 'Suecia', FI: 'Finlandia', EE: 'Estonia', LV: 'Letonia', LT: 'Lituania', LU: 'Luxemburgo', MT: 'Malta', CY: 'Chipre', NO: 'Noruega', CH: 'Suiza' };
  const TYPES = [['licitaciones', 'Licitaciones'], ['ayudas', 'Ayudas y subvenciones'], ['fondos_ue', 'Fondos europeos']];

  const chip = (name, value, label, checked) => `<label class="chip"><input type="checkbox" name="${name}" value="${value}"${checked ? ' checked' : ''}><span>${label}</span></label>`;
  $('#sectors').innerHTML = SECTORS.map(([v, l]) => chip('sector', v, l)).join('');
  $('#ccaa').innerHTML = Object.entries(CCAA).map(([c, [n]]) => chip('ccaa', c, n)).join('');
  $('#eu').innerHTML = Object.entries(EU).map(([c, n]) => chip('eu', c, n)).join('');
  $('#types').innerHTML = TYPES.map(([v, l]) => chip('type', v, l, true)).join('');
  if (!CFG.EMAIL_LIVE) $('#proto').hidden = false;

  const vals = (name) => [...document.querySelectorAll(`input[name=${name}]:checked`)].map((i) => i.value);
  const renderProvs = () => {
    const sel = vals('ccaa').filter((c) => CCAA[c][1].length > 1);
    $('#provBox').hidden = !sel.length;
    const kept = new Set(vals('prov'));
    $('#provs').innerHTML = sel.map((c) => CCAA[c][1].map((p) => chip('prov', p, p, kept.has(p))).join('')).join('');
  };
  $('#ccaa').addEventListener('change', renderProvs);

  // plan elegido en la sección de precios (solo informativo durante la prueba; punto de integración con Stripe más abajo)
  document.querySelectorAll('[data-plan]').forEach((a) => a.addEventListener('click', () => { sessionStorage.setItem('av_plan', a.dataset.plan); }));

  const msg = (cls, html) => { $('#msg').innerHTML = `<div class="msg ${cls}">${html}</div>`; };
  $('#form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if ($('#website').value) return;                                         // honeypot: los bots lo rellenan
    const email = $('#email').value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) return msg('err', 'Revisa tu correo electrónico: no parece válido.');
    const sectors = vals('sector');
    if (!sectors.length) return msg('err', 'Elige al menos un sector.');
    const types = vals('type');
    if (!types.length) return msg('err', 'Elige qué quieres recibir (licitaciones, ayudas o fondos).');
    if (!$('#consent').checked) return msg('err', 'Para suscribirte necesitamos tu consentimiento: marca la casilla.');
    const body = {
      email, company_name: $('#company').value.trim() || null, sectors, ccaa: vals('ccaa'), provinces: vals('prov'), eu_countries: vals('eu'),
      content_types: types, min_budget_eur: Number($('#budget').value), frequency: $('#freq').value, fire_risk: $('#fire').checked, consent_version: CFG.CONSENT_VERSION,
    };
    const btn = $('#submit'); btn.disabled = true; btn.textContent = 'Enviando…';
    try {
      const res = await fetch(`${CFG.SUPABASE_URL}/rest/v1/subscribers`, {
        method: 'POST', headers: { apikey: CFG.SUPABASE_KEY, Authorization: `Bearer ${CFG.SUPABASE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify(body),
      });
      // 409 = ese correo ya tiene una suscripción viva: respondemos igual para no revelar quién está suscrito.
      if (res.status === 201 || res.status === 409) {
        $('#form').reset(); renderProvs();
        msg('ok', CFG.EMAIL_LIVE
          ? '<b>Casi listo.</b> Te hemos enviado un correo para confirmar tu dirección. Hasta que lo confirmes no recibirás nada. Si no lo ves, mira en spam.'
          : '<b>Solicitud guardada (modo prototipo).</b> Todavía no se envían correos de confirmación, así que de momento no recibirás nada. Puedes pedir el borrado de tus datos escribiendo al contacto del aviso legal.');
      } else {
        const t = await res.text();
        msg('err', t.includes('rate_limit') ? 'Demasiadas solicitudes ahora mismo. Inténtalo de nuevo en unos minutos.' : 'No hemos podido guardar tu solicitud. Revisa los datos e inténtalo de nuevo.');
      }
    } catch { msg('err', 'No hay conexión con el servidor. Inténtalo de nuevo.'); }
    btn.disabled = false; btn.textContent = 'Quiero mi prueba gratuita de 14 días';
  });
  // PUNTO DE INTEGRACIÓN STRIPE (futuro): tras confirmar el correo, enlazar a CFG.STRIPE_LINKS[plan] + '?prefilled_email=' + email
})();
