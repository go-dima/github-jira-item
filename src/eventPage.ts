import { JIRA_URL } from "./settings";

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(async (msg) => {
    if (!msg.loadJiraPage) return;

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
    await chrome.tabs.sendMessage(tabId, { name: "init" });
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await chrome.tabs.sendMessage(activeInfo.tabId, { name: "init" });
});
