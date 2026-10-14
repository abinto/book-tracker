/* ── app.js — Book Tracker core logic (steps 1–3) ── */

// The key we use in localStorage to store all books.
const STORAGE_KEY = "bookTracker.books";

// In-memory array of book objects (kept in sync with localStorage).
let books = [];

// The current search string (empty means "show all").
let currentQuery = "";

// ─────────────────────────────────────────────
// DATA HELPERS
// ─────────────────────────────────────────────

/**
 * loadBooks()
 * Reads the saved books from localStorage.
 * Falls back to an empty array if nothing is saved or the data is corrupt.
 */
function loadBooks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    // Guard: if the stored value isn't an array, discard it.
    books = Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    // If JSON.parse fails for any reason, start fresh.
    console.warn("Could not parse saved books. Starting with empty list.", e);
    books = [];
  }
}

/**
 * generateId()
 * Returns a unique string ID for a new book.
 * Uses crypto.randomUUID() when available (all modern browsers).
 * Falls back to a timestamp + random number for older environments.
 */
function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback: timestamp + 4 random digits (collision-resistant enough for local use).
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/**
 * saveBooks()
 * Writes the current `books` array to localStorage.
 * Call this every time books changes.
 */
function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// ─────────────────────────────────────────────
// SEARCH
// ─────────────────────────────────────────────

/**
 * getFilteredBooks()
 * Returns a filtered copy of `books` based on `currentQuery`.
 * If the query is empty, returns all books.
 * Never modifies the `books` array — read-only.
 */
function getFilteredBooks() {
  const q = currentQuery.toLowerCase();
  if (q === "") return books; // no filter — show everything

  return books.filter(function (book) {
    // Match if the title OR author contains the query string.
    return (
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q)
    );
  });
}

/**
 * searchBooks()
 * Reads the search input, stores the trimmed query, and re-renders.
 * Stats always show ALL books — only the visible list changes.
 */
function searchBooks() {
  currentQuery = document.getElementById("search-input").value.trim();
  renderBooks(getFilteredBooks());
}

// ─────────────────────────────────────────────
// ADDING A BOOK
// ─────────────────────────────────────────────

/**
 * addBook(title, author, status)
 * Creates a new book object, adds it to the front of the array,
 * saves to localStorage, and re-renders the list.
 */
function addBook(title, author, status) {
  const now = Date.now();

  // Each book is a plain object with five fields.
  const book = {
    id:      generateId(), // unique ID — safe against same-millisecond adds
    title:   title,        // string (already trimmed)
    author:  author,       // string (already trimmed)
    status:  status,       // "To read" | "Reading" | "Finished"
    addedAt: now           // number — used for newest-first sorting
  };

  books.push(book);
  saveBooks();
  // Re-render with the active filter so the new book appears (or not)
  // depending on whether it matches the current search.
  renderBooks(getFilteredBooks());
}

// ─────────────────────────────────────────────
// UPDATING A BOOK'S STATUS
// ─────────────────────────────────────────────

/**
 * updateStatus(id, newStatus)
 * Finds the book with the given id, changes its status,
 * saves to localStorage, and re-renders the list.
 */
function updateStatus(id, newStatus) {
  // Find the book by id — not by position in the array.
  const book = books.find(b => b.id === id);
  if (!book) return; // safety check

  book.status = newStatus;
  saveBooks();
  // Re-render with the active filter so the search stays applied.
  renderBooks(getFilteredBooks());
}

// ─────────────────────────────────────────────
// DELETING A BOOK
// ─────────────────────────────────────────────

/**
 * deleteBook(id)
 * Asks for confirmation, then removes the book with the given id,
 * saves to localStorage, and re-renders (keeping any active search).
 */
function deleteBook(id) {
  // Ask before doing anything — cancel means nothing changes.
  if (!confirm("Delete this book?")) return;

  // Remove the book by id (filter returns all books EXCEPT this one).
  books = books.filter(function (b) { return b.id !== id; });
  saveBooks();

  // Re-render with the active filter.
  // If books is now empty, renderBooks will show "No books yet."
  renderBooks(getFilteredBooks());
}

// ─────────────────────────────────────────────
// RENDERING THE LIST
// ─────────────────────────────────────────────

/**
 * badgeClass(status)
 * Returns a CSS class name for the coloured status select.
 */
function badgeClass(status) {
  if (status === "To read")  return "badge badge-to-read";
  if (status === "Reading")  return "badge badge-reading";
  if (status === "Finished") return "badge badge-finished";
  return "badge";
}

/**
 * renderBooks(list)
 * Clears the book-list section and injects one card per book.
 * `list` is an array of book objects — newest first already assumed.
 */
function renderBooks(list) {
  const container = document.getElementById("book-list");
  container.innerHTML = ""; // clear old cards

  // Sort newest first every time we render.
  const sorted = list.slice().sort((a, b) => b.addedAt - a.addedAt);

  if (sorted.length === 0) {
    const msg = document.createElement("p");
    msg.className = "empty-msg";
    // Different message depending on whether the list is empty
    // because of a search filter or because no books exist at all.
    if (books.length === 0) {
      msg.textContent = "No books yet. Add your first one above!";
    } else {
      msg.textContent = "No books found.";
    }
    container.appendChild(msg);
    updateStats(); // always update chips, even when no cards are shown
    return;
  }

  sorted.forEach(function (book) {
    // ── Outer card ──
    const card = document.createElement("div");
    card.className = "book-card";
    card.dataset.id = book.id; // useful for future steps

    // ── Left side: title, author, badge ──
    const info = document.createElement("div");
    info.className = "book-info";

    const titleEl = document.createElement("p");
    titleEl.className = "book-title";
    titleEl.textContent = book.title;   // textContent — safe, no HTML injection

    const authorEl = document.createElement("p");
    authorEl.className = "book-author";
    authorEl.textContent = book.author; // textContent — safe

    // ── Status dropdown (replaces static badge) ──
    const statusOptions = ["To read", "Reading", "Finished"];
    const select = document.createElement("select");
    select.className = badgeClass(book.status); // badge colour matches status
    select.setAttribute("aria-label", "Change status");

    statusOptions.forEach(function (opt) {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;               // textContent — safe
      if (opt === book.status) option.selected = true;
      select.appendChild(option);
    });

    // When the user picks a new status, update it immediately.
    select.addEventListener("change", function () {
      updateStatus(book.id, select.value);
    });

    info.appendChild(titleEl);
    info.appendChild(authorEl);
    info.appendChild(select);

    // ── Delete button ──
    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.textContent = "✕";
    delBtn.setAttribute("aria-label", "Delete " + book.title);
    delBtn.addEventListener("click", function () {
      deleteBook(book.id);
    });

    card.appendChild(info);
    card.appendChild(delBtn);

    container.appendChild(card);
  });

  // Refresh the stats bar whenever the list re-renders.
  updateStats();
}

// ─────────────────────────────────────────────
// STATS BAR
// ─────────────────────────────────────────────

/**
 * updateStats()
 * Counts books by status and updates the chips in #stats-bar.
 */
function updateStats() {
  const bar = document.getElementById("stats-bar");
  bar.innerHTML = "";

  const total    = books.length;
  const toRead   = books.filter(b => b.status === "To read").length;
  const reading  = books.filter(b => b.status === "Reading").length;
  const finished = books.filter(b => b.status === "Finished").length;

  // Only show the bar when there are books.
  if (total === 0) return;

  const chips = [
    { label: "Total",    value: total },
    { label: "To read",  value: toRead },
    { label: "Reading",  value: reading },
    { label: "Finished", value: finished }
  ];

  chips.forEach(function (chip) {
    const el = document.createElement("span");
    el.className = "stat-chip";
    el.textContent = chip.value + " " + chip.label;
    bar.appendChild(el);
  });
}

// ─────────────────────────────────────────────
// FORM HANDLING & VALIDATION
// ─────────────────────────────────────────────

/**
 * clearErrors()
 * Removes all red error borders and messages before each submission.
 */
function clearErrors() {
  document.getElementById("title-error").textContent  = "";
  document.getElementById("author-error").textContent = "";
  document.getElementById("title").classList.remove("input-error");
  document.getElementById("author").classList.remove("input-error");
}

/**
 * handleFormSubmit(event)
 * Called when the Add Book form is submitted.
 * Trims inputs, validates required fields, and calls addBook if valid.
 */
function handleFormSubmit(event) {
  event.preventDefault(); // stop the browser from reloading the page

  clearErrors();

  // Read and trim values.
  const titleInput  = document.getElementById("title");
  const authorInput = document.getElementById("author");
  const statusInput = document.getElementById("status");

  const title  = titleInput.value.trim();
  const author = authorInput.value.trim();
  const status = statusInput.value;

  // Validate — show specific messages under each field.
  let hasError = false;

  if (title === "") {
    document.getElementById("title-error").textContent = "Please enter a title";
    titleInput.classList.add("input-error");
    hasError = true;
  }

  if (author === "") {
    document.getElementById("author-error").textContent = "Please enter an author";
    authorInput.classList.add("input-error");
    hasError = true;
  }

  if (hasError) return; // stop here — do not add the book

  // All good — add the book.
  addBook(title, author, status);

  // Reset the form fields.
  titleInput.value  = "";
  authorInput.value = "";
  statusInput.value = "To read";
}

// ─────────────────────────────────────────────
// BOOTSTRAP — runs once when the page loads
// ─────────────────────────────────────────────

// Wire up the form.
document.getElementById("book-form").addEventListener("submit", handleFormSubmit);

// Wire up the search box — fires on every keystroke.
document.getElementById("search-input").addEventListener("input", searchBooks);

// Load saved books from localStorage, then show them.
loadBooks();
renderBooks(books);
