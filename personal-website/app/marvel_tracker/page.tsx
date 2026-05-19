"use client";

import { useState, useEffect, useCallback } from "react";
import { UNIVERSES, MarvelUniverse } from "./marvel-data";

const ADMIN_PASSWORD = "test"; // Change this to your preferred password

type WatchedMap = Record<string, boolean>;

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="progress-bar-track">
      <div
        className="progress-bar-fill"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  );
}

function UniverseSection({
  universe,
  watched,
  isAdmin,
  onToggle,
  onAddEntry,
  onRemoveEntry,
  onRenameEntry,
}: {
  universe: MarvelUniverse;
  watched: WatchedMap;
  isAdmin: boolean;
  onToggle: (id: string) => void;
  onAddEntry: (universeId: string, title: string) => void;
  onRemoveEntry: (universeId: string, entryId: string) => void;
  onRenameEntry: (universeId: string, entryId: string, newTitle: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const total = universe.entries.length;
  const done = universe.entries.filter((e) => watched[e.id]).length;
  const pct = total === 0 ? 0 : (done / total) * 100;

  return (
    <section className="universe-section">
      <div
        className="universe-header"
        onClick={() => setCollapsed((c) => !c)}
        style={{ borderLeftColor: universe.color }}
      >
        <div className="universe-title-row">
          <span className="universe-arrow">{collapsed ? "▶" : "▼"}</span>
          <h2 className="universe-title" style={{ color: universe.color }}>
            {universe.label}
          </h2>
          <span className="universe-count">
            {done}/{total}
          </span>
        </div>
        <ProgressBar value={pct} color={universe.color} />
      </div>

      {!collapsed && (
        <ul className="entry-list">
          {universe.entries.map((entry, idx) => (
            <li key={entry.id} className={`entry-item ${watched[entry.id] ? "watched" : ""}`}>
              <button
                className="check-btn"
                style={watched[entry.id] ? { backgroundColor: universe.color, borderColor: universe.color } : {}}
                onClick={() => onToggle(entry.id)}
                aria-label={watched[entry.id] ? "Mark unwatched" : "Mark watched"}
              >
                {watched[entry.id] && <span className="checkmark">✓</span>}
              </button>

              {editingId === entry.id && isAdmin ? (
                <input
                  className="edit-input"
                  value={editingTitle}
                  autoFocus
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={() => {
                    if (editingTitle.trim()) onRenameEntry(universe.id, entry.id, editingTitle.trim());
                    setEditingId(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (editingTitle.trim()) onRenameEntry(universe.id, entry.id, editingTitle.trim());
                      setEditingId(null);
                    }
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
              ) : (
                <span
                  className="entry-title"
                  onDoubleClick={() => {
                    if (isAdmin) {
                      setEditingId(entry.id);
                      setEditingTitle(entry.title);
                    }
                  }}
                >
                  <span className="entry-num">{idx + 1}.</span> {entry.title}
                </span>
              )}

              {isAdmin && (
                <button
                  className="remove-btn"
                  onClick={() => onRemoveEntry(universe.id, entry.id)}
                  title="Remove entry"
                >
                  ×
                </button>
              )}
            </li>
          ))}

          {isAdmin && (
            <li className="add-entry-row">
              <input
                className="add-input"
                placeholder="Add new entry…"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newTitle.trim()) {
                    onAddEntry(universe.id, newTitle.trim());
                    setNewTitle("");
                  }
                }}
              />
              <button
                className="add-btn"
                style={{ backgroundColor: universe.color }}
                onClick={() => {
                  if (newTitle.trim()) {
                    onAddEntry(universe.id, newTitle.trim());
                    setNewTitle("");
                  }
                }}
              >
                Add
              </button>
            </li>
          )}
        </ul>
      )}
    </section>
  );
}

export default function MarvelTrackerPage() {
  const [universes, setUniverses] = useState<MarvelUniverse[]>(UNIVERSES);
  const [watched, setWatched] = useState<WatchedMap>({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const w = localStorage.getItem("marvel_watched");
      const u = localStorage.getItem("marvel_universes");
      if (w) setWatched(JSON.parse(w));
      if (u) setUniverses(JSON.parse(u));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("marvel_watched", JSON.stringify(watched));
  }, [watched, loaded]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("marvel_universes", JSON.stringify(universes));
  }, [universes, loaded]);

  const totalEntries = universes.reduce((s, u) => s + u.entries.length, 0);
  const totalWatched = universes.reduce(
    (s, u) => s + u.entries.filter((e) => watched[e.id]).length,
    0
  );
  const overallPct = totalEntries === 0 ? 0 : (totalWatched / totalEntries) * 100;

  const handleToggle = useCallback((id: string) => {
    setWatched((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleLogin = () => {
    if (pwInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowLogin(false);
      setPwInput("");
      setPwError(false);
    } else {
      setPwError(true);
    }
  };

  const handleAddEntry = (universeId: string, title: string) => {
    setUniverses((prev) =>
      prev.map((u) =>
        u.id === universeId
          ? { ...u, entries: [...u.entries, { id: `${universeId}-custom-${Date.now()}`, title }] }
          : u
      )
    );
  };

  const handleRemoveEntry = (universeId: string, entryId: string) => {
    setUniverses((prev) =>
      prev.map((u) =>
        u.id === universeId
          ? { ...u, entries: u.entries.filter((e) => e.id !== entryId) }
          : u
      )
    );
    setWatched((prev) => {
      const next = { ...prev };
      delete next[entryId];
      return next;
    });
  };

  const handleRenameEntry = (universeId: string, entryId: string, newTitle: string) => {
    setUniverses((prev) =>
      prev.map((u) =>
        u.id === universeId
          ? { ...u, entries: u.entries.map((e) => e.id === entryId ? { ...e, title: newTitle } : e) }
          : u
      )
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #0a0a0f; color: #e8e8f0; font-family: 'DM Sans', sans-serif; }

        .tracker-root {
          min-height: 100vh;
          background: #0a0a0f;
          background-image:
            radial-gradient(ellipse at 20% 0%, rgba(180,0,0,0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 100%, rgba(100,0,200,0.06) 0%, transparent 60%);
          padding: 0 0 80px;
        }

        .tracker-hero { padding: 60px 24px 40px; max-width: 900px; margin: 0 auto; }

        .back-link {
          display: inline-flex; align-items: center; gap: 6px; color: #666;
          text-decoration: none; font-size: 13px; letter-spacing: 0.05em;
          text-transform: uppercase; margin-bottom: 32px; transition: color 0.2s;
        }
        .back-link:hover { color: #ccc; }

        .tracker-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(52px, 8vw, 96px);
          line-height: 0.9; letter-spacing: 0.02em; color: #fff;
          text-transform: uppercase; margin-bottom: 4px;
        }
        .tracker-title span { color: #e63946; }

        .tracker-subtitle {
          font-size: 13px; color: #555; letter-spacing: 0.12em;
          text-transform: uppercase; margin-bottom: 40px;
        }

        .overall-stats { display: flex; align-items: center; gap: 20px; margin-bottom: 8px; }

        .stat-big { font-family: 'Bebas Neue', sans-serif; font-size: 48px; color: #e63946; line-height: 1; }
        .stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #555; }

        .overall-bar-track {
          flex: 1; height: 6px; background: #1a1a2a; border-radius: 3px; overflow: hidden;
        }
        .overall-bar-fill {
          height: 100%; background: linear-gradient(90deg, #e63946, #ff6b6b);
          border-radius: 3px; transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
        }

        .admin-bar {
          display: flex; align-items: center; justify-content: flex-end;
          gap: 10px; padding: 0 24px; max-width: 900px; margin: 0 auto 24px;
        }

        .admin-btn {
          font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 6px 14px; border-radius: 4px;
          border: 1px solid #333; background: transparent; color: #666;
          cursor: pointer; transition: all 0.2s;
        }
        .admin-btn:hover { border-color: #e63946; color: #e63946; }

        .login-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px); display: flex; align-items: center;
          justify-content: center; z-index: 100;
        }

        .login-box {
          background: #111118; border: 1px solid #222; border-radius: 12px;
          padding: 40px 36px; width: 320px;
        }

        .login-title { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: #fff; margin-bottom: 6px; }
        .login-subtitle { font-size: 12px; color: #555; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 0.08em; }

        .login-input {
          width: 100%; background: #0a0a0f; border: 1px solid #333; border-radius: 6px;
          padding: 10px 14px; color: #fff; font-family: 'DM Sans', sans-serif;
          font-size: 14px; margin-bottom: 12px; outline: none; transition: border-color 0.2s;
        }
        .login-input:focus { border-color: #e63946; }
        .login-input.error { border-color: #ff4444; }
        .login-error { font-size: 12px; color: #ff4444; margin-bottom: 12px; }

        .login-actions { display: flex; gap: 10px; }

        .btn-primary {
          flex: 1; background: #e63946; color: #fff; border: none; border-radius: 6px;
          padding: 10px; font-family: 'DM Sans', sans-serif; font-size: 13px;
          font-weight: 500; cursor: pointer; letter-spacing: 0.05em; transition: background 0.2s;
        }
        .btn-primary:hover { background: #c1121f; }

        .btn-ghost {
          background: transparent; color: #555; border: 1px solid #333; border-radius: 6px;
          padding: 10px 16px; font-family: 'DM Sans', sans-serif; font-size: 13px;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-ghost:hover { color: #aaa; border-color: #555; }

        .universes-container {
          max-width: 900px; margin: 0 auto; padding: 0 24px;
          display: flex; flex-direction: column; gap: 2px;
        }

        .universe-section { border-radius: 8px; overflow: hidden; background: #0e0e18; border: 1px solid #181828; }

        .universe-header { padding: 16px 20px 14px; cursor: pointer; user-select: none; border-left: 3px solid transparent; transition: background 0.15s; }
        .universe-header:hover { background: #131323; }

        .universe-title-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .universe-arrow { font-size: 10px; color: #444; }
        .universe-title { font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 0.06em; flex: 1; }
        .universe-count { font-size: 12px; color: #555; }

        .progress-bar-track { height: 3px; background: #1a1a2a; border-radius: 2px; overflow: hidden; }
        .progress-bar-fill { height: 100%; border-radius: 2px; transition: width 0.4s cubic-bezier(0.4,0,0.2,1); }

        .entry-list { list-style: none; border-top: 1px solid #181828; }

        .entry-item {
          display: flex; align-items: center; gap: 12px; padding: 9px 20px;
          border-bottom: 1px solid #111120; transition: background 0.1s;
        }
        .entry-item:hover { background: #131323; }
        .entry-item.watched .entry-title { color: #444; text-decoration: line-through; }
        .entry-item:last-child { border-bottom: none; }

        .check-btn {
          width: 18px; height: 18px; border-radius: 4px; border: 1px solid #333;
          background: transparent; cursor: pointer; display: flex; align-items: center;
          justify-content: center; flex-shrink: 0; transition: all 0.15s;
        }
        .check-btn:hover { border-color: #666; }
        .checkmark { font-size: 11px; color: #fff; line-height: 1; }

        .entry-title { font-size: 13.5px; color: #ccc; flex: 1; line-height: 1.4; transition: color 0.2s; }
        .entry-num { color: #444; font-size: 11px; margin-right: 2px; }

        .edit-input {
          flex: 1; background: #0a0a0f; border: 1px solid #e63946; border-radius: 4px;
          padding: 4px 8px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 13px; outline: none;
        }

        .remove-btn {
          background: none; border: none; color: #333; font-size: 18px; cursor: pointer;
          padding: 0 4px; line-height: 1; transition: color 0.15s; flex-shrink: 0;
        }
        .remove-btn:hover { color: #e63946; }

        .add-entry-row {
          display: flex; gap: 8px; padding: 10px 20px;
          background: #0b0b16; border-top: 1px dashed #1a1a2a;
        }

        .add-input {
          flex: 1; background: #0a0a0f; border: 1px solid #222; border-radius: 4px;
          padding: 7px 10px; color: #ccc; font-family: 'DM Sans', sans-serif; font-size: 13px;
          outline: none; transition: border-color 0.2s;
        }
        .add-input:focus { border-color: #444; }
        .add-input::placeholder { color: #333; }

        .add-btn {
          border: none; border-radius: 4px; padding: 7px 14px; color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
          cursor: pointer; letter-spacing: 0.04em; transition: opacity 0.15s;
        }
        .add-btn:hover { opacity: 0.85; }

        .admin-badge {
          font-size: 10px; background: rgba(230,57,70,0.15); color: #e63946;
          border: 1px solid rgba(230,57,70,0.3); border-radius: 3px;
          padding: 2px 7px; letter-spacing: 0.1em; text-transform: uppercase;
        }
      `}</style>

      <div className="tracker-root">
        <div className="tracker-hero">
          <a href="/" className="back-link">← Back to Home</a>
          <h1 className="tracker-title">
            <span>Marvel</span> Watch<br />Tracker
          </h1>
          <p className="tracker-subtitle">Multiverse Edition · All Universes</p>

          <div className="overall-stats">
            <div>
              <div className="stat-big">{Math.round(overallPct)}%</div>
              <div className="stat-label">{totalWatched} of {totalEntries} watched</div>
            </div>
            <div className="overall-bar-track">
              <div className="overall-bar-fill" style={{ width: `${overallPct}%` }} />
            </div>
          </div>
        </div>

        <div className="admin-bar">
          {isAdmin && <span className="admin-badge">Admin Mode</span>}
          {isAdmin ? (
            <button className="admin-btn" onClick={() => setIsAdmin(false)}>Lock</button>
          ) : (
            <button className="admin-btn" onClick={() => setShowLogin(true)}>Edit Mode</button>
          )}
        </div>

        <div className="universes-container">
          {universes.map((u) => (
            <UniverseSection
              key={u.id}
              universe={u}
              watched={watched}
              isAdmin={isAdmin}
              onToggle={handleToggle}
              onAddEntry={handleAddEntry}
              onRemoveEntry={handleRemoveEntry}
              onRenameEntry={handleRenameEntry}
            />
          ))}
        </div>
      </div>

      {showLogin && (
        <div className="login-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowLogin(false); }}>
          <div className="login-box">
            <div className="login-title">Admin Access</div>
            <div className="login-subtitle">Enter password to edit</div>
            <input
              className={`login-input ${pwError ? "error" : ""}`}
              type="password"
              placeholder="Password"
              value={pwInput}
              autoFocus
              onChange={(e) => { setPwInput(e.target.value); setPwError(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            {pwError && <div className="login-error">Incorrect password</div>}
            <div className="login-actions">
              <button className="btn-ghost" onClick={() => { setShowLogin(false); setPwInput(""); setPwError(false); }}>Cancel</button>
              <button className="btn-primary" onClick={handleLogin}>Unlock</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}