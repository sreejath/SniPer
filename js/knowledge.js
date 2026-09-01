// SniPer knowledge base — 5th-grade-friendly lessons on common topics.
// Each entry: keywords for matching, and a short engaging lesson with a fun fact + a follow-up question.

const TOPICS = [
  {
    id: "solar-system",
    name: "the Solar System",
    keywords: ["solar system", "planets", "space", "sun", "mars", "jupiter", "saturn"],
    lesson: "Our Solar System is like a cosmic neighborhood with the Sun as the giant glowing house in the middle! Eight planets orbit around it: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. The closer a planet is to the Sun, the hotter and faster it zooms around. Earth is the only one we know of with life — it's just the right distance from the Sun, not too hot and not too cold, which scientists call the 'Goldilocks Zone.'",
    funFact: "Fun fact: a day on Venus is longer than its entire year!",
    question: "Want to know which planet has the biggest storm in the whole Solar System?"
  },
  {
    id: "volcanoes",
    name: "Volcanoes",
    keywords: ["volcano", "volcanoes", "lava", "magma", "eruption"],
    lesson: "A volcano is like a pressure valve for the Earth! Deep underground, it's so hot that rock melts into liquid called magma. When pressure builds up, the magma pushes up through cracks in the Earth's crust and bursts out as lava, ash, and gas. Some volcanoes erupt slowly and gently, while others explode suddenly and powerfully.",
    funFact: "Fun fact: there's a volcano under Yellowstone National Park so big it's nicknamed a 'supervolcano'!",
    question: "Should I explain the difference between magma and lava next?"
  },
  {
    id: "photosynthesis",
    name: "Photosynthesis",
    keywords: ["photosynthesis", "plants grow", "how do plants make food", "chlorophyll"],
    lesson: "Photosynthesis is how plants cook their own food using sunlight! Leaves take in sunlight, water from the roots, and carbon dioxide from the air. Using a green chemical called chlorophyll, the plant combines these ingredients to make sugar for energy — and releases oxygen as a bonus, which is the very air we breathe.",
    funFact: "Fun fact: without photosynthesis, there would be almost no oxygen on Earth for us to breathe!",
    question: "Want to learn how the water cycle feeds into this process?"
  },
  {
    id: "water-cycle",
    name: "the Water Cycle",
    keywords: ["water cycle", "evaporation", "condensation", "precipitation", "rain"],
    lesson: "The water cycle is nature's way of recycling water forever! The Sun heats up oceans and lakes, turning water into invisible vapor that rises into the sky — that's evaporation. Up high, it cools and turns into tiny droplets that form clouds — that's condensation. When the droplets get heavy enough, they fall back down as rain or snow — that's precipitation. Then it all starts again!",
    funFact: "Fun fact: the water you drink today could be the same water dinosaurs drank millions of years ago!",
    question: "Want me to explain where groundwater fits into this cycle?"
  },
  {
    id: "ancient-egypt",
    name: "Ancient Egypt",
    keywords: ["ancient egypt", "pyramids", "pharaoh", "mummies", "nile"],
    lesson: "Ancient Egypt grew up along the Nile River more than 5,000 years ago. The river's yearly floods left rich soil perfect for farming, which let Egyptian civilization thrive. Egyptians built massive stone pyramids as tombs for their pharaohs (kings), and they believed in an afterlife — so they mummified bodies to preserve them for the journey.",
    funFact: "Fun fact: the Great Pyramid of Giza was the tallest man-made structure on Earth for almost 4,000 years!",
    question: "Want to hear how Egyptians actually built the pyramids without modern machines?"
  },
  {
    id: "fractions",
    name: "Fractions",
    keywords: ["fraction", "fractions", "numerator", "denominator"],
    lesson: "A fraction is just a way to describe a part of a whole! Think of a pizza cut into 4 equal slices — if you eat 1 slice, you've eaten 1/4 of the pizza. The top number (numerator) tells you how many parts you have, and the bottom number (denominator) tells you how many equal parts the whole thing was cut into.",
    funFact: "Fun fact: you use fractions every time you check a clock — 'half past' means 1/2 of an hour has passed!",
    question: "Want me to show you a trick for adding fractions with different denominators?"
  },
  {
    id: "human-heart",
    name: "the Human Heart",
    keywords: ["heart", "heartbeat", "blood", "circulatory"],
    lesson: "Your heart is a hard-working muscle about the size of your fist, and it beats around 100,000 times a day! It pumps blood through your body, delivering oxygen and nutrients to every cell, and carrying away waste. The heart has four chambers that squeeze in a steady rhythm to keep the blood flowing in one direction, like a very reliable pump.",
    funFact: "Fun fact: your blood vessels laid end to end could wrap around the Earth more than twice!",
    question: "Want to know how oxygen actually gets into your blood in the first place?"
  },
  {
    id: "electricity",
    name: "Electricity",
    keywords: ["electricity", "circuit", "electric current", "battery"],
    lesson: "Electricity is the flow of tiny charged particles called electrons through a material like a wire. When electrons flow in a complete loop, called a circuit, they can power lights, motors, and gadgets. A battery pushes the electrons along, kind of like a pump pushing water through a pipe.",
    funFact: "Fun fact: lightning is a giant, super-fast burst of static electricity between clouds and the ground!",
    question: "Want to learn the difference between a series circuit and a parallel circuit?"
  },
  {
    id: "dinosaurs",
    name: "Dinosaurs",
    keywords: ["dinosaur", "dinosaurs", "t-rex", "trex", "fossil"],
    lesson: "Dinosaurs ruled the Earth for about 165 million years before going extinct roughly 66 million years ago. They came in all shapes and sizes, from the tiny, chicken-sized Compsognathus to the massive, long-necked Argentinosaurus. Scientists learn about them by studying fossils — bones and footprints turned to stone over millions of years.",
    funFact: "Fun fact: birds are actually considered living dinosaurs by many scientists!",
    question: "Want to hear the leading theory about what wiped the dinosaurs out?"
  },
  {
    id: "ecosystems",
    name: "Ecosystems",
    keywords: ["ecosystem", "food chain", "food web", "habitat"],
    lesson: "An ecosystem is a community of living things — plants, animals, and tiny organisms — interacting with each other and their environment, like a forest, pond, or desert. Energy flows through the ecosystem in a food chain: plants use sunlight to grow, plant-eaters (herbivores) eat the plants, and meat-eaters (carnivores) eat the herbivores.",
    funFact: "Fun fact: a single oak tree can support hundreds of different species of insects!",
    question: "Want to learn what happens to an ecosystem when one species disappears?"
  },
  {
    id: "the-moon",
    name: "the Moon",
    keywords: ["moon", "moon phases", "lunar"],
    lesson: "The Moon is Earth's only natural satellite, and it orbits us about once every 27 days. It doesn't make its own light — we see it because it reflects sunlight. As it orbits, we see different amounts of its sunlit side, which is why the Moon seems to change shape in the sky — these are called Moon phases.",
    funFact: "Fun fact: the Moon is slowly drifting away from Earth, about 3.8 centimeters every year!",
    question: "Want to know why we always see the same side of the Moon from Earth?"
  },
  {
    id: "simple-machines",
    name: "Simple Machines",
    keywords: ["simple machine", "lever", "pulley", "inclined plane", "wheel and axle"],
    lesson: "Simple machines are basic tools that make work easier by changing the amount or direction of force needed. There are six classic types: the lever, wheel and axle, pulley, inclined plane, wedge, and screw. A seesaw is a lever, a ramp is an inclined plane, and a doorknob is a wheel and axle!",
    funFact: "Fun fact: the ancient Egyptians likely used ramps (inclined planes) to help build the pyramids!",
    question: "Want me to explain how a pulley can help you lift something heavier than you?"
  },
  {
    id: "rounding-numbers",
    name: "Rounding Numbers",
    keywords: ["rounding", "round numbers", "nearest ten", "nearest hundred"],
    lesson: "Rounding is a way to simplify a number by finding the closest 'friendly' number, like the nearest 10 or 100. Look at the digit right after the place you're rounding to: if it's 5 or more, round up; if it's less than 5, round down. For example, 47 rounds to 50, but 42 rounds down to 40.",
    funFact: "Fun fact: rounding is used every day in real life — like when a cashier estimates your total bill!",
    question: "Want to practice rounding a few numbers together?"
  },
  {
    id: "continents-oceans",
    name: "Continents and Oceans",
    keywords: ["continents", "oceans", "geography", "seven continents"],
    lesson: "Earth's land is divided into seven continents: Africa, Antarctica, Asia, Australia, Europe, North America, and South America. Its water is divided into five oceans: the Pacific, Atlantic, Indian, Southern, and Arctic. The Pacific Ocean is so huge it's bigger than all the land on Earth combined!",
    funFact: "Fun fact: scientists believe all the continents were once joined together in a supercontinent called Pangaea!",
    question: "Want to learn how continents slowly drift apart over millions of years?"
  },
  {
    id: "force-and-motion",
    name: "Force and Motion",
    keywords: ["force", "motion", "gravity", "newton's laws", "friction"],
    lesson: "A force is a push or a pull that can make an object start moving, stop moving, speed up, slow down, or change direction. Gravity is a force that pulls objects toward each other — it's why things fall down instead of floating away. Friction is another force that slows things down when two surfaces rub together.",
    funFact: "Fun fact: without friction, you wouldn't be able to walk — your shoes would just slide right out from under you!",
    question: "Want to hear Newton's three laws of motion explained simply?"
  }
];

function findTopic(query) {
  const q = query.toLowerCase();
  return TOPICS.find(t => t.keywords.some(k => q.includes(k)));
}

function randomTopic(excludeId) {
  const pool = excludeId ? TOPICS.filter(t => t.id !== excludeId) : TOPICS;
  return pool[Math.floor(Math.random() * pool.length)];
}
