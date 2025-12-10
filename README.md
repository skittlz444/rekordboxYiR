# Rekordbox Year In Review

A web application that generates a "Spotify Wrapped" style year-in-review story for DJs using their Rekordbox `master.db` file.

## Features

-   **Secure Processing:** Your Rekordbox database is processed locally or via a secure Cloudflare Worker. The decryption key is never exposed to the client.
-   **Interactive Story:** View your top artists, tracks, genres, and listening habits in an engaging story format.
-   **Multi-Year Comparison:** Compare your stats with previous years to see how your taste has evolved.
-   **Shareable:** Download slides as images to share on social media (Instagram Stories, Posts, etc.).
-   **Theming:** Choose from multiple visual themes (Pastel, Club, Clean, Booth).

## Tech Stack

-   **Frontend:** React 19, Vite, Tailwind CSS, Shadcn/UI, Framer Motion, Zustand
-   **Backend:** Cloudflare Workers, Hono
-   **Database:** SQLCipher (WASM) for reading the encrypted Rekordbox database

## Prerequisites

-   Node.js (v18 or later)
-   npm

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/skittlz444/rekordboxYiR.git
    cd rekordboxYiR
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**

    Create a `.dev.vars` file in the root directory to store your secrets for local development. You will need the encryption key for the Rekordbox database.

    ```bash
    # .dev.vars
    REKORDBOX_KEY="your_secret_key_here"
    ```

4.  **Run the development server:**

    This starts both the Vite frontend and the Cloudflare Worker backend.

    ```bash
    npm run dev
    ```

    Open your browser and navigate to `http://localhost:8789` (or the port shown in the terminal).

## Scripts

-   `npm run dev`: Start the development server (Frontend + Worker).
-   `npm run build`: Build the frontend assets.
-   `npm run deploy`: Build and deploy the application to Cloudflare Workers.
-   `npm run lint`: Run ESLint to check for code quality issues.
-   `npm test`: Run unit tests using Vitest.
-   `npm run test:e2e`: Run end-to-end tests using Playwright.

## Testing

### Unit Tests

Run unit tests for the logic and components:

```bash
npm test
```

### End-to-End (E2E) Tests

Run E2E tests to verify the full user flow:

```bash
npm run test:e2e
```

To run E2E tests with a UI:

```bash
npm run test:e2e:ui
```

## Project Structure

-   `src/client`: React frontend application.
-   `src/worker`: Cloudflare Worker code for handling database uploads and decryption.
-   `src/shared`: Shared types between client and worker.
-   `docs/plan`: Project documentation and roadmap.
-   `e2e`: Playwright E2E tests.

## License

[MIT](LICENSE)
