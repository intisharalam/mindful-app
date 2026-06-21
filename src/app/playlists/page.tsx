"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface PlaylistSummary {
  id: number;
  name: string;
  contentType: "video" | "book";
  itemCount: number;
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<PlaylistSummary[] | null>(null);
  const [creatingType, setCreatingType] = useState<"video" | "book" | null>(null);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => {
    fetch("/api/playlists")
      .then((res) => res.json())
      .then((data) => setPlaylists(data.playlists ?? []))
      .catch(() => setPlaylists([]));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!newName.trim() || !creatingType) return;
    setBusy(true);
    try {
      const res = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), contentType: creatingType }),
      });
      if (res.ok) {
        setNewName("");
        setCreatingType(null);
        load();
      }
    } finally {
      setBusy(false);
    }
  };

  const videoPlaylists = (playlists ?? []).filter((p) => p.contentType === "video");
  const bookPlaylists = (playlists ?? []).filter((p) => p.contentType === "book");

  return (
    <div className="px-4 md:px-6 py-5 pb-20 md:pb-5">
      <h1 className="text-[20px] font-semibold text-ink mb-1">Playlists</h1>
      <p className="text-[13px] text-ink-secondary mb-6">
        Your own collections — videos and books, kept separate.
      </p>

      <PlaylistSection
        title="Video playlists"
        items={videoPlaylists}
        loading={playlists === null}
        creating={creatingType === "video"}
        onStartCreate={() => setCreatingType("video")}
        onCancelCreate={() => setCreatingType(null)}
        newName={newName}
        setNewName={setNewName}
        onCreate={handleCreate}
        busy={busy}
      />

      <PlaylistSection
        title="Book playlists"
        items={bookPlaylists}
        loading={playlists === null}
        creating={creatingType === "book"}
        onStartCreate={() => setCreatingType("book")}
        onCancelCreate={() => setCreatingType(null)}
        newName={newName}
        setNewName={setNewName}
        onCreate={handleCreate}
        busy={busy}
      />
    </div>
  );
}

function PlaylistSection({
  title,
  items,
  loading,
  creating,
  onStartCreate,
  onCancelCreate,
  newName,
  setNewName,
  onCreate,
  busy,
}: {
  title: string;
  items: PlaylistSummary[];
  loading: boolean;
  creating: boolean;
  onStartCreate: () => void;
  onCancelCreate: () => void;
  newName: string;
  setNewName: (v: string) => void;
  onCreate: () => void;
  busy: boolean;
}) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-border-soft">
        <h2 className="text-[12px] font-medium uppercase tracking-wide text-ink-tertiary">
          {title}
        </h2>
        {!creating && (
          <button
            onClick={onStartCreate}
            className="text-[12px] font-medium text-deep-text hover:underline"
          >
            + New
          </button>
        )}
      </div>

      {creating && (
        <div className="flex items-center gap-2 mb-4 max-w-[420px]">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onCreate();
            }}
            placeholder="Playlist name"
            className="flex-1 text-[13px] border border-border rounded-lg px-3 py-2 outline-none focus:border-deep"
          />
          <button
            disabled={busy || !newName.trim()}
            onClick={onCreate}
            className="text-[12px] font-medium rounded-lg px-3 py-2 bg-deep text-white disabled:opacity-50"
          >
            Create
          </button>
          <button
            onClick={onCancelCreate}
            className="text-[12px] font-medium text-ink-tertiary px-2"
          >
            Cancel
          </button>
        </div>
      )}

      {loading && <p className="text-[13px] text-ink-tertiary">Loading…</p>}

      {!loading && items.length === 0 && (
        <p className="text-[13px] text-ink-tertiary">No playlists yet.</p>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((p) => (
            <Link
              key={p.id}
              href={`/playlists/${p.id}`}
              className="border border-border-soft rounded-xl p-4 hover:border-border"
            >
              <p className="text-[14px] font-medium text-ink mb-1 truncate">
                {p.name}
              </p>
              <p className="text-[12px] text-ink-tertiary">
                {p.itemCount} {p.itemCount === 1 ? "item" : "items"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
