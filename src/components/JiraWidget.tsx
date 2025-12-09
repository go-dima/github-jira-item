import React from "react";
import { useJiraIssue } from "../hooks/useJiraIssue";
import { useJiraUrl } from "../hooks/useJiraUrl";

interface JiraWidgetProps {
  jiraID: string;
  mockData?: ReturnType<typeof useJiraIssue>;
  mockJiraUrl?: { jiraUrl: string | null; loading: boolean };
}

export const JiraWidget: React.FC<JiraWidgetProps> = ({
  jiraID,
  mockData,
  mockJiraUrl,
}) => {
  const {
    data,
    error,
    loading: issueLoading,
  } = mockData || useJiraIssue(jiraID);
  const { jiraUrl, loading: urlLoading } = mockJiraUrl || useJiraUrl();

  if (urlLoading) {
    return <>Loading...</>;
  }

  if (!jiraUrl) {
    return <>Jira url is not set in options</>;
  }

  const jiraBrowseUrl = `${jiraUrl}/browse/${jiraID}`;

  return (
    <>
      {issueLoading && "Loading..."}
      {error && `Error: ${error.message}`}
      {data && (
        <div className="jira-widget-content">
          <p className="jira-widget-text" title={data.summary}>
            {data.summary}
          </p>
          <p className="jira-widget-link">
            (
            <a href={jiraBrowseUrl} target="_blank">
              {jiraID}
            </a>
            )
          </p>
        </div>
      )}
    </>
  );
};

export default JiraWidget;
