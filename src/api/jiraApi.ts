import { TicketData } from "./types";

export const fetchJiraIssue = async (
  id: string,
  baseUrl: string
): Promise<TicketData> => {
  try {
    const response = await fetch(`${baseUrl}/rest/api/3/issue/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const { summary, status } = result.fields;

    return {
      summary,
      status: status.name,
      browseUrl: `${baseUrl}/browse/${id}`,
    };
  } catch (error) {
    console.error("Error fetching Jira data:", error);
    throw error;
  }
};
