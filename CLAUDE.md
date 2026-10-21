# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension that connects tickets (Jira Cloud or Linear) to GitHub pull requests. When viewing a GitHub PR, it automatically extracts the ticket ID from the branch name (e.g. `KOD-####`, `ENG-####`) and displays the ticket's summary and status directly on the GitHub page. The provider is inferred from the configured URL; only one provider is configured at a time.

## Development Commands

**Build and Development:**
- `npm run dev` - Build for development (single compilation)
- `npm run watch` - Development build with file watching
- `npm run build` - Production build (minified)

**Testing:**
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode

**Packaging:**
- `npm run local-pack` - Run the pack.sh script for local packaging
- `npm run zip` - Create installable extension zip file

**Storybook (for component development):**
- `npm run storybook` - Start Storybook development server on port 6006
- `npm run build-storybook` - Build static Storybook

## Architecture

### Extension Structure
This is a Manifest V3 Chrome extension with three main components:

1. **Background Service Worker** (`src/eventPage.ts`) - Handles tab events and routes provider-specific fetch messages (`FETCH_JIRA_ISSUE`, `FETCH_LINEAR_ISSUE`)
2. **Content Script** (`src/content.ts`) - Injected into GitHub pages, detects PR branches and renders widgets
3. **React Components** (`src/components/`) - UI components rendered within GitHub pages

### Key Files
- `src/manifest.json` - Chrome extension configuration
- `src/settings.ts` - Configuration (loads provider URL from environment variable or storage)
- `src/shared.helpers.ts` - `extractTicketId`, `detectProvider`
- `src/api/jiraApi.ts` - Jira REST API integration
- `src/api/linearApi.ts` - Linear GraphQL API integration
- `src/api/types.ts` - Provider-agnostic `TicketData`
- `src/hooks/useTicket.ts` - React hook that dispatches to the correct provider based on the configured URL
- `webpack.common.js` - Build configuration shared between dev/prod
- `.env` - Environment variables (not committed to git)
- `.env.example` - Template for environment variables

### Branch Name Pattern
The extension extracts ticket IDs in the format `PREFIX-NUMBER` or `PREFIX_NUMBER` (case-insensitive), normalizing underscore to dash. Examples: `KOD-1234`, `ENG-42`, `feat/eng_42-foo`.

### Provider Detection
`detectProvider(url)` does strict host matching:
- `atlassian.net` or `*.atlassian.net` → Jira
- `linear.app` or `*.linear.app` → Linear

### GitHub Page Integration
The content script uses CSS selectors to identify GitHub PR elements and inject the ticket widget. It handles both old and new GitHub UI versions by checking for multiple selector patterns.

## Technology Stack
- **Frontend:** React 18 + TypeScript
- **Styling:** CSS with Ant Design components
- **Build:** Webpack 5 with TypeScript loader
- **Testing:** Jest + React Testing Library + jsdom
- **Package Manager:** pnpm (specified in packageManager field)

## Environment Setup
1. Copy `.env.example` to `.env` and set your provider URL:
   ```
   PROVIDER_URL=https://your-domain.atlassian.net
   ```
   or
   ```
   PROVIDER_URL=https://linear.app/your-workspace
   ```

## Installation for Development
1. Set up environment variables (see above)
2. Run `npm run dev` to build
3. Open Chrome and go to chrome://extensions
4. Enable "Developer mode"
5. Click "Load unpacked extension" and select the `dist` folder
6. Open the extension's options page and configure the URL (and for Linear, an API key from https://linear.app/settings/api)
