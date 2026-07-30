# SagaMenu Public Availability Publish Flow

Date: 30 July 2026
Status: implementation and local acceptance
Base: `455d254c5253634ceb8b6174ebebbb00457a1ffb`
Boundary: preview-only public e-menu; no ordering

## Existing App Audit - 10 Roles

| Role | Verified finding | Sprint decision |
| --- | --- | --- |
| Product Orchestrator | Operators already store five availability values, but the quick action only toggled available and sold out. | Finish one explicit operator-to-public flow for all five states. |
| UX Workflow Architect | The edit wizard, table quick action, live preview, dashboard, public card, and detail dialog used different state rules. | Use one status vocabulary and preserve the existing navigation. |
| UI Visual Designer | Status badges already use text, but seasonal was rendered as unavailable and grayscale. | Keep text as the primary cue, add restrained tones, and treat seasonal as available while in its active schedule. |
| Frontend Engineer | Mobile and tablet share card/dialog partials, while analytics treated every unavailable state as sold out. | Add explicit data attributes and track sold-out opens only for sold out. |
| Backend Architect | Availability updates already publish atomically through a new immutable snapshot. | Preserve the transaction and add a canonical derived state to snapshots. |
| Database & Integration Engineer | The database column already stores the five states and scheduling fields exist separately. | No migration, provider, or new operational store. |
| Security Engineer | An unexpected snapshot value previously fell through to available in the dialog. | Unknown values fail closed as unconfirmed and unavailable. |
| QA & Acceptance Engineer | Existing tests covered quick publish, but not the five-state UI contract or the Filament action modal. | Add end-to-end component, snapshot, mobile, tablet, rollback, and analytics assertions. |
| DevOps & Release Engineer | The Laravel target and production prerequisites remain unavailable. | Build and validate locally; retain the 55-gate staging bootstrap. |
| Code Review & Production Auditor | Local rendering cannot prove a production release. | Keep status `IMPLEMENTED_NOT_DEPLOYED` until the exact release passes real staging gates. |

## Research Primer

- Square documents fast dashboard/POS availability changes, explicit available
  and sold-out states, and scheduled resets. This supports a direct operator
  action whose published result is immediately visible across customer
  surfaces.
- Square also separates item status from time-based menu availability. SagaMenu
  therefore keeps `seasonal` informational and available while the existing
  `available_from` and `available_until` window decides whether it is visible.
- WCAG 2.2 Use of Color requires status meaning to be conveyed with text or
  another visible cue in addition to color.
- WCAG 2.2 Status Messages requires assistive technology to receive important
  non-focus-changing updates. Filament success/error notifications retain their
  existing accessible notification behavior, while public availability is
  static visible text inside the card and dialog.

Official references:

- https://squareup.com/help/us/en/article/8495-beta-item-availability
- https://squareup.com/help/us/en/article/6424-create-menus-with-square-for-restaurants
- https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
- https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
- https://www.w3.org/TR/WCAG22/

## Before and After

| Area | Before | After |
| --- | --- | --- |
| Quick action | Ambiguous available/sold-out toggle. | Explicit five-state modal with current value, explanatory copy, loading handling, and success notification. |
| Snapshot | Only raw `availability`. | Raw value plus canonical `availability_state` with key, label, description, availability boolean, and tone. |
| Public card | Seasonal was unavailable/grayscale; unknown had no badge. | Seasonal is visible as `Menu musiman` without grayscale; unknown fails closed as unconfirmed. |
| Detail dialog | Duplicated mapping and unknown defaulted to available. | Same canonical label and tone as the card. |
| Admin preview | Every state except sold out looked available. | All five states use the same labels and semantic tones. |
| Dashboard | Every non-available state was labeled sold out. | Latest-item rows show their actual status. |
| Analytics | Every unavailable card emitted `sold_out_opened`. | Only an explicit `sold_out` card emits that event. |
| Publish failure | Transaction existed but the quick flow lacked focused rollback evidence. | Regression test proves status and active snapshot remain unchanged on validation failure. |

## Scope and Acceptance

Implemented:

1. One canonical availability resolver for operator, snapshot, and public UI.
2. Explicit quick publish modal for five statuses.
3. Atomic status update and immutable snapshot publish.
4. Consistent mobile Bio Menu and tablet Store Display card/detail treatment.
5. Fail-closed compatibility for old or unexpected snapshot values.
6. Correct sold-out analytics classification.
7. Responsive visual QA for operator desktop, public tablet, and public mobile.

Acceptance gates:

1. Operator can select any supported status and receives a success result.
2. Successful change creates a new active snapshot.
3. Failed publish changes neither status nor active snapshot.
4. Snapshot and both public surfaces expose the same key and label.
5. Seasonal remains available and is not grayscaled while inside its visibility window.
6. Unknown values show `Ketersediaan belum dikonfirmasi` and fail closed.
7. Status is visible text and not communicated by color alone.
8. Mobile and tablet have no horizontal overflow or browser errors.
9. Full tests, build, formatting, and dependency security audits pass.
10. Staging bootstrap remains fail closed until real infrastructure exists.

## Risk, Release, and Rollback

- Existing snapshots without `availability_state` remain compatible because the
  public controller derives the state from their immutable raw availability.
- A future change to status semantics needs a contract review because the raw
  snapshot value remains authoritative at render time.
- This batch has no migration, provider, credential, queue, or customer-data
  change.
- Rollback is a code revert. Existing snapshots retain an additive field that
  older code ignores.
- No Laravel deploy is authorized without an exact target, backup/restore,
  HTTPS, provider, monitoring, UAT, rollback, and public smoke evidence.
