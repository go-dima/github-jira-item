import React from "react";
import { useJiraIssue } from "../hooks/useJiraIssue";
import { LoadJiraPageAction } from "../shared.types";

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
  port,
  mockData,
}: {
  jiraID: string;
  port: chrome.runtime.Port;
  mockData?: ReturnType<typeof useJiraIssue>;
}) => {
  const { data, error, loading } = mockData || useJiraIssue(jiraID);
  let textElemnet = <p></p>;
  if (loading) {
    textElemnet = <p>Loading...</p>;
  }
  if (error) {
    textElemnet = <p>Error: {error.message}</p>;
  }

  return (
    <div className="jira-widget-container">
      {data ? <p>Summary: {data.summary}</p> : textElemnet}
      <Button
        src={"assets/jira.png"}
        text={`Load ${jiraID}`}
        onClick={() => {
          port.postMessage({
            type: "LOAD_JIRA_PAGE",
            jiraID,
          } as LoadJiraPageAction);
        }}
      />
    </div>
  );
};

export default JiraWidget;
