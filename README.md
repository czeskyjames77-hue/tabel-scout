# table-scout

Landingpage von table-scout by Webwerk: Bewertungslöschung und Antwort-Service für Gastronomie und Hotellerie.

Statische Seite ohne Build-Schritt. Einzige Server-Funktion: `api/anfrage.js`.

Vercel-Env im Projekt `table-scout`: `WEBSITE_FUNNEL_API_KEY` (derselbe Wert wie im Webwerk-Backend), optional `WEBWERK_ANFRAGE_URL`.

| Datei | Inhalt |
| --- | --- |
| `index.html` | Startseite |
| `impressum.html` | Impressum (`/impressum`) |
| `datenschutz.html` | Datenschutzerklärung (`/datenschutz`) |
| `favicon.svg` | Logo-Icon und Favicon |
| `vercel.json` | Saubere URLs ohne `.html` |
| `api/anfrage.js` | Formular-Weiterleitung an das Webwerk-Backend (`/api/table-scout/anfrage`) |

Live: https://table-scout.com (Vercel-Projekt `table-scout`)

Deployment: Jeder Push auf `main` geht über Vercel automatisch live.
