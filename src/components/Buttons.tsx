import React, { useEffect, useState } from "react";

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

export const Buttons: React.FC = ({
  jiraID,
  port,
}: {
  jiraID: string;
  port: chrome.runtime.Port;
}) => {
  return (
    <div className="jenkins-buttons-container">
      <Button
        src={"assets/logo.png"}
        text={`Load ${jiraID}`}
        onClick={() => {
          port.postMessage({ loadJiraPage: true, jiraID });
        }}
      />
    </div>
  );
};

export default Buttons;
