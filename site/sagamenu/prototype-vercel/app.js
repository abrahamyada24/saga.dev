const STORAGE_KEY = 'sagamenu-prototype-v1';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=82';

const DEFAULT_STATE = {
    business: {
        name: 'Saga Coffee Demo',
        location: 'Madiun',
        hours: 'Setiap hari, 08.00–22.00 WIB',
        address: 'Jl. Pahlawan, Madiun, Jawa Timur',
    },
    appearance: {
        preset: 'warm',
        primary: '#a4492d',
        accent: '#28665b',
        paper: '#f7f3ed',
        customFontName: '',
    },
    categories: [
        { id: 'signature', name: 'Signature', description: 'Racikan khas Saga Coffee.', visible: true },
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
            values: [
                { name: 'Extra Shot', price: 8000 },
                { name: 'Vanilla Syrup', price: 5000 },
                { name: 'Caramel Syrup', price: 5000 },
            ],
        },
    ],
    items: [
        {
            id: 'iced-aren-latte',
            name: 'Iced Aren Latte',
            categoryId: 'signature',
            price: 28000,
            description: 'Espresso, susu, dan gula aren dengan rasa karamel yang lembut.',
            image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1000&q=82',
            badge: 'Best Seller',
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
    draft: false,
    maintenance: false,
    publishedVersion: 1,
    lastPublished: '25 Jul 2026, 20.15 WIB',
};

let state = loadState();
let currentRoute = getRoute();
let previewMode = 'mobile';
let simpleDialogHandler = null;

const main = document.querySelector('[data-dashboard] #main-content');
const previewShell = document.querySelector('[data-preview-shell]');
const previewStage = document.querySelector('[data-preview-stage]');
const itemEditor = document.querySelector('[data-item-editor]');
const itemForm = document.querySelector('[data-item-form]');
const simpleDialog = document.querySelector('[data-simple-dialog]');
const simpleForm = document.querySelector('[data-simple-form]');
const detailDialog = document.querySelector('[data-menu-detail]');

function cloneDefaultState() {
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function loadState() {
    try {
        const value = localStorage.getItem(STORAGE_KEY);
        return value ? { ...cloneDefaultState(), ...JSON.parse(value) } : cloneDefaultState();
    } catch {
        return cloneDefaultState();
    }
}

function persistState({ markDraft = true } = {}) {
    if (markDraft) {
        state.draft = true;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    updateGlobalState();
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
    try {
        const url = new URL(value);
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
}

function toast(title, message = '') {
    const region = document.querySelector('[data-toast-region]');
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
        overview: renderOverview,
        menus: renderMenus,
        categories: renderCategories,
        addons: renderAddons,
        appearance: renderAppearance,
        publish: renderPublish,
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
                <strong>${state.draft ? 'Ada perubahan yang belum dipublish' : 'Menu publik sudah terbaru'}</strong>
                <span>${state.draft ? 'Customer masih melihat versi publish terakhir.' : `Versi ${state.publishedVersion} · ${state.lastPublished}`}</span>
            </div>
            <button class="button ${state.draft ? 'button-primary' : 'button-secondary'}" type="button" data-action="${state.draft ? 'open-publish' : 'preview-mobile'}">
                <i data-lucide="${state.draft ? 'send' : 'eye'}"></i>
                <span>${state.draft ? 'Review & publish' : 'Lihat menu'}</span>
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
            `<button class="button button-secondary" type="button" data-action="preview-mobile"><i data-lucide="eye"></i><span>Lihat preview</span></button>
             <button class="button button-primary" type="button" data-action="new-item"><i data-lucide="plus"></i><span>Tambah menu</span></button>`,
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
            `<button class="button button-secondary" type="button" data-action="preview-mobile"><i data-lucide="eye"></i><span>Preview</span></button>
             <button class="button button-primary" type="button" data-action="new-item"><i data-lucide="plus"></i><span>Tambah menu</span></button>`,
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
                <div class="empty-state" data-menu-empty hidden><i data-lucide="search-x"></i><span>Menu tidak ditemukan.</span></div>
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
                    <button class="icon-button" type="button" data-action="delete-item" data-item-id="${escapeHTML(item.id)}" title="Hapus menu" aria-label="Hapus ${escapeHTML(item.name)}"><i data-lucide="trash-2"></i></button>
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
                    <div class="category-row">
                        <i class="drag-handle" data-lucide="grip-vertical"></i>
                        <span><strong>${escapeHTML(category.name)}</strong><span>${escapeHTML(category.description)}</span></span>
                        <span>${state.items.filter((item) => item.categoryId === category.id).length} menu</span>
                        <button class="toggle" type="button" role="switch" aria-checked="${category.visible}" data-action="toggle-category" data-category-id="${escapeHTML(category.id)}" aria-label="Tampilkan ${escapeHTML(category.name)}"></button>
                        <div class="row-actions">
                            <button class="icon-button" type="button" data-action="move-category-up" data-category-id="${escapeHTML(category.id)}" aria-label="Naikkan ${escapeHTML(category.name)}" ${index === 0 ? 'disabled' : ''}><i data-lucide="arrow-up"></i></button>
                            <button class="icon-button" type="button" data-action="edit-category" data-category-id="${escapeHTML(category.id)}" aria-label="Edit ${escapeHTML(category.name)}"><i data-lucide="pencil"></i></button>
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
                        <span><strong>${escapeHTML(group.name)}</strong><span>${escapeHTML(group.description)}</span></span>
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
                    ${metricCard('milk', 'Pilihan susu', String(state.items.filter((item) => item.milkOptions).length), 'menu', 'menampilkan opsi')}
                    ${metricCard('plus-circle', 'Tambahan', String(state.items.filter((item) => item.extraOptions).length), 'menu', 'menampilkan opsi')}
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
            `<button class="button button-secondary" type="button" data-action="preview-mobile"><i data-lucide="eye"></i><span>Review draft</span></button>
             <button class="button button-primary" type="button" data-action="publish-now" ${state.draft ? '' : 'disabled'}><i data-lucide="send"></i><span>${state.draft ? 'Publish sekarang' : 'Sudah terbaru'}</span></button>`,
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
    const bars = [54, 68, 62, 81, 74, 91, 86];
    return `
        ${pageHead(
            'Performa',
            'Analytics',
            'Interaksi agregat untuk memahami menu yang paling berguna.',
            `<select class="filter-select" aria-label="Periode analytics"><option>30 hari terakhir</option><option>7 hari terakhir</option></select>`,
        )}
        <section class="metrics-grid">
            ${metricCard('eye', 'Menu views', '2.847', '+18%', 'dibanding periode lalu')}
            ${metricCard('mouse-pointer-click', 'Detail dibuka', '1.206', '42,4%', 'engagement rate')}
            ${metricCard('search', 'Pencarian', '634', '8,7%', 'zero result')}
            ${metricCard('qr-code', 'Scan QR', '684', '24%', 'dari total views')}
        </section>
        <section class="content-grid">
            <article class="panel chart-panel">
                <header class="panel-header"><div><h2>Menu views</h2><p>7 hari terakhir</p></div><span class="badge badge-green">+12,6%</span></header>
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
                    ${metricCard('instagram', 'Link in bio', '1.438', '50,5%', 'dari total views')}
                    ${metricCard('qr-code', 'QR counter', '684', '24%', 'dari total views')}
                    ${metricCard('link', 'Direct link', '512', '18%', 'dari total views')}
                    ${metricCard('map-pin', 'Google Business', '213', '7,5%', 'dari total views')}
                </div>
            </div>
        </article>
    `;
}

function renderPublicMenu(mode, compact = false) {
    if (state.maintenance) {
        return `
            <div class="public-menu maintenance-page" style="${appearanceStyle()}">
                <div class="maintenance-card">
                    <span class="public-brand-mark">SC</span>
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
    return `--menu-primary:${escapeHTML(state.appearance.primary)};--menu-accent:${escapeHTML(state.appearance.accent)};--menu-paper:${escapeHTML(state.appearance.paper)};${state.appearance.customFontName ? `--custom-font:"SagaUploadedFont", "Manrope", sans-serif;` : ''}`;
}

function renderMobileMenu(categories, compact) {
    return `
        <div class="public-menu" style="${appearanceStyle()}" data-public-menu>
            <header class="public-mobile-header">
                <span class="public-brand-mark">SC</span>
                <span class="public-open">Buka sekarang</span>
                <h1>${escapeHTML(state.business.name)}</h1>
                <p>Kopi pilihan, comfort food, dan seasonal menu untuk waktu santai di Madiun.</p>
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
        <div class="public-menu" style="${appearanceStyle()}" data-public-menu>
            <header class="tablet-public-header">
                <div class="tablet-brand">
                    <span class="public-brand-mark">SC</span>
                    <div><h1>${escapeHTML(state.business.name)}</h1><p>Kopi pilihan, comfort food, dan seasonal menu untuk waktu santai di Madiun.</p></div>
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
            <span class="promo-copy"><span>Promo pilihan</span><strong>${escapeHTML(promo.name)}</strong><p>${escapeHTML(promo.description)}</p></span>
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
    itemForm.reset();
    itemForm.elements.itemId.value = item?.id || '';
    itemForm.elements.name.value = item?.name || '';
    itemForm.elements.price.value = item?.price || 28000;
    itemForm.elements.description.value = item?.description || '';
    itemForm.elements.image.value = item?.image || '';
    itemForm.elements.badge.value = item?.badge || '';
    itemForm.elements.availability.value = item?.availability || 'available';
    itemForm.elements.milkOptions.checked = Boolean(item?.milkOptions);
    itemForm.elements.extraOptions.checked = Boolean(item?.extraOptions);
    itemForm.elements.containsMilk.checked = Boolean(item?.containsMilk);
    itemForm.querySelector('[data-editor-title]').textContent = item ? 'Edit menu' : 'Tambah menu';
    const categorySelect = itemForm.querySelector('[data-category-select]');
    categorySelect.innerHTML = state.categories.map((category) => `<option value="${escapeHTML(category.id)}">${escapeHTML(category.name)}</option>`).join('');
    categorySelect.value = item?.categoryId || state.categories[0]?.id || '';
    itemEditor.showModal();
    document.body.classList.add('modal-open');
    window.setTimeout(() => itemForm.elements.name.focus(), 30);
}

function closeItemEditor() {
    itemEditor.close();
    document.body.classList.remove('modal-open');
}

function openSimpleDialog({ eyebrow, title, fields, submit }) {
    simpleDialog.querySelector('[data-simple-eyebrow]').textContent = eyebrow;
    simpleDialog.querySelector('[data-simple-title]').textContent = title;
    simpleDialog.querySelector('[data-simple-fields]').innerHTML = fields;
    simpleDialogHandler = submit;
    simpleDialog.showModal();
    document.body.classList.add('modal-open');
    window.setTimeout(() => simpleForm.querySelector('input, textarea')?.focus(), 30);
}

function closeSimpleDialog() {
    simpleDialog.close();
    document.body.classList.remove('modal-open');
    simpleDialogHandler = null;
}

function categoryDialog(categoryId = '') {
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
            if (id) {
                const existing = state.categories.find((entry) => entry.id === id);
                existing.name = String(formData.get('name'));
                existing.description = String(formData.get('description'));
            } else {
                state.categories.push({
                    id: `${slugify(formData.get('name'))}-${Date.now().toString(36).slice(-4)}`,
                    name: String(formData.get('name')),
                    description: String(formData.get('description')),
                    visible: true,
                });
            }
            persistState();
            render();
            toast('Kategori disimpan', 'Perubahan masuk ke draft.');
        },
    });
}

function addonDialog(addonId = '') {
    const group = state.addonGroups.find((entry) => entry.id === addonId);
    const lines = group?.values.map((value) => `${value.name}|${value.price}`).join('\n') || '';
    openSimpleDialog({
        eyebrow: 'Add-on',
        title: group ? 'Edit grup add-on' : 'Tambah grup add-on',
        fields: `
            <input type="hidden" name="entityId" value="${escapeHTML(group?.id || '')}">
            <label class="field"><span>Nama grup</span><input name="name" required maxlength="60" value="${escapeHTML(group?.name || '')}" placeholder="Contoh: Level pedas"></label>
            <label class="field" style="margin-top:14px"><span>Deskripsi</span><input name="description" maxlength="120" value="${escapeHTML(group?.description || '')}" placeholder="Keterangan singkat"></label>
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
            if (id) {
                const existing = state.addonGroups.find((entry) => entry.id === id);
                existing.name = String(formData.get('name'));
                existing.description = String(formData.get('description'));
                existing.values = values;
            } else {
                state.addonGroups.push({
                    id: `${slugify(formData.get('name'))}-${Date.now().toString(36).slice(-4)}`,
                    name: String(formData.get('name')),
                    description: String(formData.get('description')),
                    values,
                });
            }
            persistState();
            render();
            toast('Grup add-on disimpan', 'Detail menu akan memakai informasi terbaru.');
        },
    });
}

function openDetail(itemId) {
    const item = state.items.find((entry) => entry.id === itemId);
    if (!item) return;
    const groups = [];
    if (item.milkOptions) groups.push(state.addonGroups.find((group) => group.id === 'milk') || state.addonGroups[0]);
    if (item.extraOptions) groups.push(state.addonGroups.find((group) => group.id === 'extras') || state.addonGroups[1]);
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

function bindPublicEvents() {
    previewStage.querySelectorAll('[data-public-category]').forEach((button) => {
        button.addEventListener('click', () => {
            previewStage.querySelectorAll('[data-public-category]').forEach((entry) => entry.classList.remove('is-active'));
            button.classList.add('is-active');
            const category = button.dataset.publicCategory;
            previewStage.querySelectorAll('[data-public-section]').forEach((section) => {
                section.hidden = Boolean(category) && section.dataset.publicSection !== category;
            });
        });
    });
    previewStage.querySelector('[data-public-search]')?.addEventListener('input', (event) => {
        const term = event.target.value.trim().toLocaleLowerCase('id');
        previewStage.querySelectorAll('[data-public-card]').forEach((card) => {
            card.hidden = Boolean(term) && !card.dataset.name.includes(term);
        });
        previewStage.querySelectorAll('[data-public-section]').forEach((section) => {
            section.hidden = !section.querySelector('[data-public-card]:not([hidden])');
        });
    });
    previewStage.querySelectorAll('[data-public-item]').forEach((button) => {
        button.addEventListener('click', () => openDetail(button.dataset.publicItem));
    });
}

function handleFontUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
        toast('Font terlalu besar', 'Gunakan file maksimum 2 MB.');
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

function publishNow() {
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
    persistState({ markDraft: false });
    render();
    toast('Menu berhasil dipublish', `Versi ${state.publishedVersion} sekarang aktif.`);
}

function closeSidebar() {
    document.querySelector('.sidebar')?.classList.remove('is-open');
    document.querySelector('[data-sidebar-backdrop]').hidden = true;
}

document.addEventListener('click', (event) => {
    const routeButton = event.target.closest('[data-route]');
    if (routeButton) {
        routeTo(routeButton.dataset.route);
        return;
    }

    const actionButton = event.target.closest('[data-action]');
    if (!actionButton) return;
    const { action } = actionButton.dataset;

    if (action === 'new-item') openItemEditor();
    if (action === 'edit-item') openItemEditor(actionButton.dataset.itemId);
    if (action === 'close-item-editor') closeItemEditor();
    if (action === 'new-category') categoryDialog();
    if (action === 'edit-category') categoryDialog(actionButton.dataset.categoryId);
    if (action === 'new-addon') addonDialog();
    if (action === 'edit-addon') addonDialog(actionButton.dataset.addonId);
    if (action === 'close-simple-dialog') closeSimpleDialog();
    if (action === 'close-detail') closeDetail();
    if (action === 'preview-mobile') showPreview('mobile');
    if (action === 'preview-tablet') showPreview('tablet');
    if (action === 'close-preview') closePreview();
    if (action === 'open-publish') routeTo('publish');
    if (action === 'publish-now') publishNow();
    if (action === 'copy-mobile-link') copyLink('mobile');
    if (action === 'copy-tablet-link') copyLink('tablet');

    if (action === 'toggle-sidebar') {
        document.querySelector('.sidebar')?.classList.toggle('is-open');
        document.querySelector('[data-sidebar-backdrop]').hidden = !document.querySelector('.sidebar')?.classList.contains('is-open');
    }

    if (action === 'reset-demo' && window.confirm('Reset semua perubahan prototype di browser ini?')) {
        state = cloneDefaultState();
        localStorage.removeItem(STORAGE_KEY);
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
            toast('Menu dihapus', 'Versi live belum berubah sampai dipublish.');
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

    if (action === 'delete-addon') {
        const group = state.addonGroups.find((entry) => entry.id === actionButton.dataset.addonId);
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

itemForm.addEventListener('submit', (event) => {
    event.preventDefault();
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
        milkOptions: data.get('milkOptions') === 'on',
        extraOptions: data.get('extraOptions') === 'on',
        containsMilk: data.get('containsMilk') === 'on',
    };
    if (existing) {
        Object.assign(existing, item);
    } else {
        state.items.unshift(item);
    }
    persistState();
    closeItemEditor();
    routeTo('menus');
    toast('Menu disimpan', `${name} masuk ke draft.`);
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
    }
});

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
