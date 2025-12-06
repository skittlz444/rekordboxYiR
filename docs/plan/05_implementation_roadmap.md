# Implementation Roadmap

## Phase 1: Project Setup & Infrastructure
- [x] **Task 1.1: Initialize Project Structure**
    - [x] **Refactor:** Move `src/index.ts` to `src/worker/index.ts`.
    - [x] **Refactor:** Create `src/shared` and move types there.
    - [x] Install Tailwind CSS & Shadcn/UI in `client`.
    - [x] Configure ESLint, Prettier, and Vitest for both environments.
- [x] **Task 1.2: Cloudflare Worker Setup**
    - [x] Initialize Hono server.
    - [x] Configure `wrangler.toml`.
    - [x] Set up SQLCipher WASM in the Worker environment.
    - [x] Create a "Hello World" endpoint (Implemented `/upload` endpoint).

- [x] **Task 1.3: CI/CD Pipeline (Tests)**
    - [x] Configure GitHub Actions to run Linting (ESLint) and Tests (Vitest) on PRs.
    - [x] Ensure workflow fails if tests fail.

## Phase 2: Core Data Processing
- [x] **Task 2.1: Database Upload Component**
    - [x] Create basic file input in React.
    - [x] Implement `POST` request to Worker.
    - [x] **Update:** Refactor UI to use Shadcn/UI Drag-and-Drop zone.
    - [x] **Update:** Add file validation (check extension, size warning).
- [x] **Task 2.2: Server-Side Decryption Logic**
    - [x] Implement `master.db` decryption using the secret key.
    - [x] Handle memory limits (basic try/catch implemented).
- [ ] **Task 2.3: SQL Query Implementation**
    - [x] Write SQL queries for Top Artists, Tracks, Genres.
    - [x] Write SQL queries for Session stats (Song count based).
    - [x] Parameterize queries to filter by a specific year.
    - [ ] **Update:** Implement comparison logic (fetch stats for Year A and Year B).
    - [ ] **Update:** Return structured JSON response with comparison data.

## Phase 3: UI/UX Implementation
- [ ] **Task 3.1: Story Slide Components**
    - [ ] Create a generic `StorySlide` layout component.
    - [ ] **Update:** Implement dynamic container sizing for 9:16, 4:5, and 1:1 aspect ratios.
    - [ ] Implement specific slide types: `ArtistSlide`, `TrackSlide`, `SummarySlide`.
    - [ ] **Note:** Use CSS patterns/icons for placeholders. Do not implement image fetching.
    - [ ] **Update:** Implement Theme System (Pastel [Default], Club, Clean, Booth).
- [ ] **Task 3.2: Dashboard & Navigation**
    - [ ] Create the main view to display stats before "Story Mode".
    - [ ] Implement "Play Story" overlay.
- [ ] **Task 3.3: Configuration State**
    - [ ] Set up Zustand store for user preferences.
    - [ ] **Update:** Add state for `targetYear`, `comparisonYear`, `djName`.
    - [ ] **Update:** Add toggles for `unknownArtistFilter`, `unknownGenreFilter`.
    - [ ] Connect settings UI to the store.

## Phase 4: Sharing & Polish
- [ ] **Task 4.1: Image Generation**
    - [ ] Implement `html-to-image` to capture slides as PNGs.
    - [ ] Add "Download" button to each slide.
- [ ] **Task 4.2: Refinement & Animations**
    - [ ] Add Framer Motion transitions between slides.
    - [ ] Add loading states and error messages.
- [ ] **Task 4.3: E2E Testing**
    - [ ] Write Playwright tests for the full user flow.

## Phase 5: Deployment
- [ ] **Task 5.1: Deployment Verification**
    - [ ] Verify Cloudflare Workers auto-deploy is functioning correctly.
    - [ ] Perform final production smoke tests.
    - [ ] Remove reading of this document from the copilot instructions.
