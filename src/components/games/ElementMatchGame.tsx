"use client";

import { useState } from "react";

interface Element {
  symbol: string;
  name: string;
}

const ELEMENTS: Element[] = [
  { symbol: "H", name: "Hydrogen" },
  { symbol: "He", name: "Helium" },
  { symbol: "O", name: "Oxygen" },
  { symbol: "C", name: "Carbon" },
  { symbol: "N", name: "Nitrogen" },
  { symbol: "Na", name: "Sodium" },
  { symbol: "Fe", name: "Iron" },
  { symbol: "Au", name: "Gold" },
  { symbol: "Ag", name: "Silver" },
  { symbol: "K", name: "Potassium" },
  { symbol: "Ca", name: "Calcium" },
  { symbol: "Cu", name: "Copper" },
];

function pickWrongOptions(correct: Element, count: number): Element[] {
  const pool = ELEMENTS.filter((e) => e.symbol !== correct.symbol);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function buildRound() {
  const correct = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
  const wrongs = pickWrongOptions(correct, 3);
  const options = [...wrongs, correct].sort(() => Math.random() - 0.5);
  return { correct, options };
}

const ROUND_LENGTH = 8;

export default function ElementMatchGame({ onWin }: { onWin: () => void }) {
  const [round, setRound] = useState(() => buildRound());
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const handleSelect = (symbol: string) => {
    if (selected !== null) return;
    setSelected(symbol);
    const correct = symbol === round.correct.symbol;
    const nextScore = score + (correct ? 1 : 0);
    if (correct) setScore(nextScore);

    setTimeout(() => {
      if (questionNumber >= ROUND_LENGTH) {
        setFinished(true);
        if (nextScore >= ROUND_LENGTH - 2) onWin();
      } else {
        setRound(buildRound());
        setQuestionNumber((n) => n + 1);
        setSelected(null);
      }
    }, 600);
  };

  const reset = () => {
    setRound(buildRound());
    setQuestionNumber(1);
    setScore(0);
    setSelected(null);
    setFinished(false);
  };

  if (finished) {
    return (
      <div>
        <p className="text-[16px] font-medium text-ink mb-2">
          {score} / {ROUND_LENGTH} correct
        </p>
        <p className="text-[13px] text-ink-secondary mb-4">
          {score >= ROUND_LENGTH - 2
            ? "Strong round — that counts toward your streak."
            : "Good effort. Try again to build your streak."}
        </p>
        <button
          onClick={reset}
          className="text-[13px] font-medium rounded-full px-4 py-2 bg-deep text-white hover:opacity-90"
        >
          Play again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[12px] text-ink-tertiary">
          {questionNumber} of {ROUND_LENGTH}
        </p>
        <p className="text-[12px] text-ink-tertiary">Score: {score}</p>
      </div>

      <p className="text-[13px] text-ink-secondary mb-2">
        Which element has the symbol:
      </p>
      <div className="text-[40px] font-semibold text-ink text-center mb-6">
        {round.correct.symbol}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {round.options.map((opt) => {
          const isCorrectOption = opt.symbol === round.correct.symbol;
          const isSelected = opt.symbol === selected;
          const showState = selected !== null;

          return (
            <button
              key={opt.symbol}
              onClick={() => handleSelect(opt.symbol)}
              disabled={showState}
              className={`text-[14px] font-medium rounded-xl py-3 border ${
                showState && isCorrectOption
                  ? "bg-deep-bg border-deep-text/30 text-deep-text"
                  : showState && isSelected
                    ? "bg-friction-bg border-friction/30 text-friction-text"
                    : "border-border text-ink hover:bg-app-bg"
              }`}
            >
              {opt.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
