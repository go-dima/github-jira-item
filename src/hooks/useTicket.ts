import { useEffect, useState } from "react";
import { TicketData } from "../api/types";
import { JiraAction } from "../shared.types";

export const useTicket = (ticketId: string) => {
  const [data, setData] = useState<TicketData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await chrome.runtime.sendMessage({
          type: "FETCH_JIRA_ISSUE",
          ticketId,
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

    if (ticketId) {
      fetchData();
    }
  }, [ticketId]);

  return { data, error, loading };
};
