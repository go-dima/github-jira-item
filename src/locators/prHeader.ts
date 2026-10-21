export type PrBranches = {
  targetBranch: string;
  sourceBranch: string;
};

export type HeaderAnchor = {
  anchorElement: HTMLElement;
  withMarginTop: boolean;
};

// Newest GitHub UI first, older versions as fallbacks.
const BRANCH_SELECTORS = [
  '[data-component="BranchName"]',
  '[class*="PullRequestBranchName-module__branchName"]',
  '[class*="PullRequestHeaderSummary-module__truncateBranch"]',
  "span.commit-ref > a > span.css-truncate-target",
];

const ANCHOR_V2 = '[class*="prc-PageHeader-Description"]';
const ANCHOR_V1 = ".gh-header-meta";

const CONTAINER_V2 = '[class*="prc-PageHeader-PageHeader"]';
const CONTAINER_V1 = ".gh-header";

export const findPrBranches = (
  root: ParentNode = document
): PrBranches | null => {
  for (const selector of BRANCH_SELECTORS) {
    const names = Array.from(root.querySelectorAll(selector)).map(
      (element) => element.textContent?.trim() ?? ""
    );
    if (names.length === 0) continue;

    // The header can render twice (regular + sticky) - keep first instance of each
    const [targetBranch, sourceBranch] = names.filter(
      (name, index) => names.indexOf(name) === index
    );
    return sourceBranch ? { targetBranch, sourceBranch } : null;
  }

  return null;
};

export const findHeaderAnchor = (
  root: ParentNode = document
): HeaderAnchor | null => {
  const v2 = root.querySelector(ANCHOR_V2)?.children[0];
  if (v2) {
    return { anchorElement: v2 as HTMLElement, withMarginTop: true };
  }

  const v1 = root.querySelector<HTMLElement>(ANCHOR_V1);
  return v1 ? { anchorElement: v1, withMarginTop: false } : null;
};

export const findHeaderContainer = (
  root: ParentNode = document
): Element | null =>
  root.querySelector(CONTAINER_V2) ?? root.querySelector(CONTAINER_V1);
