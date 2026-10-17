import { createServer } from "node:http";
import { request } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const backendURL = new URL(
  process.env.CS_IM_BACKEND_URL ?? "http://127.0.0.1:8080"
);
const port = Number(process.env.PORT ?? 3100);
const root = dirname(fileURLToPath(import.meta.url));

const proxyPrefixes = ["/api/", "/admin/", "/ws/"];
function isProxyPath(pathname) {
  return proxyPrefixes.some((prefix) => pathname.startsWith(prefix));
}

function proxy(req, res) {
  const headers = { ...req.headers };
  headers.host = backendURL.host;

  const proxyReq = request({
    hostname: backendURL.hostname,
    port: backendURL.port,
    path: req.url,
    method: req.method,
    headers,
  });

  proxyReq.on("response", (proxyRes) => {
    res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on("error", (error) => {
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        code: "PROXY_ERROR",
        message: error.message,
      })
    );
  });

  req.pipe(proxyReq, { end: true });
}

async function sendIndex(res) {
  try {
    const html = await readFile(join(root, "index.html"), "utf8");
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    });
    res.end(html);
  } catch {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("index.html is missing");
  }
}

async function sendFile(res, filePath) {
  try {
    const html = await readFile(filePath, "utf8");
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    });
    res.end(html);
  } catch {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("page is missing");
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  if (isProxyPath(url.pathname)) {
    proxy(req, res);
    return;
  }

  if (url.pathname === "/" || url.pathname === "/index.html") {
    await sendIndex(res);
    return;
  }

  if (url.pathname === "/relay" || url.pathname === "/relay.html") {
    await sendFile(res, join(root, "relay.html"));
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not Found");
}).listen(port, () => {
  console.log(`CS IM demo frontend: http://localhost:${port}`);
  console.log(`Backend proxy target: ${backendURL}`);
});
