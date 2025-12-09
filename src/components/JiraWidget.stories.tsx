import type { Meta, StoryObj } from "@storybook/react";
import JiraWidget from "./JiraWidget";
import { message } from "antd";

const meta = {
  title: "components/JiraWidget",
  component: JiraWidget,
} satisfies Meta<typeof JiraWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    jiraID: "JIRA-123",
    mockData: {
      data: {
        summary: "Sample Issue",
        status: "Open",
      },
      error: null,
      loading: false,
    },
  },
};

export const LongStoryShort: Story = {
  args: {
    jiraID: "JIRA-456",
    mockData: {
      data: {
        summary: "This is a long description and we want to see it trimmed",
        status: "Open",
      },
      error: null,
      loading: false,
    },
  },
};

export const Loading: Story = {
  args: {
    jiraID: "JIRA-123",
    mockData: {
      data: null,
      error: null,
      loading: true,
    },
  },
};

export const Error: Story = {
  args: {
    jiraID: "JIRA-123",
    mockData: {
      data: null,
      error: { name: "Error", message: "Failed to fetch data" },
      loading: false,
    },
  },
};

export const NoJiraUrl: Story = {
  args: {
    jiraID: "JIRA-123",
    mockJiraUrl: {
      jiraUrl: null,
      loading: false,
    },
  },
};
