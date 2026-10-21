import React from "react";
import ReactDOM from "react-dom/client";
import TicketWidget from "./components/TicketWidget";
import {
  findHeaderAnchor,
  findHeaderContainer,
  findPrBranches,
} from "./locators";
import { extractTicketId } from "./shared.helpers";
import { InitAction } from "./shared.types";
import "./styles/content.css";

const containerElementClass = "ticket-widget-container";

const onInit = async () => {
  const branches = findPrBranches();
  if (branches) {
    addFooter(branches.sourceBranch);
  }
};

const addFooter = (branchName: string) => {
  if (!document) {
    return;
  }

  const ticketId = extractTicketId(branchName);
  if (!ticketId) {
    return;
  }

  const anchor = findHeaderAnchor();
  const containerElement = findHeaderContainer();

  if (!containerElement || !anchor) {
    return;
  }

  // Check if containerElement already conatins the newElement
  const lookupNewElemnet = containerElement.querySelector(
    `.${containerElementClass}`
  );
  if (lookupNewElemnet) {
    return;
  }

  const newElement = createElement(anchor.withMarginTop);

  // Render the React component
  const root = ReactDOM.createRoot(newElement);
  root.render(
    React.createElement(TicketWidget, {
      ticketId,
    })
  );
  // add root as first child of anchorElement
  anchor.anchorElement.appendChild(newElement);
};

function createElement(withMarginTop: boolean): HTMLDivElement {
  const newElement = document.createElement("div");
  newElement.className = containerElementClass;

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
