"use client";

import { useState } from "react";
import MemoryGame from "@/components/games/MemoryGame";
import MathGame from "@/components/games/MathGame";
import WordGame from "@/components/games/WordGame";
import ScienceQuizGame from "@/components/games/ScienceQuizGame";
import ElementMatchGame from "@/components/games/ElementMatchGame";
import Toast from "@/components/Toast";
import { useEngagement } from "@/context/EngagementContext";

type GameKey = "memory" | "math" | "word" | "science" | "elements";

const GAMES: {
  key: GameKey;
  title: string;
  description: string;
  skill: string;
  emoji: string;
}[] = [
  {
    key: "memory",
    title: "Memory match",
    description: "Flip cards and find every pair.",
    skill: "Memory",
    emoji: "🧠",
  },
  {
    key: "math",
    title: "Quick math",
    description: "Eight fast arithmetic rounds.",
    skill: "Maths",
    emoji: "➗",
  },
  {
    key: "word",
    title: "Word scramble",
    description: "Unscramble the letters to find the word.",
    skill: "Language",
    emoji: "🔤",
  },
  {
    key: "science",
    title: "Science quiz",
    description: "Six quick questions across space, biology, and chemistry.",
    skill: "Science",
    emoji: "🔬",
  },
  {
    key: "elements",
    title: "Element match",
    description: "Match each chemical symbol to its element.",
    skill: "Science",
    emoji: "⚗️",
  },
];

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<GameKey | null>(null);
  const { toast, registerDeepComplete } = useEngagement();

  const handleWin = () => {
    registerDeepComplete(60);
  };

  const activeMeta = GAMES.find((g) => g.key === activeGame);

  return (
    <div className="px-4 md:px-6 py-5 pb-20 md:pb-5">
      <h1 className="text-[20px] font-semibold text-ink mb-1">Games</h1>
      <p className="text-[13px] text-ink-secondary mb-6">
        Short, simple games for memory, maths, language, and science.
        Finishing one well builds your streak too.
      </p>

      {!activeGame && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[760px]">
          {GAMES.map((game) => (
            <button
              key={game.key}
              onClick={() => setActiveGame(game.key)}
              className="text-left border border-border-soft rounded-xl p-4 hover:border-border transition-colors"
            >
              <div className="text-[26px] mb-2">{game.emoji}</div>
              <p className="text-[14px] font-medium text-ink mb-1">
                {game.title}
              </p>
              <p className="text-[12px] text-ink-tertiary mb-2">
                {game.description}
              </p>
              <span className="text-[10px] font-medium bg-deep-bg text-deep-text px-1.5 py-0.5 rounded">
                {game.skill}
              </span>
            </button>
          ))}
        </div>
      )}

      {activeGame && activeMeta && (
        <div className="max-w-[440px]">
          <button
            onClick={() => setActiveGame(null)}
            className="text-[12px] font-medium text-ink-secondary hover:text-ink mb-4 flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            All games
          </button>

          <h2 className="text-[16px] font-medium text-ink mb-4">
            {activeMeta.emoji} {activeMeta.title}
          </h2>

          {activeGame === "memory" && <MemoryGame onWin={handleWin} />}
          {activeGame === "math" && <MathGame onWin={handleWin} />}
          {activeGame === "word" && <WordGame onWin={handleWin} />}
          {activeGame === "science" && <ScienceQuizGame onWin={handleWin} />}
          {activeGame === "elements" && <ElementMatchGame onWin={handleWin} />}
        </div>
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}
