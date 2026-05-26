export interface ExtensionSettings {
  providerUrl: string;
}

const STORAGE_KEYS = {
  PROVIDER_URL: "providerUrl",
} as const;

export const storageService = {
  async getProviderUrl(): Promise<string> {
    const result = await chrome.storage.sync.get(STORAGE_KEYS.PROVIDER_URL);
    return result[STORAGE_KEYS.PROVIDER_URL] || "";
  },

  async setProviderUrl(url: string): Promise<void> {
    await chrome.storage.sync.set({ [STORAGE_KEYS.PROVIDER_URL]: url });
  },
};
