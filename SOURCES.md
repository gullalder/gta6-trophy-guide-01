# Sources and verification record

Accessed 2026-11-20 during the recorded build.

1. **make.fun GTA VI trophy guide competition kit**, downloaded from https://make.fun/c/gta6-trophy-guide-01/kit. Canonical source used: `starter/app/data/trophies.json`, list dated 2026-11-18, plus `RULES.txt` (“The trophy list”). This supplied all 55 names, descriptions and grades. The rules assert the list agrees with both Exophase and PSNProfiles. Names/descriptions/grades were preserved; starter one-line guides were replaced with original prose.
2. **Exophase**, https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/ — direct fetch returned HTTP 403 / Cloudflare challenge. This is a source referenced by the kit, not an independently inspected live listing. No earn-rate claims are made.
3. **PSNProfiles**, https://psnprofiles.com/search/games?q=grand%20theft%20auto%20vi — direct fetch returned HTTP 403. The kit references its listing but no exact game-page URL was established here; the app honestly links to search.
4. Attempted https://www.powerpyx.com/gta-6-trophy-list-revealed/ returned a “Page not found” page. It supplied no data and no guide content. Not cited as evidence in the app.

No third-party guide text was copied or paraphrased from a consulted walkthrough. Guides are original inferences from the supplied official-description snapshot, with uncertainties stated. Each data row cites the kit and its two referenced public trackers and declares its verification limitation. Exact cryptic unlock methods and permanent missability are unverified; no invented claims fill those gaps.

The delivered starter JSON contains no official hidden/count fields, despite the rules describing them. Ancillary numbers present only in starter hints are attributed explicitly, and spoiler flags are editorial rather than claimed official hidden flags.
