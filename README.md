# table-scout.com

Static, responsive website for review deletion, Google profile optimization and ongoing restaurant profile management. Implements the approved Paper Serviceedition (14 October 2026).

## Development

- `npm run build` generates the five website pages and legal pages into `dist/`.
- `npm run dev` serves the generated website at `http://127.0.0.1:4180`. Run the build after editing sources. The local server deliberately does not send inquiries.
- `npm test` verifies price boundaries and the server-side inquiry proxy.
- Page content: `src/pages.mjs`; shared navigation/dialog/footer: `src/layout.mjs`; styles/interactions: `assets/`.
- Vercel project: `agentwerk/table-scout`. `dist/` is the static output; `api/anfrage.js` is the serverless inquiry proxy. Secrets are configured in Vercel only.

## Inquiry and pricing contract

The dialog accepts multiple services: `deletion`, `profile`, `management`, `advice`. The proxy forwards them and optional positive/negative/existing review counts to the authenticated Webwerk endpoint. The API key never reaches the browser.

Deletion-only inquiries preserve the existing review-check workflow. Profile, management and mixed requests enter manual offer review in the Webwerk dashboard with their complete service selection and calculator inputs. The confirmation email describes the selected service. Inquiries are not orders or automatic subscription activations. Actual offers still require the existing human approval process.

Deletion prices: 10–24 requested reviews €19, 25–49 €15, 50–99 €12, 100+ €9 per successful removal, excluding VAT. The tier is based on commissioned reviews; only successful removals are billed. Fewer than 10 are individually reviewed.

The management calculator uses actual monthly counts across all star ratings: up to 5 €39; 6–15 €69; 16–30 €99; more than 30 €149. Historical review cleanup remains separate. Historical campaign estimates in Webwerk continue using their existing logic.

## Assets and content

Fonts and responsive WebP photographs are self-hosted. Photo credits are on `/bildnachweise`; font licenses are included under `assets/fonts/`. Social sharing uses `assets/images/og-image.jpg` (1200 × 630).

Proof points are attributed to the Webwerk family. Irish Castle: 531 to 997 profile interactions, September 2026 versus June–August average. Hotline 5: +120.4% profile views, September 2026 versus September 2025. Periods and interpretation are available in the expandable source note. Google removal grounds were checked against https://support.google.com/contributionpolicy/answer/7400114?hl=de.

## Verification

The implementation was checked in Chromium at 1440, 1024, 768, 390 and 360 px across all eight public pages, plus WebKit mobile. Tests cover multi-select inquiries, defaults, calculator boundaries, payload preservation, validation, submission failure/retry, keyboard dismissal, mobile navigation, FAQ and WCAG A/AA automated checks. Live delivery and dashboard handoff are verified separately after production deployment.

Previous production deployment before this release: `https://table-scout-lyzk9kow1-agentwerk.vercel.app`. Rollback, if needed: `vercel rollback <previous-ready-url> --scope agentwerk`.
