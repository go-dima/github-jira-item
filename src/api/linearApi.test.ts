import { fetchLinearIssue } from "./linearApi";

describe("fetchLinearIssue", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  const mockFetchOk = (payload: unknown) => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(payload),
    }) as unknown as typeof fetch;
  };

  it("throws when API key is missing", async () => {
    await expect(
      fetchLinearIssue("ENG-123", "https://linear.app/acme", "")
    ).rejects.toThrow(/api key not configured/i);
  });

  it("throws when identifier is invalid", async () => {
    await expect(
      fetchLinearIssue("not-a-ticket", "https://linear.app/acme", "lin_api_xxx")
    ).rejects.toThrow(/invalid linear identifier/i);
  });

  it("throws when Linear returns no results", async () => {
    mockFetchOk({ data: { issues: { nodes: [] } } });

    await expect(
      fetchLinearIssue("ENG-999", "https://linear.app/acme", "lin_api_xxx")
    ).rejects.toThrow(/not found/i);
  });

  it("throws when GraphQL response has errors", async () => {
    mockFetchOk({ errors: [{ message: "Unauthorized" }] });

    await expect(
      fetchLinearIssue("ENG-1", "https://linear.app/acme", "lin_api_xxx")
    ).rejects.toThrow(/unauthorized/i);
  });

  it("throws when HTTP response is not ok", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: jest.fn(),
    }) as unknown as typeof fetch;

    await expect(
      fetchLinearIssue("ENG-1", "https://linear.app/acme", "lin_api_xxx")
    ).rejects.toThrow(/HTTP error/);
  });

  it("maps Linear response to TicketData", async () => {
    mockFetchOk({
      data: {
        issues: {
          nodes: [
            {
              title: "Hook up Linear",
              identifier: "ENG-123",
              state: { name: "In Progress" },
              url: "https://linear.app/acme/issue/ENG-123/hook-up-linear",
            },
          ],
        },
      },
    });

    const result = await fetchLinearIssue(
      "ENG-123",
      "https://linear.app/acme",
      "lin_api_xxx"
    );

    expect(result).toEqual({
      summary: "Hook up Linear",
      status: "In Progress",
      browseUrl: "https://linear.app/acme/issue/ENG-123/hook-up-linear",
    });
  });

  it("decomposes identifier into team key and number for the GraphQL query", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        data: {
          issues: {
            nodes: [
              {
                title: "x",
                identifier: "ENG-123",
                state: { name: "Open" },
                url: "https://linear.app/acme/issue/ENG-123",
              },
            ],
          },
        },
      }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await fetchLinearIssue("eng-123", "https://linear.app/acme", "lin_api_xxx");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.linear.app/graphql",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "lin_api_xxx" }),
      })
    );
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.variables).toEqual({ team: "ENG", number: 123 });
  });

  it("handles multi-letter team keys and large issue numbers", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        data: {
          issues: {
            nodes: [
              {
                title: "x",
                identifier: "ENGTEAM-99999",
                state: { name: "Open" },
                url: "https://linear.app/acme/issue/ENGTEAM-99999",
              },
            ],
          },
        },
      }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await fetchLinearIssue(
      "ENGTEAM-99999",
      "https://linear.app/acme",
      "lin_api_xxx"
    );

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.variables).toEqual({ team: "ENGTEAM", number: 99999 });
  });
});
