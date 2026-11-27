# ERG Public CMS quality boundary

`D:/ERG/erg` is the canonical owner of the public CMS, editorial/news, forum and marketing surfaces. Operational LMS, LCMS, CRM and ELEARNING portals remain owned by `erg-system`; their feature implementations must not be copied here.

The auditable source is `config/public-cms-boundary.json`:

- `ownedScopes` records public CMS ownership.
- `routes` and `apiRoutes` pin representative App Router and gateway sources.
- `forbiddenOperationalScopes` prevents operational feature trees from drifting into this repository.
- `bundle` caps total client JavaScript and any single generated chunk after a production build.
- `smokePaths` probes `/`, `/tin-tuc` and `/robots.txt` against a started production server.

Local/release gate:

```bash
bun run verify:public-cms
bun run start -- --hostname 127.0.0.1
bun run smoke:public
```

CI runs the same commands in `.github/workflows/public-cms-quality.yml`. Backend behavior and contracts remain owned/published by `erg-spring`; public CMS code consumes them through its API gateway and service boundary.
