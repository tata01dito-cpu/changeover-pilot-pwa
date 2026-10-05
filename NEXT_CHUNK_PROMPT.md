# NEXT CHUNK PROMPT: Chunk 16 part B2-2b

Upload `ECA_Changeover_Pilot_Chunk_16_PART_B2-2a.zip` and `eca_seca.zip` (the source files; the PDFs are not copied into the project), then paste everything below the line.

---

Continue the ECA Changeover Pilot at Chunk 16 part B2-2b. Read `PROJECT_CHECKPOINT.md` (Known Issue 5a), `boundaries/README.md` and `docs/CHUNK_PLAN.md` first. The ZIP is the authoritative state.
Baseline to reproduce before changing anything: `npm test` 396/396 (recreate the `node_modules` symlinks to the global packages first), `node tests/smoke-boundaries.mjs` 37/37 and `node tests/smoke-areas.mjs` 56/56. Version 0.18.0.

## Standing rules (unchanged)
- Coordinates come ONLY from the publisher's text or a file I supply. Never typed, never from memory. If a source cannot be read or a line does not match the strict pattern, stop and say so.
- Nothing is repaired, reordered, renumbered or closed silently. Every assumption is written into the file's `notes` and into the docs.
- No compliance wording, no verdicts. The app still bundles no real boundary. Everything imported stays UNVERIFIED until a named person confirms that exact version.
- One chunk per session. Give me the result as a ZIP with instructions, then ask me to continue.

## Decisions already made (do not ask again)
1. Open arcs (North American Pacific 47 points, Atlantic/Gulf 206 points, China coastal 59 points, China Hainan 20 points): **C. They stay OUT.** No coastline file, no closure rule.
2. Coverage flag: **YES, done in B2-2a** (area schema 2 `coverage`, `AREA_COVERAGE_PARTIAL`, `candidate-2`, version 0.18.0).
3. Chinese areas: **YES, done in B2-1**, source data only. East / north is an ASSUMPTION (no hemisphere letters printed).

## Still to fill in before sending
Reading files 15 and 8-2: will a person read the Korean guidance image (file 15, no text layer) and the 67-page CCS notice (file 8-2)? ______ (If blank, both are treated as NOT read and listed as such.)

## Work to do (NO app change; version stays 0.18.0; `src/`, `dist/` and `package.json` must stay identical to the B2-2a ZIP)
- A point-by-point comparison report of `candidate-2` against the publisher's text: every point of the Hawaii ring (45) and the Caribbean ring (55), with its printed text, its decimal value in the candidate and its text line, read by a script from the supplied PDF independently of the first extractor where possible. Report differences, never fix them. Include the irregular Caribbean numbering (44 printed twice, 49 missing).
- The straight-line versus geodesic difference, measured for the longest legs of both rings (the longest known is Caribbean point 54 to 55, about 204 NM): state the number, the formula or method, and the ellipsoid / sphere used. A measurement only; do not change the geometry.
- Update the docs, the checkpoint, the changelog (state that no app file changed) and write the next prompt. Add unit tests for the report.

## Do not
- Do not add a closure, do not guess missing coastline, do not tick the confirmation box in any test against a real file.
- Do not claim which ECAs are in force today. The IMO printout is dated 2016/08/29, the Chinese notice 30 Nov 2018, and nothing newer was checked.
- Do not describe the candidate as confirmed or complete. It is declared PARTIAL.
