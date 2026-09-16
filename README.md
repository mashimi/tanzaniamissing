# Tanzania Missing Persons Registry

An independent, volunteer-maintained registry documenting cases of enforced disappearances and abductions in Tanzania, so that no one is forgotten and the record cannot simply be erased.

**Website:** [www.tanzania.qd.je](https://www.tanzania.qd.je) · [tanzaniamissing.pages.dev](https://tanzaniamissing.pages.dev)

## What this is

- A public, searchable registry of missing, found, and deceased persons documented by civil-society volunteers.
- Bilingual interface: **Swahili and English**.
- Every case includes the person's name, photo (where available), last-seen date and location, circumstances, and cited sources.

## Verification policy

Every case requires **at least two independent sources**, or direct confirmation from the family, before it is marked as verified. Verified cases display a badge and list their sources on the case page. Corrections and removal requests from families are honoured.

## Submitting a report

Reports can be submitted through the [report form](https://www.tanzania.qd.je/submit/). Submissions are anonymous — no name or account is required — and go to a private review queue. Nothing is published until it is reviewed.

## How it works

- The registry data lives as individual JSON records in [`mp-tz/records/`](mp-tz/records/), one file per case. Each record contains the full case details, verification status, and source URLs.
- A build script validates every record (`mp-tz/scripts/lint-records.mjs`) and generates the public data file (`mp-tz/public/data/persons.json`).
- The site is a static build of **Next.js 14** (static export) served via **Cloudflare Pages**, with small edge functions handling the report API and image proxying.
- Because every case is an open JSON file in this repository, anyone can mirror the registry — fork it and serve the static build from any static host.

## Data structure

A case record looks like this:

```json
{
  "id": "0001-humphrey-polepole",
  "full_name": "Humphrey Polepole",
  "last_seen_date": "2025-10-06",
  "location": { "name": "Dar es Salaam", "region": "Dar es Salaam" },
  "status": "missing",
  "circumstances": "...",
  "verified": true,
  "sources": ["https://...", "https://..."]
}
```

Case statuses: `missing`, `found_alive`, `found_deceased`.

## Contributing

- **Report a case:** use the website's report form — that is the fastest and safest route.
- **Suggest a correction** to an existing case: open a GitHub issue describing the correction and citing a source.
- **Mirroring:** fork this repository and deploy the `mp-tz/` static build to any static hosting provider.

## License

Content is released under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).

## Disclaimer

This registry is maintained by civil-society volunteers. Case details are compiled from cited public sources and family reports; where an allegation has not been independently confirmed by established media, the description attributes the claim to its source. This registry is not an official government record.
