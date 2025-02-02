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
  type: "INIT" | "FETCH_JIRA_ISSUE" | "LOAD_JIRA_PAGE";
}

export interface InitAction extends Action {
  type: "INIT";
}

export interface LoadJiraPageAction extends Action {
  type: "LOAD_JIRA_PAGE";
  jiraID: string;
}

export interface JiraAction extends Action {
  type: "FETCH_JIRA_ISSUE";
  jiraId: string;
}
