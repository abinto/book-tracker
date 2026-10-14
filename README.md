# Book Tracker

A simple one-page app to keep track of the books you are reading.

---

## Features

- **Add a book** — title, author, and status (To read / Reading / Finished). Title and author are required.
- **View your list** — books shown newest first.
- **Change status** — pick a new status from the dropdown on each card; the colour updates instantly.
- **Search** — type in the search box to filter by title or author (case-insensitive). Clearing the box shows everything again.
- **Delete** — remove a book with a confirmation prompt.
- **Stats** — chips above the list show a live count of all books by status.
- **Persistent** — data survives a page refresh (stored in `localStorage`).
- **Mobile-friendly** — works on narrow screens; all controls meet a 44 px tap-target minimum.

---

## How to run

No server or install needed.

1. Download or clone this folder.
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).

That's it.

---

## How data is saved

All books are stored in your browser's `localStorage` under the key `bookTracker.books` as a JSON array. Nothing is sent to a server. Clearing your browser's site data will erase the list.

---

## Built with

- Plain HTML, CSS, and JavaScript — no frameworks, no build step.
- [Antigravity](https://antigravity.dev) AI coding assistant (Google DeepMind) — used to plan and generate the code step by step.

---

## What I would improve next

- **Edit a book** — fix a typo in a title or author without deleting and re-adding.
- **Sorting and filtering** — sort by title, author, or date; filter by status without typing.
- **Export** — download the list as a CSV or JSON file for backup.
- **Better IDs and sync** — if the app ever needed multiple tabs or devices, `localStorage` would need replacing with a real backend.
