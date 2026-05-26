import { getProviderUrl } from "../settings";
import { TicketData } from "./types";

export const fetchJiraIssue = async (
  ticketId: string
): Promise<TicketData> => {
  const jiraUrl = await getProviderUrl();

  if (!jiraUrl) {
    throw new Error('Provider URL not configured. Please set it in extension options.');
  }

  try {
    const response = await fetch(`${jiraUrl}/rest/api/3/issue/${ticketId}`);

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
