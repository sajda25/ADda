type ScrapInput = {
  id: string;
  title: string;
  text: string;
  tags: string[];
  placeName?: string;
};

const BY_TAG: { match: RegExp; questions: string[] }[] = [
  {
    match: /rain|monsoon|umbrella|flood/i,
    questions: [
      "Who shared the umbrella when leaving still felt unfinished?",
      "What did the rain keep that you meant to say out loud?",
      "Whose name does wet weather still pronounce for you?",
    ],
  },
  {
    match: /coffee|adda|chai|tea/i,
    questions: [
      "Whose voice still sits across from you in that room?",
      "What argument are you still halfway through at that table?",
      "Who ordered the same drink just to stay a little longer?",
    ],
  },
  {
    match: /love|crush|kiss|heart|date/i,
    questions: [
      "What did you almost say out loud — and still rehearse?",
      "Whose hand did you hold like the city owed you time?",
      "Which version of yourself showed up for that moment?",
    ],
  },
  {
    match: /goodbye|train|bus|leave|left|parting/i,
    questions: [
      "What goodbye are you still rewriting on the way home?",
      "Who walked away first — and who is still turning back?",
      "What would you put in the letter you never sent?",
    ],
  },
  {
    match: /friend|campus|hostel|college/i,
    questions: [
      "Who became family in a place that was only temporary?",
      "What inside joke still opens that door in your head?",
      "Whose absence rearranged the table for you?",
    ],
  },
  {
    match: /fight|argument|anger|storm/i,
    questions: [
      "What soft thing were you protecting under the hard words?",
      "If you could unsend one sentence, which one?",
      "Who stayed after the volume dropped?",
    ],
  },
];

const FALLBACKS = [
  "Who were you with the last time a place felt unfinished?",
  "What corner of yourself did this scrap just brush against?",
  "If this page could keep one secret for you, what would it be?",
  "Who should read this after you — and why haven't you sent it?",
  "What are you pretending you've already forgotten?",
];

function hashPick(seed: string, n: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return n === 0 ? 0 : h % n;
}

/** Deterministic question so the same scrap always asks the same thing. */
export function questionForScrap(scrap: ScrapInput): string {
  const blob = `${scrap.title} ${scrap.tags.join(" ")} ${scrap.text.slice(0, 280)}`;
  for (const row of BY_TAG) {
    if (row.match.test(blob)) {
      return row.questions[hashPick(scrap.id, row.questions.length)]!;
    }
  }
  const placeBit = scrap.placeName
    ? ` What still waits for you at ${scrap.placeName}?`
    : "";
  if (hashPick(scrap.id + "p", 3) === 0 && placeBit) {
    return `Who did you leave behind a little — at ${scrap.placeName}?`;
  }
  return FALLBACKS[hashPick(scrap.id, FALLBACKS.length)]! + (hashPick(scrap.id, 2) === 0 ? "" : "");
}
