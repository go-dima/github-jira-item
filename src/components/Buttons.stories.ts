import type { Meta, StoryObj } from "@storybook/react";
import Buttons from "./Buttons";

const meta = {
  title: "components/Buttons",
  component: Buttons,
} satisfies Meta<typeof Buttons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    jiraID: "JIRA-123",
  },
};
