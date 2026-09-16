# Security Policy

This registry documents sensitive cases involving real people at real risk. Security here means two things: keeping the website safe, and keeping submitters and families safe. This policy covers both.

## Reporting a security vulnerability

**Do not open a public GitHub issue for security problems.**

If you find a vulnerability — for example a way to bypass the moderation queue, expose unpublished submissions, inject content into case records, or deanonymize submitters — report it privately using one of these channels:

1. **GitHub Private Vulnerability Reporting** (preferred): open the repository's **Security** tab and use **"Report a vulnerability"**. This reaches the maintainers directly and privately, without exposing either party.
2. **Signal:** use the "Message the team on Signal" link on any case page of the website. It reaches the moderation team without revealing your identity to us or ours to you.

Please include: a description of the issue, steps to reproduce it, and the affected URL or component. We will acknowledge receipt and work with you on a fix before any public disclosure.

## What we ask you not to do

- Do not test vulnerabilities against live case records in ways that could expose or corrupt them.
- Do not attempt to access the moderation dashboard, the submissions database, or maintainer accounts.
- Do not perform denial-of-service testing. This site documents human-rights cases; downtime hides real information from real families.

## How private case submissions are protected

- **Submission channel:** reports submitted through the website form go only to a private review queue. Submissions are anonymous — the form requires no name, email, or account.
- **Review process:** nothing is published automatically. Every submission is read and triaged by the moderation team before publication, and rejected submissions are never made public.
- **No submitter data is published:** we do not publish the identity, IP address, or contact details of a submitter under any circumstances. If a submitter chooses to include identifying information in the report text itself, it is removed before publication.
- **Team access:** the review queue is accessible only to the moderation team. Access credentials are not shared and are rotated if there is any suspicion of exposure.
- **Source verification:** published cases cite their sources. Case descriptions attribute allegations to the person or publication that made them, so the registry never states unverified claims as established fact.

## Handling sensitive information in case records

- Records must never contain a submitter's identity or a family member's private details unless that information is already public or the family published it themselves.
- Removal requests from families are honoured without question.
- If you spot sensitive information that should not be in a published record, report it through the channels above and it will be removed promptly.

## Scope

This policy applies to the website (including `www.tanzania.qd.je` and `tanzaniamissing.pages.dev`), the APIs under `/api/*`, the case records in `mp-tz/records/`, and the build tooling in this repository.
