# UI/UX Design System

## Design Philosophy
*   **Vibe:** "Spotify Wrapped" meets "Professional DJ". Fun, engaging, and shareable, but with a nod to the technical nature of DJing.
*   **Format:** Responsive design that adapts to the user's chosen export format (9:16, 4:5, or 1:1). The desktop view will display the slide in a central container.
*   **Readability:** High contrast text, bold typography, clear data visualization.

## Imagery Strategy (MVP)
*   **No Real Cover Art:** Since retrieving album art from the Rekordbox DB is complex/impossible in the browser, we will **NOT** use real artist or album images in the MVP.
*   **Placeholders:** Use stylish, theme-aware placeholders (e.g., abstract geometric patterns, vinyl record icons, or genre-based icons) where an image would normally go.
*   **Generative Art:** (Optional) Generate a simple gradient or pattern based on the track's BPM or Key.

## Visual Identity

### Color Palettes (Themes)
Users can select from preset themes.

1.  **Default (The "Pastel" Theme):**
    *   Background: Soft Blue / Green Gradient (`#F0F9FF` to `#ECFCCB`)
    *   Accent: Teal (`#14B8A6`) & Indigo (`#6366F1`)
    *   Text: Dark Slate (`#1E293B`) - High contrast against light bg.

2.  **The "Club" Theme (Optional):**
    *   Background: Deep Purple / Black Gradient
    *   Accent: Neon Pink (`#FF00FF`) & Cyan (`#00FFFF`)
    *   Text: White

3.  **Minimalist (The "Clean" Theme):**
    *   Background: Off-White / Light Grey
    *   Accent: Black & International Orange
    *   Text: Dark Grey

4.  **Dark Mode (The "Booth" Theme):**
    *   Background: Solid Black
    *   Accent: Red (Pioneer DJ style)
    *   Text: White

### Typography
*   **Headings:** `Inter` or `Montserrat` (Bold/Black weights) - Impactful and modern.
*   **Data/Numbers:** `JetBrains Mono` or `Roboto Mono` - Technical feel for stats.

## Component Library (Shadcn/UI)
We will use Shadcn/UI for the "App" shell (upload forms, settings, buttons), but the "Story Slides" will likely be custom CSS/Tailwind components to ensure perfect export rendering.

*   **Buttons:** Rounded, high contrast.
*   **Cards:** Glassmorphism effects (backdrop-blur) for overlays.
*   **Inputs:** Minimalist text fields for DJ Name.

## User Flow
1.  **Landing Page:**
    *   Hero section with "Get your Rekordbox Year in Review".
    *   "Upload master.db" CTA (Drag & Drop zone).
    *   Privacy disclaimer ("We don't store your data").
2.  **Configuration & Processing:**
    *   User selects the **Target Year** (e.g., 2024, 2023).
    *   Fun loading animations ("Analyzing backspins...", "Counting drops...").
3.  **Review & Customize:**
    *   User sees a dashboard with their stats.
    *   Sidebar/Drawer for "Configuration" (Toggle metrics, change theme, edit DJ Name).
4.  **The Story View:**
    *   A "Play" button launches the full-screen story experience.
    *   User can tap left/right to navigate slides.
    *   "Download" button visible on each slide.
