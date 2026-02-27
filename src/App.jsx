import React, { useEffect, useMemo, useState } from "react";
import Login from "./components/Login.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Grid from "./components/Grid.jsx";
import Player from "./components/Player.jsx";
import { getCatalog, getItemsByType, buildPlaybackUrl } from "./services/xtream.js";

export default function App() {
  const [session, setSession] = useState(null);
  const [catalog, setCatalog] = useState(null);

  const [type, setType] = useState("live");
  const [categoryId, setCategoryId] = useState(null);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  const categories = useMemo(() => {
    if (!catalog) return [];
    if (type === "live") return catalog.liveCategories;
    if (type === "vod") return catalog.vodCategories;
    if (type === "series") return catalog.seriesCategories;
    return [];
  }, [catalog, type]);

  useEffect(() => {
    if (!session) return;
    setError("");
    setCatalog(null);
    (async () => {
      try {
        const c = await getCatalog(session);
        setCatalog(c);
      } catch (e) {
        setError(e.message || String(e));
      }
    })();
  }, [session]);

  useEffect(() => {
    if (!session) return;
    setError("");
    setItems([]);
    setSelected(null);

    (async () => {
      try {
        const list = await getItemsByType(session, type, categoryId);
        setItems(list);
      } catch (e) {
        setError(e.message || String(e));
      }
    })();
  }, [session, type, categoryId]);

  const playbackUrl = useMemo(() => {
    if (!session || !selected) return "";
    return buildPlaybackUrl(session, selected, type);
  }, [session, selected, type]);

  if (!session) {
    return (
      <div className="appShell" style={{ gridTemplateColumns: "1fr" }}>
        <div className="panel">
          <div className="brand">
            <span className="dot" />
            <div>
              <h1>ConSySencI.A Player</h1>
              <div className="small">SPA + HLS (Hls.js) + Netlify Proxy</div>
            </div>
          </div>
          <Login onSession={setSession} />
        </div>
      </div>
    );
  }

  return (
    <div className="appShell">
      <div className="panel">
        <div className="brand">
          <span className="dot" />
          <div>
            <h1>ConSySencI.A Player</h1>
            <div className="small">{type.toUpperCase()} • {items.length} itens</div>
          </div>
        </div>

        <Sidebar
          type={type}
          setType={(t) => {
            setType(t);
            setCategoryId(null);
          }}
          categories={categories}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          onLogout={() => {
            setSession(null);
            setCatalog(null);
            setItems([]);
            setSelected(null);
          }}
        />

        {error ? (
          <div style={{ padding: 16 }}>
            <div className="small" style={{ color: "rgba(255,120,120,0.95)" }}>
              {error}
            </div>
          </div>
        ) : null}
      </div>

      <div className="panel">
        {!selected ? (
          <Grid items={items} type={type} onPick={(item) => setSelected(item)} />
        ) : (
          <Player title={selected?.name || "Player"} url={playbackUrl} onBack={() => setSelected(null)} />
        )}
      </div>
    </div>
  );
}
