# S.N.I.P.E.R

A retro, JARVIS-style AI assistant that runs entirely in your web browser — no backend, no build step, no API keys.

## Features

- **Retro HUD interface** — glowing cyan/amber arc-reactor visualizer, scanlines, animated rings, and a terminal-style transmission log.
- **Voice input** — speak your questions using the microphone button (powered by the browser's Web Speech API).
- **Robotic voice output** — every response is read back in a low-pitched, synthetic voice.
- **Answers everyday questions**:
  - "What time is it?"
  - "What day is it today?"
  - "What is the current weather?" (uses your location + the free [Open-Meteo](https://open-meteo.com) API — no key required)
- **Teaches 5th grade topics** on request — try "Teach me the solar system" or "Teach me volcanoes."
- **Proactive teaching offers** — after every other exchange, SniPer offers to teach you a new 5th-grade topic.

## Running it

No installation needed — it's a static site.

1. Open `index.html` directly in a browser, **or**
2. Serve the folder locally, e.g.:
   ```bash
   npx serve .
   ```
3. Or enable **GitHub Pages** for this repository (Settings → Pages → deploy from `main` branch, root folder) and visit the published URL.

## Browser support

- Voice **input** requires the Web Speech API's `SpeechRecognition`, which today works reliably in **Chrome / Edge on desktop and Android**. Safari and Firefox have limited or no support — the mic button is automatically disabled if unsupported, but typed input always works.
- Voice **output** uses `speechSynthesis`, which is broadly supported across modern browsers.
- Weather requires either browser geolocation permission or falls back to an approximate IP-based location lookup.

## Project structure

```
index.html        Markup and layout
css/style.css      Retro HUD styling
js/knowledge.js    5th-grade lesson content
js/app.js          App logic: speech, weather, intent handling
```

## Extending it

Add new teachable topics by appending an entry to the `TOPICS` array in `js/knowledge.js` — each needs `keywords` to match against user input, a `lesson`, a `funFact`, and a follow-up `question`.
