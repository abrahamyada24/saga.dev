# SagaMenu Design Freeze v1

Date: 29 July 2026
Direction: Editorial KV Ops
Scope: owner dashboard, menu editor, Bio Menu mobile, Store Display tablet

## Freeze Status

The prototype interaction model is frozen for usability review. New visual ideas must not change navigation, create/edit separation, publish safety, or public-surface behavior until the pilot gate is reviewed.

This freeze is not a production-readiness claim. The Vercel build remains a browser-local prototype; Laravel persistence and infrastructure are separate gates.

## Product Hierarchy

1. Global chrome: business identity, preview launcher, publish command, pilot mode.
2. Primary navigation: Overview, Menu & Katalog, Media Library, Tampilan, Preview & Terbitkan, Analytics.
3. Page command: one primary action per page.
4. Working surface: unframed editor/list with a large live preview where relevant.
5. Contextual action: row edit/status actions; destructive and secondary commands live in overflow or confirmation surfaces.

Do not reintroduce duplicate preview or publish buttons inside page headers.

## Layout Contract

| Surface | Desktop | Mobile |
| --- | --- | --- |
| Prototype strip | 32 px fixed height | 32 px fixed height |
| Sidebar | 248 px | off-canvas |
| Dashboard content | remaining width, responsive | single column |
| Appearance workspace | controls plus dominant live preview | stacked controls and preview |
| Public Bio Menu | 390 px target | full viewport width |
| Store Display | tablet-first, category rail above menu | responsive fallback |
| Side sheet | maximum 560 px | full viewport width |
| Component radius | 5-8 px | 5-8 px |

The preview remains visually larger than the control column. Public menu categories stay above the item content on tablet and mobile.

## Typography

- Default heading and body: Plus Jakarta Sans.
- Weights: 400, 500, 600, 700, 800.
- Letter spacing: 0.
- Uploaded brand font is optional and must retain Plus Jakarta Sans as fallback.
- A font cannot be published until the owner confirms its usage license.

## Color Tokens

Dashboard defaults:

- Ink `#18201d`
- Muted `#66716c`
- Line `#dce2de`
- Canvas `#f4f6f4`
- Surface `#ffffff`
- Primary `#236354`
- Accent `#b34f32`
- Warning `#9a6514`
- Danger `#a23d3d`

Customer-facing colors are editable through Brand Kit. Normal text must maintain at least WCAG AA contrast.

## Menu Editor Contract

Create and edit are intentionally different:

- Create uses a four-step wizard: information, media, choices/detail, review.
- Edit uses focused section navigation and saves only the changed parts.
- Both use device upload or Media Library selection; no photo URL input is exposed.
- Focal point can be edited directly on the image.
- Variants and add-ons are summarized before save.
- Draft state remains private until publish succeeds.

## Video Menu Contract

- One optional video per menu.
- Prototype: MP4/WebM, maximum 2 MB and 60 seconds.
- Laravel: MP4/WebM, maximum 50 MB by default, tenant-scoped, malware-scanned when the required scanner gate is enabled.
- Role: `menu_video`.
- Player: controls, `playsinline`, `preload="metadata"`, no autoplay.
- Primary image is the poster fallback until a processed thumbnail exists.
- Video failure cannot remove or overwrite the last live catalog snapshot.
- Production activation requires storage, processing/transcoding, thumbnail generation, and duration-validation evidence.

## Brand Kit Contract

Brand Kit is divided into four tabs:

1. Identitas: logo and colors.
2. Tipografi: heading/body font and licensed custom font.
3. Bentuk: radius and image treatment.
4. Preset: independent Bio Menu and Store Display layouts.

Changes are draft-only until the owner publishes them.

## Public Surface Contract

Bio Menu and Store Display are catalog previews, not ordering surfaces.

- No cart, checkout, or WhatsApp order.
- Detail includes description, price, media/video, variants, add-ons, ingredients, allergen, dietary, caffeine/spice, and serving note.
- Video is user-controlled and pauses when the detail dialog closes.
- Restricted accounts show a generic maintenance response without leaking billing status or catalog content.

## Accessibility and Motion

- Every icon-only button has an accessible name.
- Focus returns to the originating trigger after dialogs and menus close.
- Keyboard Escape closes launchers/dialogs where expected.
- Reduced-motion preference disables nonessential transitions.
- Desktop and 390 px mobile layouts must have no horizontal document overflow.

## Change Control

Allowed before pilot:

- defect fixes;
- copy clarification;
- accessibility corrections;
- test and documentation improvements.

Requires a new design decision:

- navigation changes;
- create/edit flow convergence;
- moving categories beside the menu;
- adding ordering/checkout;
- autoplay video;
- changing the two public-surface model.
