# ERG Public CMS Repository Working Rules

## Mandatory Planning & Task Workbook

Before actionable work, load `C:/Users/VuongTran/.codex/skills/erg-task-planning/SKILL.md`, create a concrete plan, and synchronize the matching row in `Tất cả Task` of `D:/ERG/TASK/ERG_Task_Management_.xlsx`.

- Do not change source, run substantive audits or execute tests until the workbook update is saved.
- Preserve dirty worktrees and unrelated user changes.
- Stop if the canonical workbook is unavailable or locked; do not create another task source.
- Do not stage, commit, push, merge or deploy unless explicitly authorized.

## Canonical ownership

`erg` owns the public CMS, forum, editorial and marketing application. The completed `ERG-066` audit established `erg-system` as owner of operational LMS, LCMS, CRM and ELEARNING portal implementations. `erg-spring` owns backend behavior and REST/GraphQL contract publication. `elearning` is a frozen secondary/legacy frontend.

Do not copy operational portal features into this repository. Shared behavior must come from a pinned package or canonical contract with an explicit owner. Cross-repository changes must pass `bun run repository-drift:check` from `erg-system`.

## Contract change protocol

Follow `D:/ERG/erg-system/docs/architecture/cross-repo-contract-release-protocol.md`.

- Do not hand-copy backend DTOs, endpoint paths or GraphQL schemas into components.
- Keep API transport, domain mapping, query keys and UI presentation separated.
- Scope authenticated query/cache state by tenant and account; never persist secrets or authorization decisions as ordinary app cache.
- Breaking changes follow `add -> publish -> sync -> generate -> migrate -> deprecate -> observe -> remove`.
- Run repository lint, typecheck, tests and build for affected public CMS behavior before completion.
