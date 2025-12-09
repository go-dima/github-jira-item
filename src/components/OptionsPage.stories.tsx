import type { Meta, StoryObj } from "@storybook/react";
import { OptionsPage } from "./OptionsPage";

const meta = {
  title: "components/OptionsPage",
  component: OptionsPage,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "light gray",
      values: [{ name: "light gray", value: "#f6f8fa" }],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "24px", minWidth: "450px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OptionsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    initialUrl: "",
    onSave: async (url: string) => {
      console.log("Saved:", url);
    },
  },
};

export const WithExistingUrl: Story = {
  args: {
    initialUrl: "https://mycompany.atlassian.net",
    onSave: async (url: string) => {
      console.log("Saved:", url);
    },
  },
};

export const SaveError: Story = {
  args: {
    initialUrl: "https://mycompany.atlassian.net",
    onSave: async () => {
      throw new Error("Network error");
    },
  },
};
