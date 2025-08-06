# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension that connects Jira tickets to GitHub pull requests. When viewing a GitHub PR, it automatically extracts the Jira ticket ID from the branch name (format: KOD-####) and displays the Jira ticket information directly on the GitHub page.

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

1. **Background Service Worker** (`src/eventPage.ts`) - Handles tab events and message routing
2. **Content Script** (`src/content.ts`) - Injected into GitHub pages, detects PR branches and renders widgets
3. **React Components** (`src/components/`) - UI components rendered within GitHub pages

### Key Files
- `src/manifest.json` - Chrome extension configuration
- `src/settings.ts` - Configuration (loads Jira URL from environment variable)
- `src/api/jiraApi.ts` - Jira REST API integration
- `src/hooks/useJiraIssue.ts` - React hook for fetching Jira data
- `webpack.common.js` - Build configuration shared between dev/prod
- `.env` - Environment variables (not committed to git)
- `.env.example` - Template for environment variables

### Branch Name Pattern
The extension expects branch names containing Jira ticket IDs in the format `KOD-####` (case-insensitive). It extracts this pattern and fetches corresponding ticket data from Jira.

### GitHub Page Integration
The content script uses CSS selectors to identify GitHub PR elements and inject the Jira widget. It handles both old and new GitHub UI versions by checking for multiple selector patterns.

## Technology Stack
- **Frontend:** React 18 + TypeScript
- **Styling:** CSS with Ant Design components
- **Build:** Webpack 5 with TypeScript loader
- **Testing:** Jest + React Testing Library + jsdom
- **Package Manager:** pnpm (specified in packageManager field)

## Environment Setup
1. Copy `.env.example` to `.env` and set your Jira URL:
   ```
   JIRA_URL=https://your-domain.atlassian.net
   ```

## Installation for Development
1. Set up environment variables (see above)
2. Run `npm run dev` to build
3. Open Chrome and go to chrome://extensions
4. Enable "Developer mode"
5. Click "Load unpacked extension" and select the `dist` folder