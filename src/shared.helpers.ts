import { ParsedUrl } from "./shared.types";

export async function getActiveTab(): Promise<chrome.tabs.Tab> {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

export function parseRepoUrl(url: URL): ParsedUrl {
  const pathParts = url.pathname.split("/").filter(Boolean);
  const repoName = pathParts[1];
  let branchName = "main";
  let inPrPage = false;

  if (pathParts[2] === "tree") {
    branchName = pathParts.slice(3).join("/");
  } else if (pathParts[2] === "pull") {
    branchName = "";
    inPrPage = true;
  }

  return { repoName, branchName, inPrPage };
}

/**
 * Extracts a ticket ID from a branch name.
 * Supports format: PREFIX-NUMBER or PREFIX_NUMBER (e.g., TES-456, WRK_100, ENG-123)
 * Always returns the ID with a dash separator regardless of input format.
 *
 * @param branchName - The branch name to extract the ticket ID from
 * @returns The ticket ID in uppercase with dash separator, or undefined if not found
 *
 * @example
 * extractTicketId("tes-123_some-feature") // returns "TES-123"
 * extractTicketId("wrk_100-my-feature") // returns "WRK-100"
 * extractTicketId("feature/wrk-456-description") // returns "WRK-456"
 * extractTicketId("feat/eng-42-foo") // returns "ENG-42"
 * extractTicketId("no-ticket-here") // returns undefined
 */
export function extractTicketId(branchName: string): string | undefined {
  const match = branchName.toUpperCase().match(/[A-Z]+[-_]\d+/);
  if (!match) return undefined;

  return match[0].replace("_", "-");
}

export type Provider = "jira" | "linear";

/**
 * Identifies the issue tracker behind a configured URL. Strict host matching
 * (exact host or proper subdomain) — rejects spoofing like
 * `atlassian.net.evil.com` or `linear.app.evil.com`.
 */
export function detectProvider(url: string): Provider | null {
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }

  if (host === "atlassian.net" || host.endsWith(".atlassian.net")) {
    return "jira";
  }
  if (host === "linear.app" || host.endsWith(".linear.app")) {
    return "linear";
  }
  return null;
}
