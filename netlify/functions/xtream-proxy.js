export default async (req) => {
  try {
    const url = new URL(req.url);
    const target = url.searchParams.get("target");
    if (!target) return json(400, { error: "Missing ?target=" });

    const targetUrl = safeParseUrl(target);
    if (!targetUrl) return json(400, { error: "Invalid target URL" });

    // ✅ Proxy APENAS para JSON (player_api.php e endpoints get_*)
    const path = (targetUrl.pathname || "").toLowerCase();

    // Bloqueia QUALQUER coisa que pareça stream/arquivo de mídia
    if (
      path.endsWith(".m3u8") ||
      path.endsWith(".ts") ||
      path.endsWith(".mp4") ||
      path.includes("/live/") ||
      path.includes("/movie/") ||
      path.includes("/series/")
    ) {
      return json(403, { error: "API proxy is JSON-only. Video must be loaded directly by the player." });
    }

    const upstream = await fetch(targetUrl.toString(), {
      method: "GET",
      headers: {
        "User-Agent": "consysencia-api-proxy/1.0",
        "Accept": "application/json,*/*",
      },
    });

    const text = await upstream.text();

    // Normaliza para JSON sempre (se não vier JSON válido, embrulha)
    let body;
    try {
      body = JSON.stringify(JSON.parse(text));
    } catch {
      body = JSON.stringify({ raw: text });
    }

    return new Response(body, {
      status: upstream.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return json(500, { error: "Proxy error", detail: String(err?.message || err) });
  }
};

function json(status, obj) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  });
}

function safeParseUrl(maybeUrl) {
  try {
    const u = new URL(maybeUrl);
    if (!["http:", "https:"].includes(u.protocol)) return null;
    return u;
  } catch {
    return null;
  }
}
