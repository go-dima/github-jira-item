import { fetchJiraIssue } from "./api/jiraApi";
import { fetchLinearIssue } from "./api/linearApi";
import { getProviderUrl } from "./settings";
import { storageService } from "./storage/storageService";
import { FetchTicketAction, InitAction } from "./shared.types";

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  try {
    if (changeInfo.status === "complete") {
      await chrome.tabs.sendMessage(tabId, { type: "INIT" } as InitAction);
    }
  } catch (error) {
    /* Tab disconnected, ignore*/
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    await chrome.tabs.sendMessage(activeInfo.tabId, {
      type: "INIT",
    } as InitAction);
  } catch (error) {
    /* Tab disconnected, ignore*/
  }
});

const handleJira = async (ticketId: string) => {
  const baseUrl = await getProviderUrl();
  if (!baseUrl) {
    throw new Error("Provider URL not configured. Please set it in extension options.");
  }
  return fetchJiraIssue(ticketId, baseUrl);
};

const handleLinear = async (ticketId: string) => {
  const baseUrl = await getProviderUrl();
  if (!baseUrl) {
    throw new Error("Provider URL not configured. Please set it in extension options.");
  }
  const apiKey = await storageService.getProviderApiKey();
  return fetchLinearIssue(ticketId, baseUrl, apiKey);
};

chrome.runtime.onMessage.addListener(
  (request: FetchTicketAction, sender, sendResponse) => {
    if (request.type === "FETCH_JIRA_ISSUE") {
      handleJira(request.ticketId)
        .then((data) => sendResponse({ success: true, data }))
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );
      return true;
    }
    if (request.type === "FETCH_LINEAR_ISSUE") {
      handleLinear(request.ticketId)
        .then((data) => sendResponse({ success: true, data }))
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );
      return true;
    }
  }
);
