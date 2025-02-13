import { fetchJiraIssue } from "./api/jiraApi";
import { InitAction, JiraAction } from "./shared.types";

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

chrome.runtime.onMessage.addListener(
  (request: JiraAction, sender, sendResponse) => {
    if (request.type === "FETCH_JIRA_ISSUE") {
      fetchJiraIssue(request.jiraId)
        .then((data) => sendResponse({ success: true, data }))
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );
      return true; // Important: indicates async response
    }
  }
);
