# twa-marketplace-v2-design

UX mockups for the **TWA Cloud-Native Weather Data Marketplace (v2)**.

This repo holds **HTML mockups only** (deployed to GitHub Pages for customer preview). All specs, architecture, contracts, and sign-offs live in Confluence:

📄 **Canonical project docs:** [TWA Weather Data Marketplace v2 (Confluence)](https://minfyhelpdesk.atlassian.net/wiki/spaces/UED/pages/3797090305/TWA+Weather+Data+Marketplace+v2)

## Project snapshot
- **Shape:** full-stack · **Flow:** ux-first · **Repos:** ui + api + worker
- **Core:** subscription-based weather data marketplace; Data Product → many Ingestions (downloadable files); single shared platform; Bedrock NL catalog search.

## Layout
- `mockups/` — static HTML mockups (auto-deployed to GitHub Pages on push to `main`).
- `.github/workflows/pages.yml` — Pages auto-deploy.

## Stage

| Stage | Status |
|-------|--------|
| Discovery | ✅ 2026-05-28 |
| Design repo scaffolded | ✅ 2026-05-28 |
| UX approved | ⬜ Pending |
| Tech spec | ⬜ Pending |
| Backlog generated | ⬜ Pending |
| UI / API / worker / infra scaffolded | ⬜ Pending |

## Onboarding
1. Clone this repo (or any project repo).
2. Run `/minfy:status` for the live project view.

> 📌 Enable Pages once: Settings → Pages → Source: "GitHub Actions". Then every push to `mockups/` auto-deploys.
