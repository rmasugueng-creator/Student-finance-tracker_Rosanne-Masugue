# Student Finance Tracker
**Student:** Rosanne Masugue Ngangoumoun

This is a simple, accessible, and responsive web application to track student budgets and daily transaction. It was built using vanilla HTML, CSS, and JavaScript without any external frameworks.

## Live Link
https://github.com/rmasugueng-creator/Student-finance-tracker_Rosanne-Masugue.git

## Features 
- **Responsive Layout:** Changes from 1 column on mobile to 2 columns on desktop using CSS Grid (supports 3 breakpoints).
- **Theme Switcher*:** Allows toggling between Light Mode and Dark Mode for better vision comfort.
- **Data Persistence:** Automatically saves all transactions in the browser using `localStorage` .
- **Import/Export:** Allows downloading data as a JSON file and reloading it with structure validation and error handling (`try/catch`).
)- **Live Search & Highlight:** Filters records by name using live Regex and highlights matching letters using `<mark>`.

## Regex Catalog 
1. **Description Filter:** `/^\S(?:.*\S)?$/` - Prevents empty or trailing spaces.
2. **Amount Check:** `/^(0|[1-9]\d*)(\.\d{1,2})?$/` - Validates standard numeric numbers with up to 2 decimal places.
3. **Date Pattern:** `/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|\d|3)$/` - Enforces the strict YYYY-MM-DD format.
4. **Duplicate Blocker (Advanced):** `/\b(\w+)\s+\1\b/i` - Uses back-reference to detect and block consecutive duplicate words (like "coffee coffee").

## Accessibility (Ally)
- Full keyboard navigation with a visible focus outline.
- Semantic HTMLS elements (`<header>`, `<main>`, `<section>`).
- Included a hidden skip-link (`.skip-link`) to skip navigation on screen readers.
- Real-time limit budget warnings announced via `aria-live="assertice"`.