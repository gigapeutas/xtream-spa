export default async (req) => {
  try {
    const url = new URL(req.url);
    const target = url.searchParams.get("target");
    if (!target) return json(400, { error: "Missing ?target=" });

    const targetUrl = safeParseUrl(target);
    if (!targetUrl) return json(400, { error: "Invalid target URL" });

    if (!["http:", "https:"].includes(targetUrl.protocol)) {
      return json(400, { error: "Only http/https allowed" });
    }

    const host = targetUrl.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "::1" ||
      host.endsWith(".local")
    ) {
      return json(403, { error: "Blocked host" });
    }

    const method = (req.method || "GET").toUpperCase();

    let body = undefined;
    if (method !== "GET" && method !== "HEAD") body = req.body;

    const upstream = await fetch(targetUrl.toString(), {
      method,
      headers: { "User-Agent": "xtream-spa-proxy/1.0" },
      body
    });

    const contentType =
      upstream.headers.get("content-type") || "application/json";
    const raw = await upstream.arrayBuffer();

    return {
      statusCode: upstream.status,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Cache-Control": "no-store"
      },
      body: Buffer.from(raw).toString("base64"),
      isBase64Encoded: true
    };
  } catch (e) {
    return json(500, { error: "Proxy error", detail: String(e?.message || e) });
  }
};

function safeParseUrl(maybeUrl) {
  try {
    return new URL(maybeUrl);
  } catch {
    return null;
  }
}

function json(statusCode, data) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store"
    },
    body: JSON.stringify(data)
  };
}
