import { legacyPrHeader, prHeader } from "./__fixtures__/prHeader";
import {
  findHeaderAnchor,
  findHeaderContainer,
  findPrBranches,
} from "./prHeader";

describe("findPrBranches", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("reads target and source from BranchName components", () => {
    document.body.innerHTML = prHeader();

    expect(findPrBranches()).toEqual({
      targetBranch: "develop",
      sourceBranch: "RD-13452_conanpackage_build_profile",
    });
  });

  test("falls back to the legacy commit-ref markup", () => {
    document.body.innerHTML = legacyPrHeader("main", "KOD-1_foo");

    expect(findPrBranches()).toEqual({
      targetBranch: "main",
      sourceBranch: "KOD-1_foo",
    });
  });

  test("returns null when no branches are found", () => {
    document.body.innerHTML = "<div>not a PR</div>";

    expect(findPrBranches()).toBeNull();
  });
});

describe("findHeaderAnchor", () => {
  test("uses the first child of the PageHeader description", () => {
    document.body.innerHTML = prHeader();

    const anchor = findHeaderAnchor();
    expect(anchor?.withMarginTop).toBe(true);
    expect(anchor?.anchorElement.parentElement?.className).toContain(
      "prc-PageHeader-Description"
    );
  });

  test("falls back to gh-header-meta without margin", () => {
    document.body.innerHTML = legacyPrHeader("main", "KOD-1_foo");

    const anchor = findHeaderAnchor();
    expect(anchor?.withMarginTop).toBe(false);
    expect(anchor?.anchorElement.className).toBe("gh-header-meta");
  });
});

describe("findHeaderContainer", () => {
  test("finds the PageHeader container", () => {
    document.body.innerHTML = prHeader();

    expect(findHeaderContainer()?.className).toContain(
      "prc-PageHeader-PageHeader"
    );
  });

  test("falls back to gh-header", () => {
    document.body.innerHTML = legacyPrHeader("main", "KOD-1_foo");

    expect(findHeaderContainer()?.className).toBe("gh-header");
  });
});
