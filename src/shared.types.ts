export interface Job {
  displayName: string;
  name: string;
  url: string;
  jobs?: Job[];
  builds?: { url: string }[];
}

export type ParsedUrl = {
  repoName: string;
  branchName: string;
  inPrPage: boolean;
};

export type PrBranches = {
  sourceBranch: string;
  targetBranch: string;
};

export interface JobWithMain extends Job {
  main: string;
}

interface Action {
  type: "INIT" | "FETCH_JIRA_ISSUE" | "FETCH_LINEAR_ISSUE";
}

export interface InitAction extends Action {
  type: "INIT";
}

export interface JiraAction extends Action {
  type: "FETCH_JIRA_ISSUE";
  ticketId: string;
}

export interface LinearAction extends Action {
  type: "FETCH_LINEAR_ISSUE";
  ticketId: string;
}

export type FetchTicketAction = JiraAction | LinearAction;
