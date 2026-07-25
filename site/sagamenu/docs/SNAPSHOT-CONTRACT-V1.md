# Saga Menu Snapshot Contract V1

## Purpose

`CatalogSnapshot.payload` is the immutable, public-safe contract read by both Store Display and Mobile Catalog. Public routes never assemble live output from draft tables.

## Versioning

- Current version: `schema_version = 1`.
- Additive optional fields may remain on version 1.
- Removing, renaming, or changing the meaning of a field requires a new schema version and compatible renderer.
- Database IDs, private user data, internal notes, and upload paths must not enter the payload.

## Root Objects

- `generated_at`: ISO-8601 snapshot generation time.
- `organization`: public brand identity, locale, currency, business type, and public address.
- `catalog`: public identity, enabled surfaces, view mode, hero copy, appearance, business information, and public settings.
- `collections[]`: visible non-empty sections in sort order.
- `featured_offerings[]`: up to six featured offerings.
- `seo`: title and description.

## Offering Object

Every public offering uses a stable `slug` and can contain:

- name, short/full description;
- display price, price type, range/promo values, and currency;
- availability and visibility state;
- badges, tags, ingredients, dietary/allergen details, spice/caffeine level, and serving note;
- informational external action from the server-side label/URL allowlist;
- active public media with role, type, URL, alt text, and safe metadata;
- variant groups, informational option groups, and inclusions.

Hidden or archived offerings are omitted. Collections without public offerings are omitted.

## Appearance Fallbacks

- Invalid or absent colors fall back in the Blade layout.
- Missing and failed images render a branded initial fallback.
- A custom font is enabled only when its validated WOFF/WOFF2 asset is active; the public layout retains a system font fallback.

## Surface Rules

- `/s/{brand}/{catalog}` and `/m/{brand}/{catalog}` read the same active snapshot.
- A disabled surface returns 404.
- `/preview/{token}` reads a short-lived draft payload and is marked noindex.
- Options and variants are descriptive only; no cart, subtotal, checkout, or order state is derived from this contract.

