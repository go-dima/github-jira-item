import React from "react";
import ReactDOM from "react-dom/client";
import JiraWidget from "./components/JiraWidget";
import { extractJiraId } from "./shared.helpers";
import { InitAction } from "./shared.types";
import "./styles/content.css";

const onInit = async () => {
  let branchElements = Array.from(
    document.querySelectorAll(
      '[class*="PullRequestHeaderSummary-module__truncateBranch"]'
    )
  );

  if (branchElements.length === 0) {
    branchElements = Array.from(
      document.querySelectorAll(
        "span.commit-ref > a > span.css-truncate-target"
      )
    );
  }

  const branchNames = branchElements.map(
    (element: HTMLElement) => element.innerText
  );

  // Remove duplicates - return the first instance of each branch name
  const [targetBranch, sourceBranch] = branchNames.filter(
    (item, index) => branchNames.indexOf(item) === index
  );
  if (sourceBranch) {
    console.info("Meging", sourceBranch, "into", targetBranch);
    addFooter(sourceBranch);
  }
};

const getAnchorElement = (): {
  anchorElement: HTMLElement;
  withMarginTop: boolean;
} => {
  const anchorClassName_v1 = "gh-header-meta";
  const anchorClassName_v2 = "prc-PageHeader-Description";
  let withMarginTop = true;

  let anchorElement = Array.from(
    document.querySelectorAll(`[class*="${anchorClassName_v2}"]`)
  ).find((el) => el.className.includes(anchorClassName_v2))
    ?.children[0] as HTMLElement;
  if (!anchorElement) {
    anchorElement = document.getElementsByClassName(
      anchorClassName_v1
    )[0] as HTMLElement;
    withMarginTop = false;
  }
  return { anchorElement, withMarginTop };
};

const getContainerElement = (): Element | undefined => {
  const containerClassName_v1 = "gh-header";
  const containerClassName_v2 = "prc-PageHeader-PageHeader";

  let containerElement = Array.from(
    document.querySelectorAll(`[class*="${containerClassName_v2}"]`)
  ).find((el) => el.className.includes(containerClassName_v2));
  if (!containerElement) {
    containerElement = document.getElementsByClassName(
      containerClassName_v1
    )[0];
  }
  return containerElement;
};

const addFooter = (branchName: string) => {
  if (!document) {
    return;
  }

  const jiraID = extractJiraId(branchName);
  const { anchorElement, withMarginTop } = getAnchorElement();
  const containerElement = getContainerElement();

  // Check if containerElement already conatins the newElement
  const lookupNewElemnet = containerElement.querySelector(".jira-widget");
  if (lookupNewElemnet || !anchorElement) {
    return;
  }

  const newElement = createElement(withMarginTop);

  // Render the React component
  const root = ReactDOM.createRoot(newElement);
  root.render(
    React.createElement<{ jiraID: string }>(JiraWidget, {
      jiraID,
    })
  );
  // add root as first child of anchorElement
  anchorElement.appendChild(newElement);
};

function createElement(withMarginTop: boolean): HTMLDivElement {
  const newElement = document.createElement("div");
  newElement.className = "jira-widget";
  newElement.style.display = "flex";
  newElement.style.alignItems = "center";

  if (withMarginTop) {
    newElement.style.marginTop = "4px";
  }
  return newElement;
}

chrome.runtime.onMessage.addListener(
  async (message: InitAction, sender, sendResponse) => {
    if (message.type === "INIT") {
      await onInit().catch(console.error);
    }
  }
);
