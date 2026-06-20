export interface Channel {
  id: string;
  name: string;
  handle: string;
  avatarEmoji: string;
  description: string;
  subscriberCount: string;
  category: string;
}

export const CHANNELS: Channel[] = [
  {
    id: "ch-1",
    name: "Helion Notes",
    handle: "@helionnotes",
    avatarEmoji: "⚛️",
    description: "Plain-language explainers on energy, physics, and the engineering behind big ideas.",
    subscriberCount: "184K",
    category: "Science",
  },
  {
    id: "ch-2",
    name: "Studio Notes",
    handle: "@studionotes",
    avatarEmoji: "📐",
    description: "Design teardowns, layout theory, and why some interfaces feel calmer than others.",
    subscriberCount: "92K",
    category: "Design",
  },
  {
    id: "ch-3",
    name: "Long Memory",
    handle: "@longmemory",
    avatarEmoji: "🏺",
    description: "History told through trade, migration, and the quiet connections between civilizations.",
    subscriberCount: "210K",
    category: "History",
  },
  {
    id: "ch-4",
    name: "Kitchen Chemistry",
    handle: "@kitchenchem",
    avatarEmoji: "🍳",
    description: "The actual science behind why recipes work, not just that they do.",
    subscriberCount: "76K",
    category: "Cooking",
  },
  {
    id: "ch-5",
    name: "Theory & Tone",
    handle: "@theoryandtone",
    avatarEmoji: "🎷",
    description: "Music theory for people who just want to know why a song feels the way it does.",
    subscriberCount: "58K",
    category: "Music",
  },
  {
    id: "ch-6",
    name: "Calm Science",
    handle: "@calmscience",
    avatarEmoji: "🧘",
    description: "What's actually backed by research on focus, rest, and mindfulness — no fluff.",
    subscriberCount: "131K",
    category: "Wellbeing",
  },
  {
    id: "ch-7",
    name: "Field Notes",
    handle: "@fieldnotes",
    avatarEmoji: "🌲",
    description: "Nature documentary energy in bite-sized, well-sourced clips.",
    subscriberCount: "145K",
    category: "Wellbeing",
  },
  {
    id: "ch-8",
    name: "Art History Lab",
    handle: "@arthistorylab",
    avatarEmoji: "🎨",
    description: "The techniques and history hiding inside famous paintings, explained simply.",
    subscriberCount: "67K",
    category: "Arts & Culture",
  },
  {
    id: "ch-9",
    name: "Number Theory Notes",
    handle: "@numbertheory",
    avatarEmoji: "🔢",
    description: "Maths that's actually interesting, for people who think they hate maths.",
    subscriberCount: "49K",
    category: "Maths",
  },
  {
    id: "ch-10",
    name: "Frame by Frame",
    handle: "@framebyframe",
    avatarEmoji: "🎬",
    description: "How animation actually works, one principle at a time.",
    subscriberCount: "88K",
    category: "Film & Animation",
  },
];

export const DEFAULT_SUBSCRIBED_CHANNEL_IDS = ["ch-1", "ch-3", "ch-6"];
