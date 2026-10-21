// Trimmed from ottopia-tech/jenkins-shared-library PR #67 on 2026-10-21.
// The header renders twice on the real page (regular + sticky).
const header = (target: string, source: string) => /* html */ `
  <div class="prc-PageHeader-PageHeader-YLwBQ" data-component="PageHeader">
    <h1><span class="markdown-title">RD-13452 conanPackage: pass build profile to export-pkg</span></h1>
    <div class="prc-PageHeader-Description-w-ejP d-flex flex-column" data-component="PageHeader.Description">
      <div class="d-flex width-full flex-items-start gap-2">
        <a href="/dimag-otto">dimag-otto</a> wants to merge 2 commits into
        <div class="d-flex flex-items-center gap-1 branches__3hqMzX">
          <a href="/ottopia-tech/jenkins-shared-library/tree/${target}" class="branchName__a15saO prc-BranchName-BranchName-CMTaU" data-component="BranchName">${target}</a>
          <span>from </span>
          <div class="d-flex flex-items-center overflow-hidden gap-1">
            <a href="/ottopia-tech/jenkins-shared-library/tree/${source}" class="branchName__a15saO prc-BranchName-BranchName-CMTaU" data-component="BranchName">${source}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

export const prHeader = (
  target = "develop",
  source = "RD-13452_conanpackage_build_profile"
) => header(target, source) + header(target, source);

// Pre-2025 GitHub PR header.
export const legacyPrHeader = (target: string, source: string) => /* html */ `
  <div class="gh-header">
    <div class="gh-header-meta">
      <span class="commit-ref"><a><span class="css-truncate-target">${target}</span></a></span>
      <span class="commit-ref"><a><span class="css-truncate-target">${source}</span></a></span>
    </div>
  </div>
`;
