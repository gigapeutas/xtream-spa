export default async (request) => {
  try {
    const url = new URL(request.url);
    const target = url.searchParams.get("target");

    if (!target) {
      return new Response(JSON.stringify({ error: "Missing ?target=" }), {
        status: 400,
        headers: jsonHeaders(),
      });
    }

    const targetUrl = safeParseUrl(target);
    if (!targetUrl) {
      return new Response(JSON.stringify({ error: "Invalid target URL" }), {
        status: 400,
        headers: jsonHeaders(),
      });
    }

    if (!["http:", "https:"].includes(targetUrl.protocol)) {
      return new Response(JSON.stringify({ error: "Only http/https allowed" }), {
        status: 400,
        headers: jsonHeaders(),
      });
    }

    const upstream = await fetch(targetUrl.toString(), {
      method: "GET",
      headers: { "User-Agent": "xtream-spa-proxy/3.0" },
    });

    const contentType =
      upstream.headers.get("content-type") || "application/json";

    const data = await upstream.arrayBuffer();

    return new Response(data, {
      status: upstream.status,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Proxy error", detail: String(err) }),
      { status: 500, headers: jsonHeaders() }
    );
  }
};

function safeParseUrl(maybeUrl) {
  try {
    return new URL(maybeUrl);
  } catch {
    return null;
  }
}

function jsonHeaders() {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
  };
}
