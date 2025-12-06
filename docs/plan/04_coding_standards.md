# Coding Standards & Guidelines

## General Principles
*   **Type Safety:** Strict TypeScript usage. No `any` unless absolutely necessary and documented.
*   **Functional Components:** All React components must be functional with Hooks.
*   **Clean Code:** Follow DRY (Don't Repeat Yourself) and SOLID principles where applicable.
*   **Comments:** Comment complex logic, but prefer self-documenting variable/function names.

## Linting & Formatting
*   **ESLint:** Use `eslint-config-react-app` or a standard strict config.
*   **Prettier:** Enforce consistent formatting (2 space indent, single quotes, semi-colons).
*   **Husky:** Pre-commit hooks to run linting and type checking before commit.

## Testing Strategy
*   **Unit Tests (Vitest):**
    *   Test utility functions (e.g., data transformation helpers, math for stats).
    *   Test individual UI components (rendering, props).
*   **E2E Tests (Playwright):**
    *   Test the critical path: Upload DB -> Process -> View Results.
    *   Test configuration toggles (e.g., "Does toggling 'Unknown Artist' update the list?").

## Directory Structure
Since we are using Cloudflare Workers for the backend and React for the frontend, we must strictly separate these environments to ensure security (keeping the Rekordbox Key on the server) and build optimization.

```
src/
  client/                   # Frontend (React + Vite)
    components/             # Shared UI components (Buttons, Inputs)
    features/               # Feature-based modules
      upload/               # Upload logic & UI
      story/                # Story visualization components
      dashboard/            # Main results view
    lib/                    # Client-side utilities & API clients
    hooks/                  # Custom React hooks
    types/                  # Client-specific types
    assets/                 # Static images/icons
    
  worker/                   # Backend (Cloudflare Workers + Hono)
    index.ts                # Worker entry point
    db/                     # SQLCipher logic & queries
    utils/                  # Server-side helpers
    
  shared/                   # Code shared between Client and Worker
    types.ts                # Shared interfaces (API responses, etc.)
```

## GitHub Workflow
*   **Branches:** `feature/feature-name`, `fix/bug-name`.
*   **PRs:** Must pass CI (Lint + Build + Test) before merging to `main`.
*   **Commit Messages:** Conventional Commits (e.g., `feat: add upload component`, `fix: resolve memory issue`).

## Copilot Instructions
*   When generating code, always prioritize **Tailwind CSS** for styling.
*   Use **Shadcn/UI** patterns for interactive elements.
*   Ensure all new components have basic **Vitest** test files created alongside them.
