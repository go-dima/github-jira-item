import React from "react";
import { useJiraIssue } from "../hooks/useJiraIssue";
import { JIRA_URL } from "../settings";

interface JiraWidgetProps {
  jiraID: string;
  mockData?: ReturnType<typeof useJiraIssue>;
}

export const JiraWidget: React.FC<JiraWidgetProps> = ({ jiraID, mockData }) => {
  const { data, error, loading } = mockData || useJiraIssue(jiraID);
  const jiraBrowseUrl = `${JIRA_URL}/browse/${jiraID}`;

  return (
    <>
      {loading && "Loading..."}
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
