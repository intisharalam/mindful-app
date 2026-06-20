"use client";

import { useState } from "react";

interface Question {
  question: string;
  options: string[];
  answerIndex: number;
}

const QUESTIONS: Question[] = [
  {
    question: "Which planet has the most moons?",
    options: ["Jupiter", "Saturn", "Mars", "Neptune"],
    answerIndex: 1,
  },
  {
    question: "What gas do plants absorb during photosynthesis?",
    options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
    answerIndex: 2,
  },
  {
    question: "What is the hardest natural substance on Earth?",
    options: ["Quartz", "Diamond", "Titanium", "Granite"],
    answerIndex: 1,
  },
  {
    question: "How many bones are in the adult human body?",
    options: ["186", "206", "256", "300"],
    answerIndex: 1,
  },
  {
    question: "What's the closest star to Earth, other than the Sun?",
    options: ["Sirius", "Alpha Centauri", "Proxima Centauri", "Betelgeuse"],
    answerIndex: 2,
  },
  {
    question: "What part of the cell contains its genetic material?",
    options: ["Mitochondria", "Nucleus", "Cytoplasm", "Ribosome"],
    answerIndex: 1,
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Osmium", "Iron"],
    answerIndex: 1,
  },
  {
    question: "What force keeps planets in orbit around the Sun?",
    options: ["Magnetism", "Friction", "Gravity", "Inertia"],
    answerIndex: 2,
  },
];

const ROUND_LENGTH = 6;

function pickQuestions(): Question[] {
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, ROUND_LENGTH);
}

export default function ScienceQuizGame({ onWin }: { onWin: () => void }) {
  const [questions, setQuestions] = useState<Question[]>(() => pickQuestions());
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const current = questions[index];

  const handleSelect = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    const correct = optionIndex === current.answerIndex;
    if (correct) setScore((s) => s + 1);

    setTimeout(() => {
      if (index + 1 >= questions.length) {
        setFinished(true);
        if (score + (correct ? 1 : 0) >= ROUND_LENGTH - 1) onWin();
      } else {
        setIndex((i) => i + 1);
        setSelected(null);
      }
    }, 700);
  };

  const reset = () => {
    setQuestions(pickQuestions());
    setIndex(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
  };

  if (finished) {
    return (
      <div>
        <p className="text-[16px] font-medium text-ink mb-2">
          {score} / {questions.length} correct
        </p>
        <p className="text-[13px] text-ink-secondary mb-4">
          {score >= ROUND_LENGTH - 1
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
          Question {index + 1} of {questions.length}
        </p>
        <p className="text-[12px] text-ink-tertiary">Score: {score}</p>
      </div>

      <p className="text-[16px] font-medium text-ink mb-5 leading-snug">
        {current.question}
      </p>

      <div className="flex flex-col gap-2.5">
        {current.options.map((option, optIndex) => {
          const isAnswer = optIndex === current.answerIndex;
          const isSelected = optIndex === selected;
          const showState = selected !== null;

          return (
            <button
              key={option}
              onClick={() => handleSelect(optIndex)}
              disabled={showState}
              className={`text-left text-[14px] font-medium rounded-xl px-4 py-3 border ${
                showState && isAnswer
                  ? "bg-deep-bg border-deep-text/30 text-deep-text"
                  : showState && isSelected
                    ? "bg-friction-bg border-friction/30 text-friction-text"
                    : "border-border text-ink hover:bg-app-bg"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
