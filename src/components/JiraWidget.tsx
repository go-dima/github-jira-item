import React from "react";
import { useJiraIssue } from "../hooks/useJiraIssue";
import { LoadJiraPageAction } from "../shared.types";
import { JIRA_URL } from "../settings";
import { LinkOutlined } from "@ant-design/icons";

interface ButtonProps {
  src: string;
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ src, text, onClick, disabled }) => (
  <button
    onClick={onClick}
    className={`jenkins-button ${disabled ? "disabled" : ""}`}
    disabled={disabled}>
    <div className="jenkins-button-content">
      <img
        className="jenkins-button-img"
        src={chrome.runtime ? chrome.runtime.getURL(src) : ""}
      />
      <span className="jenkins-button-text">{text}</span>
    </div>
  </button>
);

export const JiraWidget: React.FC = ({
  jiraID,
  mockData,
}: {
  jiraID: string;
  mockData?: ReturnType<typeof useJiraIssue>;
}) => {
  const { data, error, loading } = mockData || useJiraIssue(jiraID);
  const jiraBrowseUrl = `${JIRA_URL}/browse/${jiraID}`;

  return (
    <div className="jira-widget-container">
      <a href={jiraBrowseUrl} target="_blank">
        {jiraID}
      </a>
      {loading && "Loading..."}
      {error && `Error: ${error.message}`}
      {data && (
        <div className="jira-widget-content">
          <p style={{ margin: 0 }}>{data.summary}</p>
          <a href={jiraBrowseUrl} target="_blank">
            <LinkOutlined />
          </a>
        </div>
      )}
    </div>
  );
};

export default JiraWidget;
