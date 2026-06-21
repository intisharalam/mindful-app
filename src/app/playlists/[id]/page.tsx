"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CONTENT } from "@/lib/content";
import { BOOKS } from "@/lib/books";
import { ContentItem, Book } from "@/lib/types";
import VideoCard from "@/components/VideoCard";
import BookCard from "@/components/BookCard";
import Viewer from "@/components/Viewer";
import BookViewer from "@/components/BookViewer";
import InterruptModal from "@/components/InterruptModal";
import Toast from "@/components/Toast";
import { useEngagement } from "@/context/EngagementContext";

interface PlaylistDetail {
  id: number;
  name: string;
  contentType: "video" | "book";
  itemCount: number;
}
interface PlaylistItemRow {
  id: number;
  contentId: number;
  position: number;
  addedAt: string;
}

export default function PlaylistDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const playlistId = Number(params.id);

  const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null);
  const [items, setItems] = useState<PlaylistItemRow[] | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [activeItem, setActiveItem] = useState<ContentItem | null>(null);
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [showInterrupt, setShowInterrupt] = useState(false);
  const {
    toast,
    registerDeepComplete,
    registerShortSkip,
    registerShortBlocked,
  } = useEngagement();

  const load = () => {
    fetch(`/api/playlists/${playlistId}`)
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setPlaylist(data.playlist);
        setItems(data.items ?? []);
      })
      .catch(() => setNotFound(true));
  };

  useEffect(() => {
    if (Number.isFinite(playlistId)) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlistId]);

  const handleRemove = async (contentId: number) => {
    await fetch(`/api/playlists/${playlistId}/items?contentId=${contentId}`, {
      method: "DELETE",
    });
    load();
  };

  const handleDeletePlaylist = async () => {
    await fetch(`/api/playlists/${playlistId}`, { method: "DELETE" });
    router.push("/playlists");
  };

  const handleShortSkip = (secondsSpent: number) => {
    const result = registerShortSkip(secondsSpent);
    if (result === "interrupt") {
      registerShortBlocked();
      setShowInterrupt(true);
    }
  };

  const pickDeepFromInterrupt = () => {
    setShowInterrupt(false);
    const deepItem = CONTENT.find((c) => c.type === "deep");
    if (deepItem) setActiveItem(deepItem);
  };

  if (notFound) {
    return (
      <div className="px-4 md:px-6 py-5">
        <p className="text-[13px] text-ink-tertiary">
          Playlist not found, or it isn&apos;t yours.
        </p>
      </div>
    );
  }

  const resolvedItems = (items ?? [])
    .map((pi) => {
      if (!playlist) return null;
      if (playlist.contentType === "video") {
        const content = CONTENT.find((c) => c.id === pi.contentId);
        return content ? { pi, content, kind: "video" as const } : null;
      }
      const book = BOOKS.find((b) => b.id === pi.contentId);
      return book ? { pi, book, kind: "book" as const } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  return (
    <div className="px-4 md:px-6 py-5 pb-20 md:pb-5">
      {playlist && (
        <>
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-[20px] font-semibold text-ink">{playlist.name}</h1>
            <button
              onClick={handleDeletePlaylist}
              className="text-[12px] font-medium text-friction-text hover:underline"
            >
              Delete playlist
            </button>
          </div>
          <p className="text-[13px] text-ink-secondary mb-6">
            {playlist.contentType === "video" ? "Video" : "Book"} playlist ·{" "}
            {resolvedItems.length} {resolvedItems.length === 1 ? "item" : "items"}
          </p>
        </>
      )}

      {items === null && <p className="text-[13px] text-ink-tertiary">Loading…</p>}

      {items !== null && resolvedItems.length === 0 && (
        <p className="text-[13px] text-ink-tertiary">
          Nothing in this playlist yet — add items from the player when
          you&apos;re watching or reading something.
        </p>
      )}

      {resolvedItems.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {resolvedItems.map((entry) => (
            <div key={entry.pi.id} className="relative group">
              {entry.kind === "video" ? (
                <VideoCard item={entry.content} onOpen={setActiveItem} />
              ) : (
                <BookCard book={entry.book} onOpen={setActiveBook} />
              )}
              <button
                onClick={() => handleRemove(entry.pi.contentId)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/55 text-white flex items-center justify-center text-[12px] opacity-0 group-hover:opacity-100"
                title="Remove from playlist"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {activeItem && (
        <Viewer
          item={activeItem}
          onClose={() => setActiveItem(null)}
          onDeepComplete={registerDeepComplete}
          onShortSkip={handleShortSkip}
        />
      )}

      {activeBook && (
        <BookViewer
          book={activeBook}
          onClose={() => setActiveBook(null)}
          onStartReading={registerDeepComplete}
        />
      )}

      {showInterrupt && (
        <InterruptModal
          onPickDeep={pickDeepFromInterrupt}
          onDismiss={() => setShowInterrupt(false)}
        />
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}
