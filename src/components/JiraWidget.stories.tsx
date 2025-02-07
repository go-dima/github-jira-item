import type { Meta, StoryObj } from "@storybook/react";
import JiraWidget from "./JiraWidget";

const meta = {
  title: "components/JiraWidget",
  component: JiraWidget,
} satisfies Meta<typeof JiraWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    jiraID: "JIRA-123",
    port: {
      postMessage: () => {},
    },
    mockData: {
      data: {
        summary: "Sample Issue",
        isLoading: false,
        error: null,
      },
    },
  },
};
