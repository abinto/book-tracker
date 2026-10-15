# PROMPTS.md — Prompt Log

A record of the prompts used to build this project and what happened at each step.

---

## Prompt 1 — Project setup & core files (Steps 1–3)
**Asked:** Build a beginner-friendly Book Tracker web page using plain HTML, CSS, and JavaScript with localStorage persistence. Create index.html (form, search, stats, book list), style.css (base layout, card styles, mobile-friendly), app.js (loadBooks, saveBooks, addBook, renderBooks, handleFormSubmit), and an empty PROMPTS.md with a header.

**What happened:** Created all four files. `index.html` has a form with title/author/status fields, a stats bar, a search input, and a book-list container. `style.css` uses CSS custom properties for colours and has responsive styling. `app.js` reads/writes books to `localStorage`, validates form input, and renders book cards sorted newest-first. `PROMPTS.md` was created with a template header.

---

## Prompt 2 — Update status (Step 4)
**Asked:** Add an `updateStatus` function so users can change a book's status directly from the card.

**What happened:** Added `updateStatus(id, newStatus)` to `app.js`. Replaced the static status badge with a `<select>` dropdown styled to look like the badge. Picking a new status updates `localStorage` and re-renders the list immediately, with the badge colour changing to match.

---

## Prompt 3 — Search (Step 5)
**Asked:** Add real-time search filtering by title or author.

**What happened:** Added `searchBooks()` and `getFilteredBooks()` to `app.js`. The search input fires on every keystroke (`input` event), filters the book list case-insensitively by title or author, and re-renders only the matching cards. Stats still reflect all books, not just filtered ones. An empty search shows everything.

---

## Prompt 4 — Stats bar (Step 6)
**Asked:** Add an `updateStats` function to show live counts of books by status (Total / To Read / Reading / Finished).

**What happened:** Added `updateStats()` to `app.js`. It counts books by status and injects stat chips into `#stats-bar`. The stats refresh every time `renderBooks()` is called. The bar hides when there are no books.

---

## Prompt 5 — Delete (Step 7)
**Asked:** Add a `deleteBook` function that removes a book with a confirmation prompt.

**What happened:** Added `deleteBook(id)` to `app.js`. Each book card now has a ✕ delete button. Clicking it shows a `confirm()` dialog; if confirmed, the book is filtered out of the array, `localStorage` is updated, and the list re-renders. The button has hover/focus styles (turns red).

---

## Prompt 6 — Responsive CSS polish (Step 8)
**Asked:** Polish the CSS for mobile responsiveness.

**What happened:** Added two media-query breakpoints in `style.css`: `@media (max-width: 480px)` wraps book cards and repositions the delete button; `@media (max-width: 360px)` tightens padding and font sizes for very narrow screens. All interactive elements meet a 44px minimum tap-target size. Long titles use `overflow-wrap: break-word` to prevent horizontal scroll.

---

## Prompt 7 — README (Step 9)
**Asked:** Create a README.md for the project.

**What happened:** Created `README.md` with sections for Features, How to Run, How Data is Saved, Built With, and What I Would Improve Next. Lists all implemented features and notes that the app is plain HTML/CSS/JS with no build step.
