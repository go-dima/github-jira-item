import { JIRA_URL } from "./settings";

export async function fetchJson(url: string | URL) {
  try {
    const response = await fetch(`${url}/api/json`);
    if (!response.ok) {
      console.warn("Fetch error", response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching json", error);
    return null;
  }
}

export async function loadJenkinsJobs() {
  try {
    const response = await fetch(`${JIRA_URL}/api/json`);

    if (!response.ok) {
      console.warn("Jenkins Unreachable", response.status);
      return { jobs: undefined };
    }
    return await response.json();
  } catch (error) {
    console.warn("Jenkins Unreachable");
    return { jobs: undefined };
  }
}
