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
        isLoading: false,
        error: null,
      },
    },
  },
};

export const Loading: Story = {
  args: {
    jiraID: "JIRA-123",
    mockData: {
      loading: true,
    },
  },
};

export const Error: Story = {
  args: {
    jiraID: "JIRA-123",
    mockData: {
      error: { message: "Failed to fetch data" },
    },
  },
};
