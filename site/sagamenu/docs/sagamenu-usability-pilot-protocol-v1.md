# SagaMenu Usability Pilot Protocol v1

Date: 29 July 2026
Target: Vercel review prototype
Status: protocol ready; human sessions not yet executed

## Objective

Validate whether a restaurant or coffee-shop owner can create, edit, brand, preview, and publish a catalog without assistance. The automated browser run verifies instrumentation and task completion logic; it does not replace human evidence.

## Participant Profile

Run five moderated sessions:

- two owners or managers who currently maintain a menu;
- one operational staff member;
- one social-media/admin staff member;
- one participant with low familiarity with dashboard software.

Do not enter real customer data, credentials, unpublished pricing, or licensed media into the prototype.

## Test Tasks

1. Upload one photo or video to Media Library.
2. Create one menu as a draft.
3. Edit an existing menu and add a variant or add-on.
4. Change branding or a public-surface preset.
5. Preview both surfaces and publish the draft.

The built-in `Mode uji` automatically marks these five tasks from product events.

## Moderator Script

1. Reset the demo.
2. Open `Mode uji` and start a session.
3. Ask the participant to think aloud without giving navigation instructions.
4. Use `Tandai ragu` whenever the participant hesitates, backtracks, or asks where to click.
5. Record concise notes without names, emails, phone numbers, or customer content.
6. Finish the session and export the JSON report.
7. Store reports only in the approved research folder and assign participant codes P01-P05.

## Acceptance Gate

Pilot passes when:

- at least 4 of 5 participants complete all tasks;
- create-menu completion median is at most 4 minutes;
- edit-menu completion median is at most 3 minutes;
- no participant mistakes the prototype for an ordering/checkout product;
- no critical blocker is repeated by two or more participants;
- average hesitation count is at most 3 per session;
- both public previews are discovered without moderator navigation.

## Severity

- Critical: task cannot be completed or data appears lost.
- High: two or more participants need moderator intervention.
- Medium: repeated hesitation, unclear label, or unnecessary backtracking.
- Low: polish or preference with no task impact.

## Evidence Boundary

The exported report contains:

- random session id;
- start/end timestamps and duration;
- task completion booleans;
- hesitation count;
- moderator notes;
- action name, elapsed time, route, viewport, and non-content counts.

It does not intentionally include direct identity fields. Reports must still be reviewed before sharing.

## Decision After Pilot

- PASS: keep design freeze and start Laravel visual parity.
- CONDITIONAL: fix critical/high findings, rerun affected tasks with two participants.
- FAIL: reopen information architecture and create/edit flow decisions before backend parity.
