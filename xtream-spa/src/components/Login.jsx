import React, { useState } from "react";
import { login } from "../services/xtream.js";

export default function Login({ onSession }) {
  const [serverUrl, setServerUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const session = await login(serverUrl, username, password);
      onSession(session);
    } catch (e2) {
      setErr(e2.message || String(e2));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ padding: 16, maxWidth: 520 }}>
      <div style={{ display: "grid", gap: 10 }}>
        <label className="small">Server URL</label>
        <input
          className="input"
          placeholder="http://seu-servidor:porta"
          value={serverUrl}
          onChange={(e) => setServerUrl(e.target.value)}
          autoCapitalize="none"
          autoCorrect="off"
        />

        <label className="small">Usuário</label>
        <input
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoCapitalize="none"
          autoCorrect="off"
        />

        <label className="small">Senha</label>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn" type="submit" disabled={busy}>
          {busy ? "Entrando..." : "Entrar"}
        </button>

        {err ? (
          <div className="small" style={{ color: "rgba(255,120,120,0.95)" }}>
            {err}
          </div>
        ) : (
          <div className="small">
            Dica: chamadas passam por Netlify Function (proxy) para evitar CORS.
          </div>
        )}
      </div>
    </form>
  );
}
