import { fetchJiraIssue } from "./api/jiraApi";
import { JIRA_URL } from "./settings";
import { InitAction, JiraAction, LoadJiraPageAction } from "./shared.types";

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(async (msg: LoadJiraPageAction) => {
    if (msg.type !== "LOAD_JIRA_PAGE") return;

    try {
      await loadJiraPage(msg.jiraID);
    } catch (error) {
      // Port disconnected
      console.error("Error loading Jira page", error);
    }
    return true;
  });
});

async function loadJiraPage(jiraID: string) {
  chrome.tabs.create({
    url: `${JIRA_URL}/browse/${jiraID}`,
  });
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    await chrome.tabs
      .sendMessage(tabId, { type: "INIT" } as InitAction)
      .catch(/* Tab disconnected, ignore*/);
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await chrome.tabs
    .sendMessage(activeInfo.tabId, { type: "INIT" } as InitAction)
    .catch(/* Tab disconnected, ignore*/);
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
