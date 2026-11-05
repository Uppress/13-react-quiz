# Quizzy

A playful, timed trivia quiz built with React 19 and Vite. Choose a category, difficulty, and question count, then test your knowledge with questions from the [Open Trivia Database](https://opentdb.com/).

## Features

- Browse live trivia categories and configure each quiz.
- Fetch multiple-choice questions from Open Trivia DB.
- Safely decode API HTML entities and shuffle choices once per question.
- Answer with the mouse or number keys `1`–`4`; press `Enter` to continue.
- Beat the 15-second timer, follow your progress, and see your score.
- Keep your personal best and last-used quiz settings in local storage.
- Accessible answer buttons, feedback announcements, and loading/error states.
- Responsive layout with CSS Modules.

## Screenshots

Replace this placeholder with a screenshot of the quiz setup or gameplay:

![Quizzy screenshot placeholder](./screenshots/quizzy.png)

## Run locally

```sh
npm install
npm run dev
```

## Production build and preview

```sh
npm run build
npm run preview
```

Vite writes the optimized static site to `dist/`. The folder contains `index.html` and bundled, minified JavaScript, CSS, and other referenced assets under `dist/assets/`. The preview command serves that production build locally; it is not the development server.

## What I learned about hooks

- **`useState`** stores small pieces of UI state, such as category-loading status.
- **`useReducer`** keeps related quiz transitions—selecting answers, scoring, ticking the timer, and advancing questions—in one predictable reducer.
- **`useEffect`** synchronizes with external systems: category/question fetches, the timer interval, keyboard events, and updating the saved high score. Dependencies control when each effect is set up again, and cleanup aborts requests, clears intervals, or removes event listeners.
- **`useLocalStorageState`**, a custom hook, combines React state with `localStorage` so the high score and last quiz settings persist between visits.
- **Strict Mode** runs an extra setup-and-cleanup cycle for effects in development. Correct cleanup makes effects safe to re-run and helps reveal missing cleanup; this check does not run in production.

## Deploy

Push this repository to GitHub, then on [Vercel](https://vercel.com/) choose **Add New → Project**, import the repository, and select **Deploy**. Vercel detects Vite automatically.
