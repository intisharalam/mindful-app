"use client";

import { useEffect, useState } from "react";

interface PlaylistSummary {
  id: number;
  name: string;
  contentType: "video" | "book";
  itemCount: number;
}

export default function AddToPlaylistMenu({
  contentType,
  contentId,
}: {
  contentType: "video" | "book";
  contentId: number;
}) {
  const [open, setOpen] = useState(false);
  const [playlists, setPlaylists] = useState<PlaylistSummary[] | null>(null);
  const [addedTo, setAddedTo] = useState<Set<number>>(new Set());
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open || playlists !== null) return;
    fetch(`/api/playlists?contentType=${contentType}`)
      .then((res) => res.json())
      .then((data) => setPlaylists(data.playlists ?? []))
      .catch(() => setPlaylists([]));
  }, [open, playlists, contentType]);

  const handleAdd = async (playlistId: number) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/playlists/${playlistId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId }),
      });
      if (res.ok) {
        setAddedTo((prev) => new Set(prev).add(playlistId));
      }
    } catch {
      // Best-effort; the button simply won't show as "added".
    } finally {
      setBusy(false);
    }
  };

  const handleCreateAndAdd = async () => {
    if (!newName.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), contentType }),
      });
      const data = await res.json();
      if (res.ok && data.id) {
        await handleAdd(data.id);
        setPlaylists((prev) => [
          { id: data.id, name: newName.trim(), contentType, itemCount: 1 },
          ...(prev ?? []),
        ]);
        setNewName("");
        setCreating(false);
      }
    } catch {
      // Best-effort.
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-[13px] font-medium rounded-full px-4 py-2.5 border border-border text-ink-secondary hover:bg-app-bg flex items-center gap-1.5"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 6h10M4 12h10M4 18h6M17 14v6M14 17h6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        Add to playlist
      </button>

      {open && (
        <div
          className="absolute bottom-full mb-2 left-0 w-56 bg-surface border border-border rounded-xl shadow-lg p-2 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {playlists === null && (
            <p className="text-[12px] text-ink-tertiary px-2 py-1.5">Loading…</p>
          )}

          {playlists !== null && playlists.length === 0 && !creating && (
            <p className="text-[12px] text-ink-tertiary px-2 py-1.5">
              No playlists yet.
            </p>
          )}

          {playlists?.map((p) => {
            const added = addedTo.has(p.id);
            return (
              <button
                key={p.id}
                disabled={busy || added}
                onClick={() => handleAdd(p.id)}
                className="w-full text-left text-[13px] px-2 py-1.5 rounded-lg hover:bg-app-bg flex items-center justify-between disabled:opacity-60"
              >
                <span className="truncate text-ink">{p.name}</span>
                {added && <span className="text-[11px] text-deep-text">Added</span>}
              </button>
            );
          })}

          <div className="h-px bg-border-soft my-1.5" />

          {!creating ? (
            <button
              onClick={() => setCreating(true)}
              className="w-full text-left text-[13px] px-2 py-1.5 rounded-lg hover:bg-app-bg text-deep-text font-medium"
            >
              + New playlist
            </button>
          ) : (
            <div className="px-2 py-1.5 flex flex-col gap-1.5">
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateAndAdd();
                }}
                placeholder="Playlist name"
                className="text-[13px] border border-border rounded-lg px-2 py-1.5 outline-none focus:border-deep"
              />
              <button
                disabled={busy || !newName.trim()}
                onClick={handleCreateAndAdd}
                className="text-[12px] font-medium rounded-lg py-1.5 bg-deep text-white disabled:opacity-50"
              >
                Create & add
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
