import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export default function Player({ title, url, onBack }) {
  const videoRef = useRef(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    setErr("");
    const video = videoRef.current;
    if (!video || !url) return;

    let hls;

    const canNativeHls =
      video.canPlayType("application/vnd.apple.mpegurl") ||
      video.canPlayType("application/x-mpegURL");

    if (canNativeHls) {
      video.src = url;
      video.play().catch(() => {});
      return;
    }

    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data?.fatal) {
          setErr(`HLS fatal: ${data.type} / ${data.details}`);
          try { hls.destroy(); } catch {}
        }
      });

      return () => {
        try { hls.destroy(); } catch {}
      };
    }

    video.src = url;
    video.play().catch(() => {});
  }, [url]);

  return (
    <div className="playerWrap">
      <div className="playerTop">
        <div>
          <div style={{ fontSize: 14, fontWeight: 800 }}>{title}</div>
          <div className="small">Esc/Backspace = voltar</div>
        </div>
        <button className="btn" onClick={onBack}>Voltar</button>
      </div>

      <div className="videoBox">
        <div style={{ width: "100%" }}>
          <video ref={videoRef} controls autoPlay />
          {err ? (
            <div className="small" style={{ color: "rgba(255,120,120,0.95)", marginTop: 10 }}>
              {err}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
