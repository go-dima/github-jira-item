export interface ExtensionSettings {
  providerUrl: string;
}

const SYNC_KEYS = {
  PROVIDER_URL: "providerUrl",
} as const;

const LOCAL_KEYS = {
  PROVIDER_API_KEY: "providerApiKey",
} as const;

export const storageService = {
  async getProviderUrl(): Promise<string> {
    const result = await chrome.storage.sync.get(SYNC_KEYS.PROVIDER_URL);
    return result[SYNC_KEYS.PROVIDER_URL] || "";
  },

  async setProviderUrl(url: string): Promise<void> {
    await chrome.storage.sync.set({ [SYNC_KEYS.PROVIDER_URL]: url });
  },

  // API keys stay in chrome.storage.local — deliberately not synced so
  // tokens don't roam across the user's Chrome installations.
  async getProviderApiKey(): Promise<string> {
    const result = await chrome.storage.local.get(LOCAL_KEYS.PROVIDER_API_KEY);
    return result[LOCAL_KEYS.PROVIDER_API_KEY] || "";
  },

  async setProviderApiKey(apiKey: string): Promise<void> {
    await chrome.storage.local.set({
      [LOCAL_KEYS.PROVIDER_API_KEY]: apiKey,
    });
  },
};
