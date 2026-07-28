# SagaMenu Vercel Prototype

Prototype interaktif untuk review UI/UX dan kegunaan SagaMenu.

## Boundary

- Static HTML, CSS, dan JavaScript.
- Data demo disimpan di `localStorage` browser.
- Tidak terhubung ke Laravel, Saga Platform, payment gateway, database customer, atau production.
- Tidak boleh dipakai sebagai bukti backend atau SaaS production readiness.

## Local

```powershell
npx.cmd serve . -l 4178
```

## Review routes

- `#overview`
- `#menus`
- `#categories`
- `#addons`
- `#appearance`
- `#publish`
- `#analytics`
- `#preview-mobile`
- `#preview-tablet`

## Sprints 9-17 review

- `Mode uji` records five usability tasks without direct identity fields.
- Menu edit supports image focal point and one MP4/WebM video.
- Video player is controls-only, muted in the prototype, and never autoplays.
- Brand Kit uses Identitas, Tipografi, Bentuk, and Preset tabs.

Run the focused acceptance suite:

```powershell
npm.cmd run qa:sprints9-17
```

Human pilot instructions: `../docs/sagamenu-usability-pilot-protocol-v1.md`.
