import { useEffect, useState } from "react";
import { JiraIssueData } from "../api/jiraApi";
import { JiraAction } from "../shared.types";

export const useJiraIssue = (jiraId: string) => {
  const [data, setData] = useState<JiraIssueData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await chrome.runtime.sendMessage({
          type: "FETCH_JIRA_ISSUE",
          jiraId,
        } as JiraAction);

        if (!response.success) {
          throw new Error(response.error);
        }

        setData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    if (jiraId) {
      fetchData();
    }
  }, [jiraId]);

  return { data, error, loading };
};
