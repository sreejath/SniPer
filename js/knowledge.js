// SniPer knowledge base — superhero and SniPer-suit lessons.
// Each entry: keywords for matching, and a short engaging lesson with a fun fact + a follow-up question.

const TOPICS = [
  {
    id: "what-makes-a-superhero",
    name: "What Makes a Superhero",
    keywords: ["superhero", "superheroes", "super hero", "super heroes", "hero"],
    lesson: "A superhero isn't just about super strength or flashy powers — it's about choices. Every great hero shares a few things in common: courage to act even when they're scared, a strong sense of right and wrong, and a willingness to put others first. Some heroes get their powers from an accident or birth, but plenty of the best ones — like a certain armored inventor — build their powers themselves, out of pure determination and hard work.",
    funFact: "Fun fact: the word 'hero' comes from ancient Greek, where it described someone with courage and skill admired for their brave deeds!",
    question: "Want to see what SniPer's first suit, Jump One, is made of?"
  },
  {
    id: "jump-one-parts",
    name: "Jump One: Suit Parts",
    suitBasics: true,
    keywords: ["suit parts", "parts of the suit", "what's in the suit", "whats in the suit", "suit components", "jump one parts", "parts of jump one", "what is the suit made of", "what's the suit made of", "jump one", "jump-one", "jumpone", "jump 1", "jump1", "first suit", "snip's first suit", "snip first suit", "snip's suit"],
    lesson: "Jump One was held together with five main parts, each a little rough around the edges. The HELMET had a cracked visor and a basic heads-up display that flickered more than it should. The CHEST CORE was the power source — a glowing, exposed power cell wired in by hand, since there wasn't time to hide the wiring neatly. The GAUNTLETS (the gloves) gave just enough grip strength to lift heavy objects, though the fingers stuck sometimes. The BOOTS had the thrusters — wobbly at first, barely strong enough to jump high rather than truly fly, which is actually where the suit got its name. And running through all of it was the WIRING HARNESS, a tangle of cables taped down in a hurry, connecting every part back to the chest core.",
    funFact: "Fun fact: real engineers call this kind of exposed, rough wiring a 'breadboard' setup — fast to build and easy to fix, even if it looks messy!",
    question: "Which part of Jump One do you think needs the biggest upgrade first — the helmet, the boots, or the gauntlets?"
  }
];

// The individual parts of SniPer's Jump One suit, for the "let's work on <part>" conversation flow.
const SUIT_PARTS = [
  { id: "helmet", name: "Helmet", keywords: ["helmet", "visor", "hud", "mask", "face plate", "faceplate", "face shield"] },
  { id: "chest-core", name: "Chest Core", keywords: ["chest core", "chest", "core", "power cell", "power source"] },
  { id: "gauntlets", name: "Gauntlets", keywords: ["gauntlets", "gauntlet", "gloves", "glove", "hands"] },
  { id: "boots", name: "Boots", keywords: ["boots", "boot", "thrusters", "feet"] },
  { id: "wiring-harness", name: "Wiring Harness", keywords: ["wiring harness", "wiring", "cables", "harness"] },
];

function findSuitPart(query) {
  const q = query.toLowerCase();
  let best = null;
  let bestLen = 0;
  for (const p of SUIT_PARTS) {
    for (const k of p.keywords) {
      if (q.includes(k) && k.length > bestLen) {
        best = p;
        bestLen = k.length;
      }
    }
  }
  return best;
}

function findTopic(query) {
  const q = query.toLowerCase();
  let best = null;
  let bestLen = 0;
  for (const t of TOPICS) {
    for (const k of t.keywords) {
      if (q.includes(k) && k.length > bestLen) {
        best = t;
        bestLen = k.length;
      }
    }
  }
  return best;
}

function randomTopic(excludeId) {
  const pool = excludeId ? TOPICS.filter(t => t.id !== excludeId) : TOPICS;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getTopicById(id) {
  return TOPICS.find(t => t.id === id);
}
