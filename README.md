# Issue Tracker ↔ GitHub Chrome Extension

Connects Jira Cloud or Linear tickets to GitHub PRs. The extension reads the
ticket ID out of the PR's branch name (`KOD-1234`, `ENG-42`, etc.) and renders
the ticket title, status, and a link to the ticket in the PR header.

The provider is inferred from the configured URL — Jira (`*.atlassian.net`) or
Linear (`linear.app`). Only one provider is configured at a time.

## Building

1.  Clone repo
2.  `npm i`
3.  `npm run dev` to compile once, or `npm run watch` to run the dev task in watch mode
4.  `npm run build` to build a production (minified) version

## Installation

1.  Build (see above)
2.  Go to [`chrome://extensions`](chrome://extensions) in Google Chrome
3.  Enable **Developer mode**, click **Load unpacked extension**, and select the `dist/` folder

## Setup

Open the extension's options page and configure:

- **Issue tracker URL** — your Jira Cloud instance (`https://your-domain.atlassian.net`) or your Linear workspace (`https://linear.app/your-workspace`).
- **Linear API key** (Linear only) — create one at [linear.app/settings/api](https://linear.app/settings/api). Stored in `chrome.storage.local` (not synced across Chrome installations).

Jira uses your existing browser session — make sure you're logged into Atlassian in the same browser.
