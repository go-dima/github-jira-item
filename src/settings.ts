import { storageService } from "./storage/storageService";

const ENV_PROVIDER_URL = process.env.PROVIDER_URL || "";

let cachedProviderUrl: string | null = null;

export const getProviderUrl = async (): Promise<string> => {
  if (ENV_PROVIDER_URL) {
    return ENV_PROVIDER_URL;
  }

  if (cachedProviderUrl !== null) {
    return cachedProviderUrl;
  }

  try {
    const storedUrl = await storageService.getProviderUrl();
    cachedProviderUrl = storedUrl;
    return cachedProviderUrl;
  } catch (error) {
    console.warn("Failed to read from storage:", error);
    return "";
  }
};

export const clearProviderUrlCache = (): void => {
  cachedProviderUrl = null;
};
