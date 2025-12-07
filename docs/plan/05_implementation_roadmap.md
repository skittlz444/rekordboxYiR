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
- [x] **Task 2.3: SQL Query Implementation**
    - [x] Write SQL queries for Top Artists, Tracks, Genres.
    - [x] Write SQL queries for Session stats (Song count based).
    - [x] Parameterize queries to filter by a specific year.
    - [x] **Update:** Implement comparison logic (fetch stats for Year A and Year B).
    - [x] **Update:** Return structured JSON response with comparison data.

## Phase 3: UI/UX Implementation
- [x] **Task 3.1: Story Slide Components**
    - [x] **Prototype:** Create HTML/Tailwind prototypes for all slides with responsive logic (9:16, 4:5, 1:1).
    - [x] Create a generic `StorySlide` layout component (React).
    - [x] **Update:** Implement dynamic container sizing for 9:16, 4:5, and 1:1 aspect ratios (React).
    - [x] Implement specific slide types (React):
        - [x] `OpenerSlide` (Welcome message)
        - [x] `ArtistSlide` (Top Artists)
            - [x] Fix formatting for long artist names
        - [x] `TrackSlide` (Top Tracks)
            - [x] Fix formatting for long track names
        - [x] `GenreSlide` (Top Genres)
            - [x] Fix stats not populating
        - [x] `BusiestDaySlide` (Busiest Month/Longest Session)
            - [x] Change month to show month name or short name
            - [x] Fix longest session to correctly get and display the time rather than N/A - default to 100% play estimation for track lengths
            - [x] Change date time format for longest session to be more readable
        - [x] `LibraryGrowthSlide` (New tracks added)
            - *Note: If collection size decreased, change messaging to "You cleaned up your library" or similar.*
        - [x] `YearComparisonSlide` (General stats comparison)
            - *Note: Only show if a comparison year exists AND there are metrics with positive growth. Only display metrics that have increased.*
            - [x] Add sets played metric
        - [x] `YearComparisonTrendsSlide` (Biggest increases, rank changes, new favorites)
            - *Biggest Obsession: Artist/Genre with highest % increase in plays vs comparison year (regardless of rank).*
            - *Rank Climber: Artist/Genre with largest rank change from outside Top 10 to inside Top 10 (Top 3 for genre).*
            - *New Favorite: Artist/Genre with 0 plays in comparison year to highest current rank. Show "From 0 plays to Top X" (Artist X: 5, 10, 15, 20, 30; Genre X: 3, 5, 10).*
            - [x] Add Rank Climber metric
        - [x] `SummarySlide` (Cheatsheet)
            - [x] Change month format to show month name or short name
    - [x] **Note:** Use CSS patterns/icons for placeholders. Do not implement image fetching.
    - [x] **Update:** Implement Theme System (Pastel [Default], Club, Clean, Booth).
        - [x] Implement clean theme
- [x] **Task 3.2: Dashboard & Navigation**
    - [x] Create the main view to display stats before "Story Mode".
    - [x] Implement "Play Story" overlay.
- [ ] **Task 3.3: Configuration State**
    - [ ] Set up Zustand store for user preferences.
    - [ ] **Update:** Add state for `targetYear`, `comparisonYear`, `djName`.
    - [ ] **Update:** Add toggles for `unknownArtistFilter`, `unknownGenreFilter`.
    - [ ] **Update:** Add toggle to disable genres in `YearComparisonTrendsSlide` (show only artists).
    - [ ] **Update:** Add state for `averageTrackPlayedPercent` (number, default 0.75).
    - [ ] **Update:** Implement UI controls for all configuration options (Year, Filters, Playtime Estimation. DJ Name, etc) on the initial upload page, but also in the dashboard, story slides and view all slides pages.
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
