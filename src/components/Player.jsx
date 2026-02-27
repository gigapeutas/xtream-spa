import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export default function Player({ url }) {
  const videoRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) return;

    setError("");

    // reset
    video.pause();
    video.removeAttribute("src");
    video.load();

    let hls;
    const isM3u8 = url.includes(".m3u8");
    const isHttp = url.startsWith("http://");
    const isHttpsSite = window.location.protocol === "https:";

    if (isHttp && isHttpsSite) {
      // não impede; só avisa. O browser pode bloquear mesmo.
      console.warn("Possível Mixed Content: site HTTPS tentando tocar stream HTTP:", url);
    }

    const onVideoError = () => {
      const code = video.error?.code;
      setError(
        `Falha ao reproduzir (video error code: ${code ?? "?"}).
Causas comuns: Mixed Content (HTTPS→HTTP), CORS, servidor instável (Cloudflare 521), stream fora do padrão.`
      );
    };

    video.addEventListener("error", onVideoError);

    if (Hls.isSupported() && isM3u8) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
        maxBufferLength: 20,
        maxMaxBufferLength: 60,
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        console.log("HLS ERROR:", data);
        if (data?.fatal) {
          setError(
            `HLS fatal: ${data?.details || "unknown"}.
Se seu site estiver em HTTPS e o stream em HTTP, o navegador pode bloquear (Mixed Content).`
          );
          try { hls.destroy(); } catch {}
        }
      });

      hls.loadSource(url);
      hls.attachMedia(video);
    } else {
      // iOS Safari toca HLS nativo; mp4 etc.
      video.src = url;
    }

    return () => {
      video.removeEventListener("error", onVideoError);
      if (hls) hls.destroy();
    };
  }, [url]);

  return (
    <div>
      <video
        ref={videoRef}
        controls
        autoPlay
        playsInline
        style={{ width: "100%", borderRadius: 16, background: "#000" }}
      />
      {error ? (
        <pre style={{ marginTop: 12, color: "#ff6b6b", whiteSpace: "pre-wrap" }}>
          {error}
        </pre>
      ) : null}
    </div>
  );
}
