# CHANGELOG

## Chunk 16 - Area boundary data, PART B2-2a (coverage flag; app change; version 0.17.0 -> 0.18.0)
Summary: First of two sub-parts of B2-2. Your decision 2 = YES: area files now declare whether they hold every area. A PARTIAL set can never produce OUTSIDE or NORMAL, also after a person confirms it. The comparison report (part C groundwork) is B2-2b and is NOT done here.
### Added / changed
- `models/areaset.ts`: area schema 2 (`AREA_SET_SCHEMA_VERSION = 2`, supported 1 and 2), `AREA_COVERAGES`, `AreaSetInfo.coverage` / `coverageAssumed`, `isPartialCoverage()`.
- `services/areas/loader.ts`: schema 2 REQUIRES `coverage` = exactly `"COMPLETE"` or `"PARTIAL"` (anything else refuses the whole file). Schema 1 still loads and is PARTIAL by assumption (never COMPLETE); a schema 1 file that carries `coverage` is refused.
- `calculations/alerts/engine.ts` + `models/alerts.ts`: new reason code `AREA_COVERAGE_PARTIAL`. REAL scope, PARTIAL set (not in ERROR state), position not inside a drawn area: status VERIFY, never OUTSIDE / NORMAL, also when CONFIRMED. INSIDE a drawn area is unchanged. DEMO scope, COMPLETE, an omitted coverage and an unreadable set are unchanged.
- `models/prediction.ts`, `calculations/prediction/predict.ts`, `hooks/usePrediction.ts`, `components/AlertsRunner.tsx`: the flag `areasPartial` is carried (context only; the geometry result is unchanged).
- Screens: import preview shows a Coverage row (declared / ASSUMED) and a PARTIAL COVERAGE notice, plus what the active version said; the map shows an AREA SET PARTIAL notice (also next to the confirmed notice) and the area information lists the coverage; the CURRENT AREA panel says "NOT INSIDE ANY DRAWN AREA - VERIFY" instead of OUTSIDE; the confirmed row says a confirmed set stays partial; the Regulation Center importer text explains coverage.
- `scripts/extract-imo-appendix7.py` now also writes `boundaries/candidates/IMO-APPVII-PARTIAL-closed-rings.candidate-2.json`: the same two rings, schemaVersion 2, version `candidate-2`, `coverage: "PARTIAL"`. Re-running the script on the supplied PDF (sha256 9102647b...) reproduced every existing file byte for byte. candidate-1 is kept unchanged.
- Version 0.18.0 (`models/version.ts`, `package.json`); `dist/` rebuilt (`npm run build:offline`, cache `eca-pilot-v0.18.0-...`).
### Tests
- `npm test` 396 / 396 (381 + 15 new: 10 in `tests/areas.ts`, 5 in `tests/boundaries.ts`). Two existing tests were changed on purpose: the "schema 2 is refused" case now uses schema 3, and the candidates folder now lists two files. The DOCUMENTED HAZARD test still pins that the GEOMETRY layer says OUTSIDE off Los Angeles; the new tests pin that the ALERT layer never does. Mutation check: switching the engine rule off fails 2 tests.
- Smoke: boundaries 37 (was 20; imports candidate-1 then candidate-2), areas 56 (was 41; files are now schema 2 / COMPLETE, last section covers refusals, schema 1, a declared PARTIAL file and a CONFIRMED partial test file), log 86 (two hardcoded `0.17.0` checks now follow `package.json`), all others unchanged: versions 63, map 27, geo 10, regulations 9, calculator 12, sox 21, noxpm 30, port 42, prediction 47, gps 33, alerts 67, offline 41, subpath 19, a11y 37, wording 16, vessel (no counter, 0 console errors).
### Not changed / limits
- The app cannot check what a file declares: a file that wrongly says COMPLETE is believed. The flag is a declaration that a person must read before confirming.
- Nothing was closed, no coordinate was added, no real file was confirmed in any test. The test that confirms a file uses a synthetic TEST file.
- The `.tsx` files were checked by esbuild only (no React types in the sandbox); the official `npm run build` has still never run.

## Chunk 16 - Area boundary data, PART B2-1 (China source data + tests; NO app code change; version stays 0.17.0)
Summary: Second sub-part of part B. Your decisions applied: (1) open arcs stay OUT, no closure was built (option C); (3) the Chinese coastal and Hainan tables were extracted. Decision 2 (coverage flag) was left unanswered, so the app part of B2 (schema 2, alert reason code, map notice) was NOT built.
### Build
- No file under `src/` changed (checked by file hash against the uploaded B1 ZIP: `src/`, `dist/`, `package.json` identical), so `dist/`, the cache name and the version are unchanged.
### Added
- `scripts/extract-china-tec1171.py`: reads `9. ClassNK Tech Info TEC-1171.pdf` with `pdftotext -layout`; one strict entry pattern (number, longitude, latitude, two table columns per text line, seconds with 2, 1 or 0 decimals); stops and writes nothing on any unexplained part of a line with a degree sign; Table 2 labels must be exactly A1 to A3 and 33 to 49; the prose of point 60 must match three exact lines; Table 3 rows (B1 to B8) are counted and listed, not converted. It also re-reads the PDF with `pdftotext -raw` (a different text order) and compares.
- `boundaries/source-data/china-tec1171.points.json` (Table 1: 59 points; Table 2: 20 points; printed text, decimals, text line; point 60 recorded as prose), `boundaries/source/china-tec1171.coordinate-lines.txt` (raw lines, with the point-60 prose and the Table 3 rows), `boundaries/crosscheck-china.json`.
- `tests/boundaries.ts`: 6 new unit tests (counts and labels; every decimal re-derived by a second parser; every point on its raw line; the -raw reading and the Table 1 / Table 2 overlap agree; both tables open and no China outline in any importable file; the east / north assumption written down and Table 3 listed as not extracted).
### Findings
- The text says the coastal area is enclosed by 60 coordinates, but point 60 is a prose description (a river waterway), not a coordinate. Only 59 are coordinates.
- No hemisphere letters are printed. East / north are assumed and written into the data, the cross-check and the docs.
- Table 2 points 33 to 49 are identical to Table 1 points 33 to 49 (17 compared).
- Neither table is closed by the publisher. Both need the coast as the missing edge, as with the Pacific and Atlantic arcs. Nothing was closed.
### Test status
- `npm test` 381 / 381 (375 + 6). `node tests/smoke-boundaries.mjs` 20 / 20 against the unchanged `dist/`. The other smoke tests were not re-run (no app code changed).

## Chunk 16 - Area boundary data, PART B1 (data + tooling + tests; NO app code change; version stays 0.17.0)
Summary: First half of part B. The coordinates of the IMO Appendix VII tables were read BY A SCRIPT from the printout you supplied (`3. North American & US Caribbean Sea ECA.pdf`), never typed and never taken from memory. Only the two outlines the publisher closes itself are importable (Hawaiian Islands part of the North American ECA; United States Caribbean Sea ECA). The Pacific and Atlantic/Gulf tables are open arcs with no inshore edge: they are kept as source data, and nothing was invented to close them. Part B2 and part C are NOT done.
### Build
- No file under `src/` changed, so `dist/` (`app.js` 894,450 bytes), `dist/sw.js`, the cache name and the version are unchanged. `npm install` / `npm run build` were not run (no network, as before).
### Added
- `scripts/extract-imo-appendix7.py`: reads the text with `pdftotext -layout`, accepts a line as a coordinate only if it matches ONE strict pattern, stops with an error (writing nothing) if any line with a degree sign does not match, if there are not exactly 8 tables, or if a table is not introduced by the expected sea area. Exact DMS arithmetic (Fraction), 7 decimals.
- `boundaries/` (see `boundaries/README.md`): the importable candidate `candidates/IMO-APPVII-PARTIAL-closed-rings.candidate-1.json` (2 areas, 45 and 55 points); `source-data/imo-appendix-vii.points.json` (all 8 tables, printed text + decimals + text line); `source/imo-appendix-vii.coordinate-lines.txt` (the raw lines, with the PDF sha256); `crosscheck.json`.
- Findings (all in `boundaries/README.md`): the NOx and SOx copies of every table are identical (706 points compared); Pacific (47) and Atlantic/Gulf (206) are open arcs; Hawaii (45) and Caribbean (55) are closed by the publisher; the IMO's Caribbean numbering is irregular (44 printed twice at two different positions, 49 missing) and is kept in printed order; geodesic lines in the text versus straight lines in the app; the only date in the printout is the 2016/08/29 print date.
- `tests/boundaries.ts` (12 unit tests, registered in `tests/run.ts`): table and point counts; every decimal re-derived from the printed text by a second independent parser; every point found on its raw text line; NOx = SOx; open versus closed rings; the Caribbean irregularity recorded; the candidate accepted by the app's strict loader; candidate coordinates equal the source in printed order as [lon, lat]; the candidate says PARTIAL in the set id, source, area names and notes; import path (READY, stored, not active, second import refused); geometry probes; and a pinned DOCUMENTED HAZARD test. Mutation-checked: a corrupted candidate coordinate and a corrupted source decimal were each caught.
- `tests/smoke-boundaries.mjs` (20 checks, port 4192): imports the real candidate through the Regulation Center, checks preview / store / not active / activate / two shapes with the PARTIAL SET names / source hash shown / UNVERIFIED gives VERIFY for a position in Hawaii and for one off the US mainland (never INSIDE ECA, never NORMAL) / no verdict wording / Confirmed: NO stays eight / no external request / no console error. It does not tick the confirmation box.
### Changed
- Docs only: `PROJECT_CHECKPOINT.md` (new Known Issue 5a, test status, next step with the open decisions), `docs/CHUNK_PLAN.md`, `README.md`, new `NEXT_CHUNK_PROMPT.md`.
### Known hazard (also Known Issue 5a)
- With the partial candidate alone, a position off the US mainland is evaluated OUTSIDE, which is wrong for the publisher's North American area. While the set is UNVERIFIED the alert stays VERIFY. If a person confirms it, that protection is gone, because the confirmation statement says nothing about missing areas. Do not confirm the candidate for operational use. Part B2 proposes a coverage flag.
### Test status
- `npm test` 375 / 375 (363 + 12). `node tests/smoke-boundaries.mjs` 20 / 20 against the unchanged `dist/`. The older smoke tests were not re-run in B1 because no app code changed.

## Chunk 16 - Area boundary import, PART A only (v0.17.0)
Summary: PARTIAL chunk. Part A (the import of area boundaries from a user-supplied file, with a verification step) is built and tested. Part B (a candidate boundary file prepared from the IMO text) and part C (a comparison report against the IMO text and the Marine Regions shapefile) were NOT done: no coordinates were researched or typed in, so the app still ships with no real boundary and no boundary file has been checked against a real source.
### Build
- `npm install` was not run (no network in the sandbox) and `npm run build` was NOT run; `npm run build:offline` was used and passes. `dist/assets/app.js` is 894,450 bytes (882,300 in 0.16.0, +12,150). The `.ts` files pass a strict type check (only missing `@types/node` / `@types/react` declarations are reported, 45 messages, all TS2591 or TS7016); the `.tsx` files have still never been checked against real React types.
### Added
- Area boundary file (schemaVersion 1; `src/models/areaset.ts`, `src/services/areas/loader.ts`): `setId`, `version`, `publicationDate`, `isDemo`, `source { name, reference, url | null, retrievedDate }` and a list of areas, each with `id`, `name`, `type`, its own `sourceReference` and `sourceDate`, optional `notes` (shown verbatim, never parsed) and a GeoJSON `Polygon` / `MultiPolygon` (positions `[lon, lat]`). Every area goes through the same strict geometry parser as the DEMO areas. Unknown fields, future dates, duplicate ids and an empty list are refused.
- NO partial import for boundaries: one bad area refuses the whole file and the message names the area (at most 12 problems listed, the rest counted). Reason: a set with a missing area could make a vessel look outside an area it is inside. Regulation and port imports still accept a partial import (explicit checkbox). OPEN QUESTION for you: do you want a partial import for boundaries too?
- New version kind `AREAS` in the update center (`versions:AREAS:index`, `versions:AREAS:v:<setId@version>`, same immutable-version rules, activation history, Activate / Roll back / confirmed Remove, and a diff of ids, source dates and a changed-outline flag). Files over 1,000,000 characters are refused (`FILE_TOO_LARGE`), as for the other kinds.
- Verification (`src/services/areas/confirmations.ts`, key `areas:confirmations`, append-only): an imported set is UNVERIFIED until a named person ticks the fixed statement ("I compared the outlines in this file with the publisher's text and found no difference.") and the app records the name, the time and the statement for that exact version (`setId@version`). A new version starts UNVERIFIED again, a rollback returns to the version that was confirmed, and a file can never confirm itself. The app cannot check the claim and the UI says so. The statement wording is an UNCONFIRMED PROPOSAL.
- `tests/areas.ts` (19 unit tests) and `tests/smoke-areas.mjs` (41 checks, port 4191): refusals, preview, store, activate, UNVERIFIED giving VERIFY, confirmation, a new version with a diff, rollback, reload, remove.
### Changed
- REAL scope uses the boundaries of the active imported set. With unverified or unreadable boundaries the alert status is VERIFY and never INSIDE ECA (reason codes `AREA_DATA_UNVERIFIED`, `AREA_DATA_UNREADABLE`); the prediction panels carry the tag "VERIFY (AREA BOUNDARIES UNVERIFIED)"; the map draws imported areas with an UNVERIFIED or confirmed notice and shows source, set and verification when an area is tapped. With no active set, REAL scope still says `NO_AREA_DATA`. DEMO scope ignores imported areas.
- Not changed on purpose: the SOx, NOx and PM panels read only bundled data in REAL scope, so imported boundaries do not feed them. Their note (`sox-real-gap`, `noxpm-real-gap`) said "area geometry cannot be imported yet", which was no longer true; it now says that these panels do not use imported data and which parts do.
- `src/data/bundledAreas.ts`: comment brought up to date (`BUNDLED_PRODUCTION_AREAS` is still `null`).
- `PROJECT_CHECKPOINT.md`: the "Features Not Completed" line listed "Chunks 14-15" although both are complete; removed. New limitations 28 to 30 (boundary design points, test coverage gap, behaviour not examined); limitation 5 rewritten; open question (a) marked answered and three new ones added.
- `APP_VERSION` 0.16.0 to 0.17.0 (also `package.json`); `CURRENT_CHUNK` "15" to "16". The Settings count of "Confirmed: NO" lines stays EIGHT: the boundary design points are listed in `PROJECT_CHECKPOINT.md` but have no Settings panel yet.
### Fixed (tests)
- `tests/smoke-offline.mjs` had two stale `0.16.0` literals (cache name pattern, "App version" in the PDF) and failed 2 of 41 checks after the version bump; `tests/smoke-log.mjs` held a `0.17.0` literal. All three now read the version from `package.json`, so a version bump no longer breaks them. `tests/smoke-versions.mjs` already had the new wording for the import notice and passes 63 of 63.
### Results after the last build
- `npm test`: 363 of 363. Smoke tests: areas 41, versions 63, map 27, geo 10, regulations 9, calculator 12, sox 21, noxpm 30, port 42, prediction 47, gps 33, log 86, alerts 67, offline 41, subpath 19, a11y 37, wording 16, vessel (prints no counter, 0 console errors).
### NOT done
- Part B: no candidate boundary file; which areas are in force today was not checked. Part C: no comparison report. Neither depends on code; both depend on finding the IMO coordinate text, and coordinates must not be typed from memory.
- The a11y and wording smoke tests only see the Regulation Center with nothing imported: they do NOT cover the confirmation box, the UNVERIFIED tags or the map notice (those have only the verdict check inside `smoke-areas`). No keyboard, contrast or 320 px check was made for them.
- Imported boundaries have only been tried with fictional TEST files. A real outline has never been loaded, so real file sizes against the 1,000,000-character cap are unknown.

## Chunk 15 - Final QA / production hardening (v0.16.0)
Summary: no new feature. A wording audit, an accessibility and small-screen pass, error-handling review, release-readiness tests (sub-path, same-version update), a data-safety review and the release documents. Two real defects were found by the new tests and fixed (keyboard focus was lost in three places; the erase confirmation did not say the offline copy stays). Everything else the audit looked at passed.
### Build
- `npm install` returned 403 again (tried once, first). `npm run build` was NOT run; `npm run build:offline` was used and passes. The `.tsx` files (including this chunk's two edited components) have still never been checked against real React types.
### Added
- `tests/smoke-wording.mjs` (16 checks, port 4188): reads all 9 routes (with every closed section opened), the "All screens" sheet, the vessel form with an added engine, the calculator with and without a result, the log screen with an entry and its export notice, the PDF text (poppler) and the CSV. Ban list: `complian`, `required fuel`, `permitted`, `must change`, `you must`, `tier iii` plus the VERDICT pattern of the other smoke tests. EXACTLY ONE sentence is excluded (the app disclaimer, read from `src/models/disclaimer.ts`); the test also checks that the log export notice and the PDF repeat it verbatim. Every other hit is printed (`HIT` lines) and must be on a reviewed list inside the test; an unreviewed hit fails.
- `tests/smoke-a11y.mjs` (37 checks, port 4189): control names, Tab reach, focus handling, the update notice by keyboard (with a simulated newer worker), contrast computed from the real styles, sideways scroll at 390 px and 320 px. It does not show WCAG conformance.
- `tests/smoke-subpath.mjs` (19 checks, port 4190): `dist/` served under `/eca/` (worker scope, cache, manifest, icons, offline with the server's files gone, PDF); then a build B made by the real `make-sw` step with the SAME version and one changed file is found, waits, and installs only after "Reload now".
- `docs/RELEASE_CHECKLIST.md`: what was tested, what was not, placeholders and what only you can supply, steps before use on board, data-safety summary.
- README "Deploy" section (HTTPS, `sw.js` caching, sub-path, updates).
### Changed
- Wording audit result: 11 hits (6 different sentences, 3 kinds), all read, none is a verdict, so NO wording was changed: the Changeover Calculator lead ("it is not a compliance statement"), the Vessel Profile completeness notes ("NOx compliance evidence cannot be confirmed"), and the engine tier choice "Tier III". They are listed as reviewed in the test. Elsewhere in the 9 routes, the log export notice, the PDF and the CSV nothing else hit.
- Accessibility defects fixed (found by the new test, three failures before): (1) the safety notice did not take keyboard focus and focus fell to `<body>` after "I understand"; now the button is focused and the screen content (`main`) receives focus afterwards. (2) After a route change focus stayed on the clicked link or fell to `<body>`; now `main` receives focus (`AppShell`, `preventScroll`). (3) The "All screens" sheet did not take focus, did not close on Escape and lost focus when closed; now it takes focus, Escape closes it, and focus returns to the More button (a screen chosen in the sheet moves focus to the new screen). `main` and the sheet get no focus ring because they are focused by code only.
- Settings: one sentence under LOCAL STORAGE ("kept only in this browser on this device. There is no backup ... it is gone") and one in the erase confirmation ("The offline copy of the app itself ... is not erased; the safety notice will be shown again").
- `tests/smoke-offline.mjs`: 35 to 41 checks (step 10: erase while offline); version expectation 0.16.0. `tests/smoke-log.mjs`: version expectation 0.16.0.
- `APP_VERSION` 0.15.0 to 0.16.0 (also `package.json`); `CURRENT_CHUNK` "14" to "15". Not 1.0.0 (your decision).
- `PROJECT_CHECKPOINT.md`: the limitations are now ONE numbered list of 27 items (the old list had grown to numbers like `0000000.`); `ARCHITECTURE.md` points to it instead of repeating limitations. `docs/CHUNK_PLAN.md` updated.
### Reviewed, nothing changed
- Error boundary: none exists. Proposal (not built, needs your yes) in `ARCHITECTURE.md`.
- "Erase all local data": removes every key with the prefix `eca-pilot:` (profile, log, imported versions, acknowledgement); the offline cache stays. Shown by `smoke-offline` step 10.
- Placeholders found: icons, manifest names, disclaimer text, 14 `example.invalid` URLs in the DEMO data, no licence file. Listed in `docs/RELEASE_CHECKLIST.md`.
### Known points
- Size: `dist/assets/app.js` is 882,300 bytes (gzip 318,917, default level), up from 881,288 in 14 because of the two focus fixes. The `pdf-lib` lazy-chunk idea was NOT done.
- Not checked: the official build, other browsers, real phones, home-screen install, a real host or HTTPS, screen readers, zoom / large text, colour-vision differences, real storage exhaustion (fakes only), contrast of the map's SVG text and of error-only messages.
- Deleted: `NEXT_CHUNK_PROMPT.md` (consumed). No new one: no open question was answered. Unanswered: area-boundary import as its own chunk (asked 7 times); IndexedDB (with the three decisions); the error boundary; the version number for a first release.

## Chunk 14 - Offline-first hardening (v0.15.0)
Summary: audit first (`docs/OFFLINE_AUDIT.md`), then only what the audit showed. The service worker now precaches EVERY built file (so Download PDF works on a first-ever offline use), updates wait for the user, storage failures reach the screens as readable `StorageError`s everywhere, Settings shows what is really cached and stored, and a Playwright test switches the browser offline and finally shuts the server down.
### Added
- `public/sw.js` is now a TEMPLATE; `scripts/make-sw.mjs` (run by `npm run build` after `vite build`, and by `build:offline`) writes `dist/sw.js` with the cache name `eca-pilot-v<APP_VERSION>-<8 hex fingerprint of the built files>` and the precache list = every file in `dist/` except `sw.js` and `.map` files. `scripts/sw-lib.mjs` holds the pure parts (`cacheName`, `fingerprint`, `precacheUrls`, `renderSw`) with `sw-lib.d.mts`. An unbuilt template (for example `vite dev`) unregisters itself.
- Worker behaviour: precached files cache-first; navigation to the app falls back to the cached `index.html`; every other request is left alone and never stored; old `eca-pilot-*` caches are deleted on activate; install is all-or-nothing and does NOT call `skipWaiting`.
- Update notice: `services/pwa/register.ts` tracks a waiting worker (only when a worker already controls the page), `hooks/useUpdateReady.ts`, `components/UpdateNotice.tsx` in `AppShell`: "A new version of this app is ready. Reload to use it." with a "Reload now" button. Only the button sends SKIP_WAITING, then the page reloads once. A check for a new `sw.js` also runs when the device comes back online.
- Settings: "Offline copy" row (read from the browser's Cache Storage: cache name and file count, `services/pwa/offlineCopy.ts`), "Approximate size of stored data" row (items and characters of this app's own keys, `KeyValueStore.usage()`), and a sentence saying remaining space cannot be measured. No claim about free space. No new design points panel, so the Settings count stays EIGHT and no smoke test count changed.
- `tests/pwa.ts` (13 unit tests, 331 to 344): cache name, fingerprint, precache list, template filling and content (no fixed name, no `skipWaiting` in install, no other site), version match, offline-copy reader, storage usage, FULL vs BLOCKED errors, blocked read / remove / keys / clear / usage, corrupt vs unsupported codes, quota detection, `createStore` fallback rules.
- `tests/smoke-offline.mjs` (35 checks, port 4187): first visit online (worker takes control, cache holds every built file, `app.js` byte for byte), reload with the browser offline, all 9 routes, log add / edit / CSV / PDF (read back with `pdftotext`), Regulation Center import, Settings rows, no app request to the server in the offline phase (only the browser's own `sw.js` check is possible), 0 external requests, an update that waits (page not reloaded, new worker waiting, both caches present), Reload button, old cache deleted, stored log kept, then the server is shut down and the app still opens with its data, 0 console errors.
- `docs/OFFLINE_AUDIT.md`.
### Changed
- Storage audit and fixes (`services/storage/storage.ts`): (1) `get`, `remove`, `keys`, `clear` threw a raw browser error when storage was blocked; they now throw `StorageError` with code `BLOCKED` and a readable message. (2) `set` tells FULL (quota) from BLOCKED; a failed write leaves the old value (tested). (3) `createStore` treated a FULL but readable storage as blocked and silently used memory, which would have hidden the saved data; it now keeps `localStorage` when it can be read and holds data of this app, and falls back to memory only when reading is blocked, or writing fails and the app has nothing stored. (4) `StorageError` has a `code` (`FULL`, `BLOCKED`, `CORRUPT`, `UNSUPPORTED_FORMAT`). (5) `discardVesselProfile` no longer throws into the screen: it returns `{ ok, message }` and the Vessel Profile screen shows "NOT DISCARDED: ..." on failure. Checked and already fine: disclaimer (`useStored`), vessel profile save / load, log store (`STORAGE` code), version store (messages shown through `describeError`), Settings erase.
- `KeyValueStore` has a new method `usage()`; the two test doubles (`tests/logstore.ts`, `tests/profile.ts`) were updated.
- `build` script: `tsc --noEmit && vite build && node scripts/make-sw.mjs`.
- `APP_VERSION` 0.14.1 to 0.15.0 (also `package.json`, and the `app_version` / PDF text expectation in `tests/smoke-log.mjs`); `CURRENT_CHUNK` "13" to "14".
- Two strict type errors in `tests/log.ts` (a cast at line 131, `Array.prototype.at` at line 166 with `lib: ES2020`) were fixed; they would have stopped `tsc --noEmit` in the official build. Test code only.
### Known points
- `dist/assets/app.js` is now 881,288 bytes (gzip 318,590), up from 877,353 (gzip 317,559) in 13C. Because every built file is precached now, `pdf-lib` could become a lazy chunk without losing offline use; that was NOT done (not asked, and the esbuild fallback build does not split).
- The official `npm install` returned 403 again (tried once, first). `npm run build` was NOT run. `build:offline` passes. Plain `tsc` here only reports the missing `vite/client` and `node` type packages, so a temporary config was used: no error in the new non-React code; what remains is the noise from missing `@types/react` / `@types/node`.
- Same version, different files: the fingerprint changes the cache name, so a rebuild always installs as an update. Bump the version for every release anyway.
- IndexedDB: proposed only, NOT built, NOT migrated (see `ARCHITECTURE.md`). Needs your answer.
- Not checked: other browsers, real phones, home-screen install, Vite build output, hosting under a sub-path, real storage exhaustion (only fakes), how long browsers keep the cache.

## Chunk 13C - Changeover log: PDF export (v0.14.1)
Summary: you decided "make it pdf" (XLSX not wanted). The log screen now has "Download PDF" next to "Download CSV". CSV and PDF are the only export formats; XLSX is not built. Nothing in 13A / 13B changed except the export wording and the version.
### Added
- Dependency `pdf-lib` ^1.17.1 (MIT) in `package.json`. `npm install` returns 403 here, so in this session it was resolved from the global copy (1.17.1) by `build:offline` and a session-only symlink; on your machine run `npm install` first. No lockfile exists in the project.
- `src/services/log/pdf.ts`: `buildPdf(entries, meta)`: A4 portrait, built-in Helvetica (no remote fonts, no network). Header block (app, version, export time UTC, entry count, DEMO / MOCK flag, UTC note, damaged entries NOT included if any, the export notice = the app disclaimer verbatim), then one block per entry with the same fields and wording as the entry cards ("not entered" for a missing value, a real 0 stays 0), the app context with its labels and the DEMO / MOCK note, a page footer "Page n of N ... not an official record". PDF metadata: title, creator, producer = app name and version, creation / modification date = the export time.
- Characters the built-in font cannot draw (for example Japanese): each becomes `?`, and the PDF says how many ("N characters in this file could not be drawn ... The CSV export keeps the exact text"). This is the ONLY change made to your text in the PDF (the CSV's formula apostrophe guard does not apply to a PDF). The screen says so before you download.
- `services/log/download.ts`: `preparePdfExport` (reads the STORED log, newest first, writes nothing), `downloadPdf`, `exportFileName(ms, "pdf")` (`changeover-log-YYYYMMDDTHHMMSSZ.pdf`, UTC stamp only); the Blob / object URL / anchor helper is shared with the CSV. Damaged stored entries are counted, left out and named in the PDF header and the screen note. The Download buttons are disabled while the stored log is unreadable.
- Tests: `tests/logpdf.ts`, 13 new unit tests (318 to 331): sanitizer, wrapping, entry rows, a valid PDF whose page text is read back (stream inflated), notice verbatim and no other compliance wording, DEMO / MOCK flags, empty log, 40 entries over several pages with page numbers, 2000-character words, undrawable characters, damaged entries, export from storage with no write. `tests/smoke-log.mjs`: 69 to 86 checks; the PDF is downloaded in the browser and read back with poppler (`pdfinfo`, `pdftotext`, both needed to run that smoke test).
### Changed
- `APP_VERSION` 0.14.0 to 0.14.1 (also `package.json`); `CURRENT_CHUNK` stays "13". `tests/smoke-log.mjs` expects the CSV header `app_version` 0.14.1 and no longer asserts that no PDF button exists.
- `LOG_DESIGN_POINTS` "Export" text now names CSV and PDF (still UNCONFIRMED PROPOSAL, still `confirmed: false`; the Settings count stays EIGHT).
### Known points
- Bundle size: `dist/assets/app.js` grew from 439,970 to 877,353 bytes (gzip 135,009 to 317,559) because `pdf-lib` is bundled statically. It is static, not a lazy chunk, on purpose: a lazy chunk would not be in the offline cache until first used. Chunk 14 (service worker) must precache it as part of the app shell.
- The PDF has no embedded font, so non-Latin text is replaced (see above). Embedding a font would need `@pdf-lib/fontkit` plus a font file; not done, not asked.
- Checked: poppler reads the PDF (text, A4, metadata) and the layout was looked at as an image. Not checked: other PDF viewers, printing.
- The official `npm install` / `npm run build` is still unverified (403).

## Chunk 13 - Changeover log: persistence, screen, CSV download (v0.14.0)
Summary: Chunk 13B wired the 13A log layer into the app. `#/log` is now a real screen: add / edit / delete (with confirmation) entries, a newest-first list in UTC, an optional pre-fill from the live values, a damaged-entry panel and a CSV download made on the device. CSV is the ONLY export format; XLSX and PDF are NOT built (decision open, see below). The 13A layer was not changed.
### Added
- `src/services/log/logStore.ts`: `loadLog`, `addEntry`, `editEntry`, `removeEntry` (needs `{ confirmed: true }`), `removeDamagedEntries` (needs `{ confirmed: true }`). Key `changeover-log` through `store` only; the whole log is written on every change; every operation re-reads the stored log first and runs one at a time. Unreadable (corrupt / wrong version) = `UNREADABLE`, nothing written; damaged entries present = `DAMAGED_PRESENT`, nothing written (the stored text stays byte-for-byte unchanged until a confirmed removal); full / blocked storage = `STORAGE` with the readable `StorageError` text; a refused operation (invalid, duplicate id, full log, unknown id, not confirmed) writes nothing. Ids and times come from the screen, never from this layer.
- `src/services/log/form.ts` (pure): typed text to entry. Times are typed in UTC (`2026-10-04 13:05`, seconds optional, optional `UTC` / `Z`, real calendar dates only, any other zone refused); decimals accept a decimal comma; a blank field is `null`, a typed `0` stays `0`, junk text is an error (never 0). Messages are placed next to the field they belong to. `entryToForm` for editing.
- `src/services/log/prefill.ts` (pure): runs ONLY when the user presses "Pre-fill from live values". Fills EMPTY fields only (quantity + unit, sulphur high, sulphur low, from the Changeover screen's session inputs), names them in `appContext.prefilled`, marks each as "Pre-filled from the live values (editable)", and captures the context as displayed: predicted latest start, status shown, scope DEMO | REAL, labels DEMO / MOCK / DERIVED / VERIFY (same meaning as the prediction panels). Editing a pre-filled value removes its mark and its name; "Undo pre-fill" clears the still-pre-filled fields and the context. Nothing is pre-filled otherwise and no position is copied.
- `src/services/log/download.ts`: `prepareCsvExport` (reads the STORED log, newest first, `buildCsv`), `exportFileName` (`changeover-log-YYYYMMDDTHHMMSSZ.csv`: a UTC stamp only, no vessel name, no invented identifier), `downloadCsv` (Blob + object URL + anchor, no network).
- `src/hooks/useLog.ts`, `src/screens/ChangeoverLog.tsx` (replaces the placeholder; `chunk: null` in `routes.ts`). Settings: panel CHANGEOVER LOG DESIGN POINTS - UNCONFIRMED PROPOSAL with `Confirmed: NO` (`LOG_DESIGN_POINTS`, still `confirmed: false`): Settings now shows EIGHT "Confirmed: NO" lines.
- Tests: `tests/logstore.ts`, 24 new unit tests (294 to 318): store round trip, corrupt value, wrong version, damaged entries never written back, full / blocked storage, no write on a refused operation, concurrent operations, form conversion, pre-fill, export preparation and file name. `tests/smoke-log.mjs` (port 4186, 69 checks): add / edit / delete with confirmation, reload keeps entries, validation messages and no write on failure, pre-fill with DEMO + MOCK context, the downloaded CSV (file name, header block, column row, quoting of comma / quote / newline, formula guard, empty not 0, UTC), a damaged stored entry shown and not rewritten, a corrupt value, Settings count, no compliance wording, 0 console errors, no external requests.
### Changed
- `APP_VERSION` 0.13.0 to 0.14.0 (also `package.json`); `CURRENT_CHUNK` "12" to "13".
- Tests that legitimately change: the "Confirmed: NO" count 7 to 8 in `tests/smoke-{gps,noxpm,port,prediction,versions,alerts}.mjs` (assertion and description text only, no check weakened); the route test in `tests/run.ts` now lists `log` among the implemented screens. No other existing test changed.
### Decisions made in 13B (tell me if you want them different)
- The downloaded file starts with a UTF-8 byte-order mark so spreadsheet programs read non-ASCII text correctly. It is added to the download only; `buildCsv` and its text are unchanged.
- The pre-fill rounds the predicted latest start to whole milliseconds (the engine's instant can carry a fraction; the validator, correctly, accepts whole milliseconds only). Found by the smoke test, covered by a unit test.
- If damaged entries exist the CSV still downloads the readable entries; the screen and the download note say how many damaged entries are NOT in the file. The CSV header block (13A) cannot say so itself.
- XLSX and PDF: NOT built. XLSX is a ZIP of XML files, so a small hand-written writer without a library is possible but would be new unverified code (no real spreadsheet program is available here to open it). PDF with only the built-in fonts cannot show non-Latin text, and the log holds free text (remarks, tank names); embedding fonts needs a library. The only PDF library found in this environment is the global `pdf-lib` 1.17.1 (525,099 bytes minified, 206,939 gzipped; the app bundle is 439,970 bytes, 135,009 gzipped), and it is NOT a project dependency. Nothing was added; I need your decision.
### Known points
- The official `npm install` / `npm run build` still returns 403; `npm run build:offline` passes. The new `.tsx` files were checked with `tsc --strict` against a minimal React stub only.
- Editing keeps no history; deleting keeps no copy. The log is on this device only (localStorage); a full 1000-entry log refuses new entries.

## Chunk 13A - Changeover log: pure model, strict validation, CSV builder (NO UI; version stays 0.13.0, the bump comes with 13B)
Chunk 13 is split: 13A (this entry) is the pure log model, strict validator, pure log operations, the CSV builder and their unit tests, with NOTHING wired into the app (no screen, no storage call, no route change); 13B is the UI, persistence, the browser CSV download, the XLSX / PDF decision, the smoke test, docs, version bump and final ZIP (`CHUNK_13B_PROMPT.md`). The five design points are built on the proposals and are `confirmed: false` (`src/calculations/log/settings.ts`, `LOG_DESIGN_POINTS`); the Settings panel that makes the "Confirmed: NO" count 8 arrives in 13B. The user answered "proceed", so the proposals stand.
- `src/models/log.ts`: `LogEntry` (id, createdAtMs, updatedAtMs, start / end time, start / end position, quantity with unit from `models/fuel.ts`, sulphur high / low % m/m, from / to tank, remarks, optional `appContext` with predicted latest start, status, scope, DEMO / MOCK / DERIVED / VERIFY flags and the list of pre-filled fields), `ChangeoverLog { schemaVersion: 1, entries }`, key `changeover-log`, `MAX_LOG_ENTRIES` 1000. `null` = not entered, never 0.
- `src/calculations/log/validate.ts`: `parseEntry` (every key must be present, unknown fields rejected, specific messages with the field path, no repair, no default; at least one user-reported value; times whole ms in 2000-2099; positions need both coordinates; sulphur 0..100; quantity > 0 with a known unit) and `parseLog` (wrong / missing schema version or unknown top-level field rejects the whole log; a bad or duplicate entry is reported with its position and left out).
- `src/calculations/log/ops.ts`: `appendEntry` (refuses duplicates and a full log, never drops an entry), `replaceEntry` (needs `updatedAtMs`, `createdAtMs` cannot change, no history), `deleteEntry` (needs `{ confirmed: true }`), `newestFirst`. Inputs are never mutated.
- `src/calculations/log/csv.ts`: `buildCsv` (header block with app, version, export time UTC, entry count, DEMO / MOCK flag, time note and the safety notice, one blank line, column row, one row per entry; RFC 4180 quoting, CRLF; missing = empty field; UTC via `formatUtc`; text starting with = + - @ tab CR gets a leading apostrophe against spreadsheet formulas, numbers are never touched). `EXPORT_NOTICE` = the app disclaimer text verbatim plus one sentence about what the export holds.
- Tests: `tests/log.ts`, 19 new (275 to 294), including the exact CSV text. Nothing existing changed; the smoke tests were not re-run because no application file changed (`tests/run.ts` only registers the new tests).
- Not done on purpose: persistence, UI, browser download, XLSX, PDF, version bump, "Confirmed: NO" count change.

## Chunk 12 - Alerts + notifications (v0.13.0)
Summary: a pure alert engine (12A) is now live in the app (12B): one operational status + alert level + reasons on the Dashboard and in the header, an in-app notification list with Acknowledge and a banner, lead times typed by the user with no default, a Settings panel for the UNCONFIRMED design points. Timing, geometry and data state only; no regulatory statement. Unit tests 275, smoke-alerts 67.

## Chunk 12B - Alert UI, smoke test, docs, version bump (v0.13.0)
12B was built in two parts (part 1: store, runner, status panel, header chip, Settings panel; part 2: notification list + banner, smoke test, docs, version bump). The 12A engine was NOT changed: no test showed a bug in it.
### Added
- `src/services/alerts/store.ts`: SESSION-ONLY module store (`useSyncExternalStore` style, like `predictionInputs`): lead-time texts + parsed lead times (blank = null = not entered, junk = NaN = invalid, decimal comma accepted, never read as 0), the `NotificationState`, the latest evaluation, `acknowledge` / `acknowledgeAll`. No localStorage, NO new storage key, no timer. `leadTimes` / `leadTexts` keep their object identity until the user edits, so submitting an evaluation cannot re-trigger the evaluating effect; `notifications` keeps its identity while the state is unchanged (`recordEvaluation`).
- `src/hooks/useAlerts.ts`; `src/components/AlertsRunner.tsx` (mounted ONCE in `AppShell`, renders nothing): assembles the engine input from `useGps()`, `usePrediction()` (`result`, `current`, `inputs.useDemo` = scope), `useData().data?.status` (null until read), `useVesselStatus()` and the lead times; calls `evaluateAlert(now = Date.now())` in a `useEffect` and submits the result. It subscribes to `leadTimes` only, never to its own output. No timer: it re-runs when an input changes (the GPS store ticks every second; an unchanged state creates no entry).
- `src/components/AlertPanels.tsx`: Dashboard panel OPERATIONAL STATUS: status text + symbol from `ALERT_LEVELS`, alert level as text, DETERMINING reasons with their codes, NOTES in a separate smaller list, timing line ("Latest start in N min" / "Latest start passed N min ago", "(unverified)" when the status is VERIFY), DEMO and MOCK (NOT GPS) labels. The three lead-time fields (empty by default, "Not evaluated: lead time not entered.", validation messages from `validateLeadTimes`, Clear button) are in THIS panel on the Dashboard, not on the Changeover screen.
- `src/components/NotificationPanels.tsx`: ALERT LIST panel on the Dashboard, directly below OPERATIONAL STATUS (newest first: UTC time, status, level text + symbol, DEMO/REAL, one-line summary, "from X" or "first evaluation", acknowledged time; Acknowledge per entry; Acknowledge all; honest empty state "No alerts yet") and a banner at the top of the Dashboard only while there are unacknowledged entries (count + newest unacknowledged summary). In-app only: no push, no sound, no vibration, no Notification API, no service-worker change, no repetition on a timer. Acknowledging changes no status.
- Header: ONE new chip "STATUS: <status>" (colour + text; "STATUS: NOT EVALUATED YET" before the first evaluation) next to the existing chips; the existing chips are unchanged.
- Settings: panel ALERT DESIGN POINTS - UNCONFIRMED PROPOSAL (`Confirmed: NO`, the four `ALERT_DESIGN_POINTS`, the three `NOT_PRODUCED_STATUSES` with their reasons). Settings shows SEVEN "Confirmed: NO" lines.
- `tests/smoke-alerts.mjs` (port 4185, 67 checks): status panel and header chip; no GPS = GPS UNRELIABLE / GPS_NOT_USABLE; lead-time fields empty with the "not evaluated" text; with the developer mock position (2 deg south of DEMO-A, margin 20, FOBAS 41 min 35 s) the exact walk GPS UNRELIABLE > VERIFY (REAL, NO_AREA_DATA) > VERIFY (DEMO, LEAD_TIME_NOT_SET x3) > PREPARE > VERIFY (profile incomplete, never NORMAL) > PREPARE > CHANGEOVER SOON > CHANGEOVER WINDOW ACTIVE > GPS UNRELIABLE (mock cleared) > WINDOW ACTIVE at ACTION REQUIRED (start passed) > GPS UNRELIABLE (cleared) > INSIDE ECA > VERIFY (REAL), 13 entries, exactly ONE per change; 3.5-4 s on one state add none; invalid lead times (PREPARE < SOON, junk text) = VERIFY + LEAD_TIMES_INVALID and no extra entry; Acknowledge / Acknowledge all / banner count and disappearance / no repetition; reload empties the list and the lead times; REAL scope = VERIFY with NO_AREA_DATA, no area-based status; no compliance wording (shared VERDICT regex); DEMO labels; Settings panel and the three not-produced statuses; localStorage, sessionStorage and the IndexedDB database list identical before and after; bundle has no Notification API / vibrate; no console errors; no external requests.
- `tests/alerts.ts`: 4 new unit tests (275 in total): store lead-time parsing and Clear; store identity across 200 submits with one entry; acknowledge / acknowledgeAll publish only on change; static check that the store, hook and the three alert components are session-only / in-app-only with no compliance wording.
### Changed
- `APP_VERSION` 0.12.0 to 0.13.0 (also `package.json`); `CURRENT_CHUNK` "11" to "12".
- Tests that legitimately change: the "Confirmed: NO" count 6 to 7 in `tests/smoke-gps.mjs`, `smoke-noxpm.mjs`, `smoke-port.mjs`, `smoke-prediction.mjs`, `smoke-versions.mjs` (assertion and description text only; no check weakened). No other existing test changed; all other counts are unchanged (versions 63, port 42, sox 21, noxpm 30, prediction 47, gps 33, map 27, geo 10, regulations 9, calculator 12, vessel 0 console errors).
### Known points
- The list is session only: after a reload it holds one new "first evaluation" entry (the first evaluation runs at start-up), so "No alerts yet" exists in code but is practically never visible.
- There is no hysteresis: a state that flips back and forth makes one entry per flip. Clearing the mock position is a real state change (GPS UNRELIABLE) and makes an entry.
- With an incomplete vessel profile the status can never be NORMAL (VERIFY with VESSEL_PROFILE_INCOMPLETE); NORMAL is not reached in the smoke test for that reason, it is covered by the 12A unit tests.
- Area geometry import is still not built and the question whether it should be its own chunk is still unanswered.
- Official `npm run build` (tsc + Vite) NOT VERIFIED (npm registry 403); built with `npm run build:offline`; the new `.tsx` files and hooks pass `tsc --strict --noUnusedLocals --noUnusedParameters` against a minimal React stub (only the stub's own implicit-any on `onChange` handlers remain).

## Chunk 12A - Alert engine and notification logic (pure, NO UI; version stays 0.12.0, the bump comes with 12B)
Chunk 12 is split: 12A (this entry) is the pure alert engine, the pure notification list logic and their unit tests, with NO UI and nothing wired into the app; 12B is the UI (Dashboard status panel, header chip, notification list with Acknowledge, Settings panel), the smoke test, docs, version bump and final ZIP (`CHUNK_12B_PROMPT.md`). The four design points are built on the proposals and are `confirmed: false` (`src/calculations/alerts/settings.ts`, `ALERT_DESIGN_POINTS`); the Settings panel that makes the "Confirmed: NO" count 7 arrives in 12B. The user answered "proceed", so the proposals stand.
### Added
- `src/models/alerts.ts`: `AlertInput`, `AlertEvaluation` (`status`, `level`, `reasons[]` with role DETERMINING / NOTE, `scope`, `demo`, `mock`, `evaluatedAt`, `timing`, `confirmed: false`), `AlertReasonCode` (the 11 prediction reason codes passed through unchanged + 21 alert-only codes), `AlertLeadTimes`, `AlertEntry`, `NotificationState`. `AlertRegulationInput` and `AlertVesselInput` are structural subsets of `RegulationStatus` and `ProfileStatus`, so the pure engine imports no service.
- `src/calculations/alerts/engine.ts`: `evaluateAlert(input)`, pure, clock injected. Priority, first match wins: 1 GPS UNRELIABLE (same `gpsUsability` gate as the prediction); 2 STALE DATA (REAL scope: active dataset STALE); 3 VERIFY with every reason listed (degraded GPS, regulation data not loaded / unreadable / UNVERIFIED in REAL scope, NO_AREA_DATA, ON_BOUNDARY, any prediction refusal reason other than NO_ENTRY_ON_TRACK / ALREADY_INSIDE, missing or invalid lead times, ENTRY_TIME_PASSED, INPUTS_INCONSISTENT); 4 INSIDE ECA (INFORMATION; names the area, DEMO labelled; motion and changeover inputs do not matter while inside); 5 timing from the prediction output only: CHANGEOVER WINDOW ACTIVE, CHANGEOVER SOON, PREPARE; 6 NORMAL only when every input was evaluated and the vessel profile is complete. A missing input never gives NORMAL.
- Timing: lead times are minutes BEFORE THE LATEST START TIME, user-entered, NO DEFAULT (`emptyLeadTimes()` is all null). Order PREPARE >= SOON >= WINDOW; equality counts as reached. A lead time that is null means that status is not evaluated and the result lists it (`LEAD_TIME_NOT_SET`); with any of them missing and no threshold hit the result is VERIFY, not NORMAL. A latest start time that has already passed (`timeToStartSeconds <= 0`, never clamped) is CHANGEOVER WINDOW ACTIVE at ACTION_REQUIRED with or without lead times: it is a fact of the prediction, not a threshold. ACTION_REQUIRED is produced in no other case and its text is timing ("The latest start time ... has passed"), not a rule.
- Alert levels: GPS UNRELIABLE / STALE DATA / VERIFY / CHANGEOVER SOON / WINDOW ACTIVE (start not yet passed) = ATTENTION; PREPARE = PREPARE; INSIDE ECA = INFORMATION; NORMAL = NORMAL; WINDOW ACTIVE with the start passed = ACTION_REQUIRED.
- Notes (never decisive, never hidden): incomplete or unread vessel profile (blocks NORMAL only, turning it into VERIFY; never hides INSIDE ECA or a timing status), MOCK position (`mock` flag + `GPS_MOCK`), DEMO scope (`demo` flag + `DEMO_SCOPE`), UPDATE RECOMMENDED freshness. The timing figures are kept on VERIFY results when the prediction produced them.
- Not produced (by design, listed in `NOT_PRODUCED_STATUSES` and to be shown in Settings): ECA ENTRY IMMINENT (no lead time was asked for), ECA EXIT APPROACHING (no exit prediction exists), ECA EXITED (needs a remembered previous state). A test checks that produced + not-produced = the whole `OPERATIONAL_STATUSES` vocabulary.
- `src/calculations/alerts/notifications.ts`: `recordEvaluation`, `acknowledge`, `acknowledgeAll`, `unacknowledgedCount`, `stateKey`, `MAX_NOTIFICATIONS` (100). A state = status + level + DEMO/REAL. A change creates one entry (the first evaluation a `FIRST` entry); the same state evaluated again, at any clock time, returns the SAME object (no timer, nothing repeats). Acknowledging changes the entry only and never re-raises anything. No hysteresis: a state that flips back and forth makes an entry per flip (stated in the design point).
- `src/calculations/alerts/settings.ts`: `ALERT_SETTINGS`, `ALERT_DESIGN_POINTS` (status mapping and priority; lead times; notification channel: in-app list and banner only, no push / sound / vibration / background work / browser notifications; de-duplication and acknowledgement), `validateLeadTimes`, `LEAD_TIME_FIELDS`, `NOT_PRODUCED_STATUSES`.
- `tests/alerts.ts` (32 tests, registered in `tests/run.ts`): every produced status reachable; every prediction reason code mapped (a new code fails the test until it is added); timing boundaries by hand (the clock is moved to an exact number of minutes before the predicted start); lead times missing / invalid; REAL scope has no area; REAL data states; priority order pairwise; vessel profile blocks NORMAL only; a sweep removing each input from the NORMAL baseline never leaves NORMAL; ACTION_REQUIRED only with START_TIME_PASSED; no compliance wording in any message; determinism and no input mutation; notifications (first entry, 1000 identical evaluations give one entry and the same object, change / level / scope entries, flip-flop, acknowledge, acknowledge-all, no re-raise, cap of 100, end to end with the real engines); a static check that the alert sources contain no timer, clock, randomness, storage, network, push or upward import.
### Not done (by design, left for 12B)
- No UI, no hook, no Dashboard panel, no header chip change, no Settings panel, no smoke test, no storage key (the proposal keeps lead times and the notification list in memory for the session, like the prediction inputs), no version bump. Nothing in `src/` imports the new code yet.
- The area-import question is still open (the user answered "proceed to chunk 12", which was not an answer to it). It is not built and not decided.
### Tests and build
- `npm test`: 271 of 271 pass (239 + 32 new). `npm run build:offline` passes. Official `npm run build` NOT verified (npm registry unreachable here). Type-check: the new files and `tests/alerts.ts` pass `tsc --strict --noUnusedLocals --noUnusedParameters` against a stub for `node:assert` / `node:fs` (`@types/node` is not installed here). Browser smoke tests were not re-run: no application file changed.

## Chunk 11 - Regulation update center (v0.12.0)
Chunk 11 was built in two sub parts. 11A (the next entry below) is the basis fix, the versioned import / store / activation services and their unit tests. 11B (this entry) is the UI, the smoke test, the docs and the version bump. The three update-center design points and the Port advisor scope choice are an UNCONFIRMED PROPOSAL (`confirmed: false`, Settings says `Confirmed: NO`).
### 11B - Added (UI, smoke test)
- `src/hooks/useData.ts`: one shared data module. The app version store (`new KvVersionStore(store)`), `loadAll(now, versionStore)` read once and again after every import / activate / rollback / remove (`versionActions`, read with `useSyncExternalStore`), the version lists, the active keys and the merged activation history. Store errors are shown as `CODE: message`. `useSox`, `useNoxPm` keep their DEMO behaviour unchanged (they still read the bundled data).
- `src/components/UpdateCenter.tsx`: per kind (regulation dataset, port list) an Import section (file input, then `previewImport` shown as data: the reject code and message, or the READY summary with dataset id, version, publication date, file name, accepted / rejected counts, oldest last-verified date and freshness, the rejected items with reasons, and the diff against the active version as plain id / date lists with the content-differs flag only where the date is unchanged). Buttons: "Accept and store (does not activate)" and Cancel; a partial import also needs its own acceptance checkbox (the service refuses with `PARTIAL_NOT_ACCEPTED` otherwise). There is NO "import and activate" button. A version list per dataset id (ACTIVE marked, import time, file name, counts, PARTIAL flag, Activate, Roll back, Remove with an explicit confirmation step that says what is deleted and, for the active version, that production data then disappears and REAL scope has no data). The activation history as a plain list. Honest empty states ("No production dataset imported", "No production port list imported") and a note that area geometry cannot be imported.
- `src/services/versions/store.ts`: `rollbackTarget(log, sourceId, current)` (pure, shared by the store and the UI so both agree). One new unit test.
- Port advisor scope (UNCONFIRMED PROPOSAL): `usePort` offers DEMO | REAL, session only, default DEMO, with a visible scope label. REAL is offered only when an imported dataset AND an imported port list are both active and readable; it uses only those (`production`, `productionPorts`) and shows imported values with source, authority, document, reference, dates and freshness but without the DEMO label. With nothing active REAL is not offered and the screen says why. A REAL choice that outlives its data (version removed) makes the engine refuse with `NO_DATASET`; a button switches back to DEMO. Changing scope clears the picked port.
- Rules panels (sulphur, NOx, PM) keep DEMO scope and say, in REAL scope, why imported datasets are not used there (no production area exists).
- Settings: panel `REGULATION UPDATE CENTER DESIGN POINTS - UNCONFIRMED PROPOSAL` (`Confirmed: NO`, the three `VERSION_DESIGN_POINTS`): Settings now shows SIX "Confirmed: NO" lines. The "Regulation dataset" row shows the active imported version (`activeProductionVersion`) or "none loaded"; the constant `REGULATION_DATASET_VERSION` stays `null` (bundled production version). The erase confirmation says it also removes imported versions.
- Header chip: uses `loadAll(...).status` (an active imported dataset gives its freshness chip; otherwise as before).
- `tests/smoke-versions.mjs` (63 checks, port 4184): writes its own fictional TEST- files to a temp directory and uploads them through the file input. Covers nothing imported (REAL not offered, empty states), invalid JSON / DEMO-flagged / unsupported schema refused with their codes and nothing stored, preview and Cancel, partial acceptance, accept stores but does not activate, Activate, REAL scope on the Port screen with imported values and no DEMO label, reload (versions persist, scope choice does not), ALREADY_IMPORTED, VERSION_CONFLICT, the diff of a newer version, Roll back, Remove with confirmation, REAL refusing again after the active version is removed, Settings, no compliance wording, no console errors, no external requests.
### 11B - Changed
- Regulation Center reads `useData()` (so an active imported dataset shows as PRODUCTION and its records appear); its old "coming in Chunk 11" note is replaced. `routes.ts`: the Regulation Center is implemented (`chunk: null`); `tests/run.ts` route test updated to list it.
- Existing smoke tests: only the "Confirmed: NO" count changed, 5 to 6 (`smoke-gps`, `smoke-noxpm`, `smoke-prediction`, `smoke-port`); no check count changed.
- Version 0.11.0 to 0.12.0, `CURRENT_CHUNK` "11".
### 11B - Tests and build
- `npm test`: 239 of 239 pass (238 + 1 new). Smoke tests (headless Chromium, all pass): versions 63 (new), port 42, sox 21, noxpm 30, prediction 47, gps 33, map 27, geo 10, regulations 9, calculator 12, vessel (no check counter, console errors 0).
- `npm run build:offline` passes. Official `npm run build` NOT verified (npm registry 403). Type-check: `src/hooks/useData.ts` and `usePort.ts` pass `tsc --strict --noUnusedLocals --noUnusedParameters` against a React type stub; the new / changed `.tsx` files only show the stub's own "implicit any" on event handlers (the same appears in older files), no other error. This is NOT the official build.
### Known gap (by scope, asked to the user)
- Only datasets and port lists are importable. Area GEOMETRY is not, so there is no production area: the area-based sulphur / NOx / PM panels, the map and the prediction stay DEMO / NO_AREA, and only the Port Advisor can answer in REAL scope. Whether area import should be its own chunk is an open question.

## Chunk 11A - Regulation update center, data layer (built before 11B; version bump came with 11B)
Chunk 11 is split: 11A (see below) is the basis fix, the versioned import / store / activation services and their unit tests, with NO UI; 11B is the Regulation Center UI, Settings panel, smoke test, docs, version bump and final ZIP (`CHUNK_11B_PROMPT.md`). The three design points (how a dataset is imported and stored, versioning, what the center shows) were built on the proposals and are `confirmed: false` (`src/services/versions/settings.ts`, `VERSION_DESIGN_POINTS`); the Settings panel that makes the "Confirmed: NO" count 6 arrives in 11B.
### Fixed
- **Basis issue (known issue from Chunk 10).** `selectSox` and `selectNoxPm` matched a block by `areaId` whatever its basis, so a PORT-basis block whose `areaId` equalled an area id could answer an area query. An area query now accepts only GLOBAL blocks and AREA blocks for that area (`calculations/sox/engine.ts`, `calculations/noxpm/engine.ts`). The port engine is unchanged (it already required basis PORT + the port id for port-level entries, and a non-PORT basis for area-level entries).
### Added
- `src/models/versions.ts`: `VersionMeta`, `VersionIndex`, `VersionPayload`, `ActivationEvent`, `VersionDiff`, import preview / reject types, `VERSION_STORE_FORMAT` (1), `IMPORT_MAX_CHARS` (1,000,000, UNCONFIRMED technical cap).
- `src/services/versions/store.ts`: `VersionStore` interface (`list`, `get`, `put`, `activeKeys`, `log`, `activate`, `rollback`, `remove`), `KvVersionStore` over the existing `KeyValueStore`, `createMemoryVersionStore()` for tests, `VersionStoreError` with specific codes (UNSUPPORTED_FORMAT, INDEX_CORRUPT, PAYLOAD_MISSING, ALREADY_IMPORTED, VERSION_CONFLICT, NOT_FOUND, ALREADY_ACTIVE, CONFIRMATION_REQUIRED, NO_PREVIOUS_VERSION, INVALID_VERSION). Versions are immutable: a payload is written once and never rewritten; only the index (active pointers + append-only activation history) changes. `put` never overwrites and never activates.
- `src/services/versions/importer.ts`: `previewImport` (size cap, JSON, the SAME strict parsers as bundled data via `parseKind`, DEMO-flagged files refused, no valid item refused, ALREADY_IMPORTED / VERSION_CONFLICT, diff against the active version of the same dataset id) and `commitImport` (a partial import needs `acceptPartial: true`; does not activate).
- `src/services/versions/diff.ts`: `diffItems`, plain added / removed / changed lists by id and `lastVerifiedDate`, plus a byte-level `contentDiffers` flag (an addition to the proposal, so a content change under an unchanged date is not hidden; `datasetVersion` is excluded because it differs in every record of any two versions).
- `src/services/versions/active.ts`: `resolveProductionRegulation`, `resolveProductionPorts`, `activeProductionVersion`, `loadAll(now, store)` (bundled DEMO data plus the ACTIVE imported production data as `production` / `productionPorts`; nothing active = null = REAL scope refuses with NO_DATASET; two active dataset ids, an unreadable or mismatching stored version = an error load, nothing is guessed). `loadBundled` is unchanged.
- `tests/versions.ts` (23 tests): the basis fix both ways; valid dataset and port list; whole-file rejection (schema version, unknown field, missing DEMO flag, bad JSON, wrong shape, too large); DEMO-flagged and empty files; partial import with listed rejects and explicit acceptance; the same version twice; activate, older version again, rollback, remove with confirmation; REAL scope reads the active imported data in the SOx, NOx / PM and port engines and refuses with NO_DATASET when nothing is active or after removal; two active ids; version diff (datasets and port lists); unsupported / corrupt store format; persistence across store instances on the localStorage backend; design points UNCONFIRMED.
### Changed (existing tests)
- `tests/port.ts` "port entries equal the SOx / NOx-PM layer entries": the PORT-origin half used to call the area queries with a port id, which only worked because of the basis issue. It now compares the port-level entries with the shared entry builders (`soxEntry`, `noxPmEntry`) and the AREA half is unchanged.
- `tests/run.ts` registers the new tests.
### Tests and build
- `npm test`: 238 of 238 pass (215 + 23). All existing browser smoke tests were re-run after the basis fix and pass unchanged: port 42, sox 21, noxpm 30, prediction 47, gps 33, map 27, geo 10, regulations 9, calculator 12. `npm run build:offline` passes.
- Type-check: `src/services/versions/**`, `src/models/versions.ts` and both engines pass `tsc --strict --noUnusedLocals --noUnusedParameters`; `tests/versions.ts`, `tests/port.ts` and `tests/sox.ts` pass the same check with a stub for `node:assert` (`@types/node` is not installed here). The official `npm run build` (tsc + Vite) and the `.tsx` files remain UNVERIFIED (no npm access).
### Not done (by design, left for 11B)
- No UI: no Import section, version list, Activate button, per-dataset summary or Settings panel; nothing reads the store yet (the hooks still use `loadBundled`); `REGULATION_DATASET_VERSION` is still the constant `null` (11B shows `activeProductionVersion`); `APP_VERSION` / `CURRENT_CHUNK` not bumped. No scraping, no network fetch, no alerts, no export, no compliance verdict.
### Notes for 11B
- "Reset local data" (`store.clear()`) removes every app key, including imported versions; the UI must say so before it runs.
- A device clock earlier than a stored version's publication date makes the strict parser reject the stored file; the center shows that error and never repairs it.

## Chunk 10 - Port advisor (v0.11.0)
Chunk 10 was built in two sub parts. 10A (below) is the data layer, the pure engine and the unit tests; 10B is the UI, the port smoke test, the docs and the version bump. The three design points (how ports are stored, how a port is chosen, what the advisor shows) were built on the proposals and are `confirmed: false`, shown as UNCONFIRMED PROPOSAL.
### 10B - Added (UI, smoke test)
- `src/hooks/usePort.ts`: loads the bundled DEMO port list and the DEMO sulphur / NOx-PM datasets once (`loadBundled(now)`), scope DEMO because no production port list exists. The chosen port id is kept in a SESSION-ONLY module store (`portChoice`): nothing is written to storage, `null` by default, cleared by a page reload.
- `src/components/PortPanels.tsx`: `PortPicker` (a select over the loaded list with a "None - no port selected" choice), `PortAdviceView` (the advice as data), `PortDetails`, `PortListInfo` (accepted / rejected port counts, UNCONFIRMED PROPOSAL note), `PortDashboardPanel`.
- `src/screens/PortScreen.tsx` (`#/port`, replaces the PlannedScreen): picker; for the chosen port its name (labelled DEMO), id, area id or "none", source URL, last-verified date, freshness and UPDATE RECOMMENDED flag; entries grouped under "Entries for this port" and "Entries for the port's area", each with record id, authority, document, reference, source URL, effective / expiry dates, time-state, freshness, flag and the value or summary copied from the record; refused sections with their reason codes and messages (a missing entry is shown as a refusal, never as "nothing applies"); `CONFLICT - VERIFY` with every candidate; `VERIFY WITH PORT / AUTHORITY` on every answer and every refusal. No verdict, no alert level, no ETA, no route.
- Dashboard: the NEXT PORT placeholder is now a small panel (picked port name or "No port selected", its freshness, a link to `#/port`, `VERIFY WITH PORT / AUTHORITY`); the full advice is not repeated there.
- Regulation Center: a DEMO PORTS panel lists the 3 DEMO ports and the PORT-basis blocks of the DEMO records (`DEMO-S4`, `DEMO-N4`); a record card now says "port" instead of "area" for a PORT-basis block (it names a port id).
- Settings: `PORT ADVISOR DESIGN POINTS - UNCONFIRMED PROPOSAL` with a `Confirmed: NO` line and the three design points from `PORT_DESIGN_POINTS`.
- `tests/smoke-port.mjs` (42 browser checks, port 4183): no console errors, no external requests; picker lists 3 DEMO ports and "none"; nothing picked shows NO_PORT_SELECTED and the verify text; ALPHA shows port-level (DEMO-S4, DEMO-N4) and area-level (DEMO-S1, DEMO-N1) entries separately with labels; BETA shows UPDATE RECOMMENDED and the port-level NO_MATCHING_RECORD refusals; GAMMA shows RECORD_NOT_CURRENT; the choice is not kept after a reload and no port id is written to local storage; no panel makes a compliance statement (the shared VERDICT regex); every DEMO value is labelled DEMO; the Settings design points show as UNCONFIRMED PROPOSAL.
### 10B - Changed (existing tests and code)
- Route table: `port` is implemented (`chunk: null`). `tests/run.ts` route test: the implemented screens are now map, port, changeover, vessel, settings; primary tabs stay 4.
- Settings now shows FIVE "Confirmed: NO" lines (GPS, prediction, SOx, NOx / PM, port). `tests/smoke-gps.mjs`, `tests/smoke-noxpm.mjs` and `tests/smoke-prediction.mjs` counted four; they now count five. `tests/smoke-sox.mjs` does not count them and is unchanged.
- `APP_VERSION` 0.11.0, `CURRENT_CHUNK` "10", `package.json` version 0.11.0.
### 10B - Tests and build
- `npm test`: 215 of 215 pass (the route-test change adds no test).
- Browser smoke tests, all pass: port 42, sox 21, noxpm 30, prediction 47, gps 33, map 27, geo 10, regulations 9, calculator 12.
- `npm run build:offline` passes. The official `npm run build` (tsc + Vite) is STILL UNVERIFIED: the npm registry returned 403 in this session, so `npm install` could not run. The new `.tsx` files (`PortPanels.tsx`, `PortScreen.tsx`) and the changed ones (`Dashboard.tsx`, `RegulationCenter.tsx`, `Settings.tsx`, `screens/index.tsx`) and `usePort.ts` were NOT type-checked (no `@types/react` available offline); they were built by esbuild and exercised in a browser only.
### 10B - Not done (by design)
- No dataset or port-list import or persistence (Chunk 11), no alerts (12), no logs or export (13), no route or ETA to a port, no GPS-based port guessing, no compliance verdict.

### 10A - Added (port data layer, pure engine, unit tests; no UI)
- `src/models/port.ts`: `Port`, `PortListLoad`, `PortQuery`, `PortAdvice` (`OK` with the resolved port and per-topic / per-origin sections, or `REFUSED` with reasons), `PortSection`, `PortEntry` (labelled PORT or AREA), `PORT_REASON_CODES` = the SOx / NOx-PM codes (LIMIT_MISSING / BLOCK_MISSING unified as BLOCK_MISSING) plus NO_PORT_SELECTED, PORT_NOT_FOUND, PORT_UNVERIFIED; fixed status text `VERIFY WITH PORT / AUTHORITY` carried on every advice, refusals included.
- `src/services/ports/` (`validation.ts`, `loader.ts`): strict port-list parser, port-list schema version 1 (own format, not the regulation schema): rejects missing fields, bad / non-finite / out-of-range coordinates and 0, 0, duplicate ids, unknown fields (port and list level), bad source URL, bad / future last-verified date, DEMO / production mixing (id prefix, flag, area id), a UN/LOCODE on a DEMO port and a malformed UN/LOCODE. A rejected port is never repaired.
- `src/data/demoPorts.ts`: 3 fictional ports (DEMO PORT ALPHA / BETA / GAMMA), UN/LOCODE null, coordinates inside DEMO-A / DEMO-B / DEMO-C, dates built from `now`; `loadBundled` now also returns `demoPorts`.
- `src/data/demoSox.ts` (`DEMO-S4`) and `src/data/demoNoxPm.ts` (`DEMO-N4`): one PORT-basis record each for DEMO PORT ALPHA (the block's `areaId` names the port id; values / texts obviously fictional, no number in the text). No regulation schema change (the PORT basis already existed).
- `src/calculations/port/` (pure, no React, no clock): `adviseForPort`, `settings.ts` (three design points, UNCONFIRMED PROPOSAL, `confirmed: false`). Port-level entries (block basis PORT naming the port id) and area-level entries (block basis AREA or GLOBAL for the port's own `areaId`) are judged and listed separately; a PORT-basis record naming an area id is never area-level and an AREA-basis record naming the port id is never port-level. Each layer answers or refuses on its own; a layer with no dataset refuses only itself.
- `src/calculations/shared/selection.ts`: `judgeAll` (judge every candidate, return usable entries and excluded reasons), extracted from the SOx and NOx / PM engines; both engines now use it and export their entry builders (`soxEntry`, `noxPmEntry`), which the port engine reuses.
### 10A - Changed
- `tests/sox.ts` and `tests/noxpm.ts`: the bundled DEMO dataset record count is now 4 (3 area records + the PORT-basis record); nothing else in those tests changed.
- `tests/smoke-noxpm.mjs`: the Regulation Center count of NOx / PM blocks listed is now 4 / 3 (the PORT-basis entry adds one of each).
### 10A - Tests
- `npm test`: 215 of 215 pass (195 before + 20 new in `tests/port.ts`, registered in `tests/run.ts`).
- Browser smoke tests re-run after the data change: sox 21, noxpm 30, prediction 47, gps 33, map 27, geo 10, regulations 9, calculator 12, all pass.
- `npm run build:offline` passes. `tsc --strict --noUnusedLocals` is clean on all non-React `src` files that were checked before, the new port files, and `tests/port.ts`, `sox.ts`, `noxpm.ts`, `regulations.ts`. The official `npm run build` is still unverified (registry unavailable); `.tsx` files and hooks were not type-checked.
### Known notes (10A, still true)
- The SOx and NOx / PM area engines still match a block by `areaId` regardless of basis. A PORT-basis block whose `areaId` equalled an AREA id would answer an area query. Not reachable with the bundled data; the port engine does not have this problem. Left unchanged on purpose (small diff).
- A port whose last-verified date is STALE or after the query date is refused with PORT_UNVERIFIED (one code for both; the message says which). UNCONFIRMED PROPOSAL.

## Chunk 09 - NOx + PM rules layer (v0.10.0)
### Added
- `src/models/regulation.ts`: schema version 3; optional `nox` and `pm` blocks `{ basis: AREA | GLOBAL | PORT, areaId, summary }` on a record (`nox: null` / `pm: null` when absent); `SUPPORTED_SCHEMA_VERSIONS = [1, 2, 3]`. `summary` is free text copied from the source (1 to 2000 characters); no numeric field, no default. MIGRATION NOTE: versions 1 and 2 are strict subsets of 3 and still load; a `nox` / `pm` field in a version-1 or version-2 dataset is rejected as unknown (a `sulphur` field stays valid from version 2).
- `src/services/regulations/validation.ts`: `validateNoxPm` (strict: missing / empty / non-text / oversized summary, unknown fields, wrong basis, GLOBAL with an area, AREA/PORT without an area, DEMO/production id mixing all rejected). The basis + area rules are now one shared function (`checkBasisArea`) used by both the sulphur and the NOx / PM validators; behaviour of `validateSulphur` is unchanged.
- `src/calculations/shared/selection.ts`: the record-selection logic extracted from the SOx engine (`gateQuery`: bad date, no / unreadable dataset, scope vs dataset, no area, in that order; `judgeRecord`: time-state, date consistency and freshness on the QUERY date; `provenance`). `selectSox` now uses it; the 16 SOx tests are unchanged and green.
- `src/models/noxpm.ts`: `NoxPmQuery` (topic NOX | PM, area, scope, date, dataset, profile), `NoxPmResult` (`OK` with entries / `REFUSED` with reasons, conflicting entries and `CONFLICT - VERIFY`), `NoxPmEntry`, `EngineReport`, reason codes NO_DATASET, DATASET_DEMO_ONLY, NO_AREA, DATE_INVALID, NO_MATCHING_RECORD, RECORD_NOT_CURRENT, RECORD_UNVERIFIED, RECORD_STALE, CONFLICTING_RECORDS, BLOCK_MISSING (the SOx LIMIT_MISSING renamed, there is no limit here) and ENGINE_DATA_MISSING. Every result carries the status text `VERIFY BEFORE ENTRY` as data.
- `src/calculations/noxpm/` (pure, no React, no clock): `selectNoxPm`, `reportEngineData`, `settings.ts` (the three design points, all UNCONFIRMED PROPOSAL, `confirmed: false`).
- `src/data/demoNoxPm.ts`: 3 fictional DEMO records (placeholder sentences with no number, `.invalid` source URLs), dates built from `now`; loaded as `demoNoxPm` by `loadBundled`; `DEMO-0` and the DEMO sulphur dataset are unchanged.
- `src/hooks/useNoxPm.ts` (reads the saved vessel profile, reacts to profile saves), `src/components/NoxPmPanels.tsx` (`NoxPmEntries`).
- UI: Dashboard CURRENT AREA and NEXT REGULATORY AREA panels show the matching NOx and PM entries (source, time-state, freshness, flag), `VERIFY BEFORE ENTRY` and the engine facts, every DEMO text labelled DEMO; Regulation Center lists the `nox` / `pm` blocks; Settings shows the design points as UNCONFIRMED PROPOSAL.
- `tests/noxpm.ts` (19 unit tests), `tests/smoke-noxpm.mjs` (30 browser checks).

### How it works
- Same order and policy as SOx, per topic: a record is a candidate when it has a block for that topic and the block is GLOBAL or names the area; judged on the QUERY date; one usable match answers, several refuse with CONFLICTING_RECORDS and `CONFLICT - VERIFY` and are all listed; left-out candidates are listed with the reason. REAL scope with only DEMO data is NO_DATASET + DATASET_DEMO_ONLY, never "nothing applies". A record with only a NOx block never answers PM.
- Engine data: `reportEngineData` lists, for the main engine and each auxiliary engine in the saved profile, which fields are present (the user's own entry, as text) and which are MISSING (blank, never entered, or answered Unknown; Not applicable counts as an answer). It compares nothing with a record. ENGINE_DATA_MISSING is NON-BLOCKING: it is reported next to the answer (`engineReasons`) and never changes which records answer, so a missing profile does not hide a record.
- Text in an entry is copied from the record; engine facts are copied from the profile; no number is produced anywhere (a test asserts entries contain only strings present in the dataset).

### Changed (existing tests and code)
- `tests/regulations.ts`: the unsupported-version case now uses version 4 and the message "supports version 1, 2 and 3" (the loader message now reads "1, 2 and 3").
- `tests/smoke-prediction.mjs`, `tests/smoke-gps.mjs`: the Settings check counted three "Confirmed: NO" lines; the new NOx / PM panel makes it four.
- `tests/smoke-sox.mjs`: the "VERIFIED CURRENT" count is now scoped to the SOx block (the NOx / PM entries in the same panel legitimately show it too). No SOx behaviour changed.
- `tests/smoke-gps.mjs`: the derived-SOG check accepts 35.9 or 36.0 kn. Cause of the long-standing flake: the test back-dates the first fix by 60 s, but the second fix is entered later in real time, so the interval is a little over 60 s and the correct derived SOG is 35.9 kn on a slower machine. Before the change the untouched Chunk 08 build failed this check in 5 of 6 runs here; after, 0 of 6.
- `src/hooks/useVesselStatus.ts`: exports `PROFILE_CHANGED_EVENT` (same string as before).
- `Regulation Center` wording: NOx / PM no longer "coming in Chunk 09". Version 0.10.0, chunk 09.

### Not done (by design)
- No port advisor (10), dataset import or persistence (11), alerts or notifications (12), logs (13). No compliance verdict, no tier judgement, no engine-versus-record comparison. No real NOx / PM text exists anywhere in the app.

## Chunk 08 - SOx rules layer (v0.9.0)
### Added
- `src/models/regulation.ts`: schema version 2; optional `sulphur` block `{ limitPercentMm, basis: AREA | GLOBAL | PORT, areaId }` on a record (`sulphur: null` when absent); `SUPPORTED_SCHEMA_VERSIONS = [1, 2]`. MIGRATION NOTE: a version-1 dataset is a strict subset and still loads; a `sulphur` field in a version-1 dataset is rejected as unknown.
- `src/services/regulations/validation.ts`: `validateSulphur` (strict: missing value = MISSING never 0; negative, zero, above 100, non-finite, wrong type, wrong basis, unknown fields, GLOBAL with an area, AREA/PORT without an area, DEMO/production id mixing all rejected). The loader passes the dataset schema version to the record validator.
- `src/models/sox.ts`: `SoxQuery`, `SoxResult` (`OK` with entries and a list of left-out candidates / `REFUSED` with reasons, conflicting entries and the status text `CONFLICT - VERIFY`), `SoxEntry`, reason codes NO_DATASET, DATASET_DEMO_ONLY, NO_AREA, DATE_INVALID (added), NO_MATCHING_RECORD, RECORD_NOT_CURRENT, RECORD_UNVERIFIED, RECORD_STALE, CONFLICTING_RECORDS, LIMIT_MISSING.
- `src/calculations/sox/` (pure, no React, no clock): `selectSox`; reuses `timeStateProblem` and `evaluateFreshness` from Chunk 03. `settings.ts` holds the three design points, all UNCONFIRMED PROPOSAL (`confirmed: false`, shown in Settings).
- `src/data/demoSox.ts`: 3 fictional DEMO sulphur records (values 7.77 / 6.66 / 5.55, `.invalid` source URLs), dates built from `now` so the demo never rots into STALE; loaded as `demoSox` by `loadBundled`; the existing `DEMO-0` dataset is unchanged.
- `src/hooks/useSox.ts`, `src/components/SoxPanels.tsx` (`SoxEntries`, `SoxInfoPanel`), `useInfoAreaId` in `PredictionPanels.tsx`.
- UI: Dashboard CURRENT AREA and NEXT REGULATORY AREA panels show the record value, source and time-state/freshness as data, every DEMO value labelled DEMO; Changeover screen shows the record value next to the typed S_T as information only (nothing filled or checked); Regulation Center lists the sulphur block; Settings shows the design points.
- `tests/sox.ts` (16 unit tests), `tests/smoke-sox.mjs` (21 browser checks).

### How it works
- Order: bad date; no dataset / unreadable; REAL scope with a DEMO dataset = NO_DATASET + DATASET_DEMO_ONLY (never "no limit applies"); DEMO scope with a production dataset = NO_DATASET; no area = NO_AREA; candidates = records with a sulphur block that is GLOBAL or has this area id; none = NO_MATCHING_RECORD (+ LIMIT_MISSING when no record in the dataset has a block).
- Each candidate is judged on the QUERY date: declared UNVERIFIED / STALE / not CURRENT, then date consistency (effective day applies, expiry day is the first day not applying: UNCONFIRMED convention), then freshness (STALE refuses, verified-after-query-date refuses as RECORD_UNVERIFIED, UPDATE RECOMMENDED answers with a flag).
- Exactly one usable match answers; several usable matches refuse with CONFLICTING_RECORDS and list all of them; matching records that were left out are listed with their reason. Every number in a result is copied from a record.

### Changed (existing tests)
- `tests/regulations.ts`: the unsupported-version case now uses version 3 and the message "supports version 1 and 2".
- `tests/smoke-prediction.mjs`, `tests/smoke-gps.mjs`: the Settings check counted exactly two "Confirmed: NO" lines; the new SOx panel makes it three.
- Version 0.9.0, chunk 08.

### Not done (by design)
- No NOx / PM (09), port advisor (10), dataset import or persistence (11), alerts (12), logs (13). No compliance verdict, no required fuel. No real sulphur value exists anywhere in the app.

## Chunk 07 - Integration: live changeover prediction (v0.8.0)
### Added
- `src/models/prediction.ts`: `PredictionInput`, `PredictionResult` (discriminated union `OK` / `REFUSED`), `Reason` and `REASON_CODES` (GPS_NOT_USABLE, SOG_MISSING, SOG_TOO_LOW, COG_MISSING, NO_AREA_DATA, NO_ENTRY_ON_TRACK, ALREADY_INSIDE, CHANGEOVER_DURATION_MISSING, MARGIN_MISSING, plus MARGIN_INVALID and TRACK_INVALID), `PredictionContext` (scope, DEMO, MOCK, VERIFY, DERIVED flags, position age, `confirmed: false`), `CurrentAreaAssessment`
- `src/calculations/geo/spatial.ts`: `destinationPoint` (spherical destination point on the same sphere as `distanceM`; longitude wrapped to [-180,180])
- `src/calculations/prediction/` (pure, no React, no clock access; `now` is passed in): `predict`, `assessCurrentArea`, `gpsUsability`, `buildProjectedTrack`, `settings.ts` (look-ahead, leg length, minimum SOG, the three design points; all UNCONFIRMED), `format.ts` (UTC time, spans, "PASSED ... ago")
- `src/services/prediction/inputsStore.ts`: session-only store for the changeover inputs, the safety margin text/number and the "use DEMO areas" switch; `parseMargin` (blank = null, junk = NaN, never 0)
- `src/hooks/usePrediction.ts`, `src/components/PredictionPanels.tsx` (CURRENT AREA, NEXT REGULATORY AREA, CHANGEOVER panels, DEMO switch), `src/map/predictionItems.ts` (marker and projected-track items, labels carry DEMO / MOCK / VERIFY as text)
- `tests/prediction.ts` (31 unit tests), `tests/smoke-prediction.mjs` (47 browser checks)

### How it works
- Gate: GOOD and MOCK usable; DEGRADED usable with a VERIFY flag; STALE (also a stale MOCK), INVALID, DENIED, UNAVAILABLE, NO_FIX, ACQUIRING refuse with GPS_NOT_USABLE and the hint GPS UNRELIABLE
- Track: straight line ahead along COG (great circle on the initial course), 500 NM look-ahead in 5 NM legs, then the existing `nextAreaAlongTrack` (so the antimeridian works as before)
- Figures: distance to entry (NM), ETA = distance / SOG, entry time = FIX time + ETA (so an old fix is not flattered), required start = entry time - (FOBAS duration + margin), start distance before entry = SOG x (duration + margin), time to start = start time - now (negative = passed, shown as PASSED, never clamped), start point on the track (null once passed)
- Independent problems are all reported together (e.g. GPS + duration + margin). `REAL` scope with only DEMO areas gives NO_AREA_DATA, never "outside"
- FOBAS duration: `calculateFobas` is run by the engine and its own messages are passed through. The vessel profile holds quantity and consumption but NOT sulphur values, so the Changeover screen publishes its form (profile prefill + the sulphur values you type) to the session store. Leaving the screen keeps the values; reloading the app loses them (nothing is saved)
- UI: Dashboard CURRENT AREA / NEXT REGULATORY AREA / CHANGEOVER panels replace the placeholders; Changeover screen has a LIVE CHANGEOVER START panel and a safety-margin field; the map draws the COG projected track, an ENTRY marker and a CHANGEOVER START marker (text labels). Settings has "PREDICTION DESIGN POINTS - UNCONFIRMED PROPOSAL"

### Modified
- `MapPanel.tsx` (draws prediction items), `MapScreen.tsx` (the mock end-point projection is hidden while a COG prediction is OK, so there is no duplicate entry marker), `Changeover.tsx` (publishes inputs, margin field, live panel; profile prefill no longer overwrites values already entered), `Dashboard.tsx`, `Settings.tsx`, `version.ts` (0.8.0 / chunk 07), `package.json`, `tests/run.ts`
- `tests/smoke-calculator.mjs`: the Calculate click now targets the button by role (the word "calculate" now also appears in refusal text); `tests/smoke-gps.mjs`: Settings now has two "Confirmed: NO" lines (GPS and prediction), expectation changed from 1 to 2

### Tests
- `npm test`: 160 passed, 0 failed (129 previous + 31 new)
- Browser smoke tests (Playwright, 390x800): prediction 47/47, gps 33/33, map 27/27, geo 10/10, regulations 9/9, calculator 12/12; vessel smoke runs through with 0 console errors (logs rather than asserts)
- `tsc --strict --noUnusedLocals` passed on all non-React `src` files and on `tests/prediction.ts`, `tests/gps.ts`, `tests/map.ts` (`node:assert` checked against a local stub). The `.tsx` files, the React hooks and the other test files were NOT type-checked (no `@types/react` offline)
- Official `npm run build` (tsc + Vite) still NOT verified (no npm registry); `npm run build:offline` (esbuild) passes

### Design decisions and limitations (all UNCONFIRMED PROPOSALS)
- Projected track: straight COG line, look-ahead 500 NM, leg 5 NM, minimum SOG 0.5 kn. No route waypoints yet. Assumes constant course and speed; a vessel that turns, slows or follows a channel will differ
- Safety margin: user-entered minutes, no default; a missing margin refuses (MARGIN_MISSING); 0 is used only if entered; junk or negative is MARGIN_INVALID
- Edges of areas are straight in lon/lat space while the track is a sampled great circle (short legs keep the difference small); haversine on a sphere (error up to about 0.5% vs WGS84)
- BOUNDARY counts as ALREADY_INSIDE (in contact), the conservative choice
- DEMO scope is a visible switch (default off). With it off the app is in REAL scope and, with no real areas, says NO AREA DATA
- Panels make no regulatory statement: no sulphur limit, no "required fuel", no compliance claim. Operational hints (VERIFY, GPS UNRELIABLE) are data only; no alert engine (Chunk 12)
- Prediction inputs and results are NOT persisted; no position history exists
- Not verified on real GPS hardware or with a real FOBAS reference value

## Chunk 06 - GPS engine (v0.7.0)
### Added
- `src/models/gps.ts`: `GpsFix` (null = not reported, never 0), `GpsState`, `GpsReliability` (NO_FIX, ACQUIRING, GOOD, DEGRADED, STALE, INVALID, DENIED, UNAVAILABLE, MOCK), `canDrawPosition`
- `src/calculations/gps/` (pure, no React, no clock access; `now` is always passed in): `thresholds.ts` (`GPS_THRESHOLDS`, all `confirmed: false`), `units.ts` (m/s <-> kn with 1852 m/NM, course normalisation to [0,360), age and coordinate formatting), `fix.ts` (`validateFix`, `impliedSpeedKn`, `isJump`, `motionFor` incl. DERIVED SOG/COG, `acceptFix`), `state.ts` (`classifyFix`, `buildGpsState`)
- `src/services/gps/`: `source.ts` (replaceable `GpsFixSource` interface, Capacitor-ready), `deviceSource.ts` (`navigator.geolocation.watchPosition` behind a `GeolocationLike` interface; denied / unavailable / timeout / insecure context / no API each map to a specific state), `mockSource.ts` (always stamps `source: "mock"`; manual `push` and deterministic `script`), `store.ts` (`createGpsStore`: one active source, last accepted fix, 1 s re-evaluation timer only while active, stale-callback guard), `chip.ts`, `index.ts` (app singleton, `startDeviceGps`, `ensureMockGps`, `stopGps`); `src/hooks/useGps.ts`
- UI: `components/GpsPanel.tsx` (state, position, data age, accuracy, SOG, COG, source, DERIVED flags, reasons, Start/Stop; unknown values read "not available"); header GPS chip now shows the real state; Dashboard "CURRENT POSITION - GPS" panel replaces the placeholder; Settings "GPS THRESHOLDS - UNCONFIRMED PROPOSAL" panel
- `src/map/gpsVessel.ts`: `vesselFromGps` (vessel only for GOOD / DEGRADED / STALE / MOCK, with text tags `MOCK`, `STALE <age>`, `DEGRADED`) and `mapGpsNote`
- `tests/gps.ts` (46 unit tests), `tests/smoke-gps.mjs` (33 browser checks)

### Modified
- `MapPanel.tsx`: vessel and the NO POSITION badge now come from the GPS state; note text states MOCK / device / state reason
- `MapScreen.tsx`: the Chunk 05 mock position is replaced by a DEVELOPER MOCK GPS panel that feeds the MOCK source (adds optional accuracy, speed, course and fix-age fields so every GPS state can be exercised); GPS STATUS panel added
- `mockScene.ts`: `applyMockScene(p, scene, withVessel = true)`; the map passes `false` because the vessel belongs to the GPS state
- `SvgMap.tsx` (vessel label + class), `provider.ts` (`VesselItem` label/quality/mock; track layer label "Track (not recorded yet)"), `AppShell.tsx`, `Dashboard.tsx`, `Settings.tsx`, `theme.css`, `version.ts` (0.7.0 / chunk 06), `package.json`, `tests/run.ts`

### Tests
- `npm test`: 129 passed, 0 failed (83 previous + 46 new)
- Browser smoke tests (Playwright, 390x800): gps 33/33 (initial state, permission denied, permission granted with a mocked browser position, teleport rejected then recovery, stop, MOCK / STALE / DEGRADED / INVALID states, DERIVED SOG/COG, projection from the GPS state, zero external requests, zero console errors); map 27/27, geo 10/10, regulations 9/9, calculator 12/12 re-run clean; vessel smoke runs through with 0 console errors (it logs rather than asserts)
- `tsc --strict --noUnusedLocals` passed on all non-React `src` files (GPS, map, geo) and on `tests/gps.ts` + `tests/map.ts` (checked against a global `@types/node`). `.tsx` files and the other test files were NOT type-checked (no `@types/react` offline)
- Official `npm run build` (tsc + Vite) still NOT verified (no npm registry); `npm run build:offline` (esbuild) passes

### Design decisions and limitations
- Every threshold is an UNCONFIRMED PROPOSAL (stale 30 s, poor accuracy 50 m, max plausible speed 50 kn, clock skew 5 s, derived interval 5 to 120 s, derived COG min 20 m). They are engineering defaults, not rules; confirm or change them
- Unreported accuracy is DEGRADED, not GOOD: a position whose accuracy is unknown cannot be confirmed as accurate
- Jump test subtracts both accuracy radii (unreported counts as 0, i.e. strictest) so normal receiver noise is not a teleport. A rejected fix is not adopted as the baseline; with a long enough gap the implied speed falls and the next fix is accepted
- The Geolocation `heading` is direction of travel (course over ground), not a compass heading, and is reported as COG. It is not suppressed at very low speed
- SOG/COG are derived only from the immediately previous accepted fix. A receiver that reports no speed AND delivers fixes faster than every 5 s never gets a derived value (stated reason shown). An anchor-based derivation would fix this if real hardware needs it
- STALE keeps the last known position drawn with a text tag; projection and DEMO entry marker are hidden while STALE
- Not verified on real hardware or real browsers other than headless Chromium: real receiver accuracy/speed/heading behaviour, iOS Safari permission flow, background behaviour of watchPosition
- Not built: position history / track buffer (Track layer has no source), live changeover prediction, alerts, any compliance statement

## Chunk 05 - Mini map + full-screen map (v0.6.0)
### Added
- `src/map/` (provider layer, pure TypeScript): `provider.ts` (`MapProvider` interface: view, vessel, polyline, area, marker, layer visibility; layers `areas`, `demo`, `track`, `projected`, `vessel`, `markers`), `svgProvider.ts` (the single implementation, an immutable scene store; `resolveProviderKind` for `VITE_MAP_PROVIDER`), `projection.ts` (pure drawing math: local equirectangular projection, antimeridian-safe path/polygon projection reusing the Chunk 04 unwrap, `fitView`, zoom/pan with clamps, graticule step), `mockScene.ts` (developer mock position -> scene using ONLY the Chunk 04 engine: current DEMO area, next DEMO entry marker, heading from bearing)
- Renderer and UI: `SvgMap.tsx` (offline SVG: lat/lon graticule, areas with holes, tracks, markers, vessel, zoom/pan/FIT buttons), `MapPanel.tsx` (shared by both maps: layer checkboxes, NO POSITION badge, NO REAL AREAS LOADED notice, area info panel, mandatory `MAP_DISCLAIMER`), `screens/MapScreen.tsx` (full map + developer mock-position panel, labelled NOT GPS, NOT SAVED)
- Dashboard now shows the mini map (placeholder removed) with a link to the full map
- `src/data/bundledAreas.ts` (`null`: no real area geometry bundled), `src/utils/coords.ts` (`parseCoord`, strict: empty/junk is never 0; moved out of `GeoSelfTest`)
- `tests/map.ts` (15 tests, includes a fake provider), `tests/smoke-map.mjs` (27 browser checks)

### Modified
- `routes.ts` (map is implemented; Dashboard chunk label now "06-07"), `screens/index.tsx`, `Dashboard.tsx` (Current area / next area panels now point to Chunk 07), `GeoSelfTest.tsx` (shared `parseCoord`), `theme.css` (map styles), `.env.example` (`VITE_MAP_PROVIDER=svg`), `version.ts` (0.6.0 / chunk 05), `package.json`, `tests/run.ts` (route test lists `map` as implemented)

### Fixed
- `tests/smoke-vessel.mjs` hard-coded an old absolute `dist` path and could not run in a fresh checkout; it now resolves `../dist` relative to the file
- Longitude labels at +/-180 no longer show a W/E suffix

### Tests
- `npm test`: 83 passed, 0 failed (68 previous + 15 new)
- Browser smoke tests (Playwright, 390x800): map 27/27 OK incl. offline mode, zero external requests, zero console errors; geo 10/10, regulations 9/9, calculator 12/12 re-run clean; vessel smoke runs through with 0 console errors (it logs rather than asserting)
- `tsc --strict` passed on the non-React map/geo files; `.tsx` and `tests/` still NOT type-checked (no `@types/react` / `@types/node` offline)

### Design decisions and limitations
- Provider choice: an offline SVG renderer instead of Leaflet. The app is offline-first and no verified basemap or tile licence exists, so tiles would be blank at sea and any coastline would be invented geography. The grid is lat/lon lines only. `VITE_MAP_PROVIDER` other than `svg` is reported as not implemented and falls back to SVG. A tile provider can be added behind the same interface later
- The map makes no geometry decision: area results, distances and entry points all come from `src/calculations/geo/`
- DEMO areas are drawn only when the DEMO layer is on, with dashed outline, hatch and a "(DEMO)" label (status never by colour alone); the DEMO layer is OFF by default
- Display projection is equirectangular around the view centre (display only, distorts at high latitude; latitude clamped to +/-85). Areas are drawn in one longitude copy nearest the view centre
- Not built: changeover start marker has no data source until Chunk 07; track layer has no source until Chunk 06; no drag/pinch gestures (buttons only); no area-label collision handling (labels can overlap); area info has no source/verification fields because the area model has none yet
- No GPS, live prediction, SOx/NOx rules or compliance statement

## Chunk 04 - ECA geographic engine (v0.5.0)
### Added
- `src/models/geo.ts`: `GeoPoint`, `GeoRing`, `GeoPolygon {outer, holes}`, `GeoArea {id, name, type, polygons, isDemo}`, `PointState` (INSIDE / OUTSIDE / BOUNDARY)
- `src/calculations/geo/` (pure; chosen over `src/map/` because it is calculation, and `src/map/` is reserved for the Chunk 05 map UI):
  - `geometry.ts`: antimeridian unwrap/shift, segment intersection, ring validation (closed, >= 4 points, no repeated points, no self-intersection or overlap, no pole-enclosing rings)
  - `parse.ts`: strict GeoJSON-style parser (Polygon / MultiPolygon only, `[lon, lat]`), path-tagged readable errors, rejects bad coordinates, unclosed / short / self-intersecting rings, holes outside or touching the outer ring, unknown fields, duplicate ids, `DEMO-` id prefix rules. Never repairs
  - `spatial.ts`: point-in-polygon/area (holes, MultiPolygon, BOUNDARY), haversine distance (R = 6371008.8 m, stated assumption; 1 NM = 1852 m), initial bearing, nearest point and distance to boundary, track analysis (ordered ENTRY / EXIT with cumulative distance), distance to first entry
  - `areaEngine.ts`: `evaluatePosition` (current area(s), overall state, distance to each boundary) and `nextAreaAlongTrack`; specific error codes for missing / invalid / non-finite / out-of-range positions and invalid tracks
- Data isolation: scope `REAL` ignores DEMO areas entirely, scope `DEMO` (explicit) uses only DEMO areas; with no areas in scope the answer is `UNKNOWN_NO_AREA_DATA`, never OUTSIDE
- `src/data/demoAreas.ts`: 3 FICTIONAL DEMO areas in open ocean (rectangle, rectangle with hole, rectangle crossing the antimeridian); no real ECA, coastline, port or regulation coordinates
- `src/components/GeoSelfTest.tsx` on Settings: "GEOGRAPHIC ENGINE SELF-TEST (DEMO)" (strict lat/lon input, empty is never 0, per-area state, distance in NM, nearest boundary point, REAL-scope line showing UNKNOWN)
- `tests/geo.ts` (22 tests), `tests/smoke-geo.mjs` (manual Playwright smoke test)

### Modified
- `Settings.tsx` (self-test panel), `version.ts` (0.5.0 / chunk 04), `package.json` version, `tests/run.ts`

### Fixed
- None

### Tests
- `npm test`: 68 passed, 0 failed (46 previous + 22 new). Browser smoke tests (Playwright, 390x800): geo 10 checks passed, regulations smoke test re-run with no failures, 0 console errors
- `tsc --strict` passed on the new non-React files (`calculations/geo/*`, `models/geo.ts`, `data/demoAreas.ts`). `tests/geo.ts` and all `.tsx` NOT type-checked (no `@types/node` / `@types/react` offline)

### Design decisions and limitations
- Antimeridian: longitudes stay in [-180, 180]; rings and tracks are unwrapped so consecutive vertices differ by <= 180 degrees (an edge is always the short way round); queries are shifted by multiples of 360. Polygons enclosing a pole are rejected
- Edges are straight in lon/lat space (GeoJSON convention), not great circles; distances are haversine. Long edges (hundreds of NM) differ from great-circle arcs. Track legs should be short
- BOUNDARY tolerance 1e-9 degrees (~0.1 mm). In track analysis, BOUNDARY counts as "in contact" (conservative); a zero-length tangent touch at a single vertex is not an entry
- Distance to boundary: nearest edge point chosen in a local equirectangular projection, reported distance is haversine to that real point (can slightly exceed the exact minimum for very long edges)
- Not checked: overlap between polygons of one MultiPolygon; ring winding order
- No map, GPS, SOx/NOx rules or compliance statement. No production areas exist; real GeoJSON must be supplied by the user

## Chunk 03 - Regulation data model (v0.4.0)
### Added
- `src/models/regulation.ts`: record type (authority, document, reference, effective/expiry date, applicability, source URL, publication date, last verified date, dataset version, time-state, DEMO flag) and dataset envelope `{schemaVersion, datasetId, version, publicationDate, isDemo, records}`
- `src/services/regulations/validation.ts` (pure): required-field detection (missing vs invalid), ISO date sanity, http(s) URL check, publication/verified date ordering, dataset-version match, duplicate ids, unknown-field rejection, time-state vs date consistency. Failing records are REJECTED, never repaired
- `src/services/regulations/loader.ts`: strict offline parser (`parseDataset`, `parseDatasetJson`) with readable errors for corrupt, unsupported-version, unknown-field and malformed datasets; freshness evaluation; dataset freshness (oldest record; DEMO/empty/error = UNVERIFIED); status (`none` / `demo_only` / `production` / `error`) and header-chip text
- `src/data/demoRegulations.ts`: 3 FICTIONAL records (`DEMO-001..003`, `isDemo`, `.invalid` URLs, no real rule, authority or citation) that pass through the same validator; `src/services/regulations/bundled.ts` (no production dataset bundled)
- Regulation Center screen (`src/screens/RegulationCenter.tsx`): dataset status, "REGULATION COULD NOT BE VERIFIED" whenever no production dataset exists, thresholds panel marked UNCONFIRMED, record cards with full source metadata and time-state, rejected-record listing, DEMO records hidden behind a working Show/Hide button and labelled "DEMO (FICTIONAL)"
- Header chip now reflects real state (`NO VERIFIED REGULATIONS (DEMO ONLY)` today)
- `tests/regulations.ts` (13 tests), `tests/smoke-regulations.mjs` (manual Playwright smoke test)

### Modified
- `AppShell.tsx` (regulation chip), `routes.ts` (Regulation Center chunk label now "08, 11"), `screens/index.tsx`, `version.ts` (0.4.0 / chunk 03), `tests/run.ts`, `package.json` version
- `REGULATION_DATASET_VERSION` deliberately still `null` (no real dataset exists)

### Fixed
- None

### Tests
- `npm test`: 46 passed, 0 failed (33 previous + 13 new). Production-shaped fixtures in tests are synthetic ("TEST AUTH", `.invalid` URLs) and are never shipped or rendered
- Browser smoke test (Playwright, 390x800): 9 checks passed, 0 console errors

### Known limitations
- Official `npm run build` (tsc + Vite) STILL NOT VERIFIED (npm 403). Built with `npm run build:offline`; partial `tsc --strict` of models/services/data/tests passed; `.tsx` not type-checked
- Freshness thresholds (30 / 90 days) are an UNCONFIRMED PROPOSAL, not a regulatory rule; the `expiryDate` = "first day the record no longer applies" convention also needs confirmation
- No dataset import/persistence yet (Chunk 11); no regulatory content exists anywhere in the app

## Chunk 02 - FOBAS calculation engine (v0.3.0)
### Added
- `src/calculations/fobas.ts`: pure engine for t = (Q/R)·ln[(S_H−S_L)/(S_T−S_L)] (symbols documented in code and UI). Explicit unit handling (m³, L, t, kg; t/h, kg/h, m³/h, L/h, t/day, m³/day). Mixed mass/volume requires an explicit user-entered density (kg/m³), never defaulted; an unneeded density is ignored and noted. Result in h/min (rounded to the nearest minute; exact hours also shown) plus step-by-step explanation
- Validation: missing vs invalid kept separate, specific messages; sulphur 0–100 % m/m; rejects S_L ≥ S_H, S_T ≤ S_L (log undefined) and S_T ≥ S_H (no positive duration). Never clamps or corrects
- `src/services/profile/prefill.ts`: prefill quantity/consumption/arrangement only from a readable saved vessel profile; unreadable or empty profile gives nothing
- Changeover Calculator screen (`src/screens/Changeover.tsx`) replacing the placeholder; prefilled fields marked "From vessel profile (editable)" and lose the marker when edited; caution if the profile's arrangement is not a common mixing system; result states it is a timing estimate, not a compliance statement
- `tests/fobas.ts` (11 tests), `tests/smoke-calculator.mjs` (manual Playwright smoke test)

### Modified
- `routes.ts` (Changeover implemented), `screens/index.tsx`, `version.ts` (0.3.0 / chunk 02), `tests/run.ts`, `package.json` version

### Fixed
- None

### Tests
- `npm test`: 33 passed, 0 failed (22 previous + 11 new). Test values are hand-verified from the formula (e.g. S 0.6/0.1/0.35 gives ratio 2, Q=12 t, R=3 t/h gives 4·ln2 h = 2 h 46 min). No externally sourced "official" examples were used; none were supplied, so none are claimed
- Browser smoke test (Playwright, 390x800): 12 checks passed, 0 console errors (missing list, inline errors, result, density prompt, prefill + marker, unreadable profile ignored)

### Known limitations
- Official `npm run build` (tsc + Vite) STILL NOT VERIFIED (npm 403). Built with `npm run build:offline`; partial `tsc --strict` of models/services/calculations passed; `.tsx` not type-checked
- Formula taken as given in `docs/CHUNK_PLAN.md`; not cross-checked against an official FOBAS source. It assumes ideal mixing in the service system
- Rounding to the nearest minute is a display choice, not a regulatory rule

## Chunk 01 - Vessel + Engine Profile (v0.2.0)
### Added
- Models: `src/models/vessel.ts`, `engine.ts`, `fuel.ts` (vessel particulars, main + multiple auxiliary engines with full NOx fields, fuel profile with explicit units)
- `src/services/profile/validation.ts`: pure deterministic validation (IMO check digit, date sanity, power/RPM > 0, required fields). Separates **missing** / **invalid** / **not applicable**; "unknown" counts as missing; nothing is ever defaulted
- `src/services/profile/profileStore.ts`: versioned envelope `{schemaVersion, savedAt, profile}` over the existing `store`; strict parser with readable errors for corrupt / unsupported / damaged data (never repaired); `evaluateStatus` + chip label
- Vessel Profile screen (`src/screens/VesselProfile.tsx`) with sections Vessel, Main Engine, Auxiliary Engines (add/remove with confirm), NOx Profile, Fuel Profile (tanks add/remove); inline validation, completeness panel listing what is missing and why, explicit Save with confirmation message, unsaved-changes indicator, discard-unreadable-data recovery
- `src/components/fields.tsx` form components; `src/hooks/useVesselStatus.ts`
- Header chip `VESSEL PROFILE COMPLETE / INCOMPLETE / UNREADABLE` and a Dashboard vessel-profile panel (reflect the last SAVED profile)
- `tests/profile.ts` (12 new tests), `tests/smoke-vessel.mjs` (manual Playwright smoke test)

### Modified
- `routes.ts` (Vessel Profile now implemented), `screens/index.tsx`, `AppShell.tsx`, `Dashboard.tsx`, `theme.css` (form styles), `version.ts` (0.2.0 / chunk 01), `tests/run.ts`, `package.json` version

### Fixed
- None

### Tests
- `npm test`: 22 passed, 0 failed (10 from Chunk 00 + 12 new: IMO, dates, missing vs invalid, not-applicable/unknown, multiple aux engines, persistence round-trip on both stores, corrupt/unsupported/damaged data, failed write)
- Browser smoke test (Playwright, 390x800): fill, invalid IMO and power shown inline, save blocked on invalid, save OK, header chip, reload persists incl. aux engine, corrupt data shows readable error and discard works, 0 console errors

### Known limitations
- Official `npm run build` (tsc + Vite) STILL NOT VERIFIED: npm registry returned 403 again. Built with `npm run build:offline` (esbuild, no type-check). Partial `tsc --strict` check of `src/models`, `src/services/profile`, `src/services/storage` passed; `.tsx` files could not be type-checked (no @types/react)
- No regulation logic: NOx Tier etc. are user-entered data only. No first-run wizard yet. Unit conversion deliberately absent (Chunk 02)

## Chunk 00
### Added
- Vite + React 19 + TypeScript project, mobile-first dark marine theme (`src/styles/theme.css`)
- App shell: header with status chips (GPS / REGULATIONS / NETWORK), bottom tab bar (Dashboard, Map, Changeover, Port, More), hash router
- 9 routed screens: Dashboard, Live Monitor, Map, Port Advisor, Changeover Calculator, Regulation Center, Vessel Profile, Changeover Log, Settings. Only Dashboard shell and Settings are real; the rest are labelled placeholders naming their delivery chunk
- Safety disclaimer gate (versioned acknowledgement, persisted), map disclaimer text constant
- Storage abstraction (`KeyValueStore`): LocalStorage and in-memory implementations, versioned envelope, specific error messages, automatic memory fallback
- Alert-level, operational-status, freshness and rule-time-state vocabularies (`src/models/status.ts`)
- PWA: manifest, icons, service worker (precache shell, stale-while-revalidate, offline navigation fallback), registration
- Hooks: `useRoute`, `useOnline`, `useStored`
- `scripts/build-offline.mjs` esbuild fallback build
- Docs, `.gitignore`, `.env.example`, `docs/CHUNK_PLAN.md`

### Modified
- None (first chunk)

### Fixed
- None

### Tests
- `npm test`: 10 passed, 0 failed (routing, storage round-trip/prefix/corruption/quota/fallback, status labels, null regulation dataset version)
- Browser smoke test (Playwright, 390x800): disclaimer gate, navigation to 3 routes, service worker controls the page, offline reload works, 0 console errors. Not committed as a script (see limitations)

### Known limitations
- Official `npm run build` (tsc + Vite) NOT verified: sandbox npm registry returned 403. Built with the esbuild fallback; no type-check performed (React/Vite type packages unavailable)
- Service worker uses a fixed cache version `v1` and is not hardened until Chunk 14
- Icons are simple generated placeholders
- No regulation dataset, GPS, map or calculations exist yet
