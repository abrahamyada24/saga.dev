const OPERATIONS_SCHEMA_VERSION = 5;
const SAGA_LOCALES = {
    id: { label: 'Indonesia', short: 'ID' },
    en: { label: 'English', short: 'EN' },
};

let selectedItemIds = new Set();
let menuSavedView = 'all';
let changeCenterTab = 'changes';
let changeCenterFilter = 'all';
let lastBulkUndo = null;
let publicLocale = 'id';
let publicDietaryFilter = '';

function operationsDefaults() {
    return {
        enabledLocales: ['id', 'en'],
        defaultLocale: 'id',
        activeOutletId: 'madiun',
        outlets: [
            { id: 'madiun', name: 'Madiun', address: 'Jl. Pahlawan, Madiun', status: 'active', catalogMode: 'master' },
            { id: 'surabaya', name: 'Surabaya', address: 'Tunjungan, Surabaya', status: 'setup', catalogMode: 'override' },
        ],
        members: [
            { id: 'andreas', name: 'Andreas', email: 'owner@sagamenu.local', role: 'owner', status: 'active' },
            { id: 'naya', name: 'Naya', email: 'manager@sagamenu.local', role: 'manager', status: 'active' },
            { id: 'raka', name: 'Raka', email: 'editor@sagamenu.local', role: 'editor', status: 'pending' },
        ],
        qrRoutes: [
            { id: 'counter-main', label: 'Counter utama', source: 'counter', surface: 'mobile', outletId: 'madiun', status: 'active', scans: 684 },
            { id: 'instagram-bio', label: 'Instagram bio', source: 'instagram', surface: 'mobile', outletId: 'madiun', status: 'active', scans: 1438 },
            { id: 'store-tablet', label: 'Tablet outlet', source: 'tablet', surface: 'tablet', outletId: 'madiun', status: 'active', scans: 312 },
        ],
        analyticsEvents: [],
        versionHistory: [],
    };
}

function augmentDefaultState() {
    const defaults = operationsDefaults();
    Object.entries(defaults).forEach(([key, value]) => {
        if (DEFAULT_STATE[key] === undefined) DEFAULT_STATE[key] = JSON.parse(JSON.stringify(value));
    });
    DEFAULT_STATE.items = DEFAULT_STATE.items.map((item) => ({
        visibility: 'both',
        translations: {},
        schedule: { startsAt: '', endsAt: '' },
        videoTranscript: item.video ? '' : null,
        imageAlt: item.imageAlt || `${item.name} dari ${DEFAULT_STATE.business.name}`,
        ...item,
    }));
}

function ensureOperationsState() {
    const defaults = operationsDefaults();
    Object.entries(defaults).forEach(([key, value]) => {
        if (state[key] === undefined) state[key] = JSON.parse(JSON.stringify(value));
    });
    state.schemaVersion = OPERATIONS_SCHEMA_VERSION;
    state.enabledLocales = [...new Set((state.enabledLocales || ['id']).filter((locale) => SAGA_LOCALES[locale]))];
    if (!state.enabledLocales.length) state.enabledLocales = ['id'];
    state.defaultLocale = SAGA_LOCALES[state.defaultLocale] ? state.defaultLocale : 'id';
    publicLocale = SAGA_LOCALES[publicLocale] ? publicLocale : state.defaultLocale;
    state.items = state.items.map((item) => ({
        visibility: 'both',
        translations: {},
        schedule: { startsAt: '', endsAt: '' },
        videoTranscript: item.video ? '' : null,
        imageAlt: item.imageAlt || `${item.name} dari ${state.business.name}`,
        ...item,
        translations: item.translations || {},
        schedule: { startsAt: '', endsAt: '', ...(item.schedule || {}) },
    }));
    if (!state.versionHistory.length && state.publishedSnapshot) {
        state.versionHistory.push({
            id: `v${state.publishedVersion}`,
            version: state.publishedVersion,
            note: 'Versi live saat baseline operations dibuat',
            publishedAt: state.lastPublished,
            author: 'Andreas',
            snapshot: JSON.parse(JSON.stringify(state.publishedSnapshot)),
        });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function activeOutlet() {
    return state.outlets.find((outlet) => outlet.id === state.activeOutletId) || state.outlets[0];
}

function isScheduledVisible(item, at = new Date()) {
    const startsAt = item.schedule?.startsAt ? new Date(item.schedule.startsAt) : null;
    const endsAt = item.schedule?.endsAt ? new Date(item.schedule.endsAt) : null;
    if (startsAt && !Number.isNaN(startsAt.valueOf()) && at < startsAt) return false;
    if (endsAt && !Number.isNaN(endsAt.valueOf()) && at > endsAt) return false;
    return true;
}

function localizedValue(entity, field, locale = publicLocale) {
    if (locale === state.defaultLocale) return entity[field] || '';
    return entity.translations?.[locale]?.[field] || entity[field] || '';
}

function readableValue(value, field = '') {
    if (value === null || value === undefined || value === '') return 'Kosong';
    if (field === 'price') return formatPrice(Number(value));
    if (field === 'categoryId') return categoryName(value);
    if (field === 'availability') return value === 'available' ? 'Tersedia' : 'Sold out';
    if (field === 'visibility') return { both: 'Bio dan Store', mobile: 'Bio saja', tablet: 'Store saja', hidden: 'Disembunyikan' }[value] || value;
    return String(value);
}

function currentPublishedState() {
    return state.publishedSnapshot || buildSnapshot(state);
}

function catalogDiff() {
    const live = currentPublishedState();
    const changes = [];
    const fields = ['name', 'description', 'price', 'categoryId', 'availability', 'visibility', 'badge'];
    const liveItems = new Map((live.items || []).map((item) => [item.id, item]));
    const draftItems = new Map(state.items.map((item) => [item.id, item]));

    state.items.forEach((item) => {
        const previous = liveItems.get(item.id);
        if (!previous) {
            changes.push({
                id: `item-created:${item.id}`,
                group: 'content',
                type: 'created',
                itemId: item.id,
                title: `${item.name} ditambahkan`,
                detail: 'Item baru akan tampil setelah publish.',
                before: null,
                after: item.name,
            });
            return;
        }
        fields.forEach((field) => {
            if (JSON.stringify(previous[field] ?? '') === JSON.stringify(item[field] ?? '')) return;
            changes.push({
                id: `item:${item.id}:${field}`,
                group: ['price', 'availability', 'visibility'].includes(field) ? 'operations' : 'content',
                type: 'field',
                itemId: item.id,
                field,
                title: `${item.name}: ${field}`,
                detail: 'Nilai draft berbeda dari versi live.',
                before: previous[field] ?? '',
                after: item[field] ?? '',
            });
        });
    });
    (live.items || []).forEach((item) => {
        if (draftItems.has(item.id)) return;
        changes.push({
            id: `item-deleted:${item.id}`,
            group: 'content',
            type: 'deleted',
            itemId: item.id,
            title: `${item.name} dihapus`,
            detail: 'Item akan hilang dari kedua surface.',
            before: item.name,
            after: null,
        });
    });

    const liveCategoryOrder = (live.categories || []).map((category) => `${category.id}:${category.visible}`).join('|');
    const draftCategoryOrder = state.categories.map((category) => `${category.id}:${category.visible}`).join('|');
    if (liveCategoryOrder !== draftCategoryOrder) {
        changes.push({
            id: 'categories:structure',
            group: 'structure',
            type: 'structure',
            title: 'Struktur kategori berubah',
            detail: 'Urutan atau visibilitas kategori diperbarui.',
            before: 'Struktur live',
            after: 'Struktur draft',
        });
    }

    const liveAppearance = live.appearance || {};
    ['bioPreset', 'storePreset', 'primary', 'accent', 'paper', 'headingFont', 'bodyFont'].forEach((field) => {
        if (JSON.stringify(liveAppearance[field] ?? '') === JSON.stringify(state.appearance[field] ?? '')) return;
        changes.push({
            id: `appearance:${field}`,
            group: 'appearance',
            type: 'appearance',
            field,
            title: `Tampilan: ${field}`,
            detail: 'Brand Kit draft berbeda dari versi live.',
            before: liveAppearance[field] ?? '',
            after: state.appearance[field] ?? '',
        });
    });
    return changes;
}

function parseHexColor(hex) {
    const value = String(hex || '').replace('#', '');
    if (!/^[0-9a-f]{6}$/i.test(value)) return null;
    return [0, 2, 4].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16) / 255);
}

function relativeLuminance(hex) {
    const rgb = parseHexColor(hex);
    if (!rgb) return 0;
    return rgb.map((value) => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
        .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
}

function contrastRatio(foreground, background) {
    const first = relativeLuminance(foreground);
    const second = relativeLuminance(background);
    return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

function catalogHealthIssues() {
    const issues = [];
    const categoryIds = new Set(state.categories.map((category) => category.id));
    state.items.forEach((item) => {
        if (!item.name.trim()) issues.push(healthIssue('blocking', 'missing-name', item, 'Nama menu belum diisi', 'menus'));
        if (!categoryIds.has(item.categoryId)) issues.push(healthIssue('blocking', 'invalid-category', item, 'Kategori menu tidak valid', 'menus'));
        if (!Number.isFinite(Number(item.price)) || Number(item.price) < 0) issues.push(healthIssue('blocking', 'invalid-price', item, 'Harga menu tidak valid', 'menus'));
        if (!item.image) issues.push(healthIssue('blocking', 'missing-image', item, 'Foto utama belum tersedia', 'menus'));
        if (!String(item.imageAlt || '').trim()) issues.push(healthIssue('warning', 'missing-alt', item, 'Alt text foto belum lengkap', 'media'));
        if (!String(item.description || '').trim()) issues.push(healthIssue('warning', 'missing-description', item, 'Deskripsi singkat belum lengkap', 'menus'));
        if (item.video && !String(item.videoTranscript || '').trim()) issues.push(healthIssue('warning', 'missing-transcript', item, 'Video belum memiliki transcript', 'menus'));
        if (item.schedule?.startsAt && item.schedule?.endsAt && new Date(item.schedule.startsAt) >= new Date(item.schedule.endsAt)) {
            issues.push(healthIssue('blocking', 'invalid-schedule', item, 'Waktu selesai harus setelah waktu mulai', 'distribution'));
        }
        state.enabledLocales.filter((locale) => locale !== state.defaultLocale).forEach((locale) => {
            const translation = item.translations?.[locale];
            if (!translation?.name || !translation?.description) {
                issues.push(healthIssue('warning', `translation-${locale}`, item, `Terjemahan ${SAGA_LOCALES[locale].label} belum lengkap`, 'menus'));
            }
        });
    });
    const ratio = contrastRatio(state.appearance.ink, state.appearance.paper);
    if (ratio < 4.5) {
        issues.push({
            id: 'appearance-contrast',
            severity: 'blocking',
            code: 'contrast',
            title: 'Kontras teks belum memenuhi target',
            detail: `Rasio saat ini ${ratio.toFixed(2)}:1; target minimal 4.5:1.`,
            route: 'appearance',
        });
    }
    return issues;
}

function healthIssue(severity, code, item, title, route) {
    return {
        id: `${code}:${item.id}`,
        severity,
        code,
        itemId: item.id,
        title,
        detail: item.name || 'Item tanpa nama',
        route,
    };
}

function menuMatchesSavedView(item) {
    if (menuSavedView === 'sold-out') return item.availability === 'sold_out';
    if (menuSavedView === 'missing-media') return !item.image || !item.imageAlt;
    if (menuSavedView === 'scheduled') return Boolean(item.schedule?.startsAt || item.schedule?.endsAt);
    if (menuSavedView === 'translation') {
        return state.enabledLocales.some((locale) => locale !== state.defaultLocale
            && (!item.translations?.[locale]?.name || !item.translations?.[locale]?.description));
    }
    return true;
}

function renderQuickViewButton(id, label, count) {
    return `<button class="saved-view ${menuSavedView === id ? 'is-active' : ''}" type="button" data-action="menu-saved-view" data-view="${id}"><span>${escapeHTML(label)}</span><b>${count}</b></button>`;
}

function renderOperationsMenuRow(item) {
    const selected = selectedItemIds.has(item.id);
    const translationComplete = state.enabledLocales.filter((locale) => locale !== state.defaultLocale)
        .every((locale) => item.translations?.[locale]?.name && item.translations?.[locale]?.description);
    const scheduled = item.schedule?.startsAt || item.schedule?.endsAt;
    return `
        <tr data-item-row data-name="${escapeHTML(`${item.name} ${item.description}`.toLocaleLowerCase('id'))}" data-category="${escapeHTML(item.categoryId)}" data-status="${escapeHTML(item.availability)}">
            <td class="selection-cell"><input type="checkbox" data-select-item value="${escapeHTML(item.id)}" aria-label="Pilih ${escapeHTML(item.name)}" ${selected ? 'checked' : ''}></td>
            <td>
                <div class="menu-cell">
                    <img src="${safeImage(item.image)}" alt="">
                    <span><strong>${escapeHTML(item.name)}</strong><span>${escapeHTML(item.description)}</span></span>
                </div>
            </td>
            <td>
                <select class="inline-control" data-inline-field="categoryId" data-item-id="${escapeHTML(item.id)}" aria-label="Kategori ${escapeHTML(item.name)}">
                    ${state.categories.map((category) => `<option value="${escapeHTML(category.id)}" ${category.id === item.categoryId ? 'selected' : ''}>${escapeHTML(category.name)}</option>`).join('')}
                </select>
            </td>
            <td><label class="inline-price"><span>Rp</span><input type="number" min="0" step="1000" value="${Number(item.price)}" data-inline-field="price" data-item-id="${escapeHTML(item.id)}" aria-label="Harga ${escapeHTML(item.name)}"></label></td>
            <td>
                <select class="inline-control status-${escapeHTML(item.availability)}" data-inline-field="availability" data-item-id="${escapeHTML(item.id)}" aria-label="Status ${escapeHTML(item.name)}">
                    <option value="available" ${item.availability === 'available' ? 'selected' : ''}>Tersedia</option>
                    <option value="sold_out" ${item.availability === 'sold_out' ? 'selected' : ''}>Sold out</option>
                </select>
            </td>
            <td>
                <select class="inline-control" data-inline-field="visibility" data-item-id="${escapeHTML(item.id)}" aria-label="Visibilitas ${escapeHTML(item.name)}">
                    <option value="both" ${item.visibility === 'both' ? 'selected' : ''}>Bio + Store</option>
                    <option value="mobile" ${item.visibility === 'mobile' ? 'selected' : ''}>Bio saja</option>
                    <option value="tablet" ${item.visibility === 'tablet' ? 'selected' : ''}>Store saja</option>
                    <option value="hidden" ${item.visibility === 'hidden' ? 'selected' : ''}>Sembunyikan</option>
                </select>
            </td>
            <td>
                <span class="readiness-dot ${translationComplete ? 'is-ready' : ''}" title="${translationComplete ? 'Terjemahan lengkap' : 'Terjemahan perlu dilengkapi'}"></span>
                ${scheduled ? '<span class="schedule-dot" title="Memiliki jadwal"></span>' : ''}
            </td>
            <td>
                <div class="row-actions">
                    <button class="icon-button" type="button" data-action="translate-item" data-item-id="${escapeHTML(item.id)}" title="Terjemahkan" aria-label="Terjemahkan ${escapeHTML(item.name)}"><i data-lucide="languages"></i></button>
                    <button class="icon-button" type="button" data-action="schedule-item" data-item-id="${escapeHTML(item.id)}" title="Jadwalkan" aria-label="Jadwalkan ${escapeHTML(item.name)}"><i data-lucide="calendar-clock"></i></button>
                    <button class="icon-button" type="button" data-action="edit-item" data-item-id="${escapeHTML(item.id)}" title="Edit menu" aria-label="Edit ${escapeHTML(item.name)}"><i data-lucide="pencil"></i></button>
                    <details class="row-action-menu">
                        <summary class="icon-button" title="Aksi lainnya" aria-label="Aksi lainnya ${escapeHTML(item.name)}"><i data-lucide="ellipsis"></i></summary>
                        <div class="row-action-popover" role="menu">
                            <button type="button" role="menuitem" data-action="duplicate-item" data-item-id="${escapeHTML(item.id)}" aria-label="Duplikat ${escapeHTML(item.name)}"><i data-lucide="copy-plus"></i><span>Duplikat menu</span></button>
                            <button class="is-danger" type="button" role="menuitem" data-action="delete-item" data-item-id="${escapeHTML(item.id)}" aria-label="Hapus ${escapeHTML(item.name)}"><i data-lucide="trash-2"></i><span>Hapus menu</span></button>
                        </div>
                    </details>
                </div>
            </td>
        </tr>
    `;
}

function renderOperationsMenus() {
    selectedItemIds = new Set([...selectedItemIds].filter((id) => state.items.some((item) => item.id === id)));
    const visibleItems = state.items.filter(menuMatchesSavedView);
    const missingMedia = state.items.filter((item) => !item.image || !item.imageAlt).length;
    const translationMissing = state.items.filter((item) => state.enabledLocales.some((locale) => locale !== state.defaultLocale
        && (!item.translations?.[locale]?.name || !item.translations?.[locale]?.description))).length;
    return `
        ${pageHead(
            'Katalog operations',
            'Menu',
            `Scope aktif: ${activeOutlet().name}. Edit cepat tersimpan sebagai draft.`,
            `<button class="button button-secondary shift-mode-button" type="button" data-action="toggle-shift-mode"><i data-lucide="zap"></i><span>Shift mode</span></button>
             <button class="button button-primary" type="button" data-action="new-item"><i data-lucide="plus"></i><span>Tambah menu</span></button>`,
        )}
        <section class="operations-summary" aria-label="Ringkasan katalog">
            ${metricCard('utensils', 'Total item', String(state.items.length), `${state.items.filter((item) => item.availability === 'available').length} aktif`, 'pada scope ini')}
            ${metricCard('circle-off', 'Sold out', String(state.items.filter((item) => item.availability === 'sold_out').length), 'operasional', 'butuh perhatian')}
            ${metricCard('image-off', 'Media', String(missingMedia), 'issue', 'foto atau alt text')}
            ${metricCard('languages', 'Terjemahan', String(translationMissing), 'item', 'belum lengkap')}
        </section>
        <article class="panel operations-panel">
            <div class="saved-views" aria-label="Saved views">
                ${renderQuickViewButton('all', 'Semua', state.items.length)}
                ${renderQuickViewButton('sold-out', 'Sold out', state.items.filter((item) => item.availability === 'sold_out').length)}
                ${renderQuickViewButton('missing-media', 'Media', missingMedia)}
                ${renderQuickViewButton('scheduled', 'Terjadwal', state.items.filter((item) => item.schedule?.startsAt || item.schedule?.endsAt).length)}
                ${renderQuickViewButton('translation', 'Terjemahan', translationMissing)}
            </div>
            <div class="table-toolbar">
                <label class="search-field"><i data-lucide="search"></i><span class="sr-only">Cari menu</span><input type="search" placeholder="Cari nama menu..." data-menu-search></label>
                <select class="filter-select" data-menu-category-filter aria-label="Filter kategori">
                    <option value="">Semua kategori</option>
                    ${state.categories.map((category) => `<option value="${escapeHTML(category.id)}">${escapeHTML(category.name)}</option>`).join('')}
                </select>
                <select class="filter-select" data-menu-status-filter aria-label="Filter status">
                    <option value="">Semua status</option><option value="available">Tersedia</option><option value="sold_out">Sold out</option>
                </select>
            </div>
            ${selectedItemIds.size ? `
                <div class="bulk-action-bar" role="region" aria-label="Aksi massal">
                    <strong>${selectedItemIds.size} item dipilih</strong>
                    <button type="button" data-action="bulk-available"><i data-lucide="eye"></i><span>Tersedia</span></button>
                    <button type="button" data-action="bulk-sold-out"><i data-lucide="eye-off"></i><span>Sold out</span></button>
                    <button type="button" data-action="bulk-show"><i data-lucide="panel-top-open"></i><span>Tampilkan</span></button>
                    <button type="button" data-action="bulk-hide"><i data-lucide="panel-top-close"></i><span>Sembunyikan</span></button>
                    <label>Pindah kategori
                        <select data-bulk-category>
                            <option value="">Pilih kategori</option>
                            ${state.categories.map((category) => `<option value="${escapeHTML(category.id)}">${escapeHTML(category.name)}</option>`).join('')}
                        </select>
                    </label>
                    ${lastBulkUndo ? '<button type="button" data-action="undo-bulk"><i data-lucide="undo-2"></i><span>Undo</span></button>' : ''}
                    <button class="bulk-clear" type="button" data-action="clear-selection" aria-label="Batalkan pilihan"><i data-lucide="x"></i></button>
                </div>
            ` : ''}
            <div class="table-scroll">
                <table class="data-table operations-table">
                    <thead><tr>
                        <th class="selection-cell"><input type="checkbox" data-select-all aria-label="Pilih semua item pada view" ${visibleItems.length && visibleItems.every((item) => selectedItemIds.has(item.id)) ? 'checked' : ''}></th>
                        <th>Menu</th><th>Kategori</th><th>Harga</th><th>Status</th><th>Surface</th><th>Health</th><th aria-label="Aksi"></th>
                    </tr></thead>
                    <tbody data-menu-table>${visibleItems.map(renderOperationsMenuRow).join('')}</tbody>
                </table>
                <div class="empty-state" data-menu-empty ${visibleItems.length ? 'hidden' : ''}>
                    <img src="assets/illustrations/empty-catalog.webp" alt="" width="640" height="640">
                    <strong>Tidak ada item pada view ini</strong><span>Pilih saved view lain atau tambahkan menu.</span>
                </div>
            </div>
        </article>
    `;
}

function renderChangeRow(change) {
    return `
        <article class="change-center-row" data-change-group="${escapeHTML(change.group)}">
            <span class="change-center-icon"><i data-lucide="${change.group === 'appearance' ? 'palette' : change.group === 'operations' ? 'bolt' : change.group === 'structure' ? 'list-ordered' : 'file-pen-line'}"></i></span>
            <div><span class="eyebrow">${escapeHTML(change.group)}</span><strong>${escapeHTML(change.title)}</strong><small>${escapeHTML(change.detail)}</small></div>
            <div class="field-diff"><span>${escapeHTML(readableValue(change.before, change.field))}</span><i data-lucide="arrow-right"></i><b>${escapeHTML(readableValue(change.after, change.field))}</b></div>
            <button class="button button-secondary" type="button" data-action="discard-change" data-change-id="${escapeHTML(change.id)}"><i data-lucide="undo-2"></i><span>Batalkan</span></button>
        </article>
    `;
}

function renderHealthRow(issue) {
    return `
        <article class="health-row is-${escapeHTML(issue.severity)}">
            <span><i data-lucide="${issue.severity === 'blocking' ? 'octagon-alert' : 'triangle-alert'}"></i></span>
            <div><strong>${escapeHTML(issue.title)}</strong><small>${escapeHTML(issue.detail)}</small><code>${escapeHTML(issue.code)}</code></div>
            <button class="button button-secondary" type="button" data-route="${escapeHTML(issue.route)}">Perbaiki</button>
        </article>
    `;
}

function renderChangesHealth() {
    const changes = catalogDiff();
    const issues = catalogHealthIssues();
    const blocking = issues.filter((issue) => issue.severity === 'blocking').length;
    const visibleChanges = changeCenterFilter === 'all' ? changes : changes.filter((change) => change.group === changeCenterFilter);
    return `
        ${pageHead(
            'Publish confidence',
            'Perubahan & Kesehatan',
            'Pahami semua perbedaan draft dan selesaikan masalah sebelum customer melihatnya.',
            `<button class="button button-secondary" type="button" data-action="preview-mobile"><i data-lucide="scan-eye"></i><span>Bandingkan preview</span></button>
             <button class="button button-primary" type="button" data-route="publish" ${blocking ? 'disabled' : ''}><i data-lucide="send"></i><span>Tinjau publish</span></button>`,
        )}
        <section class="change-health-summary">
            ${metricCard('file-diff', 'Perubahan draft', String(changes.length), 'field', 'berbeda dari live')}
            ${metricCard('octagon-alert', 'Blocking', String(blocking), blocking ? 'harus selesai' : 'aman', 'sebelum publish')}
            ${metricCard('triangle-alert', 'Warning', String(issues.length - blocking), 'review', 'disarankan')}
            ${metricCard('store', 'Scope outlet', activeOutlet().name, 'aktif', 'untuk review ini')}
        </section>
        <div class="change-center-tabs" role="tablist">
            <button type="button" role="tab" aria-selected="${changeCenterTab === 'changes'}" class="${changeCenterTab === 'changes' ? 'is-active' : ''}" data-action="change-center-tab" data-tab="changes">Perubahan <b>${changes.length}</b></button>
            <button type="button" role="tab" aria-selected="${changeCenterTab === 'health'}" class="${changeCenterTab === 'health' ? 'is-active' : ''}" data-action="change-center-tab" data-tab="health">Catalog Health <b>${issues.length}</b></button>
        </div>
        ${changeCenterTab === 'changes' ? `
            <section class="change-center-layout">
                <div class="change-filter-rail">
                    ${['all', 'content', 'operations', 'structure', 'appearance'].map((filter) => `<button type="button" class="${changeCenterFilter === filter ? 'is-active' : ''}" data-action="change-filter" data-filter="${filter}">${filter === 'all' ? 'Semua' : filter}<b>${filter === 'all' ? changes.length : changes.filter((change) => change.group === filter).length}</b></button>`).join('')}
                </div>
                <div class="change-list-panel">
                    ${visibleChanges.length ? visibleChanges.map(renderChangeRow).join('') : '<div class="centered-empty"><i data-lucide="badge-check"></i><strong>Tidak ada perubahan pada filter ini</strong><span>Draft dan versi live sudah sama.</span></div>'}
                </div>
            </section>
        ` : `
            <section class="health-groups">
                <article class="panel"><header class="panel-header"><div><h2>Blocking issues</h2><p>Publish tidak dilanjutkan sampai bagian ini selesai.</p></div><span class="badge badge-red">${blocking}</span></header><div class="health-list">${issues.filter((issue) => issue.severity === 'blocking').map(renderHealthRow).join('') || '<div class="health-clear"><i data-lucide="shield-check"></i><span><strong>Tidak ada blocking issue</strong><small>Draft aman untuk dilanjutkan ke review.</small></span></div>'}</div></article>
                <article class="panel"><header class="panel-header"><div><h2>Warnings</h2><p>Perbaikan kualitas yang disarankan.</p></div><span class="badge">${issues.length - blocking}</span></header><div class="health-list">${issues.filter((issue) => issue.severity === 'warning').map(renderHealthRow).join('') || '<div class="health-clear"><i data-lucide="circle-check"></i><span><strong>Semua warning selesai</strong><small>Kualitas katalog sudah lengkap.</small></span></div>'}</div></article>
            </section>
        `}
    `;
}

function itemVisibleOnSurface(item, mode) {
    if (item.visibility === 'hidden') return false;
    if (mode === 'mobile' && item.visibility === 'tablet') return false;
    if (mode === 'tablet' && item.visibility === 'mobile') return false;
    return isScheduledVisible(item);
}

function renderOperationsPublicCard(item, mode) {
    const cardClass = mode === 'tablet' ? 'tablet-menu-card' : 'mobile-menu-card';
    const localizedName = localizedValue(item, 'name');
    const localizedDescription = localizedValue(item, 'description');
    const dietary = [...(item.dietary || []), ...(item.allergens || [])].join(' ').toLocaleLowerCase('id');
    return `
        <article class="${cardClass} ${item.availability === 'sold_out' ? 'sold-out' : ''}" data-public-card data-name="${escapeHTML(`${localizedName} ${localizedDescription} ${item.ingredients || ''}`.toLocaleLowerCase('id'))}" data-dietary="${escapeHTML(dietary)}">
            <button type="button" data-public-item="${escapeHTML(item.id)}" aria-label="Lihat detail ${escapeHTML(localizedName)}">
                <span class="public-card-media">
                    <img src="${safeImage(item.image)}" alt="${escapeHTML(item.imageAlt || localizedName)}" loading="lazy" decoding="async" style="object-position:${Number(item.focalX ?? 50)}% ${Number(item.focalY ?? 50)}%">
                    ${item.video ? '<span class="public-video-badge"><i data-lucide="play"></i> Video</span>' : ''}
                </span>
                <span class="public-card-copy">
                    <span class="public-card-top"><h3>${escapeHTML(localizedName)}</h3><strong>${formatPrice(item.price)}</strong></span>
                    <p>${escapeHTML(localizedDescription)}</p>
                    ${item.availability === 'sold_out' ? '<span class="public-badge sold-label">Sold out</span>' : item.badge ? `<span class="public-badge">${escapeHTML(item.badge)}</span>` : ''}
                </span>
            </button>
        </article>
    `;
}

function renderOperationsPublicSection(category, mode) {
    const items = state.items.filter((item) => item.categoryId === category.id && itemVisibleOnSurface(item, mode));
    if (!items.length) return '';
    return `
        <section class="public-section" data-public-section="${escapeHTML(category.id)}">
            <header class="public-section-header"><h2>${escapeHTML(localizedValue(category, 'name'))}</h2><span>${escapeHTML(localizedValue(category, 'description'))}</span></header>
            <div class="${mode === 'tablet' ? 'tablet-menu-grid' : 'mobile-menu-list'}">${items.map((item) => renderOperationsPublicCard(item, mode)).join('')}</div>
        </section>
    `;
}

function publicControlBar(categories) {
    const dietaryOptions = [
        ['', 'Semua'],
        ['vegetarian', 'Vegetarian'],
        ['vegan', 'Vegan'],
        ['susu', 'Tanpa susu'],
    ];
    return `
        <div class="public-discovery-controls">
            <label class="public-search">
                <i data-lucide="search"></i><span class="sr-only">Cari menu</span>
                <input type="search" placeholder="${publicLocale === 'en' ? 'Search menu, taste, or ingredient' : 'Cari menu, rasa, atau bahan'}" data-public-search>
                <button type="button" data-action="clear-public-search" aria-label="Hapus pencarian"><i data-lucide="x"></i></button>
            </label>
            <div class="public-filter-row" aria-label="Filter kebutuhan">
                ${dietaryOptions.map(([value, label]) => `<button type="button" class="${publicDietaryFilter === value ? 'is-active' : ''}" data-action="public-dietary" data-filter="${value}">${label}</button>`).join('')}
            </div>
            <div class="public-search-feedback" aria-live="polite"><span data-public-result-count></span></div>
        </div>
        <div class="public-category-rail sticky-category-rail">
            <button class="is-active" type="button" data-public-category="">Semua</button>
            ${categories.map((category) => `<button type="button" data-public-category="${escapeHTML(category.id)}">${escapeHTML(localizedValue(category, 'name'))}</button>`).join('')}
            <label class="category-overflow"><span class="sr-only">Kategori lainnya</span><select data-public-category-select><option value="">Kategori lain</option>${categories.map((category) => `<option value="${escapeHTML(category.id)}">${escapeHTML(localizedValue(category, 'name'))}</option>`).join('')}</select></label>
        </div>
    `;
}

function publicLanguageSwitch() {
    return `<div class="public-language-switch" aria-label="Bahasa menu">${state.enabledLocales.map((locale) => `<button type="button" class="${publicLocale === locale ? 'is-active' : ''}" data-action="public-locale" data-locale="${locale}" aria-pressed="${publicLocale === locale}">${SAGA_LOCALES[locale].short}</button>`).join('')}</div>`;
}

function renderOperationsMobileMenu(categories, compact) {
    return `
        <div class="public-menu is-layout-${surfaceLayout('mobile')} preset-${escapeHTML(state.appearance.bioPreset)} image-${escapeHTML(state.appearance.imageTreatment)}" style="${appearanceStyle()}" data-public-menu data-public-surface="mobile">
            <header class="public-mobile-header">
                <div class="public-mobile-brand-row">${publicBrandMark()}<div>${publicLanguageSwitch()}<span class="public-open">Buka sekarang</span></div></div>
                <span class="public-surface-label">Bio Menu</span>
                <h1>${escapeHTML(state.business.name)}</h1><p>${escapeHTML(state.business.tagline)}</p>
                <div class="public-business-note"><span><i data-lucide="clock-3"></i>${escapeHTML(state.business.hours)}</span><span><i data-lucide="map-pin"></i>${escapeHTML(activeOutlet().name)}</span></div>
            </header>
            <div class="mobile-public-body">
                ${publicControlBar(categories)}
                ${compact ? '' : renderPromoBanner()}
                <div data-public-sections>${categories.map((category) => renderOperationsPublicSection(category, 'mobile')).join('')}</div>
                <div class="public-zero-results" data-public-zero hidden><i data-lucide="search-x"></i><strong>Menu belum ditemukan</strong><span>Coba kata lain, hapus filter, atau pilih kategori berbeda.</span><button type="button" data-action="clear-public-filters">Hapus filter</button></div>
            </div>
        </div>
    `;
}

function renderOperationsTabletMenu(categories) {
    return `
        <div class="public-menu is-layout-${surfaceLayout('tablet')} preset-${escapeHTML(state.appearance.storePreset)} image-${escapeHTML(state.appearance.imageTreatment)}" style="${appearanceStyle()}" data-public-menu data-public-surface="tablet">
            <header class="tablet-public-header">
                <div class="tablet-brand">${publicBrandMark()}<div><span class="public-surface-label">Store Display</span><h1>${escapeHTML(state.business.name)}</h1><p>${escapeHTML(state.business.tagline)}</p></div></div>
                <div class="tablet-meta">${publicLanguageSwitch()}<div><span>JAM BUKA</span><strong>${escapeHTML(state.business.hours)}</strong></div><span class="badge badge-green">Buka sekarang</span></div>
            </header>
            <div class="tablet-category-wrap">${publicControlBar(categories)}</div>
            <div class="tablet-public-body" data-public-sections>${categories.map((category) => renderOperationsPublicSection(category, 'tablet')).join('')}</div>
            <div class="public-zero-results" data-public-zero hidden><i data-lucide="search-x"></i><strong>Menu belum ditemukan</strong><span>Hapus filter atau pilih kategori lain.</span><button type="button" data-action="clear-public-filters">Hapus filter</button></div>
        </div>
    `;
}

function renderDistribution() {
    const base = `${window.location.origin}${window.location.pathname}`;
    return `
        ${pageHead(
            'Distribution operations',
            'QR, Share & Jadwal',
            'Kelola tujuan, attribution, dan waktu tampil tanpa mengubah isi katalog.',
            `<button class="button button-primary" type="button" data-action="new-qr-route"><i data-lucide="qr-code"></i><span>Buat QR</span></button>`,
        )}
        <section class="distribution-grid">
            <div>
                <article class="panel">
                    <header class="panel-header"><div><h2>QR dan link aktif</h2><p>Setiap sumber mempunyai destination dan analytics sendiri.</p></div><span class="badge badge-green">${state.qrRoutes.filter((route) => route.status === 'active').length} aktif</span></header>
                    <div class="qr-route-list">
                        ${state.qrRoutes.map((route) => {
                            const target = `${base}#preview-${route.surface}`;
                            const qrUrl = `https://quickchart.io/qr?size=180&margin=1&text=${encodeURIComponent(target)}`;
                            return `<article class="qr-route-card">
                                <img src="${qrUrl}" alt="QR ${escapeHTML(route.label)}" loading="lazy">
                                <div><span class="eyebrow">${escapeHTML(route.source)} · ${escapeHTML(activeOutlet().name)}</span><strong>${escapeHTML(route.label)}</strong><small>${route.surface === 'tablet' ? 'Store Display' : 'Bio Menu'} · ${Number(route.scans || 0).toLocaleString('id-ID')} scan</small><code>${escapeHTML(target)}</code></div>
                                <span class="badge ${route.status === 'active' ? 'badge-green' : ''}">${route.status === 'active' ? 'Aktif' : 'Nonaktif'}</span>
                                <div class="row-actions">
                                    <button class="icon-button" type="button" data-action="copy-qr-route" data-qr-id="${escapeHTML(route.id)}" aria-label="Salin link ${escapeHTML(route.label)}"><i data-lucide="copy"></i></button>
                                    <button class="icon-button" type="button" data-action="download-qr-route" data-qr-id="${escapeHTML(route.id)}" aria-label="Download QR ${escapeHTML(route.label)}"><i data-lucide="download"></i></button>
                                    <button class="toggle" type="button" role="switch" aria-checked="${route.status === 'active'}" data-action="toggle-qr-route" data-qr-id="${escapeHTML(route.id)}" aria-label="Status ${escapeHTML(route.label)}"></button>
                                </div>
                            </article>`;
                        }).join('')}
                    </div>
                </article>
            </div>
            <aside>
                <article class="panel share-preview-card">
                    <header class="panel-header"><div><h2>Share preview</h2><p>Tampilan saat link dibagikan.</p></div></header>
                    <div class="social-preview"><img src="${safeImage(state.items[0]?.image)}" alt=""><div><strong>${escapeHTML(state.business.name)} Menu</strong><span>${escapeHTML(state.business.tagline)}</span><small>sagamenu.app</small></div></div>
                    <button class="button button-secondary" type="button" data-action="copy-mobile-link"><i data-lucide="link"></i><span>Salin Bio Menu</span></button>
                </article>
                <article class="panel schedule-summary">
                    <header class="panel-header"><div><h2>Jadwal konten</h2><p>Timezone Asia/Jakarta</p></div></header>
                    ${state.items.filter((item) => item.schedule?.startsAt || item.schedule?.endsAt).map((item) => `<button type="button" data-action="schedule-item" data-item-id="${escapeHTML(item.id)}"><i data-lucide="calendar-clock"></i><span><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.schedule.startsAt || 'Sekarang')} → ${escapeHTML(item.schedule.endsAt || 'Tanpa batas')}</small></span></button>`).join('') || '<div class="centered-empty compact"><i data-lucide="calendar"></i><strong>Belum ada jadwal</strong><span>Jadwalkan dari tabel Menu.</span></div>'}
                </article>
            </aside>
        </section>
    `;
}

function renderWorkspaceOperations() {
    return `
        ${pageHead(
            'Organization operations',
            'Outlet & Tim',
            'Scope selalu terlihat agar perubahan tidak masuk ke outlet yang salah.',
            `<button class="button button-primary" type="button" data-action="invite-member"><i data-lucide="user-plus"></i><span>Undang anggota</span></button>`,
        )}
        <section class="workspace-operations-grid">
            <div>
                <article class="panel">
                    <header class="panel-header"><div><h2>Outlet</h2><p>Pilih scope kerja saat ini.</p></div><span class="badge">${state.outlets.length} lokasi</span></header>
                    <div class="outlet-card-grid">
                        ${state.outlets.map((outlet) => `<button class="outlet-scope-card ${outlet.id === state.activeOutletId ? 'is-active' : ''}" type="button" data-action="select-outlet" data-outlet-id="${escapeHTML(outlet.id)}">
                            <span><i data-lucide="${outlet.id === state.activeOutletId ? 'circle-check' : 'store'}"></i></span>
                            <div><strong>${escapeHTML(outlet.name)}</strong><small>${escapeHTML(outlet.address)}</small><em>${outlet.catalogMode === 'master' ? 'Master catalog' : 'Per-outlet override'}</em></div>
                            <span class="badge ${outlet.status === 'active' ? 'badge-green' : ''}">${outlet.status === 'active' ? 'Aktif' : 'Setup'}</span>
                        </button>`).join('')}
                    </div>
                </article>
                <article class="panel">
                    <header class="panel-header"><div><h2>Anggota dan permission</h2><p>Owner invariant tetap dijaga.</p></div></header>
                    <div class="team-table">
                        ${state.members.map((member) => `<div class="team-row">
                            <span class="avatar">${escapeHTML(member.name.split(' ').map((part) => part[0]).join('').slice(0, 2))}</span>
                            <div><strong>${escapeHTML(member.name)}</strong><small>${escapeHTML(member.email)}</small></div>
                            ${member.role === 'owner' ? '<span class="badge badge-green">Owner</span>' : `<select data-member-role data-member-id="${escapeHTML(member.id)}" aria-label="Role ${escapeHTML(member.name)}"><option value="manager" ${member.role === 'manager' ? 'selected' : ''}>Manager</option><option value="editor" ${member.role === 'editor' ? 'selected' : ''}>Editor</option></select>`}
                            <span class="badge ${member.status === 'active' ? 'badge-green' : ''}">${member.status === 'active' ? 'Aktif' : 'Undangan pending'}</span>
                        </div>`).join('')}
                    </div>
                </article>
            </div>
            <aside>
                <article class="panel permission-matrix">
                    <header class="panel-header"><div><h2>Hak akses</h2><p>Ringkasan permission.</p></div></header>
                    <div><span>Kelola konten</span><b>Owner · Manager · Editor</b></div>
                    <div><span>Publish</span><b>Owner · Manager</b></div>
                    <div><span>Kelola tim</span><b>Owner</b></div>
                    <div><span>Billing</span><b>Owner</b></div>
                </article>
                <article class="panel version-timeline">
                    <header class="panel-header"><div><h2>Riwayat versi</h2><p>Restore membuat draft baru.</p></div></header>
                    ${[...state.versionHistory].reverse().map((version) => `<div class="version-row"><span>v${version.version}</span><div><strong>${escapeHTML(version.note || 'Publikasi menu')}</strong><small>${escapeHTML(version.publishedAt)} · ${escapeHTML(version.author)}</small></div><button class="button button-secondary" type="button" data-action="restore-version" data-version-id="${escapeHTML(version.id)}">Pulihkan</button></div>`).join('')}
                </article>
            </aside>
        </section>
    `;
}

function renderOperationsAnalytics() {
    const periodFactor = { '7': .29, '30': 1, '90': 2.78 }[state.analyticsPeriod] || 1;
    const liveEvents = state.analyticsEvents || [];
    const localDetailOpens = liveEvents.filter((event) => event.name === 'detail_open').length;
    const localVideoPlays = liveEvents.filter((event) => event.name === 'video_play').length;
    const localZeroResults = liveEvents.filter((event) => event.name === 'zero_results').length;
    const mobileViews = Math.round(1948 * periodFactor);
    const tabletViews = Math.round(899 * periodFactor);
    const totalViews = mobileViews + tabletViews;
    return `
        ${pageHead(
            'Privacy-light performance',
            'Analytics to Action',
            'Data agregat per outlet dan surface. Tidak ada identitas visitor.',
            `<select class="filter-select" aria-label="Periode analytics" data-analytics-period><option value="7" ${state.analyticsPeriod === '7' ? 'selected' : ''}>7 hari</option><option value="30" ${state.analyticsPeriod === '30' ? 'selected' : ''}>30 hari</option><option value="90" ${state.analyticsPeriod === '90' ? 'selected' : ''}>90 hari</option></select>`,
        )}
        <section class="metrics-grid">
            ${metricCard('eye', 'Menu views', totalViews.toLocaleString('id-ID'), '+18%', 'dibanding periode lalu')}
            ${metricCard('mouse-pointer-click', 'Detail dibuka', (1206 + localDetailOpens).toLocaleString('id-ID'), '42%', 'engagement rate')}
            ${metricCard('circle-play', 'Video play', String(184 + localVideoPlays), '15,2%', 'dari detail dengan video')}
            ${metricCard('search-x', 'Zero result', String(31 + localZeroResults), '4,9%', 'dari pencarian')}
        </section>
        <section class="analytics-operations-grid">
            <article class="panel">
                <header class="panel-header"><div><h2>Surface performance</h2><p>${activeOutlet().name} · periode terpilih</p></div></header>
                <div class="surface-performance">
                    <div><span><i data-lucide="smartphone"></i>Bio Menu</span><strong>${mobileViews.toLocaleString('id-ID')}</strong><div><i style="width:68%"></i></div><small>68% dari seluruh views</small></div>
                    <div><span><i data-lucide="tablet"></i>Store Display</span><strong>${tabletViews.toLocaleString('id-ID')}</strong><div><i style="width:32%"></i></div><small>32% dari seluruh views</small></div>
                </div>
            </article>
            <article class="panel">
                <header class="panel-header"><div><h2>QR source</h2><p>Attribution agregat.</p></div></header>
                <div class="qr-source-ranking">${state.qrRoutes.map((route, index) => `<div><span>0${index + 1}</span><strong>${escapeHTML(route.label)}</strong><small>${escapeHTML(route.source)}</small><b>${Number(route.scans || 0).toLocaleString('id-ID')}</b></div>`).join('')}</div>
            </article>
        </section>
        <article class="panel operational-insights">
            <header class="panel-header"><div><h2>Observasi operasional</h2><p>Petunjuk untuk tindakan, bukan klaim sebab-akibat.</p></div></header>
            <div>
                <article><span class="insight-tone is-warning"><i data-lucide="circle-off"></i></span><div><strong>Chicken Popcorn sering dilihat saat sold out</strong><p>Periksa stok atau jadwal agar label ketersediaan tetap akurat.</p></div><button class="button button-secondary" type="button" data-route="menus">Buka menu</button></article>
                <article><span class="insight-tone is-info"><i data-lucide="search"></i></span><div><strong>Pencarian “decaf” belum memiliki hasil</strong><p>Data contoh tidak menyimpan identitas visitor. Pertimbangkan tag informasi decaf.</p></div><button class="button button-secondary" type="button" data-route="menus">Periksa tag</button></article>
                <article><span class="insight-tone is-success"><i data-lucide="qr-code"></i></span><div><strong>Instagram memberi pembukaan terbanyak</strong><p>Gunakan QR source terpisah untuk counter dan materi cetak.</p></div><button class="button button-secondary" type="button" data-route="distribution">Kelola QR</button></article>
            </div>
        </article>
        <details class="metric-definitions"><summary>Definisi dan privasi metrik</summary><p>Views, detail opens, video plays, searches, zero results, dan QR scans di-rollup per hari, outlet, serta surface. Prototype tidak menyimpan search term, nama, email, nomor telepon, atau session identifier.</p></details>
    `;
}

function recordOperationsEvent(name, metadata = {}) {
    state.analyticsEvents = [...(state.analyticsEvents || []), {
        id: crypto.randomUUID(),
        name,
        surface: metadata.surface || previewMode || 'mobile',
        occurredAt: new Date().toISOString(),
    }].slice(-200);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function applyItemMutation(ids, changes, label) {
    const records = state.items.filter((item) => ids.includes(item.id));
    if (!records.length) return;
    lastBulkUndo = {
        label,
        items: records.map((item) => ({
            id: item.id,
            values: Object.fromEntries(Object.keys(changes).map((field) => [field, item[field]])),
        })),
    };
    records.forEach((item) => Object.assign(item, changes));
    persistState();
    render();
    toast('Perubahan massal disimpan', `${records.length} item diperbarui sebagai satu draft group.`);
}

function undoBulkMutation() {
    if (!lastBulkUndo) return;
    lastBulkUndo.items.forEach((record) => {
        const item = state.items.find((entry) => entry.id === record.id);
        if (item) Object.assign(item, record.values);
    });
    const count = lastBulkUndo.items.length;
    lastBulkUndo = null;
    persistState();
    render();
    toast('Perubahan dibatalkan', `${count} item dikembalikan.`);
}

function discardDraftChange(changeId) {
    const change = catalogDiff().find((entry) => entry.id === changeId);
    if (!change) return;
    const live = currentPublishedState();
    if (change.type === 'created') {
        state.items = state.items.filter((item) => item.id !== change.itemId);
    } else if (change.type === 'deleted') {
        const previous = live.items.find((item) => item.id === change.itemId);
        if (previous) state.items.push(JSON.parse(JSON.stringify(previous)));
    } else if (change.type === 'field') {
        const previous = live.items.find((item) => item.id === change.itemId);
        const current = state.items.find((item) => item.id === change.itemId);
        if (previous && current) current[change.field] = previous[change.field];
    } else if (change.type === 'structure') {
        state.categories = JSON.parse(JSON.stringify(live.categories || []));
    } else if (change.type === 'appearance') {
        state.appearance[change.field] = live.appearance?.[change.field] ?? DEFAULT_STATE.appearance[change.field];
    }
    persistState();
    render();
    toast('Perubahan dibatalkan', 'Perubahan lain di draft tetap aman.');
}

function openTranslationDialog(itemId) {
    const item = state.items.find((entry) => entry.id === itemId);
    if (!item) return;
    const locale = state.enabledLocales.find((entry) => entry !== state.defaultLocale) || 'en';
    const translation = item.translations?.[locale] || {};
    openSimpleDialog({
        eyebrow: 'Localization',
        title: `Terjemahkan ${item.name}`,
        fields: `
            <div class="translation-source"><span>Bahasa sumber</span><strong>${escapeHTML(item.name)}</strong><p>${escapeHTML(item.description)}</p></div>
            <label class="field"><span>Nama · ${SAGA_LOCALES[locale].label}</span><input name="name" required maxlength="140" value="${escapeHTML(translation.name || '')}"></label>
            <label class="field"><span>Deskripsi · ${SAGA_LOCALES[locale].label}</span><textarea name="description" required maxlength="240" rows="4">${escapeHTML(translation.description || '')}</textarea></label>
            ${item.video ? `<label class="field"><span>Transcript video</span><textarea name="videoTranscript" rows="4" maxlength="1200">${escapeHTML(item.videoTranscript || '')}</textarea><small>Transcript membantu customer yang tidak dapat memutar audio.</small></label>` : ''}
        `,
        submitLabel: 'Simpan terjemahan',
        submit: (formData) => {
            item.translations ||= {};
            item.translations[locale] = {
                name: String(formData.get('name') || '').trim(),
                description: String(formData.get('description') || '').trim(),
            };
            if (item.video) item.videoTranscript = String(formData.get('videoTranscript') || '').trim();
            persistState();
            render();
            toast('Terjemahan disimpan', `${SAGA_LOCALES[locale].label} siap dipreview.`);
        },
    });
}

function openScheduleDialog(itemId) {
    const item = state.items.find((entry) => entry.id === itemId);
    if (!item) return;
    openSimpleDialog({
        eyebrow: 'Asia/Jakarta',
        title: `Jadwal ${item.name}`,
        fields: `
            <label class="field"><span>Mulai tampil</span><input type="datetime-local" name="startsAt" value="${escapeHTML(item.schedule?.startsAt || '')}"></label>
            <label class="field"><span>Selesai tampil</span><input type="datetime-local" name="endsAt" value="${escapeHTML(item.schedule?.endsAt || '')}"></label>
            <div class="dialog-note"><i data-lucide="info"></i><span>Manual sold out tetap mengalahkan jadwal visibilitas.</span></div>
        `,
        submitLabel: 'Simpan jadwal',
        submit: (formData) => {
            const startsAt = String(formData.get('startsAt') || '');
            const endsAt = String(formData.get('endsAt') || '');
            if (startsAt && endsAt && new Date(startsAt) >= new Date(endsAt)) {
                toast('Jadwal belum valid', 'Waktu selesai harus setelah waktu mulai.');
                return false;
            }
            item.schedule = { startsAt, endsAt };
            persistState();
            render();
            toast('Jadwal disimpan', 'Timezone organisasi Asia/Jakarta digunakan.');
        },
    });
}

function openQrDialog() {
    openSimpleDialog({
        eyebrow: 'Distribution object',
        title: 'Buat QR baru',
        fields: `
            <label class="field"><span>Nama QR</span><input name="label" required maxlength="80" placeholder="Contoh: Meja teras"></label>
            <label class="field"><span>Sumber</span><input name="source" required maxlength="40" placeholder="table, counter, poster"></label>
            <label class="field"><span>Tujuan</span><select name="surface"><option value="mobile">Bio Menu</option><option value="tablet">Store Display</option></select></label>
        `,
        submitLabel: 'Buat QR',
        submit: (formData) => {
            const label = String(formData.get('label') || '').trim();
            const source = String(formData.get('source') || '').trim().toLocaleLowerCase('id').replace(/[^a-z0-9-]+/g, '-');
            state.qrRoutes.push({
                id: `${source}-${Date.now().toString(36).slice(-4)}`,
                label,
                source,
                surface: formData.get('surface') === 'tablet' ? 'tablet' : 'mobile',
                outletId: state.activeOutletId,
                status: 'active',
                scans: 0,
            });
            persistState({ markDraft: false });
            render();
            toast('QR dibuat', 'Destination dapat diubah tanpa mencetak ulang QR.');
        },
    });
}

function inviteMemberDialog() {
    openSimpleDialog({
        eyebrow: 'Team access',
        title: 'Undang anggota',
        fields: `
            <label class="field"><span>Nama</span><input name="name" required maxlength="80"></label>
            <label class="field"><span>Email</span><input type="email" name="email" required maxlength="160"></label>
            <label class="field"><span>Role</span><select name="role"><option value="editor">Editor</option><option value="manager">Manager</option></select></label>
        `,
        submitLabel: 'Kirim undangan',
        submit: (formData) => {
            const name = String(formData.get('name') || '').trim();
            state.members.push({
                id: `member-${Date.now().toString(36)}`,
                name,
                email: String(formData.get('email') || '').trim(),
                role: formData.get('role') === 'manager' ? 'manager' : 'editor',
                status: 'pending',
            });
            persistState({ markDraft: false });
            render();
            toast('Undangan dibuat', 'Status tetap pending sampai penerima menerima undangan.');
        },
    });
}

augmentDefaultState();
ensureOperationsState();

const baseGetRoute = getRoute;
const baseRender = render;
const baseBindViewEvents = bindViewEvents;
const baseBindPublicEvents = bindPublicEvents;
const baseOpenDetail = openDetail;
const basePublishNow = publishNow;
const baseUpdateGlobalState = updateGlobalState;

getRoute = function getOperationsRoute() {
    const value = window.location.hash.replace('#', '');
    return ['overview', 'menus', 'categories', 'addons', 'media', 'changes', 'appearance', 'distribution', 'workspace', 'publish', 'analytics'].includes(value)
        ? value
        : baseGetRoute();
};

render = function renderOperationsApp() {
    document.querySelectorAll('[data-route]').forEach((button) => button.classList.toggle('is-active', button.dataset.route === currentRoute));
    const view = {
        overview: renderEditorialOverview,
        menus: renderOperationsMenus,
        categories: renderCategories,
        addons: renderAddons,
        media: renderMediaLibrary,
        changes: renderChangesHealth,
        appearance: renderEditorialAppearance,
        distribution: renderDistribution,
        workspace: renderWorkspaceOperations,
        publish: renderEditorialPublish,
        analytics: renderOperationsAnalytics,
    }[currentRoute] || renderEditorialOverview;
    main.innerHTML = view();
    updateGlobalState();
    refreshIcons();
    bindViewEvents();
};

renderMenuRow = renderOperationsMenuRow;
renderPublicCard = renderOperationsPublicCard;
renderPublicSection = renderOperationsPublicSection;
renderMobileMenu = renderOperationsMobileMenu;
renderTabletMenu = renderOperationsTabletMenu;
renderAnalytics = renderOperationsAnalytics;

bindViewEvents = function bindOperationsViewEvents() {
    baseBindViewEvents();
    document.querySelectorAll('[data-select-item]').forEach((input) => {
        input.addEventListener('change', () => {
            if (input.checked) selectedItemIds.add(input.value);
            else selectedItemIds.delete(input.value);
            render();
        });
    });
    document.querySelector('[data-select-all]')?.addEventListener('change', (event) => {
        state.items.filter(menuMatchesSavedView).forEach((item) => {
            if (event.target.checked) selectedItemIds.add(item.id);
            else selectedItemIds.delete(item.id);
        });
        render();
    });
    document.querySelectorAll('[data-inline-field]').forEach((control) => {
        control.addEventListener('change', () => {
            const item = state.items.find((entry) => entry.id === control.dataset.itemId);
            if (!item) return;
            const field = control.dataset.inlineField;
            const value = field === 'price' ? Math.max(0, Number(control.value || 0)) : control.value;
            lastBulkUndo = { label: 'inline edit', items: [{ id: item.id, values: { [field]: item[field] } }] };
            item[field] = value;
            persistState();
            render();
            toast('Menu diperbarui', `${item.name} disimpan sebagai draft.`);
        });
    });
    document.querySelector('[data-bulk-category]')?.addEventListener('change', (event) => {
        if (event.target.value) applyItemMutation([...selectedItemIds], { categoryId: event.target.value }, 'Pindah kategori');
    });
    document.querySelectorAll('[data-member-role]').forEach((select) => {
        select.addEventListener('change', () => {
            const member = state.members.find((entry) => entry.id === select.dataset.memberId);
            if (!member || member.role === 'owner') return;
            member.role = select.value === 'manager' ? 'manager' : 'editor';
            persistState({ markDraft: false });
            toast('Role diperbarui', `${member.name} sekarang ${member.role}.`);
        });
    });
};

bindPublicEvents = function bindOperationsPublicEvents(root = previewStage) {
    baseBindPublicEvents(root);
    const updateResults = () => {
        const cards = [...root.querySelectorAll('[data-public-card]')];
        const visible = cards.filter((card) => !card.hidden);
        const hasConstraint = Boolean(root.querySelector('[data-public-search]')?.value.trim() || publicDietaryFilter);
        const promo = root.querySelector('.promo-banner');
        if (promo) promo.hidden = hasConstraint;
        root.querySelector('[data-public-result-count]')?.replaceChildren(document.createTextNode(`${visible.length} menu ditemukan`));
        const zero = root.querySelector('[data-public-zero]');
        if (zero) zero.hidden = visible.length > 0;
        if (!visible.length) recordOperationsEvent('zero_results', { surface: root.querySelector('[data-public-surface]')?.dataset.publicSurface });
    };
    root.querySelectorAll('[data-action="public-dietary"]').forEach((button) => {
        button.addEventListener('click', () => {
            publicDietaryFilter = button.dataset.filter || '';
            root.querySelectorAll('[data-action="public-dietary"]').forEach((entry) => entry.classList.toggle('is-active', entry === button));
            root.querySelectorAll('[data-public-card]').forEach((card) => {
                if (!publicDietaryFilter) {
                    card.hidden = false;
                } else if (publicDietaryFilter === 'susu') {
                    card.hidden = card.dataset.dietary.includes('susu');
                } else {
                    card.hidden = !card.dataset.dietary.includes(publicDietaryFilter);
                }
            });
            root.querySelectorAll('[data-public-section]').forEach((section) => {
                section.hidden = !section.querySelector('[data-public-card]:not([hidden])');
            });
            updateResults();
        });
    });
    root.querySelector('[data-public-search]')?.addEventListener('input', updateResults);
    root.querySelector('[data-public-category-select]')?.addEventListener('change', (event) => {
        root.querySelector(`[data-public-category="${CSS.escape(event.target.value)}"]`)?.click();
        updateResults();
    });
    updateResults();
};

openDetail = function openLocalizedDetail(itemId) {
    const item = state.items.find((entry) => entry.id === itemId);
    if (!item) return;
    const original = { name: item.name, description: item.description };
    item.name = localizedValue(item, 'name');
    item.description = localizedValue(item, 'description');
    baseOpenDetail(itemId);
    item.name = original.name;
    item.description = original.description;
    recordOperationsEvent('detail_open');
    const video = detailDialog.querySelector('video');
    if (video) {
        video.addEventListener('play', () => recordOperationsEvent('video_play'), { once: true });
        if (item.videoTranscript) {
            const transcript = document.createElement('details');
            transcript.className = 'video-transcript';
            transcript.innerHTML = `<summary>Transcript video</summary><p>${escapeHTML(item.videoTranscript)}</p>`;
            video.closest('.detail-media')?.append(transcript);
        }
    }
};

publishNow = function publishOperationsSnapshot(options = {}) {
    const previousVersion = state.publishedVersion;
    const previousSnapshot = JSON.parse(JSON.stringify(state.publishedSnapshot || buildSnapshot(state)));
    basePublishNow(options);
    if (options.forceFailure) return;
    window.setTimeout(() => {
        if (state.publishedVersion <= previousVersion) return;
        if (!state.versionHistory.some((version) => version.version === previousVersion)) {
            state.versionHistory.push({
                id: `v${previousVersion}`,
                version: previousVersion,
                note: 'Versi sebelum publikasi terbaru',
                publishedAt: state.lastPublished,
                author: 'Andreas',
                snapshot: previousSnapshot,
            });
        }
        state.versionHistory.push({
            id: `v${state.publishedVersion}`,
            version: state.publishedVersion,
            note: 'Publikasi dari Draft Changes Center',
            publishedAt: state.lastPublished,
            author: 'Andreas',
            snapshot: JSON.parse(JSON.stringify(state.publishedSnapshot)),
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, 1100);
};

updateGlobalState = function updateOperationsGlobalState() {
    baseUpdateGlobalState();
    const healthCount = document.querySelector('[data-health-count]');
    if (healthCount) {
        const count = catalogHealthIssues().length;
        healthCount.textContent = String(count);
        healthCount.classList.toggle('is-alert', count > 0);
    }
    const switcher = document.querySelector('.business-switcher small');
    if (switcher) switcher.textContent = `Menu utama · ${activeOutlet().name}`;
};

document.addEventListener('click', (event) => {
    const actionButton = event.target.closest('[data-action]');
    if (!actionButton) return;
    const { action } = actionButton.dataset;
    if (action === 'menu-saved-view') {
        menuSavedView = actionButton.dataset.view || 'all';
        selectedItemIds.clear();
        render();
    }
    if (action === 'toggle-shift-mode') {
        document.body.classList.toggle('shift-mode');
        toast(document.body.classList.contains('shift-mode') ? 'Shift mode aktif' : 'Shift mode ditutup', 'Kontrol harian diprioritaskan pada layar kecil.');
    }
    if (action === 'clear-selection') {
        selectedItemIds.clear();
        render();
    }
    if (action === 'bulk-available') applyItemMutation([...selectedItemIds], { availability: 'available' }, 'Tersedia');
    if (action === 'bulk-sold-out') applyItemMutation([...selectedItemIds], { availability: 'sold_out' }, 'Sold out');
    if (action === 'bulk-show') applyItemMutation([...selectedItemIds], { visibility: 'both' }, 'Tampilkan');
    if (action === 'bulk-hide') applyItemMutation([...selectedItemIds], { visibility: 'hidden' }, 'Sembunyikan');
    if (action === 'undo-bulk') undoBulkMutation();
    if (action === 'change-center-tab') {
        changeCenterTab = actionButton.dataset.tab === 'health' ? 'health' : 'changes';
        render();
    }
    if (action === 'change-filter') {
        changeCenterFilter = actionButton.dataset.filter || 'all';
        render();
    }
    if (action === 'discard-change') discardDraftChange(actionButton.dataset.changeId);
    if (action === 'translate-item') openTranslationDialog(actionButton.dataset.itemId);
    if (action === 'schedule-item') openScheduleDialog(actionButton.dataset.itemId);
    if (action === 'public-locale') {
        publicLocale = SAGA_LOCALES[actionButton.dataset.locale] ? actionButton.dataset.locale : state.defaultLocale;
        if (!previewShell.hidden) showPreview(previewMode);
        else render();
    }
    if (action === 'clear-public-search') {
        const root = actionButton.closest('[data-public-menu]');
        const input = root?.querySelector('[data-public-search]');
        if (input) {
            input.value = '';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.focus();
        }
    }
    if (action === 'clear-public-filters') {
        publicDietaryFilter = '';
        if (!previewShell.hidden) showPreview(previewMode);
        else render();
    }
    if (action === 'public-dietary') publicDietaryFilter = actionButton.dataset.filter || '';
    if (action === 'new-qr-route') openQrDialog();
    if (action === 'toggle-qr-route') {
        const route = state.qrRoutes.find((entry) => entry.id === actionButton.dataset.qrId);
        if (route) {
            route.status = route.status === 'active' ? 'inactive' : 'active';
            persistState({ markDraft: false });
            render();
        }
    }
    if (action === 'copy-qr-route' || action === 'download-qr-route') {
        const route = state.qrRoutes.find((entry) => entry.id === actionButton.dataset.qrId);
        if (!route) return;
        const target = `${window.location.origin}${window.location.pathname}#preview-${route.surface}`;
        if (action === 'copy-qr-route') {
            navigator.clipboard?.writeText(target);
            toast('Link QR disalin', route.label);
        } else {
            const link = document.createElement('a');
            link.href = `https://quickchart.io/qr?size=1000&margin=2&text=${encodeURIComponent(target)}`;
            link.download = `${route.id}.png`;
            link.target = '_blank';
            link.rel = 'noopener';
            link.click();
        }
    }
    if (action === 'select-outlet') {
        state.activeOutletId = actionButton.dataset.outletId;
        persistState({ markDraft: false });
        render();
        toast('Scope outlet diperbarui', `${activeOutlet().name} sekarang menjadi scope aktif.`);
    }
    if (action === 'invite-member') inviteMemberDialog();
    if (action === 'restore-version') {
        const version = state.versionHistory.find((entry) => entry.id === actionButton.dataset.versionId);
        if (version?.snapshot && window.confirm(`Pulihkan versi v${version.version} sebagai draft baru?`)) {
            const snapshot = JSON.parse(JSON.stringify(version.snapshot));
            state.business = snapshot.business || state.business;
            state.appearance = snapshot.appearance || state.appearance;
            state.categories = snapshot.categories || state.categories;
            state.addonGroups = snapshot.addonGroups || state.addonGroups;
            state.items = snapshot.items || state.items;
            ensureOperationsState();
            state.draft = true;
            persistState();
            routeTo('changes');
            toast('Versi dipulihkan sebagai draft', 'Versi live belum berubah sampai diterbitkan.');
        }
    }
    if (action === 'reset-demo') {
        window.setTimeout(() => {
            ensureOperationsState();
            render();
        }, 0);
    }
});

render();
