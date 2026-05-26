import { useEffect, useState } from "react";
import { TicketData } from "../api/types";
import { detectProvider } from "../shared.helpers";
import { FetchTicketAction } from "../shared.types";
import { useProviderUrl } from "./useProviderUrl";

export const useTicket = (ticketId: string) => {
  const [data, setData] = useState<TicketData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const { providerUrl, loading: urlLoading } = useProviderUrl();

  useEffect(() => {
    if (urlLoading) return;
    if (!ticketId) return;

    const provider = providerUrl ? detectProvider(providerUrl) : null;
    if (!provider) {
      setError(new Error("Configure a provider URL in extension options"));
      return;
    }

    const message: FetchTicketAction =
      provider === "jira"
        ? { type: "FETCH_JIRA_ISSUE", ticketId }
        : { type: "FETCH_LINEAR_ISSUE", ticketId };

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await chrome.runtime.sendMessage(message);

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

    fetchData();
  }, [ticketId, providerUrl, urlLoading]);

  return { data, error, loading };
};
