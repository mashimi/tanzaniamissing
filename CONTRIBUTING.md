# Contributing to the Tanzania Missing Persons Registry

Thank you for wanting to help document these cases. This project exists so that no one is forgotten — and so that every record is accurate, sourced, and safe for the families involved. Please read this guide before contributing.

## Ways to help

### 1. Report a missing person

Do **not** open a GitHub issue to report a new case. Use the website's [report form](https://www.tanzania.qd.je/submit/) instead — it is anonymous, goes directly to the review queue, and protects your identity.

### 2. Suggest a correction to an existing case

If a published case contains an error (wrong date, wrong location, status change, etc.), [open a GitHub issue](https://github.com/mashimi/tanzaniamissing/issues) with:

- The case ID or the person's name
- What is wrong and what it should say
- A source supporting the correction (news article, official statement, family confirmation)

Removal requests from families are honoured without question — state the relationship in the issue, and the record will be removed.

### 3. Add sources to unverified cases

Some cases are published as unverified because they have fewer than two independent sources. If you find news coverage or documentation for such a case, open an issue with the links.

### 4. Run a mirror

Fork this repository and deploy the `mp-tz/` static build to any static host. Every mirror makes the record harder to erase. No permission is needed.

## Case record guidelines

Cases live as one JSON file per person in `mp-tz/records/`. If you propose record changes, follow these rules (they are enforced by `mp-tz/scripts/lint-records.mjs`):

- The filename must match the record `id` (e.g. `0001-humphrey-polepole.json`).
- `verified: true` requires **at least 2 source URLs**.
- Photo URLs must be `https://`.
- Locations must have coordinates within Tanzania.
- `last_seen_date` must not be in the future.
- Only include information that is already public or that the family has shared publicly.

## Privacy and safety rules (strict)

This is a sensitive project. When contributing, you must:

- **Never** post the identity, contact details, or personal data of a report submitter.
- **Never** post information that could identify a family member at risk (home address, workplace, children's schools, etc.) unless the family themselves has published it.
- Attribute allegations to their source rather than stating them as established fact.
- Do not include private phone numbers or messaging handles of any person in records, issues, or pull requests.

Contributions that violate these rules will be rejected and may be reported.

## Pull requests

1. Fork the repository and create a branch from `main`.
2. Make your change (record edits, translations, bug fixes).
3. Run the lint and data build locally:
   ```bash
   cd mp-tz
   node scripts/lint-records.mjs
   node scripts/build-data.mjs
   ```
4. Commit with a clear message and open a pull request describing what changed and why.

Site code changes are reviewed by the maintainers before merge; record changes are additionally checked against the verification policy.

## License

By contributing, you agree that your contributions are licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/), like the rest of the project.
