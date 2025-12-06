# Architecture & Tech Stack

## Overview
Rekordbox Year In Review is a web application that analyzes a user's Rekordbox library database to generate "Spotify Wrapped" style statistics and shareable graphics. The application is built with a focus on privacy, performance, and a modern user experience.

## Tech Stack

### Frontend
*   **Framework:** React 19 (via Vite)
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **Routing:** React Router v7 (or latest stable)
*   **State Management:** Zustand (for lightweight global state like theme, metrics data)
*   **Styling:** Tailwind CSS
*   **Component Library:** Shadcn/UI (Radix UI primitives + Tailwind)
*   **Animations:** Framer Motion (for the "Story" transitions)
*   **Image Generation:** `html-to-image` or `satori` (for generating shareable stats)

### Backend (Serverless)
*   **Platform:** Cloudflare Workers
*   **Framework:** Hono (lightweight web framework for Workers)
*   **Database Processing:** `@7mind.io/sqlcipher-wasm` (running in the Worker)
*   **Storage (Optional/Future):** Cloudflare R2 (if temporary DB storage is needed), KV (for shared links)

## Data Flow

1.  **Upload:** User selects their `master.db` file in the React frontend.
2.  **Transmission:** The file is uploaded to the Cloudflare Worker endpoint via a `POST` request (multipart/form-data).
3.  **Processing (Server-Side):**
    *   The Worker receives the file stream.
    *   The Worker initializes the SQLCipher WASM instance.
    *   The Worker decrypts the database using the secure Rekordbox Key (stored in Cloudflare Secrets).
    *   SQL queries are executed to extract metrics (Top Tracks, Artists, Play Counts, etc.).
    *   *Constraint Check:* The Worker monitors memory usage. If the DB is too large for the 128MB limit, we may need to implement a chunked upload or stream processing strategy (or advise the user to use a smaller export).
4.  **Response:** The Worker returns a JSON object containing the calculated statistics. **The original database file is discarded and never stored persistently.**
5.  **Visualization:** The React frontend receives the JSON data and renders the "Year in Review" story slides.
6.  **Sharing:**
    *   User clicks "Share".
    *   Frontend generates an image (PNG/JPG) from the DOM using `html-to-image`.
    *   User downloads the image.

## Security Considerations
*   **Rekordbox Key:** The decryption key is stored as a Cloudflare Worker Secret (Environment Variable) and is **never** exposed to the client.
*   **Data Privacy:** User databases are processed in memory (or ephemeral storage) and are not saved.
*   **Input Validation:** The Worker validates that the uploaded file is a valid SQLite database header before attempting processing.

## Scalability & Limits
*   **Memory:** Cloudflare Workers (Free) have a 128MB memory limit. This is the primary bottleneck for loading `master.db`.
    *   *Mitigation:* Optimize SQL queries to be memory efficient.
    *   *Fallback:* If server-side processing fails consistently due to OOM, we may need to reconsider a client-side fallback or a paid Worker plan.
