import React from "react";

export default function Sidebar({
  type,
  setType,
  categories,
  categoryId,
  setCategoryId,
  onLogout
}) {
  return (
    <div style={{ padding: 16, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          className="btn"
          onClick={() => setType("live")}
          style={type === "live" ? { borderColor: "rgba(0,255,136,0.75)" } : null}
        >
          Live
        </button>
        <button
          className="btn"
          onClick={() => setType("vod")}
          style={type === "vod" ? { borderColor: "rgba(0,255,136,0.75)" } : null}
        >
          VOD
        </button>
        <button
          className="btn"
          onClick={() => setType("series")}
          style={type === "series" ? { borderColor: "rgba(0,255,136,0.75)" } : null}
        >
          Series
        </button>
      </div>

      <div className="small">Categorias</div>
      <select
        className="input"
        value={categoryId ?? ""}
        onChange={(e) => setCategoryId(e.target.value || null)}
      >
        <option value="">Todas</option>
        {categories.map((c) => (
          <option key={c.category_id} value={c.category_id}>
            {c.category_name}
          </option>
        ))}
      </select>

      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn" onClick={onLogout}>
          Sair
        </button>
      </div>

      <div className="small">
        TV Mode: navegue com ← ↑ → ↓ e pressione Enter.
      </div>
    </div>
  );
}
