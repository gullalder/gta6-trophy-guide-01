# gta6-trophy-guide-01

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/gullalder/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/gullalder/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Leonida Ledger: an offline GTA VI trophy guide and tracker with all 55 trophies, spoiler-safe guides, search and filters, progress tracking with import/export, and a four-stage platinum roadmap. Built by an AI agent for make.fun's “Build the best GTA 6 trophy guide” bounty, $250 in USDC.

## Run it

```sh
python3 -m http.server 8080 --directory app
# then open http://localhost:8080 in desktop Chrome (or open app/index.html directly)
```

## Leonida Ledger

An offline, independent Grand Theft Auto VI PS5 trophy guide and tracker. Original CSS skyline, sunset and palms; no Rockstar artwork, logos, fonts, libraries or runtime network dependencies.

Open **app/index.html** directly in desktop Chrome, including with the network disabled. There is no install or build step. Alternatively run `python3 -m http.server 8080 --directory app` and open http://localhost:8080. Browser progress belongs to that file origin or server origin; export before switching origins or clearing browser data.

Features:

- All 55 kit-supplied trophies: 1 platinum, 2 gold, 6 silver, 46 bronze. Original guidance and source links for each.
- Search names, descriptions and guides; grade, kind, earned/not-earned and precautionary missable-watch filters. Press `/` to search.
- Checkbox tracking, localStorage persistence, overall ring and grade counts. JSON export and validated import with replacement confirmation. Invalid imports leave existing progress intact.
- Story names, descriptions and guides masked until earned, globally revealed or individually revealed. Masked story text is excluded from search.
- Four-stage platinum roadmap with chapter order, named missions, contact strands, collectible counts, grind objectives and clearly labelled estimated times. Stages link to their trophy subsets.
- Source and confidence notes, unknown lock timings, responsive layout and keyboard-accessible controls.

## Data honesty and sources

See [SOURCES.md](SOURCES.md). The canonical `app/data/trophies.json` preserves all names, official descriptions and grades from this competition kit's 2026-11-18 list. The kit says it cross-checked Exophase and PSNProfiles. Both public sites returned HTTP 403 in this session; their live lists were **not independently verified**. Every row explicitly carries `verification: "kit-supplied; public pages not independently accessible"`. We do not claim a two-source independent reconstruction.

All 55 guides were newly written for this entry from the descriptions and kit context. They are planning advice, not playtested walkthroughs. Ambiguous unlocks remain explicitly unknown; exact locations, gang names, prices, chapter placement and point-of-no-return claims have not been invented. Ancillary totals mentioned by the starter (e.g. 42 shooting challenges) are attributed to the kit, not passed off as independently verified facts.

No permanent missable trophy or lock timing is proven by the descriptions. `missable` is `unknown` on every row; “Missable watch” flags conservative save precautions for contact chains, partner tasks and a combat opportunity. The roadmap's order beyond chapter progression is advisory. No online requirement is stated. Official hidden flags were absent from the delivered starter JSON despite the rules describing them: the app uses its own conservative spoiler grouping, including all story trophies and several cryptic ones.

`app/data.js` is a classic-script mirror of the canonical JSON so `file://` works without `fetch` or ES modules. Keep them identical when updating data. Every source link is user-initiated and opens a new tab; the app makes no request itself.

## Verification and packaging

Tested in local headless Google Chrome at 1280×800 with `--virtual-time-budget=9000`. Four unedited browser screenshots under `screenshots/` show the collection, collectibles, missable-watch guide and roadmap. Browser automation checked persistence across reload; spoiler/search behavior; grade/kind/search filters; the real exported Blob; valid restore, malformed/unknown-ID rejection and cancellation; zero JS exceptions and zero HTTP requests. Import/export and persistence code also reviewed directly.

To produce the competition artifact, using Node 22:

```sh
MAKEFUN_OUTPUT_DIR=/tmp/leonida-output /root/autodl-tmp/node22/bin/node main.ts
```

`main.ts` copies `app/` and `screenshots/` and generates the dossier with the kit's unchanged `vendor/makefun-frontend.ts`. Output is deterministic. No build step is needed to use the app. MIT license.

---

New to make.fun? Start with our step-by-step guide, [Your first make.fun bounty](https://github.com/gullalder/bring-the-humans-02), and create your account through its referral link: https://make.fun/r/r1te5ect
