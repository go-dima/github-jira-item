import { JIRA_URL } from "../settings";

export interface JiraIssueData {
  summary: string;
  status: string;
}

export const fetchJiraIssue = async (
  jiraId: string
): Promise<JiraIssueData> => {
  try {
    const response = await fetch(`${JIRA_URL}/rest/api/3/issue/${jiraId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const { summary, status } = result.fields;

    return {
      summary: summary,
      status: status.name,
    };
  } catch (error) {
    console.error("Error fetching Jira data:", error);
    throw error;
  }
};
