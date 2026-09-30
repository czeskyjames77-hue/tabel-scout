// Formular-Weiterleitung an das Webwerk-Backend. Der Schluessel
// (TABLESCOUT_FORM_API_KEY) liegt nur in den Vercel-Env-Variablen dieses
// Projekts und nie im HTML.
const TARGET = process.env.WEBWERK_ANFRAGE_URL || 'https://app.webwerk-design.de/api/table-scout/anfrage'
const FIELDS = ['betrieb', 'ort', 'googleLink', 'name', 'email', 'telefon', 'nachricht', 'standorte']

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, reason: 'method_not_allowed' })
  }
  const key = process.env.TABLESCOUT_FORM_API_KEY
  if (!key) return res.status(503).json({ ok: false, reason: 'not_configured' })

  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { body = null }
  }
  if (!body || typeof body !== 'object') return res.status(400).json({ ok: false, reason: 'invalid_input' })
  // Honeypot: Bots fuellen das versteckte Feld, bekommen aber ein "ok".
  if (body.website) return res.status(200).json({ ok: true })

  const payload = { antwortService: body.antwortService === true }
  for (const f of FIELDS) if (typeof body[f] === 'string') payload[f] = body[f].slice(0, 3000)

  try {
    const r = await fetch(TARGET, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-website-funnel-key': key },
      body: JSON.stringify(payload),
    })
    const data = await r.json().catch(() => ({}))
    return res.status(r.status).json({ ok: Boolean(data.ok), reason: data.reason, fields: data.fields })
  } catch (err) {
    console.error('[anfrage] Weiterleitung fehlgeschlagen:', err)
    return res.status(502).json({ ok: false, reason: 'upstream' })
  }
}
