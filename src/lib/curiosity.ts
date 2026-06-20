export interface CuriosityQuestion {
  question: string;
  matchTag: string;
}

export const CURIOSITY_QUESTIONS: CuriosityQuestion[] = [
  {
    question: "Why does magnetically confined plasma keep trying to escape?",
    matchTag: "physics",
  },
  {
    question: "Could a gene edit miss its target and land somewhere else entirely?",
    matchTag: "genetics",
  },
  {
    question: "What actually happens to a steak at the moment it starts to brown?",
    matchTag: "chemistry",
  },
  {
    question: "Did trade between distant peoples exist before any empire ruled over them?",
    matchTag: "trade",
  },
  {
    question: "Why does an endless scrolling feed feel harder to put down than a bounded grid?",
    matchTag: "attention",
  },
  {
    question: "Is there a real harmonic reason certain jazz scales feel unresolved?",
    matchTag: "music theory",
  },
  {
    question: "What's the actual three-year cost of a tariff, once it reaches a shopping cart?",
    matchTag: "economics",
  },
  {
    question: "Why do some objects feel obvious to use, and others never quite make sense?",
    matchTag: "design",
  },
];

export function pickCuriosityQuestion(seed: number): CuriosityQuestion {
  return CURIOSITY_QUESTIONS[seed % CURIOSITY_QUESTIONS.length];
}

export function findQuestionForTags(
  tags: string[] | undefined
): CuriosityQuestion | undefined {
  if (!tags || tags.length === 0) return undefined;
  return CURIOSITY_QUESTIONS.find((q) => tags.includes(q.matchTag));
}
