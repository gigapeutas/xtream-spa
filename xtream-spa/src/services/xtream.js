const PROXY_ENDPOINT = "/.netlify/functions/xtream-proxy?target=";

function proxify(targetUrl) {
  return PROXY_ENDPOINT + encodeURIComponent(targetUrl);
}

async function fetchJson(targetUrl) {
  const res = await fetch(proxify(targetUrl), { method: "GET" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
  }
  return await res.json();
}

export async function login(serverUrl, username, password) {
  const url = `${serverUrl.replace(/\/$/, "")}/player_api.php?username=${encodeURIComponent(
    username
  )}&password=${encodeURIComponent(password)}`;

  const data = await fetchJson(url);

  const auth = data?.user_info?.auth;
  if (auth !== 1 && auth !== "1") {
    throw new Error("Credenciais inválidas ou auth falhou.");
  }

  return {
    raw: data,
    serverUrl: serverUrl.replace(/\/$/, ""),
    username,
    password
  };
}

export async function getCatalog(session) {
  const { serverUrl, username, password } = session;

  const base = `${serverUrl}/player_api.php?username=${encodeURIComponent(
    username
  )}&password=${encodeURIComponent(password)}`;

  const [liveCategories, vodCategories, seriesCategories] = await Promise.all([
    fetchJson(`${base}&action=get_live_categories`).catch(() => []),
    fetchJson(`${base}&action=get_vod_categories`).catch(() => []),
    fetchJson(`${base}&action=get_series_categories`).catch(() => [])
  ]);

  return {
    liveCategories: Array.isArray(liveCategories) ? liveCategories : [],
    vodCategories: Array.isArray(vodCategories) ? vodCategories : [],
    seriesCategories: Array.isArray(seriesCategories) ? seriesCategories : []
  };
}

export async function getItemsByType(session, type, categoryId) {
  const { serverUrl, username, password } = session;

  const base = `${serverUrl}/player_api.php?username=${encodeURIComponent(
    username
  )}&password=${encodeURIComponent(password)}`;

  if (type === "live") {
    const url = categoryId
      ? `${base}&action=get_live_streams&category_id=${encodeURIComponent(categoryId)}`
      : `${base}&action=get_live_streams`;
    const data = await fetchJson(url);
    return Array.isArray(data) ? data : [];
  }

  if (type === "vod") {
    const url = categoryId
      ? `${base}&action=get_vod_streams&category_id=${encodeURIComponent(categoryId)}`
      : `${base}&action=get_vod_streams`;
    const data = await fetchJson(url);
    return Array.isArray(data) ? data : [];
  }

  if (type === "series") {
    const url = categoryId
      ? `${base}&action=get_series&category_id=${encodeURIComponent(categoryId)}`
      : `${base}&action=get_series`;
    const data = await fetchJson(url);
    return Array.isArray(data) ? data : [];
  }

  return [];
}

export function buildPlaybackUrl(session, item, type) {
  const { serverUrl, username, password } = session;

  const s = serverUrl.replace(/\/$/, "");
  const u = encodeURIComponent(username);
  const p = encodeURIComponent(password);

  if (type === "live") {
    const id = item?.stream_id ?? item?.id;
    return `${s}/live/${u}/${p}/${id}.m3u8`;
  }

  if (type === "vod") {
    const id = item?.stream_id ?? item?.id;
    const ext = item?.container_extension || "mp4";
    return `${s}/movie/${u}/${p}/${id}.${ext}`;
  }

  if (type === "series") {
    const id = item?.series_id ?? item?.id;
    return `${s}/series/${u}/${p}/${id}.m3u8`;
  }

  return "";
}
