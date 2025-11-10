import { extractJiraId } from "./shared.helpers";

describe("extractJiraId", () => {
  // Define ticket format variations [format, expectedOutput, description]
  const ticketFormats: Array<[string, string, string]> = [
    ["tes-123", "TES-123", "dash separator"],
    ["wrk_100", "WRK-100", "underscore separator"],
    ["WRK-999", "WRK-999", "uppercase input"],
    ["test-111", "TEST-111", "lowercase input"],
    ["project-567", "PROJECT-567", "long prefix"],
    ["kod-123456789", "KOD-123456789", "very long number"],
    ["wrk-001", "WRK-001", "zero-padded number"],
  ];

  // Define branch pattern templates [patternFunction, description]
  const branchPatterns: Array<[(ticket: string) => string, string]> = [
    [(ticket) => `${ticket}_some-feature`, "in middle with underscore suffix"],
    [(ticket) => `${ticket}-description`, "in middle with dash suffix"],
    [(ticket) => `feature/${ticket}_work`, "with prefix path"],
    [(ticket) => ticket, "as standalone"],
    [(ticket) => `feature-branch-${ticket}`, "at end of branch"],
    [(ticket) => ` ${ticket} `, "with whitespace"],
    [(ticket) => `feature(${ticket})`, "with special characters"],
    [(ticket) => `${ticket}-ref-tes-200`, "with double ticket (dash)"],
    [(ticket) => `${ticket}-ref-tes_201`, "with double ticket (underscore)"],
  ];

  // Generate nested test cases: ticket formats × branch patterns
  const testCases: Array<[string, string, string]> = [];
  for (const [ticketFormat, expectedId, ticketDesc] of ticketFormats) {
    for (const [patternFn, patternDesc] of branchPatterns) {
      const input = patternFn(ticketFormat);
      testCases.push([input, expectedId, `${ticketDesc} ${patternDesc}`]);
    }
  }

  it.each(testCases)("extracts '%s' as %s (%s)", (input, expected) => {
    expect(extractJiraId(input)).toBe(expected);
  });

  // Invalid input cases
  it.each([
    ["no-ticket-here", "without Jira ID"],
    ["", "with empty string"],
    ["123-456", "with only numbers"],
    ["wrk-feature", "with letters and dash but no number"],
  ])("returns undefined for branch '%s' %s", (input) => {
    expect(extractJiraId(input)).toBeUndefined();
  });
});
