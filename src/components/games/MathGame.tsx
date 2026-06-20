"use client";

import { useEffect, useState } from "react";

interface Problem {
  text: string;
  answer: number;
  options: number[];
}

function generateProblem(): Problem {
  const ops = ["+", "-", "×"] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a = Math.floor(Math.random() * 12) + 1;
  let b = Math.floor(Math.random() * 12) + 1;

  if (op === "-" && b > a) {
    [a, b] = [b, a];
  }

  let answer: number;
  if (op === "+") answer = a + b;
  else if (op === "-") answer = a - b;
  else answer = a * b;

  const wrongOptions = new Set<number>();
  while (wrongOptions.size < 3) {
    const delta = Math.floor(Math.random() * 9) - 4;
    const candidate = answer + delta;
    if (candidate !== answer && candidate >= 0) wrongOptions.add(candidate);
  }

  const options = [...wrongOptions, answer];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return { text: `${a} ${op} ${b}`, answer, options };
}

const ROUND_LENGTH = 8;

export default function MathGame({ onWin }: { onWin: () => void }) {
  const [problem, setProblem] = useState<Problem>(() => generateProblem());
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (round > ROUND_LENGTH && !finished) {
      setFinished(true);
      if (score >= ROUND_LENGTH - 2) onWin();
    }
  }, [round, finished, score, onWin]);

  const handleAnswer = (option: number) => {
    if (feedback) return;
    const correct = option === problem.answer;
    setFeedback(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 1);

    setTimeout(() => {
      setFeedback(null);
      setProblem(generateProblem());
      setRound((r) => r + 1);
    }, 500);
  };

  const reset = () => {
    setProblem(generateProblem());
    setRound(1);
    setScore(0);
    setFeedback(null);
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
          Round {round} of {ROUND_LENGTH}
        </p>
        <p className="text-[12px] text-ink-tertiary">Score: {score}</p>
      </div>

      <div className="text-[32px] font-semibold text-ink text-center mb-6">
        {problem.text} = ?
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-[320px]">
        {problem.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            disabled={feedback !== null}
            className={`text-[16px] font-medium rounded-xl py-3 border ${
              feedback && opt === problem.answer
                ? "bg-deep-bg border-deep-text/30 text-deep-text"
                : feedback === "wrong" && opt !== problem.answer
                  ? "border-border text-ink-tertiary opacity-50"
                  : "border-border text-ink hover:bg-app-bg"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
