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
