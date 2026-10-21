import { TicketData } from "./types";

const LINEAR_GRAPHQL_ENDPOINT = "https://api.linear.app/graphql";

const QUERY = `query($team: String!, $number: Float!) {
  issues(filter: { team: { key: { eq: $team } }, number: { eq: $number } }, first: 1) {
    nodes { title identifier state { name } url }
  }
}`;

interface LinearIssueNode {
  title: string;
  identifier: string;
  state: { name: string };
  url: string;
}

interface LinearGraphqlResponse {
  data?: {
    issues?: { nodes: LinearIssueNode[] };
    viewer?: { id: string };
  };
  errors?: Array<{ message: string }>;
}

/**
 * Trivial round-trip to confirm a Linear API key is accepted.
 * Throws with a user-facing message on any failure.
 */
export const verifyLinearApiKey = async (apiKey: string): Promise<void> => {
  if (!apiKey) {
    throw new Error("Linear API key is required");
  }

  let response: Response;
  try {
    response = await fetch(LINEAR_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({ query: "query { viewer { id } }" }),
    });
  } catch (e) {
    throw new Error("Could not reach Linear. Check your network.");
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error("Linear rejected the API key");
  }
  if (!response.ok) {
    throw new Error(`Linear API key check failed (HTTP ${response.status})`);
  }

  const result = (await response.json()) as LinearGraphqlResponse;
  if (result.errors && result.errors.length > 0) {
    throw new Error(
      `Linear rejected the API key: ${result.errors
        .map((e) => e.message)
        .join("; ")}`
    );
  }
  if (!result.data?.viewer?.id) {
    throw new Error("Linear did not return a viewer for this API key");
  }
};

export const fetchLinearIssue = async (
  id: string,
  browseBaseUrl: string,
  apiKey: string
): Promise<TicketData> => {
  if (!apiKey) {
    throw new Error(
      "Linear API key not configured. Please set it in extension options."
    );
  }

  const match = id.match(/^([A-Z]+)-(\d+)$/i);
  if (!match) {
    throw new Error(`Invalid Linear identifier: ${id}`);
  }
  const teamKey = match[1].toUpperCase();
  const number = Number(match[2]);

  const response = await fetch(LINEAR_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
    body: JSON.stringify({
      query: QUERY,
      variables: { team: teamKey, number },
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = (await response.json()) as LinearGraphqlResponse;

  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors.map((e) => e.message).join("; "));
  }

  const node = result.data?.issues?.nodes?.[0];
  if (!node) {
    throw new Error(`Linear issue not found: ${id}`);
  }

  return {
    summary: node.title,
    status: node.state.name,
    browseUrl: node.url,
  };
};
