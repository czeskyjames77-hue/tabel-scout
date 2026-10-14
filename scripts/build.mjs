import fs from "node:fs/promises";
import { pages } from "../src/pages.mjs";
import { layout } from "../src/layout.mjs";
await fs.rm("dist", { recursive: true, force: true });
await fs.mkdir("dist", { recursive: true });
await fs.cp("assets", "dist/assets", { recursive: true });
await fs.copyFile("favicon.svg", "dist/favicon.svg");
for (const page of Object.values(pages))
  await fs.writeFile(
    `dist/${page.path === "/" ? "index" : page.path.slice(1)}.html`,
    layout(page, page.content),
  );
const legal = JSON.parse(await fs.readFile("src/legal.json", "utf8"));
legal.datenschutz = legal.datenschutz.replace(
  "Diese Seite lädt die Schriftart Geist über Google Fonts von Servern der Google Ireland Limited. Dabei wird Ihre IP-Adresse an Google übermittelt.",
  "Die auf dieser Website verwendeten Schriftarten und Fotografien werden lokal über unseren Hosting-Anbieter ausgeliefert. Ihr Browser stellt dafür keine Verbindung zu Google Fonts oder Unsplash her.",
);
legal.datenschutz += `<section><h2>7. Anfragen über das Formular</h2><p>Wenn Sie uns eine Anfrage senden, verarbeiten wir Ihre Kontaktdaten, Angaben zu Ihrem Betrieb, die ausgewählten Leistungen und gegebenenfalls die Angaben aus dem Preisrechner zur Bearbeitung Ihrer Anfrage und zur Erstellung eines Angebots. Pflichtangaben sind entsprechend gekennzeichnet; weitere Angaben sind freiwillig.</p><p>Die Übertragung erfolgt verschlüsselt an das von Webwerk betriebene Anfragesystem. Zur Bearbeitung werden die Daten dort gespeichert und berechtigten Mitarbeitenden zur Verfügung gestellt. Für die Bestätigung und weitere E-Mails nutzen wir Resend; interne Benachrichtigungen werden über Telegram an unser zuständiges Team übermittelt. Wir verarbeiten diese Daten zur Durchführung vorvertraglicher Maßnahmen gemäß Art. 6 Abs. 1 lit. b DSGVO. Die Angaben werden gelöscht, sobald der Zweck ihrer Speicherung entfällt und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</p><p>Auf dieser Website setzen wir keine Werbe- oder Analyse-Cookies ein.</p></section>`;
const credits = [
  ["Poul Hoang", "h_Gw39Snd-M", "Küchenteam"],
  ["Willian Justen de Vasconcellos", "VUd9yv41hh0", "Küchenservice"],
  ["Eugeniya Belova", "qwempg71wDY", "Offene Küche"],
  ["Madeline Liu", "bXOHW6fKdPI", "Anrichten am Pass"],
  ["Madeline Liu", "dAGv2gGGj-4", "Team am Pass"],
  ["Kris Tian", "T3zcj51zuc4", "Barista"],
  ["CHEN HENG", "4S5_KBQzNRM", "Café-Interieur"],
];
legal.bildnachweise = `<h1>Bildnachweise</h1><p>Fotografien aus dem Alltag der Gastronomie. Die abgebildeten Betriebe und Personen stehen beispielhaft für das Umfeld unserer Leistungen.</p>${credits.map(([n, id, description]) => `<section><h2>${description}</h2><p>Fotografie: <a href="https://unsplash.com/photos/${id}" target="_blank" rel="noopener">${n} / Unsplash</a></p></section>`).join("")}<p>Nutzung der Gastro-Fotografien gemäß <a href="https://unsplash.com/license">Unsplash-Lizenz</a>. Portrait: <a href="https://www.pexels.com/photo/15597616/">Tanja Nikolic / Pexels</a>, bereitgestellt von Webwerk. Schriftarten: Instrument Sans und IBM Plex Mono, SIL Open Font License.</p>`;
for (const [name, content] of Object.entries(legal))
  await fs.writeFile(
    `dist/${name}.html`,
    layout(
      {
        title: `${name === "bildnachweise" ? "Bildnachweise" : name === "impressum" ? "Impressum" : "Datenschutz"} | table-scout`,
        path: `/${name}`,
        noindex: true,
      },
      `<div class="section legal">${content}</div>`,
    ),
  );
await fs.writeFile(
  "dist/404.html",
  layout(
    {
      title: "Seite nicht gefunden | table-scout",
      path: "/404",
      noindex: true,
    },
    '<section class="section not-found"><p class="eyebrow">404 / Hier ist gerade kein Tisch gedeckt.</p><h1>Diese Seite<br>gibt es nicht.</h1><p>Unsere Leistungen finden Sie auf der Startseite.</p><a class="button" href="/">Zur Startseite</a></section>',
  ),
);
await fs.writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.values(
    pages,
  )
    .map((p) => `<url><loc>https://table-scout.com${p.path}</loc></url>`)
    .join("")}</urlset>`,
);
await fs.writeFile(
  "dist/robots.txt",
  "User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: https://table-scout.com/sitemap.xml\n",
);
console.log("Built 5 website pages, legal pages, metadata and sitemap.");
