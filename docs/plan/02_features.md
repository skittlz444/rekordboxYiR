# Features & Functionality

## Core Features (MVP)

### 1. Data Processing
*   **Secure Upload:** Drag-and-drop interface for `master.db`.
*   **Server-Side Parsing:** Decryption and analysis performed on Cloudflare Workers.
*   **Error Handling:** Clear feedback for invalid files, corruption, or memory limits.

### 2. Key Metrics (The "Wrapped" Experience)
The application will generate a series of "Slides", each focusing on a specific metric:

*   **The Opener:** "Welcome to your 202X in Music."
*   **Top Artists:** Ranked list of most played artists. (Note: No artist images in MVP).
*   **Top Tracks:** Ranked list of most played tracks (by play count). (Note: No album art in MVP).
*   **Top Genres:** Pie chart or ranked list of genres.
*   **The "Busiest" Stats:**
    *   Busiest Month (Month with most plays).
    *   Longest Session (Calculated from consecutive play history timestamps).
*   **Library Growth:**
    *   Number of new tracks added to the library in the selected year.
    *   Total library size (optional context).
*   **Year Comparison:**
    *   Compare key stats (Total Playtime, Longest Session, Total Plays, Set Count) with a previous year.
    *   **Positive Vibes Only:** Only display metrics that have increased or improved. Hide stats that have decreased.
    *   Default: Previous year (e.g., 2024 vs 2023).
    *   Custom: User can select a specific comparison year (e.g., 2024 vs 2020).
    *   Example: "Your longest session was 20% longer than in 2020!"
*   **The Summary:** A single "Cheatsheet" slide summarizing all top stats, including Set Count.

### 3. Sharing & Export
*   **Multi-Format Support:** All slides (including the Summary) can be generated in multiple aspect ratios to suit different platforms:
    *   **Story (9:16):** 1080x1920 - Best for Instagram/TikTok Stories.
    *   **Portrait (4:5):** 1080x1350 - Best for Instagram Feed posts.
    *   **Square (1:1):** 1080x1080 - Classic feed format.
*   **Download:** One-click download for individual slides or "Download All" in the selected format.

### 4. Configuration
*   **Year Selection:** Dropdown to select which year to analyze (defaults to current year).
*   **Unknown Artist/Genre Filter:** Toggle to exclude tracks with "Unknown Artist/Genre" or empty artist/genre fields.
*   **Metric Toggles:** Simple checkboxes to hide specific slides (e.g., "I don't want to show my Genres").
*   **DJ Identity:** Input field for "DJ Name" which appears in the slides.
*   **Computation Settings:**
    *   **Playtime Estimation:** Allow user to set "Average % of song played" (default: 75%) to calculate total time, as Rekordbox history only stores track length, not actual duration played.

## Future Enhancements (Post-MVP)

### Advanced Metrics
*   **Artist/Album Art Fetching:** Attempt to retrieve real cover art via external APIs (Spotify/Last.fm) or local file matching (if possible in browser).
*   **Key Analysis:** Most used keys (Camelot Wheel visualization).
*   **BPM Analysis:** Average BPM, BPM range, "Fastest Set".
*   **Discover Stats:** Browse and crawl the database from histories to discover what other metrics can be exposed.

### Customization
*   **Themes:** Allow users to pick from pre-built themes (Primary, Secondary, Background, Text all pre-determined).
*   **Theme Builder:** Allow users to pick custom colors (Primary, Secondary, Background, Text).
*   **Previous Year Selection:** Dropdown to select which year to compare against (defaults to previous year if there are previous year histories, can be disabled to not show comparisons).
*   **Logo Upload:** Upload a transparent PNG logo to replace the text-based DJ Name.
