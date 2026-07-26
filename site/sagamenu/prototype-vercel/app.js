const STORAGE_KEY = 'sagamenu-prototype-editorial-kv-v2';
const LEGACY_STORAGE_KEY = 'sagamenu-prototype-editorial-kv-v1';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=82';

const DEFAULT_STATE = {
    schemaVersion: 2,
    business: {
        name: 'Bachelor Coffee',
        location: 'Madiun',
        hours: 'Setiap hari, 08.00-22.00 WIB',
        address: 'Jl. Pahlawan, Madiun, Jawa Timur',
        tagline: 'Kopi untuk jeda yang lebih baik.',
    },
    appearance: {
        preset: 'editorial',
        primary: '#236354',
        accent: '#cbf45a',
        paper: '#f3f5f1',
        customFontName: '',
        itemLayout: 'photo',
    },
    preview: {
        mode: 'tablet',
        zoom: 1,
    },
    analyticsPeriod: '30',
    categories: [
        { id: 'signature', name: 'Signature', description: 'Pilihan khas Bachelor Coffee.', visible: true },
        { id: 'coffee', name: 'Coffee', description: 'Espresso-based dan manual brew.', visible: true },
        { id: 'non-coffee', name: 'Non-Coffee', description: 'Pilihan segar tanpa espresso.', visible: true },
        { id: 'food', name: 'Food', description: 'Comfort food untuk makan santai.', visible: true },
        { id: 'snacks', name: 'Snacks', description: 'Camilan ringan untuk sharing.', visible: true },
        { id: 'promo', name: 'Promo & Bundle', description: 'Paket pilihan dengan harga khusus.', visible: true },
    ],
    addonGroups: [
        {
            id: 'milk',
            name: 'Pilihan Susu',
            description: 'Tersedia sebagai informasi opsi penyajian.',
            type: 'single',
            min: 0,
            max: 1,
            values: [
                { name: 'Fresh Milk', price: 0 },
                { name: 'Oat Milk', price: 7000 },
                { name: 'Soy Milk', price: 5000 },
            ],
        },
        {
            id: 'extras',
            name: 'Tambahan',
            description: 'Konfirmasi pilihan kepada staf saat berkunjung.',
            type: 'multiple',
            min: 0,
            max: 3,
            values: [
                { name: 'Extra Shot', price: 8000 },
                { name: 'Vanilla Syrup', price: 5000 },
                { name: 'Caramel Syrup', price: 5000 },
            ],
        },
    ],
    items: [
        {
            id: 'es-kopi-susu-aren',
            name: 'Es Kopi Susu Aren',
            categoryId: 'signature',
            price: 28000,
            description: 'Espresso, susu, dan gula aren dengan rasa karamel yang lembut.',
            image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1000&q=82',
            badge: 'Best seller',
            availability: 'available',
            milkOptions: true,
            extraOptions: true,
            containsMilk: true,
        },
        {
            id: 'saga-cream-coffee',
            name: 'Saga Cream Coffee',
            categoryId: 'signature',
            price: 32000,
            description: 'Cold coffee dengan house cream yang ringan dan silky.',
            image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1000&q=82',
            badge: 'Signature',
            availability: 'available',
            milkOptions: true,
            extraOptions: true,
            containsMilk: true,
        },
        {
            id: 'espresso-tonic',
            name: 'Espresso Tonic',
            categoryId: 'signature',
            price: 30000,
            description: 'Espresso bright dengan tonic dan citrus finish.',
            image: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=1000&q=82',
            badge: 'New',
            availability: 'available',
            milkOptions: false,
            extraOptions: true,
            containsMilk: false,
        },
        {
            id: 'americano',
            name: 'Americano',
            categoryId: 'coffee',
            price: 22000,
            description: 'Espresso bersih dengan pilihan hot atau iced.',
            image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=1000&q=82',
            badge: '',
            availability: 'available',
            milkOptions: false,
            extraOptions: true,
            containsMilk: false,
        },
        {
            id: 'cafe-latte',
            name: 'Cafe Latte',
            categoryId: 'coffee',
            price: 27000,
            description: 'Kopi susu klasik dengan tekstur lembut.',
            image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=1000&q=82',
            badge: '',
            availability: 'available',
            milkOptions: true,
            extraOptions: true,
            containsMilk: true,
        },
        {
            id: 'manual-brew-v60',
            name: 'Manual Brew V60',
            categoryId: 'coffee',
            price: 35000,
            description: 'Single origin pilihan dengan profil rasa mingguan.',
            image: 'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?auto=format&fit=crop&w=1000&q=82',
            badge: 'Recommended',
            availability: 'available',
            milkOptions: false,
            extraOptions: false,
            containsMilk: false,
        },
        {
            id: 'matcha-cream',
            name: 'Matcha Cream',
            categoryId: 'non-coffee',
            price: 30000,
            description: 'Matcha earthy dengan susu dan cream lembut.',
            image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1000&q=82',
            badge: 'Best Seller',
            availability: 'available',
            milkOptions: true,
            extraOptions: false,
            containsMilk: true,
        },
        {
            id: 'chicken-mentai-rice',
            name: 'Chicken Mentai Rice',
            categoryId: 'food',
            price: 42000,
            description: 'Rice bowl ayam dengan saus mentai gurih.',
            image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=82',
            badge: 'Best Seller',
            availability: 'available',
            milkOptions: false,
            extraOptions: false,
            containsMilk: false,
        },
        {
            id: 'truffle-egg-toast',
            name: 'Truffle Egg Toast',
            categoryId: 'food',
            price: 38000,
            description: 'Toast, scrambled egg, dan aroma truffle.',
            image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1000&q=82',
            badge: 'Recommended',
            availability: 'available',
            milkOptions: false,
            extraOptions: false,
            containsMilk: true,
        },
        {
            id: 'butter-croissant',
            name: 'Butter Croissant',
            categoryId: 'snacks',
            price: 26000,
            description: 'Croissant butter berlapis dengan bagian luar renyah.',
            image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=82',
            badge: '',
            availability: 'available',
            milkOptions: false,
            extraOptions: false,
            containsMilk: true,
        },
        {
            id: 'chicken-popcorn',
            name: 'Chicken Popcorn',
            categoryId: 'snacks',
            price: 28000,
            description: 'Ayam crispy bite-size dengan dipping sauce.',
            image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1000&q=82',
            badge: '',
            availability: 'sold_out',
            milkOptions: false,
            extraOptions: false,
            containsMilk: false,
        },
        {
            id: 'coffee-date-bundle',
            name: 'Coffee Date Bundle',
            categoryId: 'promo',
            price: 59000,
            description: 'Dua minuman dan satu snack untuk sharing.',
            image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1000&q=82',
            badge: 'Promo',
            availability: 'available',
            milkOptions: false,
            extraOptions: false,
            containsMilk: false,
        },
    ],
    draft: true,
    maintenance: false,
    publishedVersion: 3,
    lastPublished: '25 Jul 2026, 14.22 WIB',
    publishedSnapshot: null,
};

let state = loadState();
let currentRoute = getRoute();
let previewMode = 'mobile';
let simpleDialogHandler = null;
let publishRunState = 'idle';
let publishFailureMessage = '';
let itemEditorStep = 1;
let itemEditorPreviewMode = 'mobile';
let itemEditorDirty = false;
let itemEditorSaveTimer = null;
let itemEditorValidationAttempted = false;

const main = document.querySelector('[data-dashboard] #main-content');
const previewShell = document.querySelector('[data-preview-shell]');
const previewStage = document.querySelector('[data-preview-stage]');
const itemEditor = document.querySelector('[data-item-editor]');
const itemForm = document.querySelector('[data-item-form]');
const simpleDialog = document.querySelector('[data-simple-dialog]');
const simpleForm = document.querySelector('[data-simple-form]');
const detailDialog = document.querySelector('[data-menu-detail]');
const previewLauncher = document.querySelector('[data-preview-launcher]');
const EDITOR_DRAFT_KEY = 'sagamenu-prototype-item-editor-draft-v1';
const EDITOR_EDIT_DRAFT_PREFIX = 'sagamenu-prototype-item-editor-edit-v1:';

function cloneDefaultState() {
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function buildSnapshot(source) {
    return JSON.parse(JSON.stringify({
        business: source.business,
        appearance: source.appearance,
        categories: source.categories,
        addonGroups: source.addonGroups,
        items: source.items,
    }));
}

function loadState() {
    try {
        const value = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
        const defaults = cloneDefaultState();
        if (!value) {
            defaults.publishedSnapshot = buildSnapshot(defaults);
            return defaults;
        }
        const stored = JSON.parse(value);
        const merged = {
            ...defaults,
            ...stored,
            business: { ...defaults.business, ...(stored.business || {}) },
            appearance: { ...defaults.appearance, ...(stored.appearance || {}) },
            preview: { ...defaults.preview, ...(stored.preview || {}) },
        };
        merged.schemaVersion = 2;
        merged.addonGroups = merged.addonGroups.map((group) => ({
            type: 'multiple',
            min: 0,
            max: Math.max(1, group.values?.length || 1),
            ...group,
        }));
        merged.items = merged.items.map((item) => ({
            ...item,
            addonGroupIds: item.addonGroupIds || [
                ...(item.milkOptions ? ['milk'] : []),
                ...(item.extraOptions ? ['extras'] : []),
            ],
        }));
        merged.publishedSnapshot ||= buildSnapshot(merged);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        localStorage.removeItem(LEGACY_STORAGE_KEY);
        return merged;
    } catch {
        const defaults = cloneDefaultState();
        defaults.publishedSnapshot = buildSnapshot(defaults);
        return defaults;
    }
}

function persistState({ markDraft = true, showSaveState = true } = {}) {
    if (markDraft) {
        state.draft = true;
    }
    state.schemaVersion = 2;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    updateGlobalState();
    if (!showSaveState) return;
    const saveState = document.querySelector('[data-save-state]');
    if (saveState) {
        saveState.classList.add('is-saving');
        saveState.innerHTML = '<i data-lucide="cloud-upload"></i><span>Menyimpan...</span>';
        window.setTimeout(() => {
            saveState.classList.remove('is-saving');
            saveState.innerHTML = '<i data-lucide="cloud-check"></i><span>Tersimpan</span>';
            refreshIcons();
        }, 450);
    }
}

function persistUiState() {
    persistState({ markDraft: false, showSaveState: false });
}

function getRoute() {
    const value = window.location.hash.replace('#', '');
    return ['overview', 'menus', 'categories', 'addons', 'appearance', 'publish', 'analytics'].includes(value)
        ? value
        : 'overview';
}

function routeTo(route) {
    currentRoute = route;
    window.location.hash = route;
    closeSidebar();
    render();
    window.scrollTo(0, 0);
    window.setTimeout(() => window.scrollTo(0, 0), 0);
    main?.focus({ preventScroll: true });
}

function escapeHTML(value = '') {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function normalizeImage(value) {
    const normalizedValue = String(value || '').trim();
    if (/^data:image\/(?:jpeg|png|webp);base64,[a-z0-9+/=\s]+$/i.test(normalizedValue)) {
        return normalizedValue;
    }
    try {
        const url = new URL(normalizedValue);
        return ['https:', 'http:'].includes(url.protocol) ? url.toString() : FALLBACK_IMAGE;
    } catch {
        return FALLBACK_IMAGE;
    }
}

function safeImage(value) {
    return escapeHTML(normalizeImage(value));
}

function slugify(value) {
    const slug = String(value)
        .toLocaleLowerCase('id')
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    return slug || crypto.randomUUID().slice(0, 8);
}

function formatPrice(value) {
    return `Rp ${Number(value || 0).toLocaleString('id-ID')}`;
}

function categoryName(categoryId) {
    return state.categories.find((category) => category.id === categoryId)?.name || 'Tanpa kategori';
}

function visibleCategories() {
    return state.categories.filter((category) => category.visible);
}

function refreshIcons() {
    if (window.lucide) {
        window.lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
    }
}

function updateGlobalState() {
    document.querySelectorAll('[data-menu-count]').forEach((node) => {
        node.textContent = String(state.items.length);
    });
    document.querySelectorAll('[data-draft-dot], [data-publish-dot]').forEach((node) => {
        node.hidden = !state.draft;
    });
    const publishButton = document.querySelector('[data-global-publish]');
    const publishLabel = document.querySelector('[data-global-publish-label]');
    if (publishButton && publishLabel) {
        publishButton.classList.toggle('button-primary', state.draft);
        publishButton.classList.toggle('button-secondary', !state.draft);
        publishLabel.textContent = state.draft ? 'Tinjau & terbitkan' : 'Publikasi';
        publishButton.setAttribute('aria-label', publishLabel.textContent);
    }
}

function toast(title, message = '') {
    const region = document.querySelector('[data-toast-region]');
    while (region.children.length >= 3) {
        region.firstElementChild?.remove();
    }
    const node = document.createElement('div');
    node.className = 'toast';
    node.innerHTML = `
        <span class="toast-icon"><i data-lucide="check"></i></span>
        <span><strong>${escapeHTML(title)}</strong><span>${escapeHTML(message)}</span></span>
    `;
    region.append(node);
    refreshIcons();
    window.setTimeout(() => node.remove(), 3200);
}

function pageHead(eyebrow, title, description, actions = '') {
    return `
        <header class="page-head">
            <div>
                <span class="eyebrow">${escapeHTML(eyebrow)}</span>
                <h1>${escapeHTML(title)}</h1>
                <p>${escapeHTML(description)}</p>
            </div>
            <div class="page-actions">${actions}</div>
        </header>
    `;
}

function render() {
    document.querySelectorAll('[data-route]').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.route === currentRoute);
    });

    const view = {
        overview: renderEditorialOverview,
        menus: renderMenus,
        categories: renderCategories,
        addons: renderAddons,
        appearance: renderEditorialAppearance,
        publish: renderEditorialPublish,
        analytics: renderAnalytics,
    }[currentRoute] || renderOverview;

    main.innerHTML = view();
    updateGlobalState();
    refreshIcons();
    bindViewEvents();
}

function renderStatusBanner() {
    return `
        <section class="status-banner ${state.draft ? 'is-draft' : ''}">
            <span class="status-icon"><i data-lucide="${state.draft ? 'file-pen-line' : 'circle-check-big'}"></i></span>
            <div>
                <strong>${state.draft ? 'Ada perubahan yang belum diterbitkan' : 'Menu publik sudah terbaru'}</strong>
                <span>${state.draft ? 'Customer masih melihat versi terbit terakhir.' : `Versi ${state.publishedVersion} · ${state.lastPublished}`}</span>
            </div>
            <button class="button ${state.draft ? 'button-primary' : 'button-secondary'}" type="button" data-action="${state.draft ? 'open-publish' : 'preview-mobile'}">
                <i data-lucide="${state.draft ? 'send' : 'eye'}"></i>
                <span>${state.draft ? 'Tinjau & terbitkan' : 'Lihat menu'}</span>
            </button>
        </section>
    `;
}

function renderOverview() {
    const available = state.items.filter((item) => item.availability === 'available').length;
    const recentItems = state.items.slice(0, 4);
    return `
        ${pageHead(
            'Workspace',
            'Ringkasan',
            'Status menu Saga Coffee Demo hari ini.',
            `<button class="button button-primary" type="button" data-action="new-item"><i data-lucide="plus"></i><span>Tambah menu</span></button>`,
        )}
        ${renderStatusBanner()}
        <section class="metrics-grid" aria-label="Ringkasan performa">
            ${metricCard('eye', 'Dilihat 30 hari', '2.847', '+18%', 'dibanding bulan lalu')}
            ${metricCard('mouse-pointer-click', 'Detail dibuka', '1.206', '42%', 'dari seluruh kunjungan')}
            ${metricCard('utensils', 'Menu aktif', String(available), `${state.items.length - available} sold out`, 'semua kategori')}
            ${metricCard('qr-code', 'Sumber QR', '684', '24%', 'dari total kunjungan')}
        </section>
        <section class="content-grid">
            <div>
                <article class="panel">
                    <header class="panel-header">
                        <div><h2>Aktivitas terbaru</h2><p>Perubahan pada workspace ini</p></div>
                        <button class="button button-secondary" type="button" data-route="menus">Kelola menu</button>
                    </header>
                    <div class="panel-body activity-list">
                        ${recentItems.map((item, index) => `
                            <div class="activity-item">
                                <span class="activity-icon"><i data-lucide="${index === 0 ? 'image-plus' : 'pencil-line'}"></i></span>
                                <span>
                                    <strong>${escapeHTML(index === 0 ? `${item.name} diperbarui` : `${item.name} disimpan`)}</strong>
                                    <span>${escapeHTML(categoryName(item.categoryId))} · ${formatPrice(item.price)}</span>
                                </span>
                                <time>${index * 11 + 4} menit lalu</time>
                            </div>
                        `).join('')}
                    </div>
                </article>
                <article class="panel">
                    <header class="panel-header">
                        <div><h2>Menu paling sering dibuka</h2><p>30 hari terakhir</p></div>
                        <button class="button button-secondary" type="button" data-route="analytics">Buka analytics</button>
                    </header>
                    <div class="panel-body ranking-list">
                        ${state.items.slice(0, 4).map((item, index) => rankingItem(item, index, [486, 392, 301, 247][index])).join('')}
                    </div>
                </article>
            </div>
            <div>
                <article class="panel">
                    <header class="panel-header"><div><h2>Siap digunakan</h2><p>Setup workspace</p></div><span class="badge badge-green">4/4 selesai</span></header>
                    <div class="panel-body checklist">
                        ${checklistItem('Menu pertama', `${state.items.length} item tersedia`)}
                        ${checklistItem('Kategori', `${state.categories.length} kategori tersusun`)}
                        ${checklistItem('Tampilan', 'Warm Minimal aktif')}
                        ${checklistItem('Publish & QR', `Versi ${state.publishedVersion} sudah live`)}
                    </div>
                </article>
                <article class="panel">
                    <div class="panel-body">
                        <div class="insight-box">
                            <span><i data-lucide="sparkles"></i> Insight minggu ini</span>
                            <h3>Foto menu membantu customer memilih</h3>
                            <p>Item dengan foto mendapat pembukaan detail 2,4× lebih tinggi dibanding item tanpa foto.</p>
                        </div>
                    </div>
                </article>
                <article class="panel">
                    <header class="panel-header"><div><h2>Preview cepat</h2><p>Satu data, dua tampilan</p></div></header>
                    <div class="panel-body">
                        <div class="page-actions" style="justify-content:flex-start">
                            <button class="button button-secondary" type="button" data-action="preview-mobile"><i data-lucide="smartphone"></i><span>Bio Menu</span></button>
                            <button class="button button-secondary" type="button" data-action="preview-tablet"><i data-lucide="tablet"></i><span>Store Display</span></button>
                        </div>
                    </div>
                </article>
            </div>
        </section>
    `;
}

function metricCard(icon, label, value, change, note) {
    return `
        <article class="metric">
            <div class="metric-head"><span>${escapeHTML(label)}</span><span class="metric-icon"><i data-lucide="${icon}"></i></span></div>
            <strong>${escapeHTML(value)}</strong>
            <p><span class="metric-change">${escapeHTML(change)}</span> ${escapeHTML(note)}</p>
        </article>
    `;
}

function checklistItem(title, description) {
    return `
        <div class="checklist-item">
            <span class="check-icon"><i data-lucide="check"></i></span>
            <span><strong>${escapeHTML(title)}</strong><span>${escapeHTML(description)}</span></span>
            <i data-lucide="chevron-right"></i>
        </div>
    `;
}

function rankingItem(item, index, value) {
    return `
        <div class="ranking-item">
            <span class="ranking-number">0${index + 1}</span>
            <img src="${safeImage(item.image)}" alt="">
            <span><strong>${escapeHTML(item.name)}</strong><span>${escapeHTML(categoryName(item.categoryId))}</span></span>
            <span class="ranking-value">${Number(value).toLocaleString('id-ID')}</span>
        </div>
    `;
}

function renderMenus() {
    return `
        ${pageHead(
            'Katalog',
            'Menu',
            'Atur foto, harga, deskripsi, status, dan detail menu.',
            `<button class="button button-primary" type="button" data-action="new-item"><i data-lucide="plus"></i><span>Tambah menu</span></button>`,
        )}
        <article class="panel">
            <div class="table-toolbar">
                <label class="search-field">
                    <i data-lucide="search"></i>
                    <span class="sr-only">Cari menu</span>
                    <input type="search" placeholder="Cari nama menu..." data-menu-search>
                </label>
                <select class="filter-select" data-menu-category-filter aria-label="Filter kategori">
                    <option value="">Semua kategori</option>
                    ${state.categories.map((category) => `<option value="${escapeHTML(category.id)}">${escapeHTML(category.name)}</option>`).join('')}
                </select>
                <select class="filter-select" data-menu-status-filter aria-label="Filter status">
                    <option value="">Semua status</option>
                    <option value="available">Tersedia</option>
                    <option value="sold_out">Sold out</option>
                </select>
            </div>
            <div class="table-scroll">
                <table class="data-table">
                    <thead>
                        <tr><th>Menu</th><th>Kategori</th><th>Harga</th><th>Status</th><th>Badge</th><th aria-label="Aksi"></th></tr>
                    </thead>
                    <tbody data-menu-table>
                        ${state.items.map(renderMenuRow).join('')}
                    </tbody>
                </table>
                <div class="empty-state" data-menu-empty hidden>
                    <img src="assets/illustrations/empty-catalog.webp" alt="" width="640" height="640">
                    <strong>Menu tidak ditemukan</strong>
                    <span>Coba kata kunci atau kategori lain.</span>
                </div>
            </div>
        </article>
    `;
}

function renderMenuRow(item) {
    return `
        <tr data-item-row data-name="${escapeHTML(item.name.toLocaleLowerCase('id'))}" data-category="${escapeHTML(item.categoryId)}" data-status="${escapeHTML(item.availability)}">
            <td>
                <div class="menu-cell">
                    <img src="${safeImage(item.image)}" alt="">
                    <span><strong>${escapeHTML(item.name)}</strong><span>${escapeHTML(item.description)}</span></span>
                </div>
            </td>
            <td><span class="badge">${escapeHTML(categoryName(item.categoryId))}</span></td>
            <td><strong>${formatPrice(item.price)}</strong></td>
            <td><span class="badge ${item.availability === 'available' ? 'badge-green' : 'badge-red'}">${item.availability === 'available' ? 'Tersedia' : 'Sold out'}</span></td>
            <td>${item.badge ? `<span class="badge badge-orange">${escapeHTML(item.badge)}</span>` : '<span class="badge">—</span>'}</td>
            <td>
                <div class="row-actions">
                    <button class="icon-button" type="button" data-action="toggle-availability" data-item-id="${escapeHTML(item.id)}" title="${item.availability === 'available' ? 'Tandai sold out' : 'Tandai tersedia'}" aria-label="${item.availability === 'available' ? 'Tandai sold out' : 'Tandai tersedia'}"><i data-lucide="${item.availability === 'available' ? 'eye-off' : 'eye'}"></i></button>
                    <button class="icon-button" type="button" data-action="edit-item" data-item-id="${escapeHTML(item.id)}" title="Edit menu" aria-label="Edit ${escapeHTML(item.name)}"><i data-lucide="pencil"></i></button>
                    <details class="row-action-menu">
                        <summary class="icon-button" title="Aksi lainnya" aria-label="Aksi lainnya ${escapeHTML(item.name)}"><i data-lucide="ellipsis"></i></summary>
                        <div class="row-action-popover" role="menu" aria-label="Aksi untuk ${escapeHTML(item.name)}">
                            <button type="button" role="menuitem" data-action="duplicate-item" data-item-id="${escapeHTML(item.id)}" aria-label="Duplikat ${escapeHTML(item.name)}"><i data-lucide="copy-plus"></i><span>Duplikat menu</span></button>
                            <button class="is-danger" type="button" role="menuitem" data-action="delete-item" data-item-id="${escapeHTML(item.id)}" aria-label="Hapus ${escapeHTML(item.name)}"><i data-lucide="trash-2"></i><span>Hapus menu</span></button>
                        </div>
                    </details>
                </div>
            </td>
        </tr>
    `;
}

function renderCategories() {
    return `
        ${pageHead(
            'Struktur menu',
            'Kategori',
            'Kategori tampil sebagai rail horizontal di Store Display dan Bio Menu.',
            `<button class="button button-primary" type="button" data-action="new-category"><i data-lucide="plus"></i><span>Tambah kategori</span></button>`,
        )}
        <article class="panel">
            <header class="panel-header">
                <div><h2>Urutan kategori</h2><p>${state.categories.filter((category) => category.visible).length} kategori tampil</p></div>
                <span class="badge">Drag handle visual</span>
            </header>
            <div class="category-list">
                ${state.categories.map((category, index) => `
                    <div class="category-row" data-category-row data-category-id="${escapeHTML(category.id)}">
                        <button class="drag-handle" type="button" data-action="move-category-down" data-category-id="${escapeHTML(category.id)}" aria-label="Geser ${escapeHTML(category.name)} ke bawah" ${index === state.categories.length - 1 ? 'disabled' : ''}><i data-lucide="grip-vertical"></i></button>
                        <span><strong>${escapeHTML(category.name)}</strong><span>${escapeHTML(category.description)}</span></span>
                        <span>${state.items.filter((item) => item.categoryId === category.id).length} menu</span>
                        <button class="toggle" type="button" role="switch" aria-checked="${category.visible}" data-action="toggle-category" data-category-id="${escapeHTML(category.id)}" aria-label="Tampilkan ${escapeHTML(category.name)}"></button>
                        <div class="row-actions">
                            <button class="icon-button" type="button" data-action="move-category-up" data-category-id="${escapeHTML(category.id)}" aria-label="Naikkan ${escapeHTML(category.name)}" ${index === 0 ? 'disabled' : ''}><i data-lucide="arrow-up"></i></button>
                            <button class="icon-button" type="button" data-action="move-category-down" data-category-id="${escapeHTML(category.id)}" aria-label="Turunkan ${escapeHTML(category.name)}" ${index === state.categories.length - 1 ? 'disabled' : ''}><i data-lucide="arrow-down"></i></button>
                            <button class="icon-button" type="button" data-action="edit-category" data-category-id="${escapeHTML(category.id)}" aria-label="Edit ${escapeHTML(category.name)}"><i data-lucide="pencil"></i></button>
                            <button class="icon-button" type="button" data-action="delete-category" data-category-id="${escapeHTML(category.id)}" aria-label="Hapus ${escapeHTML(category.name)}"><i data-lucide="trash-2"></i></button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </article>
    `;
}

function renderAddons() {
    return `
        ${pageHead(
            'Opsi informasi',
            'Add-on',
            'Tambahan ditampilkan sebagai informasi pilihan, bukan sebagai keranjang atau checkout.',
            `<button class="button button-primary" type="button" data-action="new-addon"><i data-lucide="plus"></i><span>Tambah grup</span></button>`,
        )}
        <article class="panel">
            <header class="panel-header"><div><h2>Grup add-on</h2><p>Dipakai pada detail menu</p></div><span class="badge badge-green">${state.addonGroups.length} grup aktif</span></header>
            <div class="addon-list">
                ${state.addonGroups.map((group) => `
                    <div class="addon-row">
                        <span><strong>${escapeHTML(group.name)}</strong><span>${escapeHTML(group.description)}</span><small>${group.type === 'single' ? 'Pilih satu' : `Pilih hingga ${group.max || group.values.length}`}</small></span>
                        <span>${group.values.map((value) => `${escapeHTML(value.name)}${value.price ? ` (+${formatPrice(value.price)})` : ''}`).join(' · ')}</span>
                        <div class="row-actions">
                            <button class="icon-button" type="button" data-action="edit-addon" data-addon-id="${escapeHTML(group.id)}" aria-label="Edit ${escapeHTML(group.name)}"><i data-lucide="pencil"></i></button>
                            <button class="icon-button" type="button" data-action="delete-addon" data-addon-id="${escapeHTML(group.id)}" aria-label="Hapus ${escapeHTML(group.name)}"><i data-lucide="trash-2"></i></button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </article>
        <article class="panel">
            <header class="panel-header"><div><h2>Pemakaian</h2><p>Menu dengan informasi add-on</p></div></header>
            <div class="panel-body">
                <div class="metrics-grid" style="margin-bottom:0">
                    ${metricCard('milk', 'Pilihan susu', String(state.items.filter((item) => item.addonGroupIds?.includes('milk') || item.milkOptions).length), 'menu', 'menampilkan opsi')}
                    ${metricCard('plus-circle', 'Tambahan', String(state.items.filter((item) => item.addonGroupIds?.includes('extras') || item.extraOptions).length), 'menu', 'menampilkan opsi')}
                    ${metricCard('info', 'Alergen susu', String(state.items.filter((item) => item.containsMilk).length), 'menu', 'diberi informasi')}
                    ${metricCard('shopping-cart', 'Order flow', '0', 'Preview only', 'tanpa checkout')}
                </div>
            </div>
        </article>
    `;
}

function renderAppearance() {
    return `
        ${pageHead(
            'Branding',
            'Tampilan',
            'Atur preset, warna, dan font untuk kedua layout publik.',
            `<button class="button button-secondary" type="button" data-action="preview-mobile"><i data-lucide="eye"></i><span>Preview</span></button>`,
        )}
        <section class="settings-layout">
            <article class="panel">
                <section class="setting-section">
                    <h3>Preset visual</h3>
                    <p>Pilih fondasi tampilan, lalu sesuaikan warna brand.</p>
                    <div class="preset-grid">
                        ${presetButton('warm', 'Warm Minimal', 'Hangat dan editorial', '#a4492d', '#f7f3ed')}
                        ${presetButton('clean', 'Clean Premium', 'Terang dan presisi', '#1f5e52', '#f3f6f4')}
                        ${presetButton('bold', 'Bold Street', 'Kontras dan ekspresif', '#d8492f', '#f0e942')}
                    </div>
                </section>
                <section class="setting-section">
                    <h3>Warna brand</h3>
                    <p>Warna diterapkan langsung pada preview.</p>
                    <div class="color-grid">
                        ${colorField('primary', 'Warna utama', state.appearance.primary)}
                        ${colorField('accent', 'Warna aksen', state.appearance.accent)}
                        ${colorField('paper', 'Warna latar', state.appearance.paper)}
                    </div>
                </section>
                <section class="setting-section">
                    <h3>Font brand</h3>
                    <p>Upload font untuk preview sesi ini. Implementasi SaaS akan menyimpan file di media storage.</p>
                    <label class="upload-box">
                        <i data-lucide="upload-cloud"></i>
                        <strong>${state.appearance.customFontName ? escapeHTML(state.appearance.customFontName) : 'Upload .woff, .woff2, atau .ttf'}</strong>
                        <span>Maksimum 2 MB untuk prototype</span>
                        <input type="file" accept=".woff,.woff2,.ttf,font/woff,font/woff2,font/ttf" data-font-upload>
                    </label>
                </section>
            </article>
            <aside class="mini-preview">
                <div class="mini-preview-toolbar"><span>Bio Menu</span><button class="button button-secondary" type="button" data-action="preview-mobile">Buka penuh</button></div>
                <div class="mini-phone">${renderPublicMenu('mobile', true)}</div>
            </aside>
        </section>
    `;
}

function presetButton(id, name, description, primary, paper) {
    return `
        <button class="preset-button ${state.appearance.preset === id ? 'is-active' : ''}" type="button" data-action="select-preset" data-preset="${id}" data-primary="${primary}" data-paper="${paper}">
            <span class="preset-preview" style="background:${paper}"><span style="background:${primary}"></span><span></span></span>
            <strong>${escapeHTML(name)}</strong><small>${escapeHTML(description)}</small>
        </button>
    `;
}

function colorField(key, label, value) {
    return `
        <label class="color-field">
            <span>${escapeHTML(label)}</span>
            <span class="color-control"><input type="color" value="${escapeHTML(value)}" data-color-key="${key}"><span>${escapeHTML(value.toUpperCase())}</span></span>
        </label>
    `;
}

function renderPublish() {
    const base = `${window.location.origin}${window.location.pathname}`;
    const mobileUrl = `${base}#preview-mobile`;
    const tabletUrl = `${base}#preview-tablet`;
    const qrUrl = `https://quickchart.io/qr?size=240&margin=1&text=${encodeURIComponent(mobileUrl)}`;
    return `
        ${pageHead(
            'Distribusi',
            'Publish & Share',
            'Review perubahan, publish satu snapshot, lalu bagikan link yang sesuai.',
            `<button class="button button-secondary" type="button" data-action="preview-mobile"><i data-lucide="eye"></i><span>Tinjau draft</span></button>
             <button class="button button-primary" type="button" data-action="publish-now" ${state.draft ? '' : 'disabled'}><i data-lucide="send"></i><span>${state.draft ? 'Terbitkan sekarang' : 'Sudah terbaru'}</span></button>`,
        )}
        <section class="publish-grid">
            <div>
                <article class="panel">
                    <div class="publish-summary">
                        <span class="publish-summary-icon"><i data-lucide="${state.draft ? 'file-clock' : 'badge-check'}"></i></span>
                        <div>
                            <h2>${state.draft ? 'Draft siap direview' : 'Menu publik sudah terbaru'}</h2>
                            <p>${state.draft ? 'Perubahan belum terlihat oleh customer.' : `Versi ${state.publishedVersion} aktif di Bio Menu dan Store Display.`}</p>
                        </div>
                    </div>
                    <div class="publish-details">
                        <div><span>VERSI LIVE</span><strong>Versi ${state.publishedVersion}</strong></div>
                        <div><span>TERAKHIR PUBLISH</span><strong>${escapeHTML(state.lastPublished)}</strong></div>
                        <div><span>STATUS AKSES</span><strong>${state.maintenance ? 'Maintenance' : 'Aktif'}</strong></div>
                    </div>
                </article>
                <article class="panel">
                    <header class="panel-header"><div><h2>Link publik</h2><p>Gunakan sesuai perangkat customer</p></div></header>
                    <div>
                        ${shareRow('smartphone', 'Bio Menu', mobileUrl, 'copy-mobile-link')}
                        ${shareRow('tablet', 'Store Display', tabletUrl, 'copy-tablet-link')}
                    </div>
                </article>
                <article class="panel">
                    <header class="panel-header"><div><h2>Status menu publik</h2><p>Kontrol tampilan saat akun memerlukan perhatian</p></div></header>
                    <div class="maintenance-control">
                        <span>
                            <strong>Maintenance mode</strong>
                            <span>Jika aktif, semua preview publik menampilkan status maintenance tanpa membuka isi katalog.</span>
                        </span>
                        <button class="toggle" type="button" role="switch" aria-checked="${state.maintenance}" data-action="toggle-maintenance" aria-label="Maintenance mode"></button>
                    </div>
                </article>
            </div>
            <aside>
                <article class="panel">
                    <header class="panel-header"><div><h2>QR Bio Menu</h2><p>Counter utama</p></div></header>
                    <div class="qr-card">
                        <img src="${qrUrl}" alt="QR menuju Bio Menu prototype">
                        <strong>Saga Coffee Demo</strong>
                        <span>Scan untuk membuka menu mobile</span>
                    </div>
                </article>
                <article class="panel">
                    <header class="panel-header"><div><h2>Snapshot live</h2><p>Konten yang sedang tampil</p></div></header>
                    <div class="panel-body checklist">
                        ${checklistItem(`${state.items.length} menu`, `${state.items.filter((item) => item.availability === 'available').length} tersedia`)}
                        ${checklistItem(`${visibleCategories().length} kategori`, 'Rail kategori aktif')}
                        ${checklistItem(`${state.addonGroups.length} grup add-on`, 'Detail informasi')}
                    </div>
                </article>
            </aside>
        </section>
    `;
}

function shareRow(icon, title, url, action) {
    return `
        <div class="share-row">
            <span class="share-icon"><i data-lucide="${icon}"></i></span>
            <span><strong>${escapeHTML(title)}</strong><span>${escapeHTML(url)}</span></span>
            <button class="button button-secondary" type="button" data-action="${action}"><i data-lucide="copy"></i><span>Salin</span></button>
        </div>
    `;
}

function renderAnalytics() {
    const analytics = {
        '7': { label: '7 hari terakhir', views: 824, opens: 361, search: 172, qr: 208, growth: '+7,8%', bars: [48, 61, 56, 74, 69, 88, 81] },
        '30': { label: '30 hari terakhir', views: 2847, opens: 1206, search: 634, qr: 684, growth: '+18%', bars: [54, 68, 62, 81, 74, 91, 86] },
        '90': { label: '90 hari terakhir', views: 7914, opens: 3268, search: 1841, qr: 1967, growth: '+24,6%', bars: [63, 72, 68, 78, 83, 94, 89] },
    }[state.analyticsPeriod] || null;
    const bars = analytics.bars;
    return `
        ${pageHead(
            'Performa',
            'Analytics',
            'Interaksi agregat untuk memahami menu yang paling berguna.',
            `<select class="filter-select" aria-label="Periode analytics" data-analytics-period>
                <option value="7" ${state.analyticsPeriod === '7' ? 'selected' : ''}>7 hari terakhir</option>
                <option value="30" ${state.analyticsPeriod === '30' ? 'selected' : ''}>30 hari terakhir</option>
                <option value="90" ${state.analyticsPeriod === '90' ? 'selected' : ''}>90 hari terakhir</option>
            </select>`,
        )}
        <section class="metrics-grid">
            ${metricCard('eye', 'Menu views', analytics.views.toLocaleString('id-ID'), analytics.growth, 'dibanding periode lalu')}
            ${metricCard('mouse-pointer-click', 'Detail dibuka', analytics.opens.toLocaleString('id-ID'), `${Math.round((analytics.opens / analytics.views) * 1000) / 10}%`, 'engagement rate')}
            ${metricCard('search', 'Pencarian', analytics.search.toLocaleString('id-ID'), `${Math.round((analytics.search / analytics.views) * 1000) / 10}%`, 'dari total views')}
            ${metricCard('qr-code', 'Scan QR', analytics.qr.toLocaleString('id-ID'), `${Math.round((analytics.qr / analytics.views) * 1000) / 10}%`, 'dari total views')}
        </section>
        <section class="content-grid">
            <article class="panel chart-panel">
                <header class="panel-header"><div><h2>Menu views</h2><p>${analytics.label}</p></div><span class="badge badge-green">${analytics.growth}</span></header>
                <div class="panel-body">
                    <div class="bar-chart" role="img" aria-label="Grafik menu views tujuh hari terakhir">
                        ${bars.map((height, index) => `<div class="bar-column"><span class="bar" style="height:${height}%"></span><span>${['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][index]}</span></div>`).join('')}
                    </div>
                </div>
            </article>
            <article class="panel">
                <header class="panel-header"><div><h2>Menu teratas</h2><p>Berdasarkan detail dibuka</p></div></header>
                <div class="panel-body ranking-list">
                    ${state.items.slice(0, 5).map((item, index) => rankingItem(item, index, [486, 392, 301, 247, 198][index])).join('')}
                </div>
            </article>
        </section>
        <article class="panel">
            <header class="panel-header"><div><h2>Channel kunjungan</h2><p>Sumber pembukaan katalog</p></div></header>
            <div class="panel-body">
                <div class="metrics-grid" style="margin-bottom:0">
                    ${metricCard('instagram', 'Link in bio', Math.round(analytics.views * .505).toLocaleString('id-ID'), '50,5%', 'dari total views')}
                    ${metricCard('qr-code', 'QR counter', analytics.qr.toLocaleString('id-ID'), `${Math.round((analytics.qr / analytics.views) * 1000) / 10}%`, 'dari total views')}
                    ${metricCard('link', 'Direct link', Math.round(analytics.views * .18).toLocaleString('id-ID'), '18%', 'dari total views')}
                    ${metricCard('map-pin', 'Google Business', Math.round(analytics.views * .075).toLocaleString('id-ID'), '7,5%', 'dari total views')}
                </div>
            </div>
        </article>
    `;
}

function renderEditorialOverview() {
    const available = state.items.filter((item) => item.availability === 'available').length;
    const soldOut = state.items.length - available;
    const recentItems = state.items.slice(0, 6);

    return `
        ${pageHead(
            'Dashboard',
            'Selamat datang, Andreas',
            'Kelola menu dan katalog preview Bachelor Coffee.',
            `<button class="button button-primary" type="button" data-action="new-item"><i data-lucide="plus"></i><span>Tambah menu</span></button>`,
        )}
        <section class="editorial-story-strip" aria-label="Status trial dan draft">
            <div class="story-copy">
                <span class="story-label">Workspace hari ini</span>
                <h2>Menu siap dilihat, draft menunggu diterbitkan.</h2>
                <p>Satu catalog menggerakkan Store Display dan Bio Menu.</p>
            </div>
            <div class="story-facts">
                ${editorialFact('calendar-days', '9 hari masa trial', 'Hari ke-5 dari 14', 'lime')}
                ${editorialFact('file-pen-line', '3 perubahan draft', 'Belum diterbitkan', 'pink')}
                ${editorialFact('images', '18 media', 'Foto dan video', 'blue')}
            </div>
            <img class="editorial-story-art" src="assets/illustrations/dashboard-story.webp" alt="" width="1280" height="420">
            <div class="editorial-kv-placeholder" aria-hidden="true">
                <span class="kv-person"></span>
                <span class="kv-paper"></span>
                <span class="kv-arrow">→</span>
                <span class="kv-tablet"></span>
                <span class="kv-phone"></span>
            </div>
        </section>
        <section class="overview-editorial-workspace">
            ${renderLivePreviewWorkspace('overview')}
            <aside class="overview-focus-rail">
                <article class="panel attention-panel">
                    <header class="panel-header"><div><h2>Perlu perhatian</h2><p>Prioritas sebelum customer melihat menu</p></div><span class="badge badge-pink">3 tugas</span></header>
                    <div class="attention-list">
                        ${attentionRow('file-pen-line', '3 perubahan draft belum diterbitkan', 'Versi live tetap aman', 'Siap ditinjau', '', 'pink')}
                        ${attentionRow('circle-off', `${soldOut} item sedang sold out`, 'Periksa ketersediaan', 'Kelola', 'menus', 'yellow', true)}
                        ${attentionRow('image', '4 foto perlu alt text', 'Lengkapi aksesibilitas media', 'Lengkapi', 'menus', 'blue', true)}
                    </div>
                </article>
                <article class="catalog-metadata" aria-label="Kesehatan katalog">
                    ${healthStat('list-checks', available, 'item aktif', 'lime')}
                    ${healthStat('circle-off', soldOut, 'sold out', 'yellow')}
                    ${healthStat('file-pen-line', state.draft ? 3 : 0, 'draft', 'pink')}
                    ${healthStat('images', 18, 'media', 'blue')}
                </article>
                <article class="publish-rail-card">
                    <span class="publish-rail-icon"><i data-lucide="calendar-check"></i></span>
                    <div><small>Terakhir terbit</small><strong>${escapeHTML(state.lastPublished)}</strong><p>Versi ${state.publishedVersion} tetap aktif.</p></div>
                </article>
            </aside>
        </section>
        <article class="panel overview-recent-items">
            <header class="panel-header">
                <div><h2>Item terbaru</h2><p>Menampilkan ${recentItems.length} dari ${state.items.length} item</p></div>
                <button class="text-action" type="button" data-route="menus">Lihat semua</button>
            </header>
            <div class="dashboard-item-list">
                ${recentItems.map((item, index) => `
                    <div class="dashboard-item-row">
                        <img src="${safeImage(item.image)}" alt="">
                        <span><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(categoryName(item.categoryId))}</small></span>
                        <span>${formatPrice(item.price)}</span>
                        <span class="badge ${item.availability === 'available' ? 'badge-green' : 'badge-red'}">${item.availability === 'available' ? 'Aktif' : 'Sold out'}</span>
                        <time>${index < 2 ? 'Hari ini' : `${index} hari lalu`}</time>
                        <button class="icon-button" type="button" data-action="edit-item" data-item-id="${escapeHTML(item.id)}" aria-label="Edit ${escapeHTML(item.name)}"><i data-lucide="pencil"></i></button>
                    </div>
                `).join('')}
            </div>
        </article>
    `;
}

function renderLivePreviewWorkspace(context = 'appearance') {
    const mode = state.preview.mode;
    const label = mode === 'tablet' ? 'Store Display' : 'Bio Menu';
    const zoomPercent = Math.round(state.preview.zoom * 100);
    return `
        <section class="live-preview-workspace is-${context}" data-live-preview data-mode="${mode}">
            <header class="live-preview-toolbar">
                <div>
                    <span class="eyebrow">Live draft</span>
                    <h2>${label}</h2>
                    <p>Perubahan editor langsung terlihat di sini.</p>
                </div>
                <div class="live-preview-actions">
                    <div class="dashboard-preview-tabs" aria-label="Pilih perangkat preview">
                        <button class="${mode === 'tablet' ? 'is-active' : ''}" type="button" data-action="switch-embedded-preview" data-mode="tablet"><i data-lucide="tablet"></i><span>Store Display</span></button>
                        <button class="${mode === 'mobile' ? 'is-active' : ''}" type="button" data-action="switch-embedded-preview" data-mode="mobile"><i data-lucide="smartphone"></i><span>Bio Menu</span></button>
                    </div>
                    <div class="preview-zoom-controls" aria-label="Ukuran preview">
                        <button class="icon-button" type="button" data-action="preview-zoom-out" aria-label="Perkecil preview"><i data-lucide="minus"></i></button>
                        <button class="zoom-value" type="button" data-action="preview-zoom-reset" aria-label="Kembalikan ukuran preview">${zoomPercent}%</button>
                        <button class="icon-button" type="button" data-action="preview-zoom-in" aria-label="Perbesar preview"><i data-lucide="plus"></i></button>
                        <button class="icon-button" type="button" data-action="preview-${mode}" aria-label="Buka ${label} ukuran penuh"><i data-lucide="maximize-2"></i></button>
                    </div>
                </div>
            </header>
            <div class="live-preview-viewport" data-preview-viewport>
                <div class="live-preview-device is-${mode}" data-preview-device>
                    ${renderPublicMenu(mode, mode === 'mobile')}
                </div>
            </div>
            <footer class="live-preview-footer">
                <span><i data-lucide="file-pen-line"></i>Draft versi ${state.publishedVersion + (state.draft ? 1 : 0)}</span>
                <span>Customer masih melihat versi ${state.publishedVersion}</span>
            </footer>
        </section>
    `;
}

function editorialFact(icon, title, description, tone) {
    return `<div><span class="story-fact-icon is-${tone}"><i data-lucide="${icon}"></i></span><strong>${escapeHTML(title)}</strong><small>${escapeHTML(description)}</small></div>`;
}

function attentionRow(icon, title, description, actionLabel, action, tone, route = false) {
    return `
        <div class="attention-row">
            <span class="attention-icon is-${tone}"><i data-lucide="${icon}"></i></span>
            <span><strong>${escapeHTML(title)}</strong><small>${escapeHTML(description)}</small></span>
            ${action
                ? `<button class="button button-secondary" type="button" ${route ? `data-route="${action}"` : `data-action="${action}"`}>${escapeHTML(actionLabel)}</button>`
                : `<span class="attention-state">${escapeHTML(actionLabel)}</span>`}
        </div>
    `;
}

function healthStat(icon, value, label, tone) {
    return `<div class="health-stat is-${tone}"><span><i data-lucide="${icon}"></i></span><strong>${escapeHTML(String(value))}</strong><small>${escapeHTML(label)}</small></div>`;
}

function renderEditorialAppearance() {
    return `
        ${pageHead(
            'Pengaturan',
            'Tampilan & branding',
            'Perubahan baru tampil publik setelah diterbitkan.',
            `<button class="button button-secondary" type="button" data-action="reset-demo"><i data-lucide="rotate-ccw"></i><span>Reset</span></button>
             <button class="button button-primary" type="button" data-action="save-appearance"><i data-lucide="save"></i><span>Simpan tampilan</span></button>`,
        )}
        <section class="appearance-workspace">
            <article class="appearance-controls">
                <section class="setting-section">
                    <h3>Preset</h3>
                    <div class="preset-grid editorial-presets">
                        ${presetButton('editorial', 'Editorial KV', 'Hangat dan operasional', '#236354', '#f3f5f1')}
                        ${presetButton('warm', 'Warm Minimal', 'Lembut dan familiar', '#a4492d', '#f7f3ed')}
                        ${presetButton('clean', 'Clean Premium', 'Terang dan presisi', '#1f5e52', '#f3f6f4')}
                    </div>
                </section>
                <section class="setting-section">
                    <h3>Warna brand</h3>
                    <div class="color-grid">
                        ${colorField('primary', 'Warna utama', state.appearance.primary)}
                        ${colorField('accent', 'Warna aksen', state.appearance.accent)}
                        ${colorField('paper', 'Latar belakang', state.appearance.paper)}
                    </div>
                    <div class="contrast-result is-safe"><i data-lucide="circle-check"></i><span>Kontras aman untuk teks utama.</span></div>
                </section>
                <section class="setting-section">
                    <h3>Tipografi</h3>
                    <label class="field"><span>Heading font</span><select><option>Plus Jakarta Sans Bold</option><option>Brand font</option></select></label>
                    <label class="field"><span>Body font</span><select><option>Plus Jakarta Sans Regular</option></select></label>
                </section>
                <section class="setting-section">
                    <h3>Font brand</h3>
                    <label class="upload-box compact-upload">
                        <i data-lucide="upload-cloud"></i>
                        <strong>${state.appearance.customFontName ? escapeHTML(state.appearance.customFontName) : 'Unggah WOFF/WOFF2'}</strong>
                        <span>Fallback: Plus Jakarta Sans</span>
                        <input type="file" accept=".woff,.woff2,font/woff,font/woff2" data-font-upload>
                    </label>
                    ${state.appearance.customFontName ? '<button class="text-action remove-font-action" type="button" data-action="remove-custom-font">Hapus font dan gunakan fallback</button>' : ''}
                </section>
                <section class="setting-section">
                    <h3>Tampilan item</h3>
                    <div class="dashboard-preview-tabs">
                        <button class="${state.appearance.itemLayout === 'list' ? 'is-active' : ''}" type="button" data-action="select-item-layout" data-layout="list">Daftar</button>
                        <button class="${state.appearance.itemLayout === 'photo' ? 'is-active' : ''}" type="button" data-action="select-item-layout" data-layout="photo">Foto besar</button>
                    </div>
                </section>
                <div class="appearance-note"><i data-lucide="info"></i><span>Perubahan tersimpan sebagai draft sampai Anda menerbitkannya.</span></div>
            </article>
            ${renderLivePreviewWorkspace('appearance')}
        </section>
    `;
}

function renderAppearanceFrame(mode) {
    const items = state.items.slice(0, mode === 'tablet' ? 8 : 4);
    return `
        <button class="appearance-frame is-${mode}" type="button" data-action="preview-${mode}">
            <span class="appearance-frame-brand"><b>BC</b><span><strong>Bachelor Coffee</strong><small>${escapeHTML(state.business.tagline || '')}</small></span></span>
            <span class="appearance-frame-search"><i data-lucide="search"></i>Cari menu</span>
            <span class="appearance-frame-categories"><b>Signature</b><small>Coffee</small><small>Non-Coffee</small><small>Food</small></span>
            <span class="appearance-frame-items">
                ${items.map((item) => `<span><img src="${safeImage(item.image)}" alt=""><b>${escapeHTML(item.name)}</b><small>${formatPrice(item.price)}</small></span>`).join('')}
            </span>
        </button>
    `;
}

function renderEditorialPublish() {
    if (publishRunState === 'publishing') {
        return `
            ${pageHead('Publikasi', 'Menerbitkan snapshot', 'Versi live lama tetap aktif selama proses berlangsung.')}
            <section class="publish-process-state" role="status" aria-live="polite">
                <div class="publish-progress-icon"><i data-lucide="loader-circle"></i></div>
                <span class="eyebrow">Langkah 2 dari 3</span>
                <h2>Memvalidasi dan menyimpan versi baru</h2>
                <p>Draft sedang dibentuk menjadi snapshot atomik. Jangan tutup halaman ini.</p>
                <div class="publish-progress-track"><span></span></div>
                <ol>
                    <li class="is-complete"><i data-lucide="check"></i>Validasi konten</li>
                    <li class="is-active"><i data-lucide="loader-circle"></i>Simpan snapshot</li>
                    <li><i data-lucide="circle"></i>Aktifkan versi</li>
                </ol>
            </section>
        `;
    }
    if (publishRunState === 'failed') {
        return `
            ${pageHead('Publikasi', 'Penerbitan belum berhasil', 'Versi live lama tidak berubah.')}
            <section class="publish-process-state is-error" role="alert">
                <img src="assets/illustrations/safe-error.webp" alt="" width="640" height="640">
                <span class="eyebrow">Safe failure</span>
                <h2>Draft tidak dapat diterbitkan</h2>
                <p>${escapeHTML(publishFailureMessage || 'Koneksi terputus saat menyimpan snapshot.')}</p>
                <div class="safe-live-version"><i data-lucide="shield-check"></i><span><strong>Versi ${state.publishedVersion} tetap aktif</strong><small>${escapeHTML(state.lastPublished)}</small></span></div>
                <div class="page-actions">
                    <button class="button button-secondary" type="button" data-action="cancel-publish-failure">Kembali ke checklist</button>
                    <button class="button button-primary" type="button" data-action="publish-now"><i data-lucide="refresh-cw"></i><span>Coba lagi</span></button>
                </div>
            </section>
        `;
    }
    if (!state.draft) return renderEditorialPublishSuccess();
    const available = state.items.filter((item) => item.availability === 'available').length;
    const soldOut = state.items.length - available;

    return `
        ${pageHead('Publikasi', 'Preview & Terbitkan', 'Periksa perubahan sebelum menerbitkan satu snapshot baru.')}
        <section class="editorial-publish-grid">
            <div class="publish-readiness">
                <div class="publish-meta-line"><span><i data-lucide="briefcase-business"></i>Bachelor Coffee</span><span>Draft versi <b>v${state.publishedVersion + 1}</b></span><span>Terakhir diterbitkan ${escapeHTML(state.lastPublished)}</span></div>
                <article class="panel">
                    <header class="panel-header publish-check-header">
                        <div><h2>Pemeriksaan sebelum terbit</h2><p>Pastikan menu siap dilihat customer.</p></div>
                        <div class="publish-kv-mini" aria-hidden="true"><span></span><i>✓</i><b>→</b><em></em></div>
                    </header>
                    <div class="publish-check-list">
                        ${publishCheck('circle-check', 'Informasi catalog lengkap', 'Nama, deskripsi, kategori, harga, dan media sudah lengkap.', 'success')}
                        ${publishCheck('circle-check', `${available} item siap ditampilkan`, 'Semua item aktif memiliki foto utama.', 'success')}
                        ${publishCheck('info', `${soldOut} item sold out`, 'Item sold out tetap memiliki label yang jelas.', 'info')}
                        ${publishCheck('triangle-alert', 'Font brand memakai fallback', 'Periksa tampilan pada perangkat yang tidak mendukung font.', 'warning', 'Tinjau font', 'appearance')}
                    </div>
                </article>
                <article class="panel">
                    <header class="panel-header"><div><h2>Perubahan dalam versi ini</h2><p>7 perubahan oleh Andreas</p></div></header>
                    <div class="change-list">
                        ${changeRow('pencil', '3 item', 'Es Kopi Susu Aren, Matcha Cream, Avocado Toast', 'Hari ini 10.32')}
                        ${changeRow('list-ordered', '1 kategori', 'Urutan kategori diperbarui', 'Hari ini 10.28')}
                        ${changeRow('palette', '1 tampilan', 'Warna brand dan layout item', 'Hari ini 10.15')}
                        ${changeRow('circle-check', '2 ketersediaan', 'Status item diperbarui', 'Hari ini 09.58')}
                    </div>
                </article>
            </div>
            <aside class="publish-action-rail">
                <article class="panel">
                    <div class="dashboard-preview-tabs"><button class="is-active" type="button" data-action="preview-tablet">Preview Tablet</button><button type="button" data-action="preview-mobile">Preview Mobile</button></div>
                    ${renderAppearanceFrame('tablet')}
                </article>
                <article class="panel release-scope">
                    <h3>Cakupan rilis</h3>
                    <div><span>Item</span><strong>${state.items.length}</strong></div>
                    <div><span>Kategori</span><strong>${visibleCategories().length}</strong></div>
                    <div><span>Media</span><strong>18</strong></div>
                    <div class="maintenance-control editorial-maintenance-control">
                        <span>
                            <strong>Mode maintenance</strong>
                            <small>Sembunyikan katalog publik sementara tanpa menghapus draft.</small>
                        </span>
                        <button class="toggle" type="button" role="switch" aria-checked="${state.maintenance}" data-action="toggle-maintenance" aria-label="Mode maintenance"></button>
                    </div>
                    <label class="field"><span>Catatan versi (opsional)</span><textarea rows="3" placeholder="Tuliskan ringkasan perubahan versi ini..."></textarea></label>
                    <button class="button button-primary publish-action-button" type="button" data-action="publish-now"><span>Terbitkan perubahan</span><i data-lucide="send"></i></button>
                    <button class="button button-secondary prototype-failure-action" type="button" data-action="simulate-publish-failure"><i data-lucide="flask-conical"></i><span>Uji safe failure</span></button>
                    <p class="publish-safety"><i data-lucide="lock-keyhole"></i><span>Versi publik saat ini tetap aktif sampai proses terbit berhasil.</span></p>
                </article>
            </aside>
        </section>
    `;
}

function publishCheck(icon, title, description, tone, actionLabel = '', route = '') {
    return `
        <div class="publish-check-row is-${tone}">
            <span><i data-lucide="${icon}"></i></span>
            <div><strong>${escapeHTML(title)}</strong><small>${escapeHTML(description)}</small></div>
            ${actionLabel ? `<button class="button button-secondary" type="button" data-route="${route}">${escapeHTML(actionLabel)}</button>` : ''}
        </div>
    `;
}

function changeRow(icon, title, description, time) {
    return `<div class="change-row"><span><i data-lucide="${icon}"></i></span><strong>${escapeHTML(title)}</strong><p>${escapeHTML(description)}</p><time>${escapeHTML(time)}</time><small>Andreas</small></div>`;
}

function renderEditorialPublishSuccess() {
    const mobileUrl = `${window.location.origin}${window.location.pathname}#preview-mobile`;
    return `
        ${pageHead('Publikasi', 'Berhasil diterbitkan', `Versi v${state.publishedVersion} sekarang aktif.`)}
        <section class="publish-success-grid">
            <div>
                <article class="success-hero-panel">
                    <div class="success-copy">
                        <span class="success-mark"><i data-lucide="check"></i></span>
                        <div><h2>Menu berhasil diterbitkan</h2><strong>Versi v${state.publishedVersion} sekarang aktif</strong><p>Diterbitkan ${escapeHTML(state.lastPublished)} oleh Andreas.</p></div>
                    </div>
                    <img class="success-art" src="assets/illustrations/publish-success.webp" alt="" width="640" height="640">
                    <p class="success-info"><i data-lucide="info"></i><span>Store Display dan Bio Menu sudah menggunakan versi terbaru.</span></p>
                    <div class="success-actions">
                        <button class="button button-primary" type="button" data-action="preview-tablet"><i data-lucide="external-link"></i><span>Lihat menu publik</span></button>
                        <button class="button button-secondary" type="button" data-action="copy-mobile-link"><i data-lucide="copy"></i><span>Salin link publik</span></button>
                        <button class="button button-secondary" type="button" data-action="preview-mobile"><i data-lucide="qr-code"></i><span>Lihat QR</span></button>
                    </div>
                </article>
                <article class="panel publication-history">
                    <header class="panel-header"><div><h2>Riwayat publikasi</h2><p>Versi sebelumnya tetap tersimpan</p></div></header>
                    <div class="history-row"><strong>v${state.publishedVersion}</strong><span class="badge badge-green">Aktif</span><p>${escapeHTML(state.lastPublished)}</p><small>Andreas</small></div>
                    <div class="history-row"><strong>v${Math.max(1, state.publishedVersion - 1)}</strong><span class="badge badge-blue">Tersimpan</span><p>20 Jul 2026, 11.32 WIB</p><small>Andreas</small></div>
                </article>
            </div>
            <aside class="success-share-rail">
                <article class="panel">
                    <header class="panel-header"><div><h2>Menu publik</h2><p>Dua surface sudah diperbarui</p></div></header>
                    <div class="success-preview-pair">${renderAppearanceFrame('tablet')}${renderAppearanceFrame('mobile')}</div>
                </article>
                <article class="panel">
                    <h3>Bagikan menu publik</h3>
                    ${shareRow('tablet', 'Store Display', mobileUrl.replace('#preview-mobile', '#preview-tablet'), 'copy-tablet-link')}
                    ${shareRow('smartphone', 'Bio Menu', mobileUrl, 'copy-mobile-link')}
                </article>
                <article class="safe-history-note"><i data-lucide="shield-check"></i><span><strong>Aman & tersimpan</strong><small>Versi sebelumnya tetap tersedia di riwayat publikasi.</small></span></article>
            </aside>
        </section>
    `;
}

function renderPublicMenu(mode, compact = false) {
    const layoutClass = `is-layout-${state.appearance.itemLayout}`;
    if (state.maintenance) {
        return `
            <div class="public-menu maintenance-page ${layoutClass}" style="${appearanceStyle()}">
                <div class="maintenance-card">
                    <span class="public-brand-mark">SC</span>
                    <img src="assets/illustrations/maintenance.webp" alt="" width="640" height="640">
                    <h2>Menu sedang maintenance</h2>
                    <p>Kami sedang menyiapkan kembali tampilan menu. Silakan coba beberapa saat lagi.</p>
                </div>
            </div>
        `;
    }

    const categories = visibleCategories().filter((category) =>
        state.items.some((item) => item.categoryId === category.id),
    );
    return mode === 'tablet'
        ? renderTabletMenu(categories)
        : renderMobileMenu(categories, compact);
}

function appearanceStyle() {
    return `--menu-primary:${escapeHTML(state.appearance.primary)};--menu-accent:${escapeHTML(state.appearance.accent)};--menu-paper:${escapeHTML(state.appearance.paper)};${state.appearance.customFontName ? `--custom-font:"SagaUploadedFont", "Plus Jakarta Sans", sans-serif;` : ''}`;
}

function renderMobileMenu(categories, compact) {
    return `
        <div class="public-menu is-layout-${escapeHTML(state.appearance.itemLayout)}" style="${appearanceStyle()}" data-public-menu>
            <header class="public-mobile-header">
                <div class="public-mobile-brand-row">
                    <span class="public-brand-mark">BC</span>
                    <span class="public-open">Buka sekarang</span>
                </div>
                <span class="public-surface-label">Bio Menu</span>
                <h1>${escapeHTML(state.business.name)}</h1>
                <p>${escapeHTML(state.business.tagline)}</p>
                <div class="public-business-note">
                    <span><i data-lucide="clock-3"></i>${escapeHTML(state.business.hours)}</span>
                    <span><i data-lucide="map-pin"></i>Madiun</span>
                </div>
            </header>
            <div class="mobile-public-body">
                <label class="public-search">
                    <i data-lucide="search"></i>
                    <span class="sr-only">Cari menu</span>
                    <input type="search" placeholder="Cari menu, rasa, atau bahan" data-public-search>
                </label>
                <div class="public-category-rail">
                    <button class="is-active" type="button" data-public-category="">Semua</button>
                    ${categories.map((category) => `<button type="button" data-public-category="${escapeHTML(category.id)}">${escapeHTML(category.name)}</button>`).join('')}
                </div>
                ${compact ? '' : renderPromoBanner()}
                <div data-public-sections>
                    ${categories.map((category) => renderPublicSection(category, 'mobile')).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderTabletMenu(categories) {
    return `
        <div class="public-menu is-layout-${escapeHTML(state.appearance.itemLayout)}" style="${appearanceStyle()}" data-public-menu>
            <header class="tablet-public-header">
                <div class="tablet-brand">
                    <span class="public-brand-mark">BC</span>
                    <div><span class="public-surface-label">Store Display</span><h1>${escapeHTML(state.business.name)}</h1><p>${escapeHTML(state.business.tagline)}</p></div>
                </div>
                <div class="tablet-meta">
                    <div><span>JAM BUKA</span><strong>${escapeHTML(state.business.hours)}</strong></div>
                    <span class="badge badge-green">Buka sekarang</span>
                </div>
            </header>
            <div class="tablet-category-wrap">
                <div class="public-category-rail">
                    <button class="is-active" type="button" data-public-category="">Semua</button>
                    ${categories.map((category) => `<button type="button" data-public-category="${escapeHTML(category.id)}">${escapeHTML(category.name)}</button>`).join('')}
                </div>
            </div>
            <div class="tablet-public-body" data-public-sections>
                ${categories.map((category) => renderPublicSection(category, 'tablet')).join('')}
            </div>
        </div>
    `;
}

function renderPromoBanner() {
    const promo = state.items.find((item) => item.badge === 'Promo') || state.items[0];
    return `
        <button class="promo-banner" type="button" data-public-item="${escapeHTML(promo.id)}">
            <span class="promo-copy"><span>Pilihan minggu ini</span><strong>${escapeHTML(promo.name)}</strong><p>${escapeHTML(promo.description)}</p></span>
            <img src="${safeImage(promo.image)}" alt="">
        </button>
    `;
}

function renderPublicSection(category, mode) {
    const items = state.items.filter((item) => item.categoryId === category.id);
    return `
        <section class="public-section" data-public-section="${escapeHTML(category.id)}">
            <header class="public-section-header"><h2>${escapeHTML(category.name)}</h2><span>${escapeHTML(category.description)}</span></header>
            <div class="${mode === 'tablet' ? 'tablet-menu-grid' : 'mobile-menu-list'}">
                ${items.map((item) => renderPublicCard(item, mode)).join('')}
            </div>
        </section>
    `;
}

function renderPublicCard(item, mode) {
    const cardClass = mode === 'tablet' ? 'tablet-menu-card' : 'mobile-menu-card';
    return `
        <article class="${cardClass} ${item.availability === 'sold_out' ? 'sold-out' : ''}" data-public-card data-name="${escapeHTML(`${item.name} ${item.description}`.toLocaleLowerCase('id'))}">
            <button type="button" data-public-item="${escapeHTML(item.id)}" aria-label="Lihat detail ${escapeHTML(item.name)}">
                <img src="${safeImage(item.image)}" alt="">
                <span class="public-card-copy">
                    <span class="public-card-top"><h3>${escapeHTML(item.name)}</h3><strong>${formatPrice(item.price)}</strong></span>
                    <p>${escapeHTML(item.description)}</p>
                    ${item.availability === 'sold_out'
                        ? '<span class="public-badge sold-label">Sold out</span>'
                        : item.badge
                            ? `<span class="public-badge">${escapeHTML(item.badge)}</span>`
                            : ''}
                </span>
            </button>
        </article>
    `;
}

function showPreview(mode) {
    previewMode = mode;
    state.preview.mode = mode;
    persistUiState();
    previewShell.hidden = false;
    document.querySelector('[data-dashboard]').hidden = true;
    document.body.classList.add('modal-open');
    window.location.hash = `preview-${mode}`;
    previewStage.innerHTML = `<div class="device-${mode}">${renderPublicMenu(mode)}</div>`;
    previewShell.querySelectorAll('[data-action^="preview-"]').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.action === `preview-${mode}`);
    });
    bindPublicEvents();
    refreshIcons();
}

function closePreview() {
    previewShell.hidden = true;
    document.querySelector('[data-dashboard]').hidden = false;
    document.body.classList.remove('modal-open');
    window.location.hash = currentRoute;
    render();
}

function openItemEditor(itemId = '') {
    const item = state.items.find((entry) => entry.id === itemId);
    const recoveredDraft = loadEditorDraft(item?.id || '');
    itemForm.reset();
    const source = recoveredDraft || item || {};
    itemForm.elements.itemId.value = item?.id || '';
    itemForm.elements.name.value = source.name || '';
    itemForm.elements.price.value = source.price || 28000;
    itemForm.elements.description.value = source.description || '';
    itemForm.elements.image.value = source.image || '';
    itemForm.elements.badge.value = source.badge || '';
    itemForm.elements.availability.value = source.availability || 'available';
    itemForm.elements.containsMilk.checked = Boolean(source.containsMilk);
    itemForm.querySelector('[data-editor-title]').textContent = item ? 'Edit menu' : 'Tambah menu';
    itemForm.querySelector('[data-editor-submit-copy]').textContent = item ? 'Simpan perubahan' : 'Buat menu sebagai draft';
    itemForm.querySelector('[data-editor-review-title]').textContent = item ? 'Review perubahan sebelum disimpan.' : 'Review sebelum membuat menu.';
    itemForm.querySelector('[data-editor-review-copy]').textContent = item
        ? 'Pastikan perubahan yang dipilih sudah sesuai sebelum memperbarui draft menu.'
        : 'Periksa seluruh informasi sebelum menambahkan menu ke draft katalog.';
    const categorySelect = itemForm.querySelector('[data-category-select]');
    categorySelect.innerHTML = state.categories.map((category) => `<option value="${escapeHTML(category.id)}">${escapeHTML(category.name)}</option>`).join('');
    categorySelect.value = source.categoryId || state.categories[0]?.id || '';
    const selectedGroups = source.addonGroupIds || [
        ...(source.milkOptions ? ['milk'] : []),
        ...(source.extraOptions ? ['extras'] : []),
    ];
    renderEditorAddonOptions(selectedGroups);
    renderEditorMediaLibrary();
    itemEditorDirty = false;
    itemEditorPreviewMode = 'mobile';
    itemEditorValidationAttempted = false;
    clearEditorValidation();
    setItemEditorStep(1, false);
    refreshItemEditorPreview();
    updateEditorSaveState(
        recoveredDraft
            ? (item ? 'Perubahan edit dipulihkan dari browser' : 'Draft dipulihkan dari browser')
            : 'Draft aman, belum tampil ke customer',
        recoveredDraft ? 'history' : 'cloud',
    );
    itemEditor.showModal();
    document.body.classList.add('modal-open');
    window.setTimeout(() => itemForm.elements.name.focus(), 30);
}

function renderEditorAddonOptions(selectedGroups = []) {
    const checkedGroups = selectedGroups.length
        ? selectedGroups
        : [...itemForm.querySelectorAll('input[name="addonGroupIds"]:checked')].map((input) => input.value);
    itemForm.querySelector('[data-addon-attachment-options]').innerHTML = state.addonGroups.map((group) => `
        <label>
            <input type="checkbox" name="addonGroupIds" value="${escapeHTML(group.id)}" ${checkedGroups.includes(group.id) ? 'checked' : ''}>
            <span><strong>${escapeHTML(group.name)}</strong><small>${escapeHTML(group.description)}</small></span>
        </label>
    `).join('');
}

function renderEditorMediaLibrary() {
    const images = [...new Set(state.items.map((item) => safeImage(item.image)).filter(Boolean))].slice(0, 8);
    const selected = itemForm.elements.image.value;
    itemForm.querySelector('[data-editor-media-library]').innerHTML = images.map((image, index) => `
        <button type="button" data-action="choose-editor-media" data-image="${escapeHTML(image)}" class="${selected === image ? 'is-selected' : ''}" aria-label="Pilih foto media ${index + 1}">
            <img src="${escapeHTML(image)}" alt="">
            <span><i data-lucide="check"></i></span>
        </button>
    `).join('');
}

function setItemEditorStep(step, shouldValidate = true) {
    const nextStep = Math.min(4, Math.max(1, Number(step)));
    if (shouldValidate && nextStep > itemEditorStep && itemEditorStep === 1) {
        itemEditorValidationAttempted = true;
        if (!validateEditorBasics()) return false;
    }

    itemEditorStep = nextStep;
    itemForm.querySelectorAll('[data-wizard-panel]').forEach((panel) => {
        panel.hidden = Number(panel.dataset.wizardPanel) !== itemEditorStep;
    });
    itemForm.querySelectorAll('[data-action="item-step"]').forEach((button) => {
        const buttonStep = Number(button.dataset.step);
        button.classList.toggle('is-active', buttonStep === itemEditorStep);
        button.classList.toggle('is-complete', buttonStep < itemEditorStep);
        if (buttonStep === itemEditorStep) button.setAttribute('aria-current', 'step');
        else button.removeAttribute('aria-current');
    });

    const labels = ['Foto & media', 'Pilihan & detail', 'Review'];
    const back = itemForm.querySelector('[data-editor-back]');
    const next = itemForm.querySelector('[data-editor-next]');
    const submit = itemForm.querySelector('[data-editor-submit]');
    back.hidden = itemEditorStep === 1;
    next.hidden = itemEditorStep === 4;
    submit.hidden = itemEditorStep !== 4;
    if (itemEditorStep < 4) next.querySelector('span').textContent = `Lanjut: ${labels[itemEditorStep - 1]}`;
    if (itemEditorStep === 4) refreshEditorReview();
    itemForm.querySelector(`[data-wizard-panel="${itemEditorStep}"] header`)?.scrollIntoView({ block: 'nearest' });
    refreshIcons();
    return true;
}

function refreshItemEditorPreview() {
    const name = itemForm.elements.name.value.trim() || 'Item baru';
    const price = Math.max(0, Number(itemForm.elements.price.value || 0));
    const description = itemForm.elements.description.value.trim() || 'Deskripsi item akan tampil di sini.';
    const image = normalizeImage(itemForm.elements.image.value);
    const availability = itemForm.elements.availability.value;
    itemForm.querySelector('[data-editor-preview-name]').textContent = name;
    itemForm.querySelector('[data-editor-preview-price]').textContent = formatPrice(price);
    itemForm.querySelector('[data-editor-preview-description]').textContent = description;
    itemForm.querySelector('[data-editor-preview-status]').textContent = availability === 'sold_out' ? 'Sold out' : 'Tersedia';
    itemForm.querySelector('[data-description-count]').textContent = String(itemForm.elements.description.value.length);
    const previewImage = itemForm.querySelector('[data-editor-preview-image]');
    previewImage.src = image;
    previewImage.alt = name;
    itemForm.querySelector('[data-editor-preview-card]').classList.toggle('is-store', itemEditorPreviewMode === 'tablet');
    itemForm.querySelector('[data-editor-preview-mode]').textContent = itemEditorPreviewMode === 'tablet' ? 'Store Display' : 'Bio Menu';
}

function refreshEditorReview() {
    const description = itemForm.elements.description.value.trim();
    const selectedGroupNames = [...itemForm.querySelectorAll('input[name="addonGroupIds"]:checked')]
        .map((input) => state.addonGroups.find((group) => group.id === input.value)?.name)
        .filter(Boolean);
    const choiceLabels = [
        ...selectedGroupNames,
        ...(itemForm.elements.containsMilk.checked ? ['Mengandung susu'] : []),
    ];
    const priceValue = itemForm.elements.price.value;
    const values = {
        name: [itemForm.elements.name.value.trim(), itemForm.elements.name.value.trim() || 'Belum diisi'],
        category: [itemForm.elements.categoryId.value, itemForm.elements.categoryId.selectedOptions[0]?.textContent || 'Belum dipilih'],
        price: [priceValue !== '' && Number(priceValue) >= 0, priceValue === '' ? 'Belum diisi' : formatPrice(Number(priceValue))],
        image: [itemForm.elements.image.value, itemForm.elements.image.value ? 'Foto siap digunakan' : 'Opsional untuk layout daftar'],
        description: [description, description || 'Belum ada deskripsi'],
        availability: [true, itemForm.elements.availability.selectedOptions[0]?.textContent || 'Tersedia'],
        badge: [true, itemForm.elements.badge.value || 'Tanpa badge'],
        choices: [true, choiceLabels.length ? choiceLabels.join(' · ') : 'Tanpa add-on atau informasi tambahan'],
    };
    Object.entries(values).forEach(([key, [complete, label]]) => {
        const row = itemForm.querySelector(`[data-review-check="${key}"]`);
        row.classList.toggle('is-complete', Boolean(complete));
        row.querySelector('small').textContent = label;
        row.querySelector('svg, i').outerHTML = `<i data-lucide="${complete ? 'circle-check' : 'circle-alert'}"></i>`;
    });
    refreshIcons();
}

function updateEditorSaveState(message, icon = 'cloud') {
    const stateElement = itemForm.querySelector('[data-editor-save-state]');
    stateElement.querySelector('span').textContent = message;
    stateElement.querySelector('svg, i').outerHTML = `<i data-lucide="${escapeHTML(icon)}"></i>`;
    refreshIcons();
}

function queueEditorDraftSave() {
    itemEditorDirty = true;
    updateEditorSaveState('Menyimpan perubahan draft...', 'cloud-upload');
    window.clearTimeout(itemEditorSaveTimer);
    itemEditorSaveTimer = window.setTimeout(persistEditorDraft, 450);
}

function editorDraftKey(itemId = '') {
    return itemId ? `${EDITOR_EDIT_DRAFT_PREFIX}${itemId}` : EDITOR_DRAFT_KEY;
}

function setEditorFieldError(field, message = '') {
    const error = itemForm.querySelector(`[data-field-error="${field.name}"]`);
    if (error) {
        error.textContent = message;
        error.hidden = !message;
    }
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
}

function clearEditorValidation() {
    itemForm.querySelectorAll('[data-field-error]').forEach((error) => {
        error.textContent = '';
        error.hidden = true;
    });
    itemForm.querySelectorAll('[aria-invalid="true"]').forEach((field) => field.removeAttribute('aria-invalid'));
    const summary = itemForm.querySelector('[data-editor-error-summary]');
    summary.hidden = true;
}

function validateEditorBasics({ focus = true } = {}) {
    const fields = [
        [itemForm.elements.name, itemForm.elements.name.value.trim() ? '' : 'Masukkan nama menu.'],
        [itemForm.elements.categoryId, itemForm.elements.categoryId.value ? '' : 'Pilih kategori menu.'],
        [
            itemForm.elements.price,
            itemForm.elements.price.value === ''
                ? 'Masukkan harga menu.'
                : (Number(itemForm.elements.price.value) < 0 ? 'Harga tidak boleh kurang dari Rp0.' : ''),
        ],
    ];
    fields.forEach(([field, message]) => setEditorFieldError(field, message));
    const invalid = fields.filter(([, message]) => message);
    const summary = itemForm.querySelector('[data-editor-error-summary]');
    summary.hidden = invalid.length === 0;
    if (invalid.length) {
        summary.querySelector('[data-editor-error-summary-copy]').textContent =
            `${invalid.length} informasi perlu diperbaiki sebelum melanjutkan.`;
        if (focus) invalid[0][0].focus();
        refreshIcons();
        return false;
    }
    return true;
}

function captureEditorDraft() {
    const data = new FormData(itemForm);
    return {
        itemId: String(data.get('itemId') || ''),
        name: String(data.get('name') || ''),
        categoryId: String(data.get('categoryId') || ''),
        price: Math.max(0, Number(data.get('price') || 0)),
        description: String(data.get('description') || ''),
        image: String(data.get('image') || ''),
        badge: String(data.get('badge') || ''),
        availability: String(data.get('availability') || 'available'),
        addonGroupIds: data.getAll('addonGroupIds').map(String),
        containsMilk: data.get('containsMilk') === 'on',
    };
}

function persistEditorDraft() {
    const itemId = itemForm.elements.itemId.value;
    try {
        localStorage.setItem(editorDraftKey(itemId), JSON.stringify(captureEditorDraft()));
        updateEditorSaveState(itemId ? 'Perubahan edit tersimpan di browser' : 'Draft tersimpan di browser', 'cloud-check');
        itemEditorDirty = false;
        return true;
    } catch {
        updateEditorSaveState('Draft belum dapat disimpan. Selesaikan atau kecilkan foto.', 'cloud-alert');
        return false;
    }
}

function loadEditorDraft(itemId = '') {
    try {
        return JSON.parse(localStorage.getItem(editorDraftKey(itemId)) || 'null');
    } catch {
        return null;
    }
}

function removeEditorDraft(itemId = '') {
    localStorage.removeItem(editorDraftKey(itemId));
}

function clearAllEditorDrafts() {
    Object.keys(localStorage)
        .filter((key) => key === EDITOR_DRAFT_KEY || key.startsWith(EDITOR_EDIT_DRAFT_PREFIX))
        .forEach((key) => localStorage.removeItem(key));
}

async function imageFileToDataUrl(file) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
        throw new Error('Gunakan JPG, PNG, atau WebP maksimal 5 MB.');
    }
    const source = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
    const image = await new Promise((resolve, reject) => {
        const element = new Image();
        element.onload = () => resolve(element);
        element.onerror = reject;
        element.src = source;
    });
    const maxDimension = 1400;
    const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/webp', 0.82);
}

function closeItemEditor({ saveDraft = false } = {}) {
    window.clearTimeout(itemEditorSaveTimer);
    if (saveDraft && itemEditorDirty && !persistEditorDraft()) return false;
    itemEditorDirty = false;
    itemEditor.close();
    document.body.classList.remove('modal-open');
    return true;
}

function saveItemEditorForLater() {
    if (itemEditorDirty && !persistEditorDraft()) return;
    closeItemEditor();
    toast(
        itemForm.elements.itemId.value ? 'Perubahan edit disimpan' : 'Draft menu disimpan',
        'Lanjutkan kembali dari menu ini kapan saja.',
    );
}

function dismissItemEditor() {
    if (!itemEditorDirty) {
        closeItemEditor();
        return;
    }
    if (window.confirm('Tutup editor dan simpan perubahan untuk dilanjutkan nanti?')) {
        closeItemEditor({ saveDraft: true });
    }
}

function openSimpleDialog({ eyebrow, title, fields, submit, submitLabel = 'Simpan' }) {
    simpleDialog.querySelector('[data-simple-eyebrow]').textContent = eyebrow;
    simpleDialog.querySelector('[data-simple-title]').textContent = title;
    simpleDialog.querySelector('[data-simple-fields]').innerHTML = fields;
    simpleDialog.querySelector('[data-simple-submit-label]').textContent = submitLabel;
    simpleDialogHandler = submit;
    simpleDialog.showModal();
    document.body.classList.add('modal-open');
    window.setTimeout(() => simpleForm.querySelector('input, textarea')?.focus(), 30);
}

function openBusinessSwitcher() {
    openSimpleDialog({
        eyebrow: 'Workspace',
        title: 'Pilih bisnis',
        submitLabel: 'Selesai',
        fields: `
            <button class="business-option is-active" type="submit">
                <span class="business-logo">BC</span>
                <span><strong>${escapeHTML(state.business.name)}</strong><small>Menu utama · ${escapeHTML(state.business.location)}</small></span>
                <i data-lucide="check"></i>
            </button>
            <p class="dialog-helper">Prototype review menggunakan satu bisnis. Multi-business akan mengikuti entitlement SaaS.</p>
        `,
        submit: () => toast('Workspace aktif', `${state.business.name} tetap dipilih.`),
    });
    refreshIcons();
}

function openProfileDialog() {
    openSimpleDialog({
        eyebrow: 'Akun owner',
        title: 'Profil Andreas',
        submitLabel: 'Tutup',
        fields: `
            <div class="profile-summary">
                <span class="avatar">AS</span>
                <span><strong>Andreas</strong><small>Owner · akses penuh</small></span>
            </div>
            <dl class="profile-metadata">
                <div><dt>Bisnis aktif</dt><dd>${escapeHTML(state.business.name)}</dd></div>
                <div><dt>Status</dt><dd>Trial aktif · 9 hari tersisa</dd></div>
                <div><dt>Session</dt><dd>Prototype lokal browser</dd></div>
            </dl>
        `,
        submit: () => {},
    });
}

function closeSimpleDialog() {
    simpleDialog.close();
    document.body.classList.remove('modal-open');
    simpleDialogHandler = null;
}

function categoryDialog(categoryId = '', onSaved = null) {
    const category = state.categories.find((entry) => entry.id === categoryId);
    openSimpleDialog({
        eyebrow: 'Kategori',
        title: category ? 'Edit kategori' : 'Tambah kategori',
        fields: `
            <input type="hidden" name="entityId" value="${escapeHTML(category?.id || '')}">
            <label class="field"><span>Nama kategori</span><input name="name" required maxlength="50" value="${escapeHTML(category?.name || '')}" placeholder="Contoh: Seasonal"></label>
            <label class="field" style="margin-top:14px"><span>Deskripsi</span><textarea name="description" rows="3" maxlength="120" placeholder="Deskripsi singkat kategori">${escapeHTML(category?.description || '')}</textarea></label>
        `,
        submit: (formData) => {
            const id = formData.get('entityId');
            let savedCategory;
            if (id) {
                const existing = state.categories.find((entry) => entry.id === id);
                existing.name = String(formData.get('name'));
                existing.description = String(formData.get('description'));
                savedCategory = existing;
            } else {
                savedCategory = {
                    id: `${slugify(formData.get('name'))}-${Date.now().toString(36).slice(-4)}`,
                    name: String(formData.get('name')),
                    description: String(formData.get('description')),
                    visible: true,
                };
                state.categories.push(savedCategory);
            }
            persistState();
            render();
            onSaved?.(savedCategory);
            toast('Kategori disimpan', 'Perubahan masuk ke draft.');
        },
    });
}

function addonDialog(addonId = '', onSaved = null) {
    const group = state.addonGroups.find((entry) => entry.id === addonId);
    const lines = group?.values.map((value) => `${value.name}|${value.price}`).join('\n') || '';
    openSimpleDialog({
        eyebrow: 'Add-on',
        title: group ? 'Edit grup add-on' : 'Tambah grup add-on',
        fields: `
            <input type="hidden" name="entityId" value="${escapeHTML(group?.id || '')}">
            <label class="field"><span>Nama grup</span><input name="name" required maxlength="60" value="${escapeHTML(group?.name || '')}" placeholder="Contoh: Level pedas"></label>
            <label class="field" style="margin-top:14px"><span>Deskripsi</span><input name="description" maxlength="120" value="${escapeHTML(group?.description || '')}" placeholder="Keterangan singkat"></label>
            <div class="form-grid" style="margin-top:14px">
                <label class="field"><span>Jenis pilihan</span><select name="type"><option value="single" ${group?.type === 'single' ? 'selected' : ''}>Pilih satu</option><option value="multiple" ${group?.type !== 'single' ? 'selected' : ''}>Pilih beberapa</option></select></label>
                <label class="field"><span>Maksimum pilihan</span><input name="max" type="number" min="1" max="20" value="${escapeHTML(group?.max || group?.values.length || 1)}"></label>
            </div>
            <label class="field" style="margin-top:14px"><span>Pilihan, satu per baris</span><textarea name="values" required rows="6" placeholder="Regular|0&#10;Large|8000">${escapeHTML(lines)}</textarea><small>Format: Nama|Harga</small></label>
        `,
        submit: (formData) => {
            const values = String(formData.get('values'))
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => {
                    const [name, price] = line.split('|');
                    return { name: name.trim(), price: Math.max(0, Number(price || 0)) };
                });
            const id = formData.get('entityId');
            let savedGroup;
            if (id) {
                const existing = state.addonGroups.find((entry) => entry.id === id);
                existing.name = String(formData.get('name'));
                existing.description = String(formData.get('description'));
                existing.type = String(formData.get('type')) === 'single' ? 'single' : 'multiple';
                existing.min = 0;
                existing.max = Math.min(values.length, Math.max(1, Number(formData.get('max') || 1)));
                existing.values = values;
                savedGroup = existing;
            } else {
                savedGroup = {
                    id: `${slugify(formData.get('name'))}-${Date.now().toString(36).slice(-4)}`,
                    name: String(formData.get('name')),
                    description: String(formData.get('description')),
                    type: String(formData.get('type')) === 'single' ? 'single' : 'multiple',
                    min: 0,
                    max: Math.min(values.length, Math.max(1, Number(formData.get('max') || 1))),
                    values,
                };
                state.addonGroups.push(savedGroup);
            }
            persistState();
            render();
            onSaved?.(savedGroup);
            toast('Grup add-on disimpan', 'Detail menu akan memakai informasi terbaru.');
        },
    });
}

function openDetail(itemId) {
    const item = state.items.find((entry) => entry.id === itemId);
    if (!item) return;
    const groupIds = item.addonGroupIds || [
        ...(item.milkOptions ? ['milk'] : []),
        ...(item.extraOptions ? ['extras'] : []),
    ];
    const groups = groupIds.map((id) => state.addonGroups.find((group) => group.id === id)).filter(Boolean);
    detailDialog.querySelector('[data-detail-content]').innerHTML = `
        <div class="detail-layout">
            <img class="detail-image" src="${safeImage(item.image)}" alt="${escapeHTML(item.name)}">
            <div class="detail-copy">
                <button class="icon-button detail-close" type="button" data-action="close-detail" aria-label="Tutup detail"><i data-lucide="x"></i></button>
                ${item.badge ? `<span class="badge badge-orange">${escapeHTML(item.badge)}</span>` : ''}
                <h2>${escapeHTML(item.name)}</h2>
                <span class="detail-price">${formatPrice(item.price)}</span>
                <p class="detail-description">${escapeHTML(item.description)} Dibuat untuk menampilkan detail rasa dan informasi penting sebelum customer datang ke outlet.</p>
                <section class="detail-section"><h3>Penyajian</h3><div class="detail-option"><span>Hot</span><span>${formatPrice(item.price)}</span></div><div class="detail-option"><span>Iced</span><span>${formatPrice(item.price)}</span></div></section>
                ${groups.filter(Boolean).map((group) => `
                    <section class="detail-section">
                        <h3>${escapeHTML(group.name)}</h3>
                        ${group.values.map((value) => `<div class="detail-option"><span>${escapeHTML(value.name)}</span><span>${value.price ? `+${formatPrice(value.price)}` : 'Termasuk'}</span></div>`).join('')}
                    </section>
                `).join('')}
                <section class="detail-section"><p class="detail-note"><i data-lucide="info"></i><span>${item.containsMilk ? 'Mengandung susu. ' : ''}Add-on ditampilkan sebagai informasi dan tidak menambahkan item ke keranjang.</span></p></section>
            </div>
        </div>
    `;
    detailDialog.showModal();
    document.body.classList.add('modal-open');
    refreshIcons();
}

function closeDetail() {
    detailDialog.close();
    document.body.classList.remove('modal-open');
}

function bindViewEvents() {
    document.querySelectorAll('[data-route]').forEach((button) => {
        button.addEventListener('click', () => routeTo(button.dataset.route));
    });

    const menuSearch = document.querySelector('[data-menu-search]');
    const categoryFilter = document.querySelector('[data-menu-category-filter]');
    const statusFilter = document.querySelector('[data-menu-status-filter]');
    [menuSearch, categoryFilter, statusFilter].forEach((control) => {
        control?.addEventListener('input', filterMenuTable);
    });

    document.querySelectorAll('[data-color-key]').forEach((input) => {
        input.addEventListener('input', () => {
            state.appearance[input.dataset.colorKey] = input.value;
            input.nextElementSibling.textContent = input.value.toUpperCase();
            persistState();
            const preview = document.querySelector('.mini-preview .public-menu');
            if (preview) {
                preview.setAttribute('style', appearanceStyle());
            }
        });
    });

    document.querySelector('[data-font-upload]')?.addEventListener('change', handleFontUpload);
    document.querySelector('[data-analytics-period]')?.addEventListener('change', (event) => {
        state.analyticsPeriod = ['7', '30', '90'].includes(event.target.value) ? event.target.value : '30';
        persistUiState();
        render();
    });
    document.querySelectorAll('[data-live-preview]').forEach((workspace) => {
        bindPublicEvents(workspace);
    });
    window.requestAnimationFrame(refreshEmbeddedPreviewScales);
}

function filterMenuTable() {
    const term = (document.querySelector('[data-menu-search]')?.value || '').trim().toLocaleLowerCase('id');
    const category = document.querySelector('[data-menu-category-filter]')?.value || '';
    const status = document.querySelector('[data-menu-status-filter]')?.value || '';
    let visible = 0;
    document.querySelectorAll('[data-item-row]').forEach((row) => {
        const matches = (!term || row.dataset.name.includes(term))
            && (!category || row.dataset.category === category)
            && (!status || row.dataset.status === status);
        row.hidden = !matches;
        if (matches) visible += 1;
    });
    document.querySelector('[data-menu-empty]').hidden = visible > 0;
}

function bindPublicEvents(root = previewStage) {
    root.querySelectorAll('[data-public-category]').forEach((button) => {
        button.addEventListener('click', () => {
            root.querySelectorAll('[data-public-category]').forEach((entry) => entry.classList.remove('is-active'));
            button.classList.add('is-active');
            const category = button.dataset.publicCategory;
            root.querySelectorAll('[data-public-section]').forEach((section) => {
                section.hidden = Boolean(category) && section.dataset.publicSection !== category;
            });
        });
    });
    root.querySelector('[data-public-search]')?.addEventListener('input', (event) => {
        const term = event.target.value.trim().toLocaleLowerCase('id');
        root.querySelectorAll('[data-public-card]').forEach((card) => {
            card.hidden = Boolean(term) && !card.dataset.name.includes(term);
        });
        root.querySelectorAll('[data-public-section]').forEach((section) => {
            section.hidden = !section.querySelector('[data-public-card]:not([hidden])');
        });
    });
    root.querySelectorAll('[data-public-item]').forEach((button) => {
        button.addEventListener('click', () => openDetail(button.dataset.publicItem));
    });
}

function refreshEmbeddedPreviewScales() {
    document.querySelectorAll('[data-live-preview]').forEach((workspace) => {
        const viewport = workspace.querySelector('[data-preview-viewport]');
        const device = workspace.querySelector('[data-preview-device]');
        if (!viewport || !device) return;
        const mobile = workspace.dataset.mode === 'mobile';
        const logicalWidth = mobile ? 390 : 1024;
        const logicalHeight = mobile ? 844 : 768;
        const availableWidth = Math.max(1, viewport.clientWidth - 32);
        const availableHeight = Math.max(1, viewport.clientHeight - 32);
        const fitScale = Math.min(availableWidth / logicalWidth, availableHeight / logicalHeight);
        const scale = Math.max(.2, fitScale * state.preview.zoom);
        device.style.width = `${logicalWidth}px`;
        device.style.height = `${logicalHeight}px`;
        device.style.transform = `translateX(-50%) scale(${scale})`;
    });
}

function handleFontUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const extension = file.name.split('.').pop()?.toLocaleLowerCase('en') || '';
    if (!['woff', 'woff2'].includes(extension)) {
        toast('Format font tidak didukung', 'Gunakan file WOFF atau WOFF2.');
        event.target.value = '';
        return;
    }
    if (file.size > 2 * 1024 * 1024) {
        toast('Font terlalu besar', 'Gunakan file maksimum 2 MB.');
        event.target.value = '';
        return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => {
        const font = new FontFace('SagaUploadedFont', `url(${reader.result})`);
        font.load().then((loaded) => {
            document.fonts.add(loaded);
            state.appearance.customFontName = file.name;
            persistState();
            render();
            toast('Font diterapkan', `${file.name} aktif untuk sesi prototype.`);
        }).catch(() => toast('Font tidak dapat dibaca', 'Coba file .woff2 lain.'));
    });
    reader.readAsDataURL(file);
}

async function copyLink(mode) {
    const url = `${window.location.origin}${window.location.pathname}#preview-${mode}`;
    try {
        await navigator.clipboard.writeText(url);
        toast('Link disalin', mode === 'mobile' ? 'Bio Menu siap dibagikan.' : 'Store Display siap dibuka di tablet.');
    } catch {
        window.prompt('Salin link ini:', url);
    }
}

function publishNow({ forceFailure = false } = {}) {
    if (!state.draft || publishRunState === 'publishing') return;
    publishRunState = 'publishing';
    render();
    window.setTimeout(() => {
        if (forceFailure) {
            publishRunState = 'failed';
            publishFailureMessage = 'Simulasi prototype: penyimpanan snapshot dihentikan sebelum versi live berubah.';
            render();
            return;
        }
        state.publishedSnapshot = buildSnapshot(state);
        state.draft = false;
        state.publishedVersion += 1;
        state.lastPublished = new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Jakarta',
        }).format(new Date()).replace('.', ':') + ' WIB';
        publishRunState = 'idle';
        publishFailureMessage = '';
        persistState({ markDraft: false });
        render();
        toast('Menu berhasil diterbitkan', `Versi ${state.publishedVersion} sekarang aktif.`);
    }, 900);
}

function closeSidebar() {
    document.querySelector('.sidebar')?.classList.remove('is-open');
    document.querySelector('[data-sidebar-backdrop]').hidden = true;
}

function setPreviewLauncher(open) {
    const trigger = previewLauncher?.querySelector('[data-action="toggle-preview-launcher"]');
    const menu = previewLauncher?.querySelector('[role="menu"]');
    if (!trigger || !menu) return;
    trigger.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    previewLauncher.classList.toggle('is-open', open);
    if (open) menu.querySelector('[role="menuitem"]')?.focus();
}

function closePreviewLauncher() {
    setPreviewLauncher(false);
}

function closeRowActionMenus(except = null) {
    document.querySelectorAll('.row-action-menu[open]').forEach((menu) => {
        if (menu !== except) menu.removeAttribute('open');
    });
}

document.addEventListener('click', (event) => {
    const launcherTarget = event.target.closest('[data-preview-launcher]');
    if (!launcherTarget) closePreviewLauncher();

    const rowActionMenu = event.target.closest('.row-action-menu');
    closeRowActionMenus(rowActionMenu);

    const routeButton = event.target.closest('[data-route]');
    if (routeButton) {
        routeTo(routeButton.dataset.route);
        return;
    }

    const actionButton = event.target.closest('[data-action]');
    if (!actionButton) return;
    const { action } = actionButton.dataset;

    if (action === 'toggle-preview-launcher') {
        const isOpen = actionButton.getAttribute('aria-expanded') === 'true';
        setPreviewLauncher(!isOpen);
    }
    if (action === 'new-item') openItemEditor();
    if (action === 'edit-item') openItemEditor(actionButton.dataset.itemId);
    if (action === 'dismiss-item-editor') dismissItemEditor();
    if (action === 'save-item-editor-later') saveItemEditorForLater();
    if (action === 'item-step') setItemEditorStep(actionButton.dataset.step);
    if (action === 'item-step-next') setItemEditorStep(itemEditorStep + 1);
    if (action === 'item-step-back') setItemEditorStep(itemEditorStep - 1, false);
    if (action === 'trigger-image-upload') itemForm.elements.imageUpload.click();
    if (action === 'choose-editor-media') {
        itemForm.elements.image.value = actionButton.dataset.image;
        renderEditorMediaLibrary();
        refreshItemEditorPreview();
        queueEditorDraftSave();
    }
    if (action === 'clear-editor-image') {
        itemForm.elements.image.value = '';
        itemForm.elements.imageUpload.value = '';
        renderEditorMediaLibrary();
        refreshItemEditorPreview();
        queueEditorDraftSave();
    }
    if (action === 'editor-preview-mode') {
        itemEditorPreviewMode = actionButton.dataset.mode === 'tablet' ? 'tablet' : 'mobile';
        itemForm.querySelectorAll('[data-action="editor-preview-mode"]').forEach((button) => {
            button.classList.toggle('is-active', button.dataset.mode === itemEditorPreviewMode);
        });
        refreshItemEditorPreview();
    }
    if (action === 'new-category-from-editor') {
        categoryDialog('', (category) => {
            const select = itemForm.querySelector('[data-category-select]');
            select.innerHTML = state.categories.map((entry) => `<option value="${escapeHTML(entry.id)}">${escapeHTML(entry.name)}</option>`).join('');
            select.value = category.id;
            refreshItemEditorPreview();
            queueEditorDraftSave();
        });
    }
    if (action === 'new-addon-from-editor') {
        addonDialog('', (group) => {
            renderEditorAddonOptions([group.id]);
            queueEditorDraftSave();
        });
    }
    if (action === 'new-category') categoryDialog();
    if (action === 'edit-category') categoryDialog(actionButton.dataset.categoryId);
    if (action === 'new-addon') addonDialog();
    if (action === 'edit-addon') addonDialog(actionButton.dataset.addonId);
    if (action === 'close-simple-dialog') closeSimpleDialog();
    if (action === 'close-detail') closeDetail();
    if (action === 'preview-mobile') {
        closePreviewLauncher();
        showPreview('mobile');
    }
    if (action === 'preview-tablet') {
        closePreviewLauncher();
        showPreview('tablet');
    }
    if (action === 'close-preview') closePreview();
    if (action === 'open-publish') {
        closePreviewLauncher();
        routeTo('publish');
    }
    if (action === 'publish-now') publishNow();
    if (action === 'simulate-publish-failure') publishNow({ forceFailure: true });
    if (action === 'cancel-publish-failure') {
        publishRunState = 'idle';
        publishFailureMessage = '';
        render();
    }
    if (action === 'copy-mobile-link') copyLink('mobile');
    if (action === 'copy-tablet-link') copyLink('tablet');
    if (action === 'open-business-switcher') openBusinessSwitcher();
    if (action === 'open-profile') openProfileDialog();

    if (action === 'switch-embedded-preview') {
        state.preview.mode = actionButton.dataset.mode === 'mobile' ? 'mobile' : 'tablet';
        persistUiState();
        render();
    }

    if (action === 'preview-zoom-in' || action === 'preview-zoom-out' || action === 'preview-zoom-reset') {
        const delta = action === 'preview-zoom-in' ? .1 : action === 'preview-zoom-out' ? -.1 : 0;
        state.preview.zoom = action === 'preview-zoom-reset'
            ? 1
            : Math.min(1.3, Math.max(.7, Number((state.preview.zoom + delta).toFixed(1))));
        persistUiState();
        render();
    }

    if (action === 'select-item-layout') {
        state.appearance.itemLayout = actionButton.dataset.layout === 'list' ? 'list' : 'photo';
        persistState();
        render();
        toast('Layout preview diperbarui', state.appearance.itemLayout === 'list' ? 'Mode daftar aktif.' : 'Mode foto besar aktif.');
    }

    if (action === 'save-appearance') {
        persistState();
        render();
        toast('Tampilan disimpan', 'Perubahan tetap sebagai draft sampai diterbitkan.');
    }

    if (action === 'remove-custom-font') {
        state.appearance.customFontName = '';
        persistState();
        render();
        toast('Font dihapus', 'Preview kembali menggunakan Plus Jakarta Sans.');
    }

    if (action === 'toggle-sidebar') {
        document.querySelector('.sidebar')?.classList.toggle('is-open');
        document.querySelector('[data-sidebar-backdrop]').hidden = !document.querySelector('.sidebar')?.classList.contains('is-open');
    }

    if (action === 'reset-demo' && window.confirm('Reset semua perubahan prototype di browser ini?')) {
        state = cloneDefaultState();
        state.publishedSnapshot = buildSnapshot(state);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
        clearAllEditorDrafts();
        publishRunState = 'idle';
        publishFailureMessage = '';
        closePreview();
        routeTo('overview');
        toast('Demo direset', 'Data kembali ke kondisi awal.');
    }

    if (action === 'toggle-availability') {
        const item = state.items.find((entry) => entry.id === actionButton.dataset.itemId);
        item.availability = item.availability === 'available' ? 'sold_out' : 'available';
        persistState();
        render();
        toast('Status menu diperbarui', `${item.name} sekarang ${item.availability === 'available' ? 'tersedia' : 'sold out'}.`);
    }

    if (action === 'delete-item') {
        const item = state.items.find((entry) => entry.id === actionButton.dataset.itemId);
        if (item && window.confirm(`Hapus ${item.name} dari draft?`)) {
            state.items = state.items.filter((entry) => entry.id !== item.id);
            persistState();
            render();
            toast('Menu dihapus', 'Versi live belum berubah sampai diterbitkan.');
        }
    }

    if (action === 'duplicate-item') {
        const item = state.items.find((entry) => entry.id === actionButton.dataset.itemId);
        if (item) {
            const copy = {
                ...JSON.parse(JSON.stringify(item)),
                id: `${item.id}-copy-${Date.now().toString(36).slice(-4)}`,
                name: `${item.name} Copy`,
                badge: 'Draft copy',
            };
            state.items.unshift(copy);
            persistState();
            render();
            toast('Menu diduplikat', `${copy.name} masuk ke draft.`);
        }
    }

    if (action === 'toggle-category') {
        const category = state.categories.find((entry) => entry.id === actionButton.dataset.categoryId);
        category.visible = !category.visible;
        persistState();
        render();
        toast('Visibilitas diperbarui', `${category.name} ${category.visible ? 'ditampilkan' : 'disembunyikan'}.`);
    }

    if (action === 'move-category-up') {
        const index = state.categories.findIndex((entry) => entry.id === actionButton.dataset.categoryId);
        if (index > 0) {
            [state.categories[index - 1], state.categories[index]] = [state.categories[index], state.categories[index - 1]];
            persistState();
            render();
        }
    }

    if (action === 'move-category-down') {
        const index = state.categories.findIndex((entry) => entry.id === actionButton.dataset.categoryId);
        if (index >= 0 && index < state.categories.length - 1) {
            [state.categories[index], state.categories[index + 1]] = [state.categories[index + 1], state.categories[index]];
            persistState();
            render();
            toast('Urutan kategori diperbarui', 'Preview mengikuti urutan terbaru.');
        }
    }

    if (action === 'delete-category') {
        const category = state.categories.find((entry) => entry.id === actionButton.dataset.categoryId);
        const inUse = state.items.filter((item) => item.categoryId === category?.id).length;
        if (!category) return;
        if (inUse > 0) {
            toast('Kategori masih digunakan', `Pindahkan ${inUse} menu sebelum menghapus ${category.name}.`);
            return;
        }
        if (window.confirm(`Hapus kategori ${category.name}?`)) {
            state.categories = state.categories.filter((entry) => entry.id !== category.id);
            persistState();
            render();
            toast('Kategori dihapus', 'Perubahan masuk ke draft.');
        }
    }

    if (action === 'delete-addon') {
        const group = state.addonGroups.find((entry) => entry.id === actionButton.dataset.addonId);
        const inUse = state.items.filter((item) => item.addonGroupIds?.includes(group?.id)
            || (group?.id === 'milk' && item.milkOptions)
            || (group?.id === 'extras' && item.extraOptions)).length;
        if (group && inUse > 0) {
            toast('Grup masih digunakan', `Lepaskan dari ${inUse} menu sebelum menghapus ${group.name}.`);
            return;
        }
        if (group && window.confirm(`Hapus grup ${group.name}?`)) {
            state.addonGroups = state.addonGroups.filter((entry) => entry.id !== group.id);
            persistState();
            render();
            toast('Grup add-on dihapus', 'Perubahan masuk ke draft.');
        }
    }

    if (action === 'select-preset') {
        state.appearance.preset = actionButton.dataset.preset;
        state.appearance.primary = actionButton.dataset.primary;
        state.appearance.paper = actionButton.dataset.paper;
        persistState();
        render();
        toast('Preset diterapkan', `${actionButton.querySelector('strong').textContent} aktif.`);
    }

    if (action === 'toggle-maintenance') {
        state.maintenance = !state.maintenance;
        persistState();
        render();
        toast(
            state.maintenance ? 'Maintenance mode aktif' : 'Menu publik diaktifkan',
            state.maintenance ? 'Preview publik tidak membuka isi katalog.' : 'Isi katalog kembali dapat dilihat.',
        );
    }
});

document.querySelector('[data-sidebar-backdrop]').addEventListener('click', closeSidebar);

itemForm.addEventListener('input', () => {
    refreshItemEditorPreview();
    if (itemEditorValidationAttempted) validateEditorBasics({ focus: false });
    queueEditorDraftSave();
});

itemForm.addEventListener('change', (event) => {
    if (itemEditorValidationAttempted && event.target.matches('input, select, textarea')) {
        validateEditorBasics({ focus: false });
    }
});

itemEditor.addEventListener('cancel', (event) => {
    event.preventDefault();
    dismissItemEditor();
});

itemForm.elements.imageUpload.addEventListener('change', async (event) => {
    const [file] = event.target.files;
    if (!file) return;
    const progress = itemForm.querySelector('[data-upload-progress]');
    progress.hidden = false;
    progress.querySelector('span').style.width = '35%';
    try {
        const image = await imageFileToDataUrl(file);
        progress.querySelector('span').style.width = '100%';
        itemForm.elements.image.value = image;
        renderEditorMediaLibrary();
        refreshItemEditorPreview();
        itemEditorDirty = true;
        if (persistEditorDraft()) {
            updateEditorSaveState('Foto selesai diproses dan tersimpan di draft', 'cloud-check');
        }
        window.setTimeout(() => {
            progress.hidden = true;
            progress.querySelector('span').style.width = '0';
        }, 500);
    } catch (error) {
        progress.hidden = true;
        event.target.value = '';
        toast('Foto tidak dapat digunakan', error.message || 'Coba gunakan file lain.');
    }
});

const editorDropZone = itemForm.querySelector('[data-media-upload-zone]');
['dragenter', 'dragover'].forEach((eventName) => editorDropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    editorDropZone.classList.add('is-dragging');
}));
['dragleave', 'drop'].forEach((eventName) => editorDropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    editorDropZone.classList.remove('is-dragging');
}));
editorDropZone.addEventListener('drop', (event) => {
    const [file] = event.dataTransfer.files;
    if (!file) return;
    const transfer = new DataTransfer();
    transfer.items.add(file);
    itemForm.elements.imageUpload.files = transfer.files;
    itemForm.elements.imageUpload.dispatchEvent(new Event('change', { bubbles: true }));
});

itemForm.addEventListener('submit', (event) => {
    event.preventDefault();
    itemEditorValidationAttempted = true;
    if (!validateEditorBasics({ focus: false })) {
        setItemEditorStep(1, false);
        validateEditorBasics();
        return;
    }
    const data = new FormData(itemForm);
    const id = String(data.get('itemId'));
    const name = String(data.get('name')).trim();
    const existing = state.items.find((entry) => entry.id === id);
    const item = {
        id: existing?.id || `${slugify(name)}-${Date.now().toString(36).slice(-4)}`,
        name,
        categoryId: String(data.get('categoryId')),
        price: Math.max(0, Number(data.get('price'))),
        description: String(data.get('description')).trim(),
        image: normalizeImage(String(data.get('image'))),
        badge: String(data.get('badge')),
        availability: String(data.get('availability')),
        addonGroupIds: data.getAll('addonGroupIds').map(String),
        containsMilk: data.get('containsMilk') === 'on',
    };
    if (existing) {
        Object.assign(existing, item);
    } else {
        state.items.unshift(item);
    }
    persistState();
    removeEditorDraft(id);
    itemEditorDirty = false;
    closeItemEditor();
    routeTo('menus');
    toast('Menu disimpan', `${name} masuk ke draft.`);
});

window.addEventListener('beforeunload', (event) => {
    if (!itemEditor.open || !itemEditorDirty) return;
    event.preventDefault();
    event.returnValue = '';
});

simpleForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (simpleDialogHandler) {
        simpleDialogHandler(new FormData(simpleForm));
    }
    closeSimpleDialog();
});

detailDialog.addEventListener('click', (event) => {
    if (event.target === detailDialog) closeDetail();
});

itemEditor.addEventListener('close', () => document.body.classList.remove('modal-open'));
simpleDialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
detailDialog.addEventListener('close', () => document.body.classList.remove('modal-open'));

document.addEventListener('keydown', (event) => {
    const previewMenu = previewLauncher?.querySelector('[role="menu"]');
    const previewItems = previewMenu ? [...previewMenu.querySelectorAll('[role="menuitem"]')] : [];
    const previewItemIndex = previewItems.indexOf(document.activeElement);
    if (!previewMenu?.hidden && previewItemIndex >= 0 && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        const nextIndex = {
            ArrowDown: (previewItemIndex + 1) % previewItems.length,
            ArrowUp: (previewItemIndex - 1 + previewItems.length) % previewItems.length,
            Home: 0,
            End: previewItems.length - 1,
        }[event.key];
        previewItems[nextIndex].focus();
        event.preventDefault();
        return;
    }
    if (event.key !== 'Escape') return;
    const previewTrigger = previewLauncher?.querySelector('[data-action="toggle-preview-launcher"]');
    if (previewTrigger?.getAttribute('aria-expanded') === 'true') {
        closePreviewLauncher();
        previewTrigger.focus();
        event.preventDefault();
        return;
    }
    const openRowMenu = document.querySelector('.row-action-menu[open]');
    if (openRowMenu) {
        openRowMenu.removeAttribute('open');
        openRowMenu.querySelector('summary')?.focus();
        event.preventDefault();
    }
});

window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'preview-mobile') {
        showPreview('mobile');
    } else if (hash === 'preview-tablet') {
        showPreview('tablet');
    } else if (!previewShell.hidden) {
        closePreview();
    } else {
        currentRoute = getRoute();
        render();
        window.scrollTo(0, 0);
    }
});
window.addEventListener('resize', refreshEmbeddedPreviewScales);

function initialize() {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'preview-mobile' || hash === 'preview-tablet') {
        currentRoute = 'overview';
        showPreview(hash.endsWith('tablet') ? 'tablet' : 'mobile');
    } else {
        render();
    }
    refreshIcons();
}

initialize();
