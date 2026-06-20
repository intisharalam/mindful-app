"use client";

import { useState } from "react";

const WORDS = [
  { word: "OCEAN", hint: "A vast body of salt water" },
  { word: "PLANET", hint: "Earth is one of these" },
  { word: "MELODY", hint: "A pleasing sequence of musical notes" },
  { word: "HARVEST", hint: "Gathering crops when they're ready" },
  { word: "CURIOUS", hint: "Eager to learn or know something" },
  { word: "BRIDGE", hint: "A structure that crosses a gap" },
  { word: "GALAXY", hint: "A huge collection of stars" },
  { word: "FOREST", hint: "A large area covered in trees" },
];

function scramble(word: string): string[] {
  const letters = word.split("");
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  if (letters.join("") === word) return scramble(word);
  return letters;
}

function pickWord() {
  const entry = WORDS[Math.floor(Math.random() * WORDS.length)];
  return { ...entry, scrambled: scramble(entry.word) };
}

export default function WordGame({ onWin }: { onWin: () => void }) {
  const [current, setCurrent] = useState(() => pickWord());
  const [guess, setGuess] = useState<string[]>([]);
  const [solvedCount, setSolvedCount] = useState(0);
  const [status, setStatus] = useState<"playing" | "correct">("playing");

  const handlePick = (letterIdx: number) => {
    if (status === "correct") return;
    const nextGuess = [...guess, `${letterIdx}`];
    setGuess(nextGuess);

    const formed = nextGuess.map((i) => current.scrambled[Number(i)]).join("");
    if (formed.length === current.word.length) {
      if (formed === current.word) {
        setStatus("correct");
        const nextSolved = solvedCount + 1;
        setSolvedCount(nextSolved);
        if (nextSolved >= 3) onWin();
        setTimeout(() => {
          setCurrent(pickWord());
          setGuess([]);
          setStatus("playing");
        }, 1100);
      } else {
        setTimeout(() => setGuess([]), 500);
      }
    }
  };

  const formedSoFar = guess
    .map((i) => current.scrambled[Number(i)])
    .join("");

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[12px] text-ink-tertiary">Solved: {solvedCount}</p>
        <button
          onClick={() => {
            setCurrent(pickWord());
            setGuess([]);
            setStatus("playing");
          }}
          className="text-[12px] font-medium text-deep hover:underline"
        >
          New word
        </button>
      </div>

      <p className="text-[13px] text-ink-secondary mb-4">{current.hint}</p>

      <div className="flex gap-2 mb-6 min-h-[44px]">
        {Array.from({ length: current.word.length }).map((_, idx) => (
          <div
            key={idx}
            className={`w-9 h-11 rounded-lg border flex items-center justify-center text-[18px] font-semibold ${
              status === "correct"
                ? "bg-deep-bg border-deep-text/30 text-deep-text"
                : "border-border text-ink"
            }`}
          >
            {formedSoFar[idx] ?? ""}
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {current.scrambled.map((letter, idx) => {
          const used = guess.includes(`${idx}`);
          return (
            <button
              key={idx}
              onClick={() => handlePick(idx)}
              disabled={used || status === "correct"}
              className={`w-10 h-10 rounded-lg border text-[16px] font-medium ${
                used
                  ? "opacity-0 pointer-events-none"
                  : "border-border text-ink hover:bg-app-bg"
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {status === "correct" && (
        <p className="text-[13px] font-medium text-deep-text mt-4">
          {current.word} — solved.
        </p>
      )}
    </div>
  );
}
