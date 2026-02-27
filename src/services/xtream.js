/*
  Consysenci.a Xtream Service
  - API via Netlify Function (JSON only)
  - Stream direto do servidor (HTTP porta 80)
*/

function normalizeBase(serverUrl) {
  return (serverUrl || "").trim().replace(/\/$/, "");
}

/* ============================
   API (LOGIN + LISTAS JSON)
   ============================ */

export function buildApiUrl(serverUrl, user, pass) {
  const base = normalizeBase(serverUrl);
  return `${base}/player_api.php?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}`;
}

export function buildLiveCategoriesUrl(serverUrl, user, pass) {
  const base = normalizeBase(serverUrl);
  return `${base}/player_api.php?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}&action=get_live_categories`;
}

export function buildLiveStreamsUrl(serverUrl, user, pass, categoryId) {
  const base = normalizeBase(serverUrl);
  return `${base}/player_api.php?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}&action=get_live_streams&category_id=${categoryId}`;
}

export function buildVodCategoriesUrl(serverUrl, user, pass) {
  const base = normalizeBase(serverUrl);
  return `${base}/player_api.php?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}&action=get_vod_categories`;
}

export function buildVodStreamsUrl(serverUrl, user, pass, categoryId) {
  const base = normalizeBase(serverUrl);
  return `${base}/player_api.php?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}&action=get_vod_streams&category_id=${categoryId}`;
}

/*
  Usa Netlify Function SOMENTE para API JSON
  Exemplo de uso:
  const url = proxifyApi(buildApiUrl(...))
*/
export function proxifyApi(targetUrl) {
  const origin = window.location.origin.replace(/\/$/, "");
  return `${origin}/.netlify/functions/xtream-proxy?target=${encodeURIComponent(targetUrl)}`;
}

/* ============================
   STREAMS (DIRETO DO SERVIDOR)
   ============================ */

/*
  LIVE → sempre .m3u8
  Exemplo:
  http://playtvstreaming.shop/live/USER/PASS/12345.m3u8
*/
export function buildLiveStreamUrl(serverUrl, user, pass, streamId) {
  const base = normalizeBase(serverUrl);
  return `${base}/live/${encodeURIComponent(user)}/${encodeURIComponent(pass)}/${streamId}.m3u8`;
}

/*
  VOD → geralmente .mp4
*/
export function buildVodStreamUrl(serverUrl, user, pass, streamId) {
  const base = normalizeBase(serverUrl);
  return `${base}/movie/${encodeURIComponent(user)}/${encodeURIComponent(pass)}/${streamId}.mp4`;
}

/*
  SERIES → geralmente .mp4
*/
export function buildSeriesStreamUrl(serverUrl, user, pass, streamId) {
  const base = normalizeBase(serverUrl);
  return `${base}/series/${encodeURIComponent(user)}/${encodeURIComponent(pass)}/${streamId}.mp4`;
}
