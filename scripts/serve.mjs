import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".mjs": "text/javascript",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".xml": "application/xml",
  ".txt": "text/plain",
};
http
  .createServer(async (req, res) => {
    const u = new URL(req.url, "http://localhost");
    if (u.pathname === "/api/anfrage") {
      res.writeHead(503, { "content-type": "application/json" });
      return res.end(JSON.stringify({ ok: false, reason: "local_preview" }));
    }
    const p = path.resolve("dist", "." + decodeURIComponent(u.pathname));
    if (
      !p.startsWith(path.resolve("dist") + path.sep) &&
      p !== path.resolve("dist")
    ) {
      res.writeHead(403);
      return res.end();
    }
    const name =
      u.pathname === "/"
        ? "dist/index.html"
        : path.extname(p)
          ? p
          : p + ".html";
    try {
      res.setHeader(
        "Content-Type",
        mime[path.extname(name)] || "application/octet-stream",
      );
      res.end(await fs.readFile(name));
    } catch {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(await fs.readFile("dist/404.html"));
    }
  })
  .listen(Number(process.env.PORT) || 4180, "127.0.0.1", () =>
    console.log("Preview: http://127.0.0.1:4180"),
  );
