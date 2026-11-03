# Go For It! – Math Challenge

Responsive browser-based math game. This redesign wires the included SVG UI reference pack into the interactive HTML/CSS/JavaScript game.

## Run locally
1. Extract this archive.
2. Open `index.html` in a modern browser.
3. Internet is optional; it is used only for the Nunito web font.

## Game functionality retained
- Multiplication and exact-division modes using factors 2–9
- 30, 60, 90, or 120 second rounds
- 3–2–1–GO countdown
- Touch keypad and physical keyboard number input
- Correct answers flash green, score +1, then the next question appears
- Wrong answers clear automatically without penalty
- Timer blinks in the final 10 seconds
- Result praise, confetti, and PLAY AGAIN flow

## UI assets now wired into the app
- Main button artwork: START, PLAY AGAIN, multiply, divide, and back
- Time selection artwork for 30/60/90/120 seconds
- Number keypad artwork 0–9
- Answer box artwork for empty, filled, and correct states
- Dynamic timer and score badges
- Four result-message wordmarks
- Cloud, star, and confetti decorations
- Welcome, time-selection, game, result, portrait, and landscape backgrounds

Interactive controls remain real HTML buttons and live text, rather than flattened screenshot images, so they remain clickable and accessible.

## Mascot artwork note
The five mascot PNGs are preserved from the supplied project. They are RGBA PNGs, but the source cutouts are still preliminary: inspect the edge matte and the clipped remnants in the victory/encouragement poses before treating them as final production artwork. This redesign improves their placement and state usage but does not claim to have fully repainted or regenerated those character cutouts.

## Project files
- `index.html`: screen structure and UI asset references
- `style.css`: responsive design, positioning, and animation
- `script.js`: game logic and screen interactions
- `assets/mascot/`: original mascot poses
- `assets/ui/`: supplied SVG visual assets plus small dynamic-value templates for live score/timer/answer values
