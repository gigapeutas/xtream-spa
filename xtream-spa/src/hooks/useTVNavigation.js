import { useEffect, useMemo, useState } from "react";

export function useTVNavigation({ itemCount, columns, onEnter, onBack }) {
  const [index, setIndex] = useState(0);

  const clamp = (v) => Math.max(0, Math.min(itemCount - 1, v));

  const api = useMemo(() => {
    return {
      index,
      setIndex: (v) => setIndex(clamp(v)),
      move: (delta) => setIndex((prev) => clamp(prev + delta))
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, itemCount]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (itemCount <= 0) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          api.move(-1);
          break;
        case "ArrowRight":
          e.preventDefault();
          api.move(+1);
          break;
        case "ArrowUp":
          e.preventDefault();
          api.move(-columns);
          break;
        case "ArrowDown":
          e.preventDefault();
          api.move(+columns);
          break;
        case "Enter":
          e.preventDefault();
          onEnter?.(api.index);
          break;
        case "Escape":
        case "Backspace":
          onBack?.();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [api, itemCount, columns, onEnter, onBack]);

  useEffect(() => {
    setIndex((prev) => clamp(prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemCount]);

  return api;
}
