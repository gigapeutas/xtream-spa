import React, { useMemo } from "react";
import { useTVNavigation } from "../hooks/useTVNavigation.js";

export default function Grid({ items, type, onPick }) {
  const columns = 6;

  const normalized = useMemo(() => {
    return (items || []).map((it) => ({
      id: it.stream_id || it.series_id || it.id,
      name: it.name || it.title || "Sem nome",
      poster:
        it.stream_icon ||
        it.cover ||
        it.movie_image ||
        it.series_cover ||
        "",
      raw: it
    }));
  }, [items]);

  const nav = useTVNavigation({
    itemCount: normalized.length,
    columns,
    onEnter: (idx) => {
      const picked = normalized[idx]?.raw;
      if (picked) onPick(picked);
    }
  });

  return (
    <div>
      <div className="playerTop">
        <div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>
            {type.toUpperCase()}
          </div>
          <div className="small">{normalized.length} itens • Enter = abrir</div>
        </div>
      </div>

      <div className="grid" role="grid" aria-label="Catálogo">
        {normalized.map((it, i) => (
          <div
            key={it.id ?? i}
            className={"card " + (i === nav.index ? "cardFocus" : "")}
            role="gridcell"
            tabIndex={-1}
            onMouseEnter={() => nav.setIndex(i)}
            onClick={() => onPick(it.raw)}
          >
            {it.poster ? (
              <img className="poster" src={it.poster} alt={it.name} />
            ) : (
              <div className="poster" />
            )}
            <div className="cardBody">
              <div className="title">{it.name}</div>
              <div className="meta">ID: {String(it.id ?? "-")}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
