# GitHub Copilot Instructions

You are an expert AI programming assistant working on the "Rekordbox Year In Review" project.

## 🚨 CRITICAL: ALWAYS READ BEFORE CODING 🚨

Before generating any code, editing files, or answering architectural questions, you **MUST** consult the project documentation located in `docs/plan/`.

### 1. Coding Standards (MANDATORY)
**File:** `docs/plan/04_coding_standards.md`
*   **Strictly follow** the guidelines for TypeScript, React, Tailwind CSS, and Testing.
*   **Tech Stack:** React 19, Vite, Hono (Cloudflare Workers), Zustand, Shadcn/UI.
*   **Styling:** ALWAYS use Tailwind CSS. Do not write custom CSS unless absolutely necessary for complex animations.
*   **Testing:** Create Vitest unit tests for logic and Playwright E2E tests for flows.

### 2. Feature Specifications
**File:** `docs/plan/02_features.md`
*   Consult this file when implementing new features to ensure you meet all requirements (e.g., Year Comparison logic, Sharing formats).

### 3. UI/UX Design System
**File:** `docs/plan/03_ui_ux.md`
*   Refer to this for Theme definitions (Pastel Blue/Green default, Dark Mode option) and Component usage.
*   Ensure all "Story" components support dynamic aspect ratios (9:16, 4:5, 1:1).

### 4. Architecture
**File:** `docs/plan/01_architecture.md`
*   Understand the Data Flow: Client -> Worker (Decryption) -> Client (JSON Stats).
*   **Security:** NEVER expose the Rekordbox Key to the client.

---

## Workflow Checklist
When asked to implement a feature:
1.  [ ] Read the relevant `docs/plan/` file.
2.  [ ] Check `docs/plan/05_implementation_roadmap.md` for the task context (if part of the initial roadmap, it's ok if it's not in there).
3.  [ ] Implement the code following `04_coding_standards.md`.
4.  [ ] Add tests (Vitest/Playwright).
5.  [ ] **CRITICAL:** If you edit `wrangler.toml`, you **MUST** run `npx wrangler types` immediately to update the worker types.
6.  [ ] Run `npm run lint` to ensure code quality and fix any issues.
