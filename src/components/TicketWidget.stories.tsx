import type { Meta, StoryObj } from "@storybook/react";
import TicketWidget from "./TicketWidget";

const meta = {
  title: "components/TicketWidget",
  component: TicketWidget,
} satisfies Meta<typeof TicketWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ticketId: "KOD-123",
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
    ticketId: "KOD-456",
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
    ticketId: "KOD-123",
    mockData: {
      data: null,
      error: null,
      loading: true,
    },
  },
};

export const Error: Story = {
  args: {
    ticketId: "KOD-123",
    mockData: {
      data: null,
      error: { name: "Error", message: "Failed to fetch data" },
      loading: false,
    },
  },
};

export const NoProviderUrl: Story = {
  args: {
    ticketId: "KOD-123",
    mockProviderUrl: {
      providerUrl: null,
      loading: false,
    },
  },
};
