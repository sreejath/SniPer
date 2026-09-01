// SniPer — a browser-based JARVIS-style assistant.
// Fully client-side: speech recognition + synthesis via the Web Speech API,
// weather via the free Open-Meteo API, everything else is rule-based.

const els = {
  log: document.getElementById("log"),
  form: document.getElementById("inputForm"),
  input: document.getElementById("textInput"),
  micBtn: document.getElementById("micBtn"),
  clearBtn: document.getElementById("clearBtn"),
  quickRow: document.getElementById("quickRow"),
  statusDot: document.getElementById("statusDot"),
  statusText: document.getElementById("statusText"),
  core: document.getElementById("core"),
  bars: document.getElementById("bars"),
  clock: document.getElementById("clockDisplay"),
  dateDisplay: document.getElementById("dateDisplay"),
};

let exchangeCount = 0;
let lastTopicId = null;
let awaitingTeachYes = false;
let pendingTeachTopic = null;

// ---------- Clock ----------
function tickClock() {
  const now = new Date();
  els.clock.textContent = now.toLocaleTimeString([], { hour12: false });
  els.dateDisplay.textContent = now.toLocaleDateString(undefined, {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
}
tickClock();
setInterval(tickClock, 1000);

// ---------- Status / visual state ----------
function setStatus(state) {
  const map = {
    STANDBY: { text: "STANDBY", cls: "" },
    LISTENING: { text: "LISTENING…", cls: "listening" },
    PROCESSING: { text: "PROCESSING…", cls: "" },
    SPEAKING: { text: "SPEAKING…", cls: "speaking" },
    ERROR: { text: "ERROR", cls: "error" },
  };
  const s = map[state] || map.STANDBY;
  els.statusText.textContent = s.text;
  els.statusDot.className = "status-dot " + s.cls;

  const active = state === "LISTENING" || state === "SPEAKING" || state === "PROCESSING";
  els.core.classList.toggle("active", active);
  els.bars.classList.toggle("active", active);
  els.micBtn.classList.toggle("listening", state === "LISTENING");
}

// ---------- Chat log ----------
function appendMessage(who, text) {
  const wrap = document.createElement("div");
  wrap.className = "msg " + (who === "user" ? "user" : "bot");
  const label = document.createElement("span");
  label.className = "who";
  label.textContent = who === "user" ? "YOU" : "SNIPER";
  const bubble = document.createElement("span");
  bubble.className = "bubble";
  bubble.textContent = text;
  wrap.appendChild(label);
  wrap.appendChild(document.createElement("br"));
  wrap.appendChild(bubble);
  els.log.appendChild(wrap);
  els.log.scrollTop = els.log.scrollHeight;
}

function greet() {
  appendMessage(
    "bot",
    "SniPer online. Good to see you. Ask me the time, the date, the weather, or say \"teach me\" followed by a topic."
  );
}

// ---------- Audio cue (activation beep) ----------
let audioCtx;
function beep(freq = 880, duration = 0.08, gain = 0.05) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.frequency.value = freq;
    osc.type = "square";
    g.gain.value = gain;
    osc.connect(g).connect(audioCtx.destination);
    osc.start();
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) { /* audio not available, ignore */ }
}

// ---------- Speech synthesis (robotic voice) ----------
let voicesCache = [];
function loadVoices() {
  voicesCache = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
}
if ("speechSynthesis" in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

function pickRoboticVoice() {
  if (!voicesCache.length) return null;
  const preferredNames = [/google uk english male/i, /microsoft david/i, /male/i, /english/i];
  for (const pattern of preferredNames) {
    const match = voicesCache.find(v => pattern.test(v.name) && v.lang.startsWith("en"));
    if (match) return match;
  }
  return voicesCache.find(v => v.lang.startsWith("en")) || voicesCache[0];
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  beep(1046, 0.06, 0.04);

  const utter = new SpeechSynthesisUtterance(text);
  utter.pitch = 0.35;   // low, flat pitch for a robotic/synthetic tone
  utter.rate = 0.98;
  utter.volume = 1;
  const voice = pickRoboticVoice();
  if (voice) utter.voice = voice;

  utter.onstart = () => setStatus("SPEAKING");
  utter.onend = () => {
    setStatus("STANDBY");
    beep(660, 0.05, 0.03);
  };
  utter.onerror = () => setStatus("STANDBY");

  window.speechSynthesis.speak(utter);
}

// ---------- Speech recognition (voice input) ----------
const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

const RECOGNITION_ERROR_MESSAGES = {
  "no-speech": "I didn't hear anything, sir. Try speaking right after the beep.",
  "audio-capture": "I can't reach a microphone. Please check that one is connected and selected in your browser.",
  "not-allowed": "Microphone access is blocked. Please allow microphone permission for this site and try again.",
  "network": "Voice recognition needs an internet connection to reach the speech service, and the request failed. Please check your connection.",
  "aborted": null,
};

let gotSpeechResult = false;

if (SpeechRecognitionImpl) {
  recognition = new SpeechRecognitionImpl();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    gotSpeechResult = true;
    const transcript = event.results[0][0].transcript;
    els.input.value = transcript;
    handleUserInput(transcript);
  };
  recognition.onerror = (event) => {
    setStatus("STANDBY");
    const message = RECOGNITION_ERROR_MESSAGES[event.error];
    if (message) appendMessage("bot", message);
    else if (message === undefined) appendMessage("bot", `Voice recognition error: ${event.error}.`);
  };
  recognition.onend = () => {
    if (els.statusText.textContent === "LISTENING…") {
      setStatus("STANDBY");
      if (!gotSpeechResult) {
        appendMessage("bot", "I didn't catch that, sir. Please try again and speak clearly right after the beep.");
      }
    }
  };
} else {
  els.micBtn.disabled = true;
  els.micBtn.title = "Voice input not supported in this browser";
}

els.micBtn.addEventListener("click", () => {
  if (!recognition) return;
  window.speechSynthesis && window.speechSynthesis.cancel();
  gotSpeechResult = false;
  setStatus("LISTENING");
  beep(1200, 0.05, 0.04);
  try { recognition.start(); } catch (e) { /* already started */ }
});

// ---------- Weather ----------
const WEATHER_CODES = {
  0: "clear sky", 1: "mainly clear", 2: "partly cloudy", 3: "overcast",
  45: "foggy", 48: "depositing rime fog",
  51: "light drizzle", 53: "moderate drizzle", 55: "dense drizzle",
  61: "light rain", 63: "moderate rain", 65: "heavy rain",
  71: "light snow", 73: "moderate snow", 75: "heavy snow",
  80: "light rain showers", 81: "moderate rain showers", 82: "violent rain showers",
  95: "a thunderstorm", 96: "a thunderstorm with light hail", 99: "a thunderstorm with heavy hail",
};

function getWeatherDescription(code) {
  return WEATHER_CODES[code] || "unusual atmospheric conditions";
}

async function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("weather request failed");
  const data = await res.json();
  return data.current_weather;
}

async function fetchApproxLocation() {
  const res = await fetch("https://ipapi.co/json/");
  if (!res.ok) throw new Error("location lookup failed");
  const data = await res.json();
  return { lat: data.latitude, lon: data.longitude, city: data.city };
}

function getGeolocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("no geolocation"));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => reject(new Error("permission denied")),
      { timeout: 6000 }
    );
  });
}

async function answerWeather() {
  try {
    let coords;
    let city = "";
    try {
      coords = await getGeolocation();
    } catch {
      const approx = await fetchApproxLocation();
      coords = { lat: approx.lat, lon: approx.lon };
      city = approx.city ? ` near ${approx.city}` : "";
    }
    const weather = await fetchWeatherByCoords(coords.lat, coords.lon);
    const desc = getWeatherDescription(weather.weathercode);
    return `Current conditions${city}: ${Math.round(weather.temperature)}°F with ${desc}, wind ${Math.round(weather.windspeed)} mph.`;
  } catch (e) {
    return "I couldn't reach the weather satellites, sir — please allow location access or check your connection, and try again.";
  }
}

// ---------- Intent handling ----------
function matchesAny(text, patterns) {
  return patterns.some(p => text.includes(p));
}

function extractTeachTopic(text) {
  const m = text.match(/(?:teach me|explain|tell me about|what is|what's)\s+(.*)/i);
  return m ? m[1].replace(/[.?!]+$/, "").trim() : text;
}

async function generateResponse(rawText) {
  const text = rawText.toLowerCase().trim();

  if (awaitingTeachYes) {
    awaitingTeachYes = false;
    if (matchesAny(text, ["yes", "yeah", "sure", "ok", "okay", "please", "yep"])) {
      const topic = pendingTeachTopic || randomTopic(lastTopicId);
      pendingTeachTopic = null;
      return teachTopic(topic);
    }
    pendingTeachTopic = null;
  }

  if (matchesAny(text, ["what time", "current time", "clock"])) {
    return `It is currently ${new Date().toLocaleTimeString([], { hour12: true })}.`;
  }

  if (matchesAny(text, ["what day", "today's date", "what's the date", "what is the date", "current date"])) {
    return `Today is ${new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.`;
  }

  if (matchesAny(text, ["weather", "temperature outside", "is it raining", "is it cold", "is it hot"])) {
    return await answerWeather();
  }

  if (matchesAny(text, ["who are you", "what are you", "your name"])) {
    return "I am SniPer — your personal AI interface, built to answer questions and teach you interesting things.";
  }

  if (matchesAny(text, ["thank you", "thanks"])) {
    return "You're very welcome. Always glad to help.";
  }

  if (matchesAny(text, ["hello", "hey sniper", "good morning", "good afternoon", "good evening"]) || /\bhi\b/i.test(text)) {
    return "Hi sir, how can I assist you?";
  }

  if (matchesAny(text, ["joke", "make me laugh"])) {
    return "Why did the robot go on a diet? It had too many bytes.";
  }

  if (matchesAny(text, ["teach me", "explain", "tell me about", "what is", "what's", "how does", "how do"])) {
    const topicQuery = extractTeachTopic(text);
    const topic = findTopic(topicQuery) || findTopic(text);
    if (topic) return teachTopic(topic);
    const fallback = randomTopic(lastTopicId);
    pendingTeachTopic = fallback;
    awaitingTeachYes = true;
    return `I don't have a lesson on that exact topic yet, but I could teach you about ${fallback.name} instead — want me to?`;
  }

  return "I'm not certain I understand that request, sir. Try asking about the time, the date, the weather, or say \"teach me\" followed by a topic.";
}

function teachTopic(topic) {
  lastTopicId = topic.id;
  return `Let's learn about ${topic.name}. ${topic.lesson} ${topic.funFact} ${topic.question}`;
}

function maybeOfferLesson(baseResponse) {
  if (exchangeCount % 2 === 0) {
    const topic = randomTopic(lastTopicId);
    pendingTeachTopic = topic;
    awaitingTeachYes = true;
    return `${baseResponse}\n\nBy the way — would you like me to teach you about ${topic.name}? It's a great 5th grade topic.`;
  }
  return baseResponse;
}

// ---------- Main input handler ----------
async function handleUserInput(rawText) {
  const text = rawText.trim();
  if (!text) return;

  appendMessage("user", text);
  els.input.value = "";
  setStatus("PROCESSING");

  exchangeCount += 1;

  let response = await generateResponse(text);
  response = maybeOfferLesson(response);

  appendMessage("bot", response);
  speak(response);
}

// ---------- Wire up UI ----------
els.form.addEventListener("submit", (e) => {
  e.preventDefault();
  handleUserInput(els.input.value);
});

els.clearBtn.addEventListener("click", () => {
  els.log.innerHTML = "";
  exchangeCount = 0;
  lastTopicId = null;
  awaitingTeachYes = false;
  pendingTeachTopic = null;
  greet();
});

els.quickRow.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  handleUserInput(btn.dataset.q);
});

greet();
setStatus("STANDBY");
