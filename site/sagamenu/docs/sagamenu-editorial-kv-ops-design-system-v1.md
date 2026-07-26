# SagaMenu Editorial KV Ops Design System V1

Tanggal: 25 Juli 2026

Status: anchor pack complete; ready for coded prototype
Selected target: `docs/design-references/sagamenu-editorial-kv-ops-dashboard-selected-v1.png`

## 1. Anchor Pack

| Screen | Reference |
|---|---|
| Store Display home | `docs/design-references/anchors/pub-01-store-display-home.png` |
| Store item detail | `docs/design-references/anchors/pub-02-store-item-detail.png` |
| Bio Menu home | `docs/design-references/anchors/pub-05-bio-menu-home.png` |
| Bio item detail | `docs/design-references/anchors/pub-06-bio-item-detail.png` |
| Owner item editor | `docs/design-references/anchors/itm-02-owner-item-editor.png` |
| Appearance dual preview | `docs/design-references/anchors/app-05-appearance-dual-preview.png` |
| Pre-publish checklist | `docs/design-references/anchors/pbl-01-pre-publish-checklist.png` |
| Publish success | `docs/design-references/anchors/pbl-03-publish-success.png` |

## 2. Consistency Review

### Passed

- Dark ink navigation remains stable across owner screens.
- Warm off-white canvas and thin grey-green borders replace heavy shadows.
- Lime is reserved for selected state, positive momentum, and the main publish/save action.
- Pastel colors communicate meaning instead of decorating every panel.
- Editorial illustration appears once per owner screen and stays subordinate to the task.
- Product photography is the primary public-menu visual.
- Store Display uses a top category rail and four-column photo grid.
- Bio Menu uses a mobile-first list and shows menu content quickly.
- Store detail and Bio detail contain the same information in device-appropriate patterns.
- Add-ons and variants remain informational.
- Publish screens explain blockers, atomic publish, and version safety.

### Normalization Required in Code

- ImageGen typography is reference-only; code uses Manrope and deterministic sizes.
- Generated brand marks are not reused. Prototype keeps the SagaMenu and demo-business marks already owned by the project.
- Product images in anchor previews are demo references. Client content continues to come from Media Library.
- Cards use a maximum 8 px radius in code even where generated previews appear rounder.
- Mobile detail uses a full-height sheet with one scroll container and no page bleed.
- Status meaning uses icon plus text, not color only.
- Preview frames in Appearance are scaled containers, not decorative device mockups.

## 3. Core Tokens

### Color

```css
--sm-ink: #171d1a;
--sm-ink-soft: #29312d;
--sm-canvas: #f3f5f1;
--sm-surface: #ffffff;
--sm-surface-soft: #f8faf8;
--sm-line: #dce2de;
--sm-line-strong: #c6d0ca;
--sm-text-muted: #66716c;
--sm-text-subtle: #8b948f;
--sm-primary: #236354;
--sm-primary-dark: #17483d;
--sm-primary-soft: #e4f1ec;
--sm-terracotta: #b34f32;
--sm-lime: #cbf45a;
--sm-lime-strong: #b7e72f;
--sm-yellow: #f4d35e;
--sm-yellow-soft: #fff4cf;
--sm-pink: #e9a7cb;
--sm-pink-soft: #fbe9f3;
--sm-blue: #a9c6f5;
--sm-blue-soft: #edf4ff;
--sm-mint: #cdebbd;
--sm-mint-soft: #edf8e9;
--sm-danger: #a23d3d;
--sm-danger-soft: #fae9e9;
```

### Typography

```css
--sm-font-ui: "Manrope", ui-sans-serif, system-ui, sans-serif;
--sm-text-xs: 12px;
--sm-text-sm: 13px;
--sm-text-body: 14px;
--sm-text-body-lg: 16px;
--sm-text-section: 18px;
--sm-text-title: 30px;
--sm-line-body: 1.5;
--sm-letter-spacing: 0;
```

### Shape, Spacing, and Elevation

```css
--sm-radius-xs: 4px;
--sm-radius-sm: 6px;
--sm-radius: 8px;
--sm-radius-sheet: 24px;
--sm-space-1: 4px;
--sm-space-2: 8px;
--sm-space-3: 12px;
--sm-space-4: 16px;
--sm-space-5: 20px;
--sm-space-6: 24px;
--sm-space-7: 28px;
--sm-space-8: 32px;
--sm-shadow-soft: 0 12px 36px rgb(23 29 26 / 8%);
```

`--sm-radius-sheet` is allowed only for mobile bottom/full-height sheet top corners.

## 4. Owner App Shell

- Desktop frame: 1440 x 1024.
- Sidebar: 220-232 px.
- Utility header: 64-72 px.
- Content padding: 28 px.
- Grid: 12 columns, 16 px gap.
- Main workspace: 8 columns.
- Context rail: 4 columns, 296-336 px.
- Mobile companion: 390 x 844, top bar 56 px, bottom navigation 64 px.

### Sidebar

- Background: `--sm-ink`.
- Label: white at 88% opacity.
- Active row: white at 14% opacity or lime where strong context is needed.
- Icon: 20 px.
- Row height: 44 px.
- Business switcher stays at the bottom.

### Top Actions

- Button height: 40 px desktop, 44 px touch.
- Primary action: lime background with ink text.
- Secondary action: white surface and line border.
- Icon-only action: 36 x 36 px desktop, 44 x 44 px touch.

## 5. Public Store Display

- Frame targets: 1194 x 834 and 1024 x 768.
- Header: 76 px.
- Category rail: 56 px and sticky.
- Content padding: 24-32 px.
- Four columns at 1194 px, three columns at 1024 px.
- Photo ratio: 4:3.
- Photo share of card: 65-72%.
- Card gap: 16 px.
- Product card radius: 8 px.
- Header illustration: maximum 140 x 90 px.

No left-side category navigation.

## 6. Public Bio Menu

- Frame target: 390 x 844.
- Brand header: 148-168 px.
- Search: 44 px.
- Category rail: 48-56 px and sticky.
- Content padding: 16 px.
- List item height: 112-124 px.
- Thumbnail: 104-112 px.
- At least one complete item and the next-item hint appear in the first viewport.
- Header illustration: maximum 96 x 72 px.

## 7. Item Detail

### Tablet

- Overlay: 1000-1060 px wide, max 740 px high.
- Split: 44% media, 56% information.
- Backdrop dims the grid but preserves context.
- Close target: 44 x 44 px.
- Right panel is the only scroll container.

### Mobile

- Full-height sheet.
- Top corners: 24 px.
- Sticky close/share bar.
- Hero media: 4:3.
- Sheet content is the only scroll container.
- No sticky ordering footer.

## 8. Form and Editor

- Use sections separated by rules, not a card for each field.
- Input height: 44 px.
- Label: 13-14 px.
- Help/error text: 12-13 px.
- Textarea min height: 96 px.
- Upload preview maintains explicit ratio.
- Right rail remains sticky until viewport width requires stacking.
- Inline validation is close to the affected input.

## 9. Semantic State Rules

| State | Color | Required treatment |
|---|---|---|
| Active/success | mint/green | icon + label |
| Selected/primary | lime | high-contrast ink text |
| Draft | yellow | edit icon + label |
| Information | blue | info icon + explanatory copy |
| Promotion | pink | tag icon + label |
| Blocker/error | danger | icon + object-specific recovery action |
| Sold out | yellow or neutral | text label; public photo may dim slightly |
| Hidden | neutral | eye-off icon + label |

## 10. Illustration Rules

- Style: editorial cut-paper 2D, soft black outline, subtle paper grain.
- One illustration scene per owner screen.
- No illustration in product detail.
- No illustration competes with product photography.
- No words, logos, or critical copy inside generated assets.
- Dashboard illustration max: 300 x 210 px.
- Context-rail illustration max: 180 x 140 px.
- Mobile header illustration max: 96 x 72 px.

## 11. Accessibility and Motion

- WCAG AA contrast for text and controls.
- Focus ring: 3 px primary mix with white.
- Touch target: minimum 44 x 44 px on mobile/public surfaces.
- Status never relies on color alone.
- Decorative illustrations use empty alt text.
- Meaningful state illustrations use concise alt text.
- Motion duration: 140-220 ms.
- Respect `prefers-reduced-motion`.
- Loading uses skeletons matching final layout; no static ImageGen loading artwork.

## 12. Implementation Gate

The coded prototype may proceed when:

- tokens above are represented in CSS;
- selected target and all eight anchors are stored locally;
- public order/cart controls remain absent;
- desktop/tablet/mobile component dimensions are explicit;
- existing prototype interactions remain testable;
- public Laravel views are not changed until prototype and dashboard QA pass.
