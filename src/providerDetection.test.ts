import { detectProvider } from "./shared.helpers";

describe("detectProvider", () => {
  it.each([
    "https://acme.atlassian.net",
    "https://acme.atlassian.net/jira/projects",
    "https://atlassian.net",
    "http://acme.atlassian.net",
  ])("recognizes Jira host: %s", (url) => {
    expect(detectProvider(url)).toBe("jira");
  });

  it.each([
    "https://linear.app",
    "https://linear.app/acme",
    "https://docs.linear.app",
  ])("recognizes Linear host: %s", (url) => {
    expect(detectProvider(url)).toBe("linear");
  });

  it.each([
    "https://atlassian.net.evil.com",
    "https://atlassian.net.attacker.com/jira",
    "https://phishylinear.app.evil.com",
    "https://evil-linear.app.com",
    "https://example.com",
    "https://github.com",
    "not a url",
    "",
  ])("rejects spoofed / unrelated URL: %s", (url) => {
    expect(detectProvider(url)).toBeNull();
  });
});
