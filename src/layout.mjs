import { button } from "./pages.mjs";
const links = [
  ["/bewertungen-loeschen", "Bewertungen"],
  ["/profiloptimierung", "Google-Profil"],
  ["/partnerprogramm", "Partnerprogramm"],
  ["/#ergebnisse", "Ergebnisse"],
  ["/ueber-uns", "Über uns"],
];
export function layout(page, content) {
  const title = page.title,
    url = `https://table-scout.com${page.path}`;
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><meta name="description" content="${page.description || "table-scout – eine Marke von Webwerk. Ihr Service für Google."}"><meta name="theme-color" content="#244bc4"><link rel="canonical" href="${url}">${page.noindex ? '<meta name="robots" content="noindex, follow">' : ""}<meta property="og:locale" content="de_DE"><meta property="og:type" content="website"><meta property="og:site_name" content="table-scout"><meta property="og:title" content="${title}"><meta property="og:description" content="${page.description || "Bewertungen. Sichtbarkeit. Laufende Betreuung. Für die Gastronomie."}"><meta property="og:url" content="${url}"><meta property="og:image" content="https://table-scout.com/assets/images/og-image.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="table-scout – Voller Einsatz. Guter Ruf. Google-Service für die Gastronomie."><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/fonts/fonts.css"><link rel="stylesheet" href="/assets/site.css"><script type="module" src="/assets/site.mjs"></script><script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "table-scout", url: "https://table-scout.com", parentOrganization: { "@type": "Organization", name: "Webwerk", url: "https://webwerk-design.de" }, email: "info@webwerk-design.de", logo: "https://table-scout.com/favicon.svg" })}</script></head><body data-service="${page.service || ""}"><a class="skip-link" href="#inhalt">Zum Inhalt</a><header class="site-header"><a class="wordmark" href="/" aria-label="table-scout Startseite">table-scout</a><nav id="main-nav" aria-label="Hauptnavigation">${links.map(([href, label]) => `<a href="${href}" ${href === page.path ? 'aria-current="page"' : ""}>${label}</a>`).join("")}</nav><div class="nav-actions">${button("Betrieb prüfen")}<button class="menu-toggle" aria-expanded="false" aria-controls="main-nav">Menü</button></div></header><main id="inhalt">${content}</main>${page.footer ? `<footer class="site-footer"><p class="eyebrow">Table-scout / By Webwerk</p><h2>${page.footer[0]}</h2><div class="footer-cta"><p>${page.footer[1]}</p>${button("Profil kostenlos prüfen", page.service)}</div>${footerLinks()}</footer>` : `<footer class="site-footer compact">${footerLinks()}</footer>`}${modal()}<noscript><div class="no-js">Sie erreichen uns auch direkt: <a href="mailto:info@webwerk-design.de">info@webwerk-design.de</a>. Für den Preisrechner und das Anfrageformular aktivieren Sie bitte JavaScript.</div></noscript></body></html>`;
}
const footerLinks = () =>
  `<div class="footer-links"><div><a class="wordmark" href="/">table-scout</a><p>Gastro im Fokus.<br>Sechs Jahre Erfahrung bei Webwerk.</p></div><div><a href="/ueber-uns">Über uns</a><a href="mailto:info@webwerk-design.de">Kontakt</a><a href="/impressum">Impressum</a><a href="/datenschutz">Datenschutz</a><a href="/bildnachweise">Bildnachweise</a></div><small>© ${new Date().getFullYear()} table-scout · Eine Marke von Webwerk</small></div>`;
function modal() {
  return `<dialog id="inquiry" aria-labelledby="inquiry-title"><div class="dialog-top"><span class="wordmark">table-scout</span><button type="button" class="close-modal" aria-label="Anfrage schließen">Schließen <span aria-hidden="true">×</span></button></div><div class="dialog-body"><div id="inquiry-intro"><p class="eyebrow blue" id="step-label">01 / Ihr Anliegen</p><h2 id="inquiry-title" tabindex="-1">Was braucht<br>Ihr Betrieb?</h2><p id="step-description">Wählen Sie, wobei wir Sie unterstützen dürfen. Mehrfachauswahl ist möglich.</p></div><form id="inquiry-form" novalidate><fieldset data-panel="1"><legend class="sr-only">Gewünschte Leistungen</legend><div class="service-options">${[
    [
      "deletion",
      "Bewertungen löschen",
      "Bestehende negative Rezensionen prüfen lassen.",
    ],
    [
      "profile",
      "Google-Profil optimieren",
      "Ihren Betrieb bei Google besser präsentieren.",
    ],
    [
      "management",
      "Partnerprogramm & Management",
      "Bewertungen und Profil dauerhaft betreuen lassen.",
    ],
    [
      "advice",
      "Ich möchte mich beraten lassen",
      "Den passenden Einstieg gemeinsam finden.",
    ],
  ]
    .map(
      ([v, l, d]) =>
        `<label><input type="checkbox" name="services" value="${v}"><span><strong>${l}</strong><small>${d}</small></span></label>`,
    )
    .join(
      "",
    )}</div></fieldset><fieldset data-panel="2" hidden><legend class="sr-only">Ihr Betrieb</legend><label>Betriebsname<input name="betrieb" required maxlength="200" autocomplete="organization" placeholder="z. B. Café am Markt"></label><div class="form-grid"><label>Ort<input name="ort" maxlength="200" autocomplete="address-level2" placeholder="z. B. Berlin"></label><label>Standorte<select name="standorte"><option value="1">Ein Standort</option><option value="2-5">2–5 Standorte</option><option value="6+">6 oder mehr</option></select></label></div><label>Google-Maps-Link <span class="optional">(optional, wenn der Ort angegeben ist)</span><input name="googleLink" maxlength="1000" inputmode="url" placeholder="https://www.google.com/maps/…"></label><p class="fine">Betriebsname und Ort reichen aus. Für diesen ersten Check benötigen wir keine Zugangsdaten.</p><div class="form-quote" id="form-quote" hidden></div></fieldset><fieldset data-panel="3" hidden><legend class="sr-only">Kontaktdaten</legend><div id="selection-summary" class="selection-summary"></div><label>Ihr Name<input name="name" required maxlength="120" autocomplete="name"></label><div class="form-grid"><label>E-Mail-Adresse<input type="email" name="email" required maxlength="200" autocomplete="email"></label><label>Telefon <span class="optional">(optional)</span><input type="tel" name="telefon" maxlength="60" autocomplete="tel"></label></div><label>Was möchten Sie uns mitgeben? <span class="optional">(optional)</span><textarea name="nachricht" rows="3" maxlength="3000" placeholder="Ihre Frage oder ein Hinweis zu Ihrem Betrieb"></textarea></label><label class="check consent"><input type="checkbox" name="consent" required><span>Ich habe die <a href="/datenschutz" target="_blank" rel="noopener">Datenschutzhinweise</a> gelesen und bin mit der Kontaktaufnahme zu dieser Anfrage einverstanden.</span></label><p class="fine">Kostenlos und unverbindlich. Ein Auftrag entsteht erst, wenn Sie unser Angebot freigeben.</p></fieldset><div class="honeypot" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div><p id="form-error" role="alert" hidden></p><div class="form-actions"><button type="button" class="text-button" id="form-back" hidden>Zurück</button><button type="submit" class="button" id="form-next">Weiter</button><span class="fine" id="step-count">Schritt 1 von 3</span></div></form><div id="inquiry-success" hidden><p class="eyebrow blue">Anfrage eingegangen</p><h2 tabindex="-1">Der erste Schritt<br>ist gemacht.</h2><p>Wir sehen uns Ihren Betrieb an und melden uns persönlich mit dem passenden nächsten Schritt. Ihre Anfrage wurde gespeichert.</p><p class="fine">Die Bestätigung kommt per E-Mail. Falls sie fehlt, prüfen Sie bitte auch Ihren Spam-Ordner.</p><button type="button" class="button close-modal">Zurück zur Website</button></div></div></dialog>`;
}
