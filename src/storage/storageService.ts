export interface ExtensionSettings {
  jiraUrl: string;
}

const STORAGE_KEYS = {
  JIRA_URL: "jiraUrl",
} as const;

export const storageService = {
  async getJiraUrl(): Promise<string> {
    const result = await chrome.storage.sync.get(STORAGE_KEYS.JIRA_URL);
    return result[STORAGE_KEYS.JIRA_URL] || "";
  },

  async setJiraUrl(url: string): Promise<void> {
    await chrome.storage.sync.set({ [STORAGE_KEYS.JIRA_URL]: url });
  },
};
