# Saga Menu Wave 1-4 Implementation

## Problem

Prototype masih memakai domain `Page / Category / Item`, public experience belum memiliki detail interaktif, seed/test masih mengunci WhatsApp-order behavior, dan dashboard/publishing/QR/analytics/tenant hardening belum tersedia.

## Goal

Menerapkan scope lokal Wave 1-4 sebagai modular Laravel application yang dapat diuji end-to-end sebelum deployment VPS.

## Scope

- Canonical `Catalog / Collection / Offering / CatalogSnapshot` domain.
- Store Display tablet-first dan Mobile Catalog mobile-first.
- Preview-only offering details tanpa cart/order/checkout.
- Owner dashboard berbasis Filament untuk catalog content.
- Draft preview, atomic publish, snapshot history, restore, unpublish.
- Pricing, promo, variants/options/inclusions, appearance, custom font baseline.
- QR routes, analytics events/rollups, owner analytics summary.
- Organization memberships, role policies, admin assist/audit baseline.
- Upload/link validation, rate limiting, cache invalidation, health/backup/runbook baseline.
- Automated feature tests, production frontend build, and browser verification.

## Non-Goals

- Production/VPS deployment without environment credentials.
- Payment gateway.
- POS, cart, checkout, kitchen, inventory, booking, or loyalty.
- Custom domain, public API, webhooks, offline kiosk, and advanced localization.
- Production-grade malware scanner or external monitoring provider integration.

## Acceptance Criteria

- Fresh migration and seed use canonical domain names.
- Store Display and Mobile Catalog read the same active snapshot.
- Draft changes do not leak to live public routes.
- Public UI contains no primary WhatsApp-order/cart/checkout flow.
- Offering detail works on tablet and mobile with accessibility baseline.
- Owner resources are organization scoped.
- Publish creates immutable snapshots and preserves the old live snapshot on failure.
- Options/inclusions remain informational.
- Custom font validation accepts only WOFF/WOFF2 and has fallback behavior.
- Stable QR redirect and analytics event allowlist work.
- Cross-tenant access and Editor publish attempts are denied.
- Audit records are created for critical operations.
- Full Laravel tests and production asset build pass.
- Browser checks pass for tablet landscape, tablet portrait, and mobile portrait.
- Remaining external/production gaps are documented honestly.

## Dependencies/Blockers

- Local PHP, Composer dependencies, Node dependencies, and SQLite are available.
- PostgreSQL/Redis/VPS runtime verification requires a configured external environment and is not assumed.

## Status

done

## Execution Gate

allowed - acceptance criteria are explicit and were derived from the approved canonical PRD and implementation scope.

Local implementation acceptance completed on 2026-07-16. Production pilot remains governed by the external VPS gates documented in the execution report.

## Target Environment

local/dev

## Max Iteration Rounds

2
