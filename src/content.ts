import React from "react";
import ReactDOM from "react-dom/client";
import Buttons from "./components/Buttons";
import { Action } from "./shared.types";
import "./styles/content.css";

const onInit = async () => {
  const branchElements = Array.from(
    document.querySelectorAll("span.commit-ref > a > span.css-truncate-target")
  );

  const branchNames = branchElements.map(
    (element: HTMLElement) => element.innerText
  );

  // Remove duplicates - return the first instance of each branch name
  const [targetBranch, sourceBranch] = branchNames.filter(
    (item, index) => branchNames.indexOf(item) === index
  );
  console.info("Meging", sourceBranch, "into", targetBranch);
  if (sourceBranch) {
    addFooter(sourceBranch);
  }
};

const addFooter = (branchName: string) => {
  if (!document) {
    return;
  }

  const jiraID = branchName.toUpperCase().match(/KOD-\d+/)?.[0];
  const anchorElement = document.getElementsByClassName("gh-header-meta")[0];
  const containerElement = document.getElementsByClassName("gh-header")[0];

  // Check if containerElement already conatins the newElement
  const lookupNewElemnet = containerElement.querySelector(".popupList-buttons");
  if (lookupNewElemnet || !anchorElement) {
    return;
  }

  const newElement = createElement();

  // Render the React component
  const root = ReactDOM.createRoot(newElement);
  const port = chrome.runtime.connect({ name: "github" });
  root.render(
    React.createElement<{ jiraID: string; port: chrome.runtime.Port }>(
      Buttons,
      {
        jiraID,
        port,
      }
    )
  );
  // add root as first child of parentElement
  anchorElement.after(newElement);
};

function createElement(): HTMLDivElement {
  const newElement = document.createElement("div");
  newElement.className = "popupList-buttons";
  newElement.style.display = "flex";
  newElement.style.alignItems = "center";
  newElement.style.justifyContent = "space-around";
  newElement.style.marginTop = "4px";
  return newElement;
}

chrome.runtime.onMessage.addListener(
  async (message: Action, sender, sendResponse) => {
    if (message.name === "init") {
      await onInit();
    }
  }
);
