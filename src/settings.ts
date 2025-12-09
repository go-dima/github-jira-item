import { storageService } from "./storage/storageService";

// Build-time env var (takes priority for dev workflow)
const ENV_JIRA_URL = process.env.JIRA_URL || "";

// Cache to avoid repeated storage reads
let cachedJiraUrl: string | null = null;

export const getJiraUrl = async (): Promise<string> => {
  // Env var takes priority (for dev workflow)
  if (ENV_JIRA_URL) {
    return ENV_JIRA_URL;
  }

  if (cachedJiraUrl !== null) {
    return cachedJiraUrl;
  }

  try {
    const storedUrl = await storageService.getJiraUrl();
    cachedJiraUrl = storedUrl;
    return cachedJiraUrl;
  } catch (error) {
    console.warn("Failed to read from storage:", error);
    return "";
  }
};

export const clearJiraUrlCache = (): void => {
  cachedJiraUrl = null;
};
