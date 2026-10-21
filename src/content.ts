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
const PR_PATH = /\/pull\/\d+/;

let mounted: {
  root: ReactDOM.Root;
  element: HTMLElement;
  ticketId: string;
} | null = null;

const unmount = () => {
  if (!mounted) {
    return;
  }
  mounted.root.unmount();
  mounted.element.remove();
  mounted = null;
};

// Idempotent: GitHub re-renders the PR header (hydration after a cached
// reload, in-app navigation), which drops our node, so this runs on every
// DOM change and re-inserts the widget when it is missing or stale.
const ensureWidget = () => {
  if (!PR_PATH.test(location.pathname)) {
    unmount();
    return;
  }

  const branches = findPrBranches();
  const ticketId = branches && extractTicketId(branches.sourceBranch);
  if (!ticketId) {
    unmount();
    return;
  }

  if (mounted?.ticketId === ticketId && mounted.element.isConnected) {
    return;
  }
  unmount();

  const anchor = findHeaderAnchor();
  const containerElement = findHeaderContainer();
  if (!anchor || !containerElement) {
    return;
  }

  // Leftovers from a previous content script instance (extension reload)
  containerElement
    .querySelectorAll(`.${containerElementClass}`)
    .forEach((element) => element.remove());

  const element = createElement(anchor.withMarginTop);
  element.dataset.ticketId = ticketId;

  const root = ReactDOM.createRoot(element);
  root.render(React.createElement(TicketWidget, { ticketId }));
  anchor.anchorElement.appendChild(element);

  mounted = { root, element, ticketId };
};

function createElement(withMarginTop: boolean): HTMLDivElement {
  const newElement = document.createElement("div");
  newElement.className = containerElementClass;

  if (withMarginTop) {
    newElement.style.marginTop = "4px";
  }
  return newElement;
}

// Coalesce mutation bursts into at most one check per frame
let scheduled = false;
const scheduleEnsureWidget = () => {
  if (scheduled) {
    return;
  }
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    ensureWidget();
  });
};

new MutationObserver(scheduleEnsureWidget).observe(document.body, {
  childList: true,
  subtree: true,
});
ensureWidget();

chrome.runtime.onMessage.addListener((message: InitAction) => {
  if (message.type === "INIT") {
    ensureWidget();
  }
});
