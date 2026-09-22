# Outlay

Outlay is a responsive single-page expense tracker for recording and reviewing company or work-related expenses. It supports expense creation, search, editing, deletion, annual weekly summaries, and browser-local persistence.

## Live demo

[Open Outlay on Vercel](https://outlay-five.vercel.app/)

## Tech stack

- React 19
- Vite 8
- JavaScript
- Plain CSS
- Browser `localStorage`

## Run locally

```bash
git clone https://github.com/bmsj23/outlay.git
cd outlay
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

Useful checks:

```bash
npm run lint
npm run build
npm run preview
```

## Features

- Add expenses with a description, custom date picker (for non-iOS devices), and positive PHP amount
- Validate required fields, positive amounts, and the 120-character description limit
- Review expenses in a desktop table or mobile list
- Search descriptions with case-insensitive partial matching
- Sort expense history by newest or oldest added
- View full totals and current-week spending
- Open expense details, edit an expense, or delete it after confirmation
- Review any saved expense year in a weekly chart and breakdown
- Open a week to see its total and sort its included expenses
- Persist all added data in browser

## Implementation choices

`App.jsx` owns the canonical expense collection and app-level UI state. Presentation is divided into focused components and views, while totals, filtered results, sorting, and weekly summaries are derived from the expense collection rather than stored separately.

Expense data is saved under the versioned `outlay.expenses.v1` key. Stored entries are validated while loading, so missing or malformed browser data falls back safely without crashing the app. Storage is browser-local and intended for one user on one device.

Weekly summaries use Monday-to-Sunday periods. The first and last weeks are clipped to the selected calendar year, so every date in that year is represented exactly once. Available years are derived from saved expenses, with the current year included by default. Weekly calculations always use the complete expense collection and are not affected by description search.

The interface uses shared React markup with responsive CSS. Expense tables become stacked items on mobile, dialogs become bottom sheets, and the full 53-week chart remains horizontally scrollable on narrow screens. The custom date picker is shared by Add and Edit Expense, uses no additional dependency, and supports month navigation, keyboard navigation, Today, and Clear actions.

## Assumptions

- Expenses are company or work-related.
- Currency is fixed to Philippine Peso (PHP).
- The main total covers all recorded expenses, not only search results.
- Description search is case-insensitive and matches partial text.
- Expense history and week details default to newest-added first and can be switched to oldest-added first.
- Descriptions cannot be blank or exceed 120 characters.
- Amounts must be valid numbers greater than zero.
- The weekly summary defaults to the current year and offers years represented by saved expenses.
- Week numbering is app-specific and starts with the partial week containing January 1.

## Current limitations

- Data is stored only in the current browser and is not synchronized between devices.
- There is no backend, authentication, receipt upload, or reimbursement workflow.
- Only expense description, date, and amount are recorded; no category, tags, or notes.