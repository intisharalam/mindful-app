"use client";

import { useEffect, useState } from "react";

const EMOJI_SET = ["🍎", "🚀", "🎵", "🐢", "🌟", "🍩", "🎈", "🦊"];

interface CardState {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildDeck(): CardState[] {
  const pairs = shuffle([...EMOJI_SET, ...EMOJI_SET]);
  return pairs.map((emoji, idx) => ({
    id: idx,
    emoji,
    flipped: false,
    matched: false,
  }));
}

export default function MemoryGame({
  onWin,
}: {
  onWin: () => void;
}) {
  const [cards, setCards] = useState<CardState[]>(() => buildDeck());
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.matched) && !won) {
      setWon(true);
      onWin();
    }
  }, [cards, won, onWin]);

  const handleFlip = (id: number) => {
    if (selected.length === 2) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const nextCards = cards.map((c) =>
      c.id === id ? { ...c, flipped: true } : c
    );
    const nextSelected = [...selected, id];
    setCards(nextCards);
    setSelected(nextSelected);

    if (nextSelected.length === 2) {
      setMoves((m) => m + 1);
      const [firstId, secondId] = nextSelected;
      const first = nextCards.find((c) => c.id === firstId)!;
      const second = nextCards.find((c) => c.id === secondId)!;

      if (first.emoji === second.emoji) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, matched: true }
                : c
            )
          );
          setSelected([]);
        }, 400);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, flipped: false }
                : c
            )
          );
          setSelected([]);
        }, 700);
      }
    }
  };

  const reset = () => {
    setCards(buildDeck());
    setSelected([]);
    setMoves(0);
    setWon(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] text-ink-secondary">Moves: {moves}</p>
        <button
          onClick={reset}
          className="text-[12px] font-medium text-deep hover:underline"
        >
          Restart
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2.5 max-w-[360px]">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleFlip(card.id)}
            disabled={card.matched}
            className={`aspect-square rounded-xl text-2xl flex items-center justify-center border transition-colors ${
              card.matched
                ? "bg-deep-bg border-deep-text/20 opacity-60"
                : card.flipped
                  ? "bg-surface border-border"
                  : "bg-deep border-deep hover:opacity-90"
            }`}
          >
            {card.flipped || card.matched ? card.emoji : ""}
          </button>
        ))}
      </div>

      {won && (
        <p className="text-[13px] font-medium text-deep-text mt-4">
          Solved in {moves} moves — nice work.
        </p>
      )}
    </div>
  );
}
