import React from "react";
import { useTicket } from "../hooks/useTicket";
import { useProviderUrl } from "../hooks/useProviderUrl";

interface TicketWidgetProps {
  ticketId: string;
  mockData?: ReturnType<typeof useTicket>;
  mockProviderUrl?: { providerUrl: string | null; loading: boolean };
}

export const TicketWidget: React.FC<TicketWidgetProps> = ({
  ticketId,
  mockData,
  mockProviderUrl,
}) => {
  const {
    data,
    error,
    loading: issueLoading,
  } = mockData || useTicket(ticketId);
  const { providerUrl, loading: urlLoading } =
    mockProviderUrl || useProviderUrl();

  if (urlLoading) {
    return <>Loading...</>;
  }

  if (!providerUrl) {
    return <>Provider URL is not set in options</>;
  }

  return (
    <>
      {issueLoading && "Loading..."}
      {error && `Error: ${error.message}`}
      {data && (
        <div className="ticket-widget-content">
          <p className="ticket-widget-text" title={data.summary}>
            {data.summary}
          </p>
          <p className="ticket-widget-link">
            (
            <a
              href={data.browseUrl ?? `${providerUrl}/browse/${ticketId}`}
              target="_blank">
              {ticketId}
            </a>
            )
          </p>
        </div>
      )}
    </>
  );
};

export default TicketWidget;
