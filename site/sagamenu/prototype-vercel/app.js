const STORAGE_KEY = 'sagamenu-prototype-editorial-kv-v2';
const LEGACY_STORAGE_KEY = 'sagamenu-prototype-editorial-kv-v1';
const PILOT_STORAGE_KEY = 'sagamenu-prototype-pilot-v1';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=82';
const PILOT_TASKS = [
    { id: 'media', label: 'Kelola satu asset media' },
    { id: 'create', label: 'Buat satu menu baru' },
    { id: 'edit', label: 'Edit menu dengan pilihan lengkap' },
    { id: 'brand', label: 'Ubah Brand Kit atau preset' },
    { id: 'publish', label: 'Tinjau dan terbitkan draft' },
];

const DEFAULT_STATE = {
    schemaVersion: 4,
    business: {
        name: 'Bachelor Coffee',
        location: 'Madiun',
        hours: 'Setiap hari, 08.00-22.00 WIB',
        address: 'Jl. Pahlawan, Madiun, Jawa Timur',
        tagline: 'Kopi untuk jeda yang lebih baik.',
    },
    appearance: {
        preset: 'editorial',
        bioPreset: 'editorial-list',
        storePreset: 'editorial-grid',
        primary: '#236354',
        accent: '#cbf45a',
        paper: '#f3f5f1',
        ink: '#20231f',
        headingFont: 'jakarta',
        bodyFont: 'jakarta',
        radius: 'soft',
        imageTreatment: 'natural',
        logo: '',
        customFontName: '',
        customFontLicenseConfirmed: false,
        itemLayout: 'photo',
    },
    preview: {
        mode: 'tablet',
        zoom: 1,
    },
    publishSurfaces: ['mobile', 'tablet'],
    onboardingComplete: true,
    appearanceSaved: null,
    analyticsPeriod: '30',
    mediaAssets: [
        {
            id: 'library-counter',
            type: 'image',
            image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1000&q=82',
            alt: 'Suasana coffee bar Bachelor Coffee',
            width: 1200,
            height: 800,
        },
    ],
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
            video: 'assets/video/es-kopi-susu-aren.webm',
            videoName: 'Cerita Es Kopi Susu Aren',
            videoDuration: 3,
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
let itemEditorMode = 'create';
let itemEditorPreviewMode = 'mobile';
let itemEditorDirty = false;
let itemEditorSaveTimer = null;
let itemEditorValidationAttempted = false;
let failedImageFile = null;
let failedVideoFile = null;
let appearanceTab = 'identity';
let pilotSession = loadPilotSession();
let pilotTimer = null;

const main = document.querySelector('[data-dashboard] #main-content');
const previewShell = document.querySelector('[data-preview-shell]');
const previewStage = document.querySelector('[data-preview-stage]');
const itemEditor = document.querySelector('[data-item-editor]');
const itemForm = document.querySelector('[data-item-form]');
const simpleDialog = document.querySelector('[data-simple-dialog]');
const simpleForm = document.querySelector('[data-simple-form]');
const detailDialog = document.querySelector('[data-menu-detail]');
const previewLauncher = document.querySelector('[data-preview-launcher]');
const pilotDialog = document.querySelector('[data-pilot-dialog]');
const EDITOR_DRAFT_KEY = 'sagamenu-prototype-item-editor-draft-v1';
const EDITOR_EDIT_DRAFT_PREFIX = 'sagamenu-prototype-item-editor-edit-v1:';

function cloneDefaultState() {
    const cloned = JSON.parse(JSON.stringify(DEFAULT_STATE));
    cloned.appearanceSaved = appearanceSnapshot(cloned.appearance);
    return cloned;
}

function createPilotSession() {
    return {
        id: crypto.randomUUID(),
        active: false,
        startedAt: null,
        endedAt: null,
        events: [],
        hesitations: 0,
        notes: '',
        completedTasks: [],
    };
}

function loadPilotSession() {
    try {
        return { ...createPilotSession(), ...JSON.parse(localStorage.getItem(PILOT_STORAGE_KEY) || '{}') };
    } catch {
        return createPilotSession();
    }
}

function persistPilotSession() {
    localStorage.setItem(PILOT_STORAGE_KEY, JSON.stringify(pilotSession));
}

function pilotElapsedMilliseconds() {
    if (!pilotSession.startedAt) return 0;
    const end = pilotSession.active ? Date.now() : (pilotSession.endedAt || Date.now());
    return Math.max(0, end - pilotSession.startedAt);
}

function recordPilotEvent(name, details = {}) {
    if (!pilotSession.active) return;
    pilotSession.events.push({
        name,
        elapsedMs: pilotElapsedMilliseconds(),
        route: currentRoute,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        details,
    });
    const completedTask = {
        media_asset_saved: 'media',
        menu_created: 'create',
        appearance_saved: 'brand',
        publish_completed: 'publish',
    }[name] || (name === 'menu_edit_saved' && ((details.variants || 0) + (details.addons || 0) > 0) ? 'edit' : null);
    if (completedTask && !pilotSession.completedTasks.includes(completedTask)) {
        pilotSession.completedTasks.push(completedTask);
    }
    persistPilotSession();
    if (pilotDialog?.open) renderPilotDialog();
}

function formatPilotDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function renderPilotDialog() {
    if (!pilotDialog) return;
    pilotDialog.querySelector('[data-pilot-state]').textContent = pilotSession.active
        ? `Sesi aktif · ${pilotSession.completedTasks.length}/${PILOT_TASKS.length} tugas`
        : (pilotSession.endedAt ? `Sesi selesai · ${pilotSession.completedTasks.length}/${PILOT_TASKS.length} tugas` : 'Belum dimulai');
    pilotDialog.querySelector('[data-pilot-duration]').textContent = formatPilotDuration(pilotElapsedMilliseconds());
    pilotDialog.querySelector('[data-pilot-toggle]').textContent = pilotSession.active ? 'Selesaikan sesi' : (pilotSession.startedAt ? 'Mulai sesi baru' : 'Mulai sesi');
    pilotDialog.querySelector('[data-pilot-notes]').value = pilotSession.notes || '';
    pilotDialog.querySelector('[data-pilot-tasks]').innerHTML = PILOT_TASKS.map((task) => {
        const complete = pilotSession.completedTasks.includes(task.id);
        return `<li class="${complete ? 'is-complete' : ''}"><i data-lucide="${complete ? 'circle-check' : 'circle'}"></i><span><strong>${escapeHTML(task.label)}</strong><small>${complete ? 'Selesai' : 'Belum terukur'}</small></span></li>`;
    }).join('');
    refreshIcons();
}

function openPilotReview() {
    renderPilotDialog();
    pilotDialog.showModal();
    document.body.classList.add('modal-open');
    window.clearInterval(pilotTimer);
    pilotTimer = window.setInterval(() => {
        if (pilotDialog.open && pilotSession.active) renderPilotDialog();
    }, 1000);
}

function closePilotReview() {
    pilotSession.notes = pilotDialog.querySelector('[data-pilot-notes]').value.trim();
    persistPilotSession();
    window.clearInterval(pilotTimer);
    pilotDialog.close();
    document.body.classList.remove('modal-open');
}

function togglePilotSession() {
    if (pilotSession.active) {
        pilotSession.active = false;
        pilotSession.endedAt = Date.now();
    } else {
        pilotSession = createPilotSession();
        pilotSession.active = true;
        pilotSession.startedAt = Date.now();
    }
    persistPilotSession();
    renderPilotDialog();
}

function exportPilotReport() {
    pilotSession.notes = pilotDialog.querySelector('[data-pilot-notes]').value.trim();
    persistPilotSession();
    const report = {
        schemaVersion: 1,
        product: 'SagaMenu prototype',
        sessionId: pilotSession.id,
        startedAt: pilotSession.startedAt ? new Date(pilotSession.startedAt).toISOString() : null,
        endedAt: pilotSession.endedAt ? new Date(pilotSession.endedAt).toISOString() : null,
        durationMs: pilotElapsedMilliseconds(),
        taskResults: PILOT_TASKS.map((task) => ({
            id: task.id,
            label: task.label,
            completed: pilotSession.completedTasks.includes(task.id),
        })),
        hesitations: pilotSession.hesitations,
        notes: pilotSession.notes,
        events: pilotSession.events,
    };
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }));
    link.download = `sagamenu-pilot-${pilotSession.id.slice(0, 8)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast('Report pilot dibuat', 'File JSON tidak memuat nama, email, atau isi customer.');
}

function appearanceSnapshot(appearance) {
    const keys = [
        'preset', 'bioPreset', 'storePreset', 'primary', 'accent', 'paper', 'ink',
        'headingFont', 'bodyFont', 'radius', 'imageTreatment', 'logo',
        'customFontName', 'customFontLicenseConfirmed', 'itemLayout',
    ];
    return Object.fromEntries(keys.map((key) => [key, appearance[key]]));
}

function buildSnapshot(source) {
    return JSON.parse(JSON.stringify({
        business: source.business,
        appearance: source.appearance,
        publishSurfaces: source.publishSurfaces,
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
        merged.schemaVersion = 4;
        if (!['editorial-list', 'photo-grid', 'compact-cards'].includes(merged.appearance.bioPreset)) {
            merged.appearance.bioPreset = 'editorial-list';
        }
        if (!['editorial-grid', 'menu-board', 'gallery-wall'].includes(merged.appearance.storePreset)) {
            merged.appearance.storePreset = 'editorial-grid';
        }
        merged.publishSurfaces = Array.isArray(merged.publishSurfaces) && merged.publishSurfaces.length
            ? merged.publishSurfaces.filter((surface) => ['mobile', 'tablet'].includes(surface))
            : ['mobile', 'tablet'];
        merged.appearanceSaved = stored.appearanceSaved || appearanceSnapshot(merged.appearance);
        merged.mediaAssets = (merged.mediaAssets || []).map((asset) => ({
            type: asset.type === 'video' ? 'video' : 'image',
            ...asset,
        }));
        merged.addonGroups = merged.addonGroups.map((group) => ({
            type: 'multiple',
            min: 0,
            max: Math.max(1, group.values?.length || 1),
            ...group,
        }));
        merged.items = merged.items.map((item) => ({
            ...item,
            badge: item.badge && item.badge !== 'null' ? item.badge : '',
            imageAlt: item.imageAlt || `${item.name} dari ${merged.business.name}`,
            focalX: Number.isFinite(Number(item.focalX)) ? Number(item.focalX) : 50,
            focalY: Number.isFinite(Number(item.focalY)) ? Number(item.focalY) : 50,
            gallery: Array.isArray(item.gallery) ? item.gallery : [],
            variants: Array.isArray(item.variants) ? item.variants : [],
            allergens: Array.isArray(item.allergens) ? item.allergens : (item.containsMilk ? ['Susu'] : []),
            dietary: Array.isArray(item.dietary) ? item.dietary : [],
            ingredients: item.ingredients || '',
            caffeine: item.caffeine || '',
            spiceLevel: item.spiceLevel || 'none',
            servingNote: item.servingNote || '',
            video: item.video || '',
            videoName: item.videoName || '',
            videoDuration: Math.max(0, Number(item.videoDuration || 0)),
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
    state.schemaVersion = 4;
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
    return ['overview', 'menus', 'categories', 'addons', 'media', 'appearance', 'publish', 'analytics'].includes(value)
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

function safeVideo(value) {
    const normalizedValue = String(value || '').trim();
    if (/^data:video\/(?:mp4|webm);base64,[a-z0-9+/=\s]+$/i.test(normalizedValue)) {
        return escapeHTML(normalizedValue);
    }
    if (/^assets\/video\/[a-z0-9._/-]+\.(?:mp4|webm)$/i.test(normalizedValue)) {
        return escapeHTML(normalizedValue);
    }
    try {
        const url = new URL(normalizedValue);
        return ['https:', 'http:'].includes(url.protocol) ? escapeHTML(url.toString()) : '';
    } catch {
        return '';
    }
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
    region.replaceChildren();
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
        media: renderMediaLibrary,
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

function collectMediaAssets() {
    const assets = (state.mediaAssets || []).map((asset) => ({
        type: asset.type === 'video' ? 'video' : 'image',
        ...asset,
        kind: 'library',
        usage: [],
    }));
    const assetKey = (asset) => asset.type === 'video' ? `video:${asset.video}` : `image:${asset.image}`;
    const bySource = new Map(assets.map((asset) => [assetKey(asset), asset]));
    state.items.forEach((item) => {
        const sources = [
            { type: 'image', image: item.image, alt: item.imageAlt, kind: 'primary' },
            ...(item.gallery || []).map((entry) => ({ type: 'image', image: entry.image || entry, alt: entry.alt || '', kind: 'gallery' })),
            ...(item.video ? [{
                type: 'video',
                video: item.video,
                image: item.image,
                alt: item.videoName || `Video ${item.name}`,
                duration: item.videoDuration || 0,
                kind: 'video',
            }] : []),
        ].filter((entry) => entry.type === 'video' ? entry.video : entry.image);
        sources.forEach((source) => {
            const key = assetKey(source);
            let asset = bySource.get(key);
            if (!asset) {
                asset = {
                    id: `item-${item.id}-${source.kind}`,
                    type: source.type,
                    image: source.image,
                    video: source.video || '',
                    alt: source.alt || '',
                    width: source.type === 'video' ? 1280 : 1400,
                    height: source.type === 'video' ? 720 : 1050,
                    duration: source.duration || 0,
                    kind: source.kind,
                    usage: [],
                };
                assets.push(asset);
                bySource.set(key, asset);
            }
            asset.usage.push({ itemId: item.id, name: item.name, kind: source.kind });
        });
    });
    return assets;
}

function renderMediaLibrary() {
    const assets = collectMediaAssets();
    const missingAlt = assets.filter((asset) => !asset.alt.trim()).length;
    return `
        ${pageHead(
            'Asset katalog',
            'Media Library',
            'Kelola foto dan video untuk Bio Menu serta Store Display.',
            `<label class="button button-primary media-upload-button"><i data-lucide="upload"></i><span>Unggah asset</span><input type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" data-library-upload aria-label="Unggah asset Media Library"></label>`,
        )}
        <section class="media-library-summary">
            ${metricCard('images', 'Total asset', String(assets.length), 'file', 'tersedia')}
            ${metricCard('link-2', 'Sedang dipakai', String(assets.filter((asset) => asset.usage.length).length), 'asset', 'terhubung ke menu')}
            ${metricCard('scan-text', 'Alt text', String(assets.length - missingAlt), 'lengkap', missingAlt ? `${missingAlt} perlu dilengkapi` : 'semua lengkap')}
        </section>
        <section class="media-library-toolbar" aria-label="Filter Media Library">
            <label class="search-field"><i data-lucide="search"></i><input type="search" placeholder="Cari nama file, alt text, atau menu..." data-media-search></label>
            <select aria-label="Status penggunaan media" data-media-filter>
                <option value="">Semua asset</option>
                <option value="used">Sedang dipakai</option>
                <option value="unused">Belum dipakai</option>
                <option value="missing-alt">Alt text belum lengkap</option>
                <option value="video">Video</option>
            </select>
        </section>
        <section class="media-library-grid" data-media-grid>
            ${assets.map((asset) => `
                <article class="media-asset-card" data-media-card data-search="${escapeHTML(`${asset.alt} ${asset.usage.map((entry) => entry.name).join(' ')}`.toLocaleLowerCase('id'))}" data-used="${asset.usage.length > 0}" data-missing-alt="${!asset.alt.trim()}" data-media-type="${asset.type}">
                    <div class="media-asset-image">
                        <img src="${safeImage(asset.image || FALLBACK_IMAGE)}" alt="${escapeHTML(asset.alt)}">
                        ${asset.type === 'video' ? '<i class="media-video-play" data-lucide="play"></i>' : ''}
                        <span>${asset.type === 'video' ? `${Math.max(1, Math.round(asset.duration || 1))} detik` : `${asset.width} x ${asset.height}`}</span>
                    </div>
                    <div class="media-asset-copy">
                        <span class="eyebrow">${asset.type === 'video' ? 'Video' : 'Foto'} · ${asset.usage.length ? `${asset.usage.length} pemakaian` : 'Belum dipakai'}</span>
                        <strong>${escapeHTML(asset.alt || 'Alt text belum diisi')}</strong>
                        <small>${asset.usage.length ? escapeHTML(asset.usage.map((entry) => entry.name).join(', ')) : 'Aman dihapus dari library'}</small>
                    </div>
                    <div class="media-asset-actions">
                        <button class="button button-secondary" type="button" data-action="edit-media-alt" data-media-id="${escapeHTML(asset.id)}"><i data-lucide="scan-text"></i><span>Edit alt</span></button>
                        <button class="icon-button" type="button" data-action="remove-media" data-media-id="${escapeHTML(asset.id)}" aria-label="Hapus asset ${escapeHTML(asset.alt || asset.id)}"><i data-lucide="trash-2"></i></button>
                    </div>
                </article>
            `).join('')}
        </section>
        <div class="table-empty-state media-empty-state" data-media-empty hidden>
            <img src="assets/illustrations/empty-catalog.webp" alt="">
            <strong>Tidak ada asset yang cocok</strong>
            <span>Ubah pencarian atau filter penggunaan.</span>
        </div>
        <div class="media-security-note"><i data-lucide="shield-check"></i><span><strong>Prototype menggunakan browser storage.</strong><small>Production wajib memvalidasi tenant, MIME, signature, ukuran, dan malware sebelum asset tersedia.</small></span></div>
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
                        <input type="file" accept=".woff,.woff2,.ttf,font/woff,font/woff2,font/ttf" data-font-upload aria-label="Unggah font brand">
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
            <span class="color-control"><input type="color" name="${escapeHTML(key)}" value="${escapeHTML(value)}" data-color-key="${key}"><span>${escapeHTML(value.toUpperCase())}</span></span>
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
    const contrast = colorContrast(state.appearance.ink, state.appearance.paper);
    const hasChanges = JSON.stringify(appearanceSnapshot(state.appearance)) !== JSON.stringify(state.appearanceSaved);
    return `
        ${pageHead(
            'Pengaturan',
            'Tampilan & branding',
            'Perubahan baru tampil publik setelah diterbitkan.',
            `<button class="button button-secondary" type="button" data-action="reset-appearance-changes" ${hasChanges ? '' : 'disabled'}><i data-lucide="undo-2"></i><span>Batalkan perubahan</span></button>
             <button class="button button-primary" type="button" data-action="save-appearance" ${hasChanges ? '' : 'disabled'}><i data-lucide="save"></i><span>Simpan tampilan</span></button>`,
        )}
        <section class="appearance-workspace">
            <article class="appearance-controls">
                <nav class="appearance-tabbar" aria-label="Bagian Brand Kit">
                    ${appearanceTabButton('identity', 'Identitas', 'badge-check')}
                    ${appearanceTabButton('type', 'Tipografi', 'type')}
                    ${appearanceTabButton('shape', 'Bentuk', 'shapes')}
                    ${appearanceTabButton('presets', 'Preset', 'layout-template')}
                </nav>
                <section class="setting-section ${appearanceTab === 'identity' ? '' : 'is-tab-hidden'}">
                    <div class="setting-section-heading"><div><span class="eyebrow">Brand Kit</span><h3>Identitas global</h3><p>Logo, warna, dan font berlaku untuk kedua surface.</p></div><button class="button button-secondary" type="button" data-action="open-catalog-setup"><i data-lucide="wand-sparkles"></i><span>Setup terpandu</span></button></div>
                    <div class="brand-logo-row">
                        <span class="brand-logo-preview">${state.appearance.logo ? `<img src="${safeImage(state.appearance.logo)}" alt="">` : 'BC'}</span>
                        <label class="button button-secondary"><i data-lucide="image-plus"></i><span>${state.appearance.logo ? 'Ganti logo' : 'Unggah logo'}</span><input type="file" accept="image/jpeg,image/png,image/webp" data-logo-upload aria-label="Unggah logo brand"></label>
                        ${state.appearance.logo ? '<button class="text-action" type="button" data-action="remove-brand-logo">Hapus logo</button>' : ''}
                    </div>
                </section>
                <section class="setting-section ${appearanceTab === 'identity' ? '' : 'is-tab-hidden'}">
                    <h3>Warna brand</h3>
                    <div class="color-grid">
                        ${colorField('primary', 'Warna utama', state.appearance.primary)}
                        ${colorField('accent', 'Warna aksen', state.appearance.accent)}
                        ${colorField('paper', 'Latar belakang', state.appearance.paper)}
                        ${colorField('ink', 'Warna teks', state.appearance.ink)}
                    </div>
                    <div class="contrast-result ${contrast >= 4.5 ? 'is-safe' : 'is-warning'}"><i data-lucide="${contrast >= 4.5 ? 'circle-check' : 'triangle-alert'}"></i><span>Rasio kontras ${contrast.toFixed(2)}:1 ${contrast >= 4.5 ? 'memenuhi WCAG AA.' : 'belum memenuhi WCAG AA untuk teks normal.'}</span></div>
                </section>
                <section class="setting-section ${appearanceTab === 'type' ? '' : 'is-tab-hidden'}">
                    <h3>Tipografi</h3>
                    <div class="form-grid">
                        <label class="field"><span>Heading font</span><select data-appearance-key="headingFont"><option value="jakarta" ${state.appearance.headingFont === 'jakarta' ? 'selected' : ''}>Plus Jakarta Sans</option><option value="brand" ${state.appearance.headingFont === 'brand' ? 'selected' : ''} ${state.appearance.customFontName ? '' : 'disabled'}>Brand font</option></select></label>
                        <label class="field"><span>Body font</span><select data-appearance-key="bodyFont"><option value="jakarta" ${state.appearance.bodyFont === 'jakarta' ? 'selected' : ''}>Plus Jakarta Sans</option><option value="brand" ${state.appearance.bodyFont === 'brand' ? 'selected' : ''} ${state.appearance.customFontName ? '' : 'disabled'}>Brand font</option></select></label>
                    </div>
                </section>
                <section class="setting-section ${appearanceTab === 'type' ? '' : 'is-tab-hidden'}">
                    <h3>Font brand</h3>
                    <label class="upload-box compact-upload">
                        <i data-lucide="upload-cloud"></i>
                        <strong>${state.appearance.customFontName ? escapeHTML(state.appearance.customFontName) : 'Unggah WOFF/WOFF2'}</strong>
                        <span>Fallback: Plus Jakarta Sans</span>
                        <input type="file" accept=".woff,.woff2,font/woff,font/woff2" data-font-upload aria-label="Unggah font brand">
                    </label>
                    <label class="check-line compact-check"><input type="checkbox" data-font-license ${state.appearance.customFontLicenseConfirmed ? 'checked' : ''}><span><strong>Saya memiliki izin penggunaan font</strong><small>Konfirmasi lisensi diperlukan sebelum font dapat diterbitkan.</small></span></label>
                    ${state.appearance.customFontName ? '<button class="text-action remove-font-action" type="button" data-action="remove-custom-font">Hapus font dan gunakan fallback</button>' : ''}
                </section>
                <section class="setting-section ${appearanceTab === 'shape' ? '' : 'is-tab-hidden'}">
                    <h3>Bentuk & foto</h3>
                    <div class="form-grid">
                        <label class="field"><span>Radius komponen</span><select data-appearance-key="radius"><option value="sharp" ${state.appearance.radius === 'sharp' ? 'selected' : ''}>Tegas</option><option value="soft" ${state.appearance.radius === 'soft' ? 'selected' : ''}>Soft</option><option value="rounded" ${state.appearance.radius === 'rounded' ? 'selected' : ''}>Rounded</option></select></label>
                        <label class="field"><span>Treatment foto</span><select data-appearance-key="imageTreatment"><option value="natural" ${state.appearance.imageTreatment === 'natural' ? 'selected' : ''}>Natural</option><option value="soft" ${state.appearance.imageTreatment === 'soft' ? 'selected' : ''}>Soft contrast</option><option value="mono" ${state.appearance.imageTreatment === 'mono' ? 'selected' : ''}>Monochrome</option></select></label>
                    </div>
                </section>
                <section class="setting-section surface-preset-section ${appearanceTab === 'presets' ? '' : 'is-tab-hidden'}">
                    <div><span class="eyebrow">Bio Menu</span><h3>Preset mobile</h3><p>Pilih layout khusus link di bio.</p></div>
                    <div class="surface-preset-grid">
                        ${surfacePresetButton('mobile', 'editorial-list', 'Editorial List', 'Narasi kuat, scan cepat', 'list')}
                        ${surfacePresetButton('mobile', 'photo-grid', 'Photo Grid', 'Foto besar dua kolom', 'photo')}
                        ${surfacePresetButton('mobile', 'compact-cards', 'Compact Cards', 'Padat untuk katalog panjang', 'compact')}
                    </div>
                </section>
                <section class="setting-section surface-preset-section ${appearanceTab === 'presets' ? '' : 'is-tab-hidden'}">
                    <div><span class="eyebrow">Store Display</span><h3>Preset tablet</h3><p>Kategori tetap berada di atas menu.</p></div>
                    <div class="surface-preset-grid">
                        ${surfacePresetButton('tablet', 'editorial-grid', 'Editorial Grid', 'Grid operasional tiga kolom', 'photo')}
                        ${surfacePresetButton('tablet', 'menu-board', 'Menu Board', 'Harga dan nama lebih dominan', 'list')}
                        ${surfacePresetButton('tablet', 'gallery-wall', 'Gallery Wall', 'Foto besar untuk venue visual', 'gallery')}
                    </div>
                </section>
                <div class="appearance-note"><i data-lucide="info"></i><span>Perubahan tersimpan sebagai draft sampai Anda menerbitkannya.</span></div>
            </article>
            ${renderLivePreviewWorkspace('appearance')}
        </section>
    `;
}

function appearanceTabButton(id, label, icon) {
    return `<button class="${appearanceTab === id ? 'is-active' : ''}" type="button" data-action="appearance-tab" data-appearance-tab="${id}" aria-pressed="${appearanceTab === id}"><i data-lucide="${icon}"></i><span>${label}</span></button>`;
}

function surfacePresetButton(surface, id, name, description, preview) {
    const active = surface === 'mobile'
        ? state.appearance.bioPreset === id
        : state.appearance.storePreset === id;
    return `
        <button class="surface-preset-card ${active ? 'is-active' : ''}" type="button" data-action="select-surface-preset" data-surface="${surface}" data-preset="${id}">
            <span class="surface-preset-thumbnail is-${preview}"><i></i><i></i><i></i></span>
            <span><strong>${escapeHTML(name)}</strong><small>${escapeHTML(description)}</small></span>
            <i data-lucide="${active ? 'circle-check' : 'circle'}"></i>
        </button>
    `;
}

function hexLuminance(hex) {
    const values = hex.replace('#', '').match(/.{2}/g)?.map((value) => {
        const channel = parseInt(value, 16) / 255;
        return channel <= .03928 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
    }) || [0, 0, 0];
    return .2126 * values[0] + .7152 * values[1] + .0722 * values[2];
}

function colorContrast(foreground, background) {
    const first = hexLuminance(foreground);
    const second = hexLuminance(background);
    return (Math.max(first, second) + .05) / (Math.min(first, second) + .05);
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
                    <div><span>Media</span><strong>${collectMediaAssets().length}</strong></div>
                    <fieldset class="publish-surface-confirmation">
                        <legend>Surface yang akan diperbarui</legend>
                        <label><input type="checkbox" value="mobile" data-publish-surface ${state.publishSurfaces.includes('mobile') ? 'checked' : ''}><i data-lucide="smartphone"></i><span><strong>Bio Menu</strong><small>${escapeHTML(state.appearance.bioPreset)}</small></span></label>
                        <label><input type="checkbox" value="tablet" data-publish-surface ${state.publishSurfaces.includes('tablet') ? 'checked' : ''}><i data-lucide="tablet"></i><span><strong>Store Display</strong><small>${escapeHTML(state.appearance.storePreset)}</small></span></label>
                    </fieldset>
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
                    ${publicBrandMark()}
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
    const radius = { sharp: '2px', soft: '8px', rounded: '16px' }[state.appearance.radius] || '8px';
    const brandFont = state.appearance.customFontName ? '"SagaUploadedFont", "Plus Jakarta Sans", sans-serif' : '"Plus Jakarta Sans", sans-serif';
    return `--menu-primary:${escapeHTML(state.appearance.primary)};--menu-accent:${escapeHTML(state.appearance.accent)};--menu-paper:${escapeHTML(state.appearance.paper)};--menu-ink:${escapeHTML(state.appearance.ink)};--menu-radius:${radius};--heading-font:${state.appearance.headingFont === 'brand' ? brandFont : '"Plus Jakarta Sans", sans-serif'};--body-font:${state.appearance.bodyFont === 'brand' ? brandFont : '"Plus Jakarta Sans", sans-serif'};`;
}

function surfaceLayout(mode) {
    const preset = mode === 'mobile' ? state.appearance.bioPreset : state.appearance.storePreset;
    return {
        'editorial-list': 'list',
        'photo-grid': 'photo',
        'compact-cards': 'list',
        'editorial-grid': 'photo',
        'menu-board': 'list',
        'gallery-wall': 'photo',
    }[preset] || state.appearance.itemLayout || 'photo';
}

function publicBrandMark() {
    return state.appearance.logo
        ? `<span class="public-brand-mark has-logo"><img src="${safeImage(state.appearance.logo)}" alt="Logo ${escapeHTML(state.business.name)}"></span>`
        : '<span class="public-brand-mark">BC</span>';
}

function renderMobileMenu(categories, compact) {
    return `
        <div class="public-menu is-layout-${surfaceLayout('mobile')} preset-${escapeHTML(state.appearance.bioPreset)} image-${escapeHTML(state.appearance.imageTreatment)}" style="${appearanceStyle()}" data-public-menu>
            <header class="public-mobile-header">
                <div class="public-mobile-brand-row">
                    ${publicBrandMark()}
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
        <div class="public-menu is-layout-${surfaceLayout('tablet')} preset-${escapeHTML(state.appearance.storePreset)} image-${escapeHTML(state.appearance.imageTreatment)}" style="${appearanceStyle()}" data-public-menu>
            <header class="tablet-public-header">
                <div class="tablet-brand">
                    ${publicBrandMark()}
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
            <span class="promo-media"><img src="${safeImage(promo.image)}" alt="${escapeHTML(promo.imageAlt || promo.name)}" style="object-position:${Number(promo.focalX ?? 50)}% ${Number(promo.focalY ?? 50)}%">${promo.video ? '<i data-lucide="play"></i>' : ''}</span>
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
                <span class="public-card-media">
                    <img src="${safeImage(item.image)}" alt="${escapeHTML(item.imageAlt || item.name)}" style="object-position:${Number(item.focalX ?? 50)}% ${Number(item.focalY ?? 50)}%">
                    ${item.video ? '<span class="public-video-badge"><i data-lucide="play"></i> Video</span>' : ''}
                </span>
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
    itemEditorMode = item ? 'edit' : 'create';
    itemEditor.dataset.mode = itemEditorMode;
    itemForm.classList.toggle('is-edit-mode', itemEditorMode === 'edit');
    itemForm.classList.toggle('is-create-mode', itemEditorMode === 'create');
    const source = recoveredDraft || item || {};
    itemForm.elements.itemId.value = item?.id || '';
    itemForm.elements.name.value = source.name || '';
    itemForm.elements.price.value = source.price || 28000;
    itemForm.elements.description.value = source.description || '';
    itemForm.elements.image.value = source.image || '';
    itemForm.elements.imageAlt.value = source.imageAlt || '';
    itemForm.elements.focalX.value = source.focalX ?? 50;
    itemForm.elements.focalY.value = source.focalY ?? 50;
    itemForm.elements.gallery.value = JSON.stringify(source.gallery || []);
    itemForm.elements.variants.value = JSON.stringify(source.variants || []);
    itemForm.elements.video.value = source.video || '';
    itemForm.elements.videoName.value = source.videoName || '';
    itemForm.elements.videoDuration.value = source.videoDuration || 0;
    itemForm.elements.badge.value = source.badge || '';
    itemForm.elements.availability.value = source.availability || 'available';
    itemForm.elements.containsMilk.checked = Boolean(source.containsMilk);
    itemForm.elements.ingredients.value = source.ingredients || '';
    itemForm.elements.caffeine.value = source.caffeine || '';
    itemForm.elements.spiceLevel.value = source.spiceLevel || 'none';
    itemForm.elements.servingNote.value = source.servingNote || '';
    itemForm.querySelectorAll('input[name="allergens"]').forEach((input) => {
        input.checked = (source.allergens || []).includes(input.value);
    });
    itemForm.querySelectorAll('input[name="dietary"]').forEach((input) => {
        input.checked = (source.dietary || []).includes(input.value);
    });
    failedImageFile = null;
    failedVideoFile = null;
    itemForm.querySelector('[data-upload-error]').hidden = true;
    itemForm.querySelector('[data-video-error]').hidden = true;
    configureItemEditorMode(item);
    const categorySelect = itemForm.querySelector('[data-category-select]');
    categorySelect.innerHTML = state.categories.map((category) => `<option value="${escapeHTML(category.id)}">${escapeHTML(category.name)}</option>`).join('');
    categorySelect.value = source.categoryId || state.categories[0]?.id || '';
    const selectedGroups = source.addonGroupIds || [
        ...(source.milkOptions ? ['milk'] : []),
        ...(source.extraOptions ? ['extras'] : []),
    ];
    renderEditorAddonOptions(selectedGroups);
    renderEditorMediaLibrary();
    renderEditorGallery();
    renderEditorVideo();
    renderEditorVariants();
    itemEditorDirty = false;
    itemEditorPreviewMode = 'mobile';
    itemEditorValidationAttempted = false;
    clearEditorValidation();
    if (itemEditorMode === 'create') setItemEditorStep(1, false);
    else showAllEditSections();
    refreshItemEditorPreview();
    updateEditorSaveState(
        recoveredDraft
            ? (item ? 'Perubahan edit dipulihkan dari browser' : 'Draft dipulihkan dari browser')
            : 'Draft aman, belum tampil ke customer',
        recoveredDraft ? 'history' : 'cloud',
    );
    itemEditor.showModal();
    recordPilotEvent(item ? 'menu_edit_opened' : 'menu_create_opened');
    document.body.classList.add('modal-open');
    window.setTimeout(() => {
        itemForm.querySelector('.item-wizard-content').scrollTop = 0;
        itemForm.querySelector('.item-wizard-main').scrollTop = 0;
        itemForm.elements.name.focus({ preventScroll: true });
    }, 30);
}

function configureItemEditorMode(item) {
    const isEdit = itemEditorMode === 'edit';
    itemForm.querySelector('[data-editor-eyebrow]').textContent = isEdit ? 'Edit menu' : 'Menu baru';
    itemForm.querySelector('[data-editor-title]').textContent = isEdit ? item.name : 'Tambah menu';
    itemForm.querySelector('[data-editor-context]').textContent = isEdit
        ? 'Perbarui bagian yang diperlukan tanpa mengulang wizard.'
        : 'Buat satu menu baru melalui empat langkah singkat.';
    itemForm.querySelector('[data-editor-submit-copy]').textContent = 'Buat menu sebagai draft';
    itemForm.querySelector('[data-editor-review-title]').textContent = 'Review sebelum membuat menu.';
    itemForm.querySelector('[data-editor-review-copy]').textContent =
        'Periksa seluruh informasi sebelum menambahkan menu ke draft katalog.';
    itemForm.querySelector('[data-create-footer]').hidden = isEdit;
    itemForm.querySelector('[data-edit-footer]').hidden = !isEdit;
    itemForm.querySelector('[data-edit-sections]').hidden = !isEdit;
    itemForm.querySelector('.item-wizard-steps').hidden = isEdit;

    const closeButton = itemForm.querySelector('.item-wizard-header [data-action="dismiss-item-editor"]');
    closeButton.setAttribute('aria-label', isEdit ? `Tutup edit ${item.name}` : 'Tutup wizard tambah menu');

    const panelCopy = isEdit
        ? [
            ['Informasi utama', 'Perbarui informasi yang dilihat customer.', 'Nama, kategori, harga, dan status dapat diubah langsung.'],
            ['Media menu', 'Ganti foto atau video saat ini.', 'Upload media baru atau pilih kembali foto dari Media Library.'],
            ['Pilihan customer', 'Atur add-on dan informasi tambahan.', 'Perubahan pada bagian ini bersifat opsional.'],
        ]
        : [
            ['Langkah 1 dari 4', 'Mulai dari informasi yang customer cari.', 'Nama, kategori, harga, dan deskripsi akan langsung terlihat pada preview.'],
            ['Langkah 2 dari 4', 'Tambahkan foto dan video tanpa menempel URL.', 'Upload dari perangkat atau pilih foto yang sudah ada di Media Library.'],
            ['Langkah 3 dari 4', 'Lengkapi pilihan yang membantu customer memahami menu.', 'Bagian ini opsional. Kosongkan jika menu tidak memiliki varian atau add-on.'],
        ];

    itemForm.querySelectorAll('[data-wizard-panel]').forEach((panel, index) => {
        if (index >= panelCopy.length) return;
        const [eyebrow, title, copy] = panelCopy[index];
        panel.querySelector('[data-panel-eyebrow]').textContent = eyebrow;
        panel.querySelector('[data-panel-title]').textContent = title;
        panel.querySelector('[data-panel-copy]').textContent = copy;
    });
}

function showAllEditSections() {
    itemForm.querySelectorAll('[data-wizard-panel]').forEach((panel) => {
        panel.hidden = Number(panel.dataset.wizardPanel) === 4;
    });
    itemForm.querySelectorAll('[data-action="edit-section"]').forEach((button, index) => {
        button.classList.toggle('is-active', index === 0);
    });
}

function focusEditSection(section) {
    const target = itemForm.querySelector(`[data-wizard-panel="${section}"]`);
    if (!target || itemEditorMode !== 'edit') return;
    itemForm.querySelectorAll('[data-action="edit-section"]').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.section === String(section));
    });
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => target.querySelector('input, select, textarea, button')?.focus({ preventScroll: true }), 220);
}

function renderEditorAddonOptions(selectedGroups = []) {
    const checkedGroups = selectedGroups.length
        ? selectedGroups
        : [...itemForm.querySelectorAll('input[name="addonGroupIds"]:checked')].map((input) => input.value);
    const orderedGroups = [
        ...checkedGroups.map((id) => state.addonGroups.find((group) => group.id === id)).filter(Boolean),
        ...state.addonGroups.filter((group) => !checkedGroups.includes(group.id)),
    ];
    itemForm.querySelector('[data-addon-attachment-options]').innerHTML = orderedGroups.map((group, index) => `
        <div class="addon-attachment-row" data-addon-attachment="${escapeHTML(group.id)}">
            <label>
                <input type="checkbox" name="addonGroupIds" value="${escapeHTML(group.id)}" ${checkedGroups.includes(group.id) ? 'checked' : ''}>
                <span><strong>${escapeHTML(group.name)}</strong><small>${escapeHTML(group.description)}</small></span>
            </label>
            <div ${checkedGroups.includes(group.id) ? '' : 'hidden'}>
                <button class="icon-button" type="button" data-action="move-attached-addon-up" data-addon-id="${escapeHTML(group.id)}" aria-label="Naikkan ${escapeHTML(group.name)}" ${index === 0 ? 'disabled' : ''}><i data-lucide="arrow-up"></i></button>
                <button class="icon-button" type="button" data-action="move-attached-addon-down" data-addon-id="${escapeHTML(group.id)}" aria-label="Turunkan ${escapeHTML(group.name)}" ${index === checkedGroups.length - 1 ? 'disabled' : ''}><i data-lucide="arrow-down"></i></button>
            </div>
        </div>
    `).join('');
    refreshEditorComplexitySummary();
    refreshIcons();
}

function renderEditorMediaLibrary() {
    const images = [...new Set(collectMediaAssets().filter((asset) => asset.type === 'image').map((asset) => safeImage(asset.image)).filter(Boolean))].slice(0, 8);
    const selected = itemForm.elements.image.value;
    itemForm.querySelector('[data-editor-media-library]').innerHTML = images.map((image, index) => `
        <button type="button" data-action="choose-editor-media" data-image="${escapeHTML(image)}" class="${selected === image ? 'is-selected' : ''}" aria-label="Pilih foto media ${index + 1}">
            <img src="${escapeHTML(image)}" alt="">
            <span><i data-lucide="check"></i></span>
        </button>
    `).join('');
}

function readEditorCollection(name) {
    try {
        const value = JSON.parse(itemForm.elements[name].value || '[]');
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

function writeEditorCollection(name, value) {
    itemForm.elements[name].value = JSON.stringify(value);
}

function renderEditorGallery() {
    const gallery = readEditorCollection('gallery');
    const container = itemForm.querySelector('[data-editor-gallery]');
    container.innerHTML = gallery.length
        ? gallery.map((entry, index) => {
            const normalized = typeof entry === 'string' ? { image: entry, alt: '' } : entry;
            return `
                <article>
                    <img src="${safeImage(normalized.image)}" alt="${escapeHTML(normalized.alt || '')}">
                    <span>Foto ${index + 1}</span>
                    <button class="icon-button" type="button" data-action="remove-gallery-image" data-gallery-index="${index}" aria-label="Hapus foto gallery ${index + 1}"><i data-lucide="x"></i></button>
                </article>
            `;
        }).join('')
        : '<div class="editor-gallery-empty"><i data-lucide="images"></i><span>Belum ada foto pendukung</span></div>';
    refreshIcons();
}

function renderEditorVideo() {
    const source = safeVideo(itemForm.elements.video.value);
    const preview = itemForm.querySelector('[data-editor-video-preview]');
    const empty = itemForm.querySelector('[data-editor-video-empty]');
    const player = itemForm.querySelector('[data-editor-video-player]');
    const hasVideo = Boolean(source);
    preview.hidden = !hasVideo;
    empty.hidden = hasVideo;
    itemForm.querySelector('[data-video-upload-label]').textContent = hasVideo ? 'Ganti video' : 'Tambah video';
    if (hasVideo) {
        player.src = source;
        player.poster = normalizeImage(itemForm.elements.image.value);
        itemForm.querySelector('[data-editor-video-name]').textContent = itemForm.elements.videoName.value || 'Video menu';
        const duration = Math.max(0, Number(itemForm.elements.videoDuration.value || 0));
        itemForm.querySelector('[data-editor-video-duration]').textContent = duration
            ? `${Math.round(duration)} detik · Siap dipreview`
            : 'Siap dipreview';
    } else {
        player.removeAttribute('src');
        player.load();
    }
    refreshIcons();
}

function refreshEditorComplexitySummary() {
    const container = itemForm.querySelector('[data-editor-complexity-summary]');
    if (!container) return;
    const variants = readEditorCollection('variants');
    const addonIds = [...itemForm.querySelectorAll('input[name="addonGroupIds"]:checked')].map((input) => input.value);
    const optionCount = variants.reduce((total, group) => total + group.values.length, 0)
        + addonIds.reduce((total, id) => total + (state.addonGroups.find((group) => group.id === id)?.values.length || 0), 0);
    const groupCount = variants.length + addonIds.length;
    container.querySelector('strong').textContent = groupCount ? `${groupCount} grup pilihan` : 'Menu sederhana';
    container.querySelector('small').textContent = groupCount
        ? `${optionCount} opsi akan tampil sebagai informasi pada detail menu.`
        : 'Belum ada varian atau add-on.';
}

function renderEditorVariants() {
    const variants = readEditorCollection('variants');
    const container = itemForm.querySelector('[data-variant-groups]');
    container.innerHTML = variants.length
        ? variants.map((group, index) => `
            <article class="variant-group-card">
                <div>
                    <span class="variant-order">${index + 1}</span>
                    <span><strong>${escapeHTML(group.name)}</strong><small>${group.values.length} pilihan · ${group.required ? 'Wajib' : 'Opsional'}</small></span>
                </div>
                <div class="variant-value-chips">${group.values.map((value) => `<span>${escapeHTML(value.name)}${value.price ? ` +${formatPrice(value.price)}` : ''}</span>`).join('')}</div>
                <div class="variant-actions">
                    <button class="icon-button" type="button" data-action="move-variant-up" data-variant-index="${index}" aria-label="Naikkan ${escapeHTML(group.name)}" ${index === 0 ? 'disabled' : ''}><i data-lucide="arrow-up"></i></button>
                    <button class="icon-button" type="button" data-action="move-variant-down" data-variant-index="${index}" aria-label="Turunkan ${escapeHTML(group.name)}" ${index === variants.length - 1 ? 'disabled' : ''}><i data-lucide="arrow-down"></i></button>
                    <button class="icon-button" type="button" data-action="edit-variant-group" data-variant-index="${index}" aria-label="Edit ${escapeHTML(group.name)}"><i data-lucide="pencil"></i></button>
                    <button class="icon-button" type="button" data-action="remove-variant-group" data-variant-index="${index}" aria-label="Hapus ${escapeHTML(group.name)}"><i data-lucide="trash-2"></i></button>
                </div>
            </article>
        `).join('')
        : '<div class="variant-empty"><i data-lucide="split"></i><span><strong>Tanpa varian</strong><small>Menu sederhana tidak perlu mengisi bagian ini.</small></span></div>';
    refreshEditorComplexitySummary();
    refreshIcons();
}

function variantDialog(variantIndex = -1) {
    const variants = readEditorCollection('variants');
    const group = variants[variantIndex];
    const lines = group?.values.map((value) => `${value.name}|${value.price}`).join('\n') || '';
    openSimpleDialog({
        eyebrow: 'Varian menu',
        title: group ? 'Edit varian' : 'Tambah varian',
        fields: `
            <label class="field"><span>Nama varian</span><input name="name" required maxlength="50" value="${escapeHTML(group?.name || '')}" placeholder="Contoh: Ukuran"></label>
            <label class="check-line"><input type="checkbox" name="required" ${group?.required ? 'checked' : ''}><span><strong>Wajib dipilih</strong><small>Customer harus memilih satu informasi varian.</small></span></label>
            <label class="field"><span>Pilihan varian</span><textarea name="values" required rows="6" placeholder="Regular|0&#10;Large|8000">${escapeHTML(lines)}</textarea><small>Format satu per baris: Nama|Tambahan harga</small></label>
        `,
        submitLabel: group ? 'Simpan varian' : 'Tambah varian',
        submit: (formData) => {
            const values = String(formData.get('values') || '')
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => {
                    const [name, price] = line.split('|');
                    return { name: name.trim(), price: Math.max(0, Number(price || 0)) };
                });
            const next = {
                id: group?.id || `variant-${Date.now().toString(36)}`,
                name: String(formData.get('name') || '').trim(),
                required: formData.get('required') === 'on',
                values,
            };
            if (group) variants[variantIndex] = next;
            else variants.push(next);
            writeEditorCollection('variants', variants);
            renderEditorVariants();
            refreshItemEditorPreview();
            queueEditorDraftSave();
        },
    });
}

function setItemEditorStep(step, shouldValidate = true) {
    if (itemEditorMode === 'edit') {
        focusEditSection(step);
        return true;
    }
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
    const addAnother = itemForm.querySelector('[data-create-another]');
    back.hidden = itemEditorStep === 1;
    next.hidden = itemEditorStep === 4;
    submit.hidden = itemEditorStep !== 4;
    addAnother.hidden = itemEditorStep !== 4;
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
    previewImage.style.objectPosition = `${itemForm.elements.focalX.value}% ${itemForm.elements.focalY.value}%`;
    itemForm.querySelector('[data-focal-x-value]').textContent = `${itemForm.elements.focalX.value}%`;
    itemForm.querySelector('[data-focal-y-value]').textContent = `${itemForm.elements.focalY.value}%`;
    const focalImage = itemForm.querySelector('[data-focal-editor-image]');
    const focalMarker = itemForm.querySelector('[data-focal-marker]');
    focalImage.src = image;
    focalImage.alt = '';
    focalMarker.style.left = `${itemForm.elements.focalX.value}%`;
    focalMarker.style.top = `${itemForm.elements.focalY.value}%`;
    itemForm.querySelector('[data-editor-preview-card]').classList.toggle('is-store', itemEditorPreviewMode === 'tablet');
    itemForm.querySelector('[data-editor-preview-mode]').textContent = itemEditorPreviewMode === 'tablet' ? 'Store Display' : 'Bio Menu';
}

function refreshEditorReview() {
    const description = itemForm.elements.description.value.trim();
    const selectedGroupNames = [...itemForm.querySelectorAll('input[name="addonGroupIds"]:checked')]
        .map((input) => state.addonGroups.find((group) => group.id === input.value)?.name)
        .filter(Boolean);
    const choiceLabels = [
        ...readEditorCollection('variants').map((group) => group.name),
        ...selectedGroupNames,
        ...(itemForm.elements.containsMilk.checked ? ['Mengandung susu'] : []),
    ];
    const priceValue = itemForm.elements.price.value;
    const values = {
        name: [itemForm.elements.name.value.trim(), itemForm.elements.name.value.trim() || 'Belum diisi'],
        category: [itemForm.elements.categoryId.value, itemForm.elements.categoryId.selectedOptions[0]?.textContent || 'Belum dipilih'],
        price: [priceValue !== '' && Number(priceValue) >= 0, priceValue === '' ? 'Belum diisi' : formatPrice(Number(priceValue))],
        image: [
            itemForm.elements.image.value,
            itemForm.elements.image.value
                ? `Foto utama + ${readEditorCollection('gallery').length} gallery${itemForm.elements.video.value ? ' + video' : ''}`
                : 'Opsional untuk layout daftar',
        ],
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
        imageAlt: String(data.get('imageAlt') || ''),
        focalX: Number(data.get('focalX') || 50),
        focalY: Number(data.get('focalY') || 50),
        gallery: readEditorCollection('gallery'),
        variants: readEditorCollection('variants'),
        video: String(data.get('video') || ''),
        videoName: String(data.get('videoName') || ''),
        videoDuration: Math.max(0, Number(data.get('videoDuration') || 0)),
        badge: String(data.get('badge') || ''),
        availability: String(data.get('availability') || 'available'),
        addonGroupIds: data.getAll('addonGroupIds').map(String),
        containsMilk: data.get('containsMilk') === 'on',
        allergens: data.getAll('allergens').map(String),
        dietary: data.getAll('dietary').map(String),
        ingredients: String(data.get('ingredients') || ''),
        caffeine: String(data.get('caffeine') || ''),
        spiceLevel: String(data.get('spiceLevel') || 'none'),
        servingNote: String(data.get('servingNote') || ''),
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

async function videoFileToDataUrl(file) {
    if (!['video/mp4', 'video/webm'].includes(file.type) || file.size > 2 * 1024 * 1024) {
        throw new Error('Gunakan MP4 atau WebM maksimal 2 MB untuk prototype.');
    }
    const data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
    const duration = await new Promise((resolve, reject) => {
        const video = document.createElement('video');
        const timeout = window.setTimeout(() => reject(new Error('Metadata video tidak dapat dibaca.')), 6000);
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            window.clearTimeout(timeout);
            resolve(Number.isFinite(video.duration) ? video.duration : 0);
            video.removeAttribute('src');
            video.load();
        };
        video.onerror = () => {
            window.clearTimeout(timeout);
            reject(new Error('Video rusak atau codec belum didukung browser.'));
        };
        video.src = data;
    });
    if (duration > 60) {
        throw new Error('Gunakan video maksimal 60 detik.');
    }
    return { data, duration };
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

function openSimpleDialog({ eyebrow, title, fields, submit, submitLabel = 'Simpan', presentation = 'modal' }) {
    simpleDialog.classList.toggle('is-side-sheet', presentation === 'sheet');
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

function openCatalogSetup() {
    openSimpleDialog({
        eyebrow: 'Setup katalog',
        title: state.onboardingComplete ? 'Tinjau setup bisnis' : 'Mulai katalog pertama',
        presentation: 'sheet',
        submitLabel: 'Simpan setup',
        fields: `
            <ol class="setup-step-list">
                <li><span>1</span><div><strong>Informasi bisnis</strong><small>Identitas yang dilihat customer.</small></div></li>
                <li><span>2</span><div><strong>Surface aktif</strong><small>Pilih Bio Menu, Store Display, atau keduanya.</small></div></li>
                <li><span>3</span><div><strong>Brand dasar</strong><small>Warna dapat disempurnakan di Brand Kit.</small></div></li>
                <li><span>4</span><div><strong>Starter content</strong><small>Tambahkan kategori awal jika dibutuhkan.</small></div></li>
            </ol>
            <div class="setup-form-section">
                <span class="eyebrow">Langkah 1</span>
                <label class="field"><span>Nama bisnis</span><input name="businessName" required maxlength="80" value="${escapeHTML(state.business.name)}"></label>
                <label class="field"><span>Tagline</span><input name="tagline" maxlength="120" value="${escapeHTML(state.business.tagline)}"></label>
            </div>
            <div class="setup-form-section">
                <span class="eyebrow">Langkah 2</span>
                <div class="surface-choice-grid">
                    <label><input type="checkbox" name="surfaces" value="mobile" ${state.publishSurfaces.includes('mobile') ? 'checked' : ''}><i data-lucide="smartphone"></i><span><strong>Bio Menu</strong><small>Link untuk Instagram atau TikTok.</small></span></label>
                    <label><input type="checkbox" name="surfaces" value="tablet" ${state.publishSurfaces.includes('tablet') ? 'checked' : ''}><i data-lucide="tablet"></i><span><strong>Store Display</strong><small>Tablet customer di venue.</small></span></label>
                </div>
            </div>
            <div class="setup-form-section">
                <span class="eyebrow">Langkah 3</span>
                <div class="form-grid">
                    ${colorField('setupPrimary', 'Warna utama', state.appearance.primary)}
                    ${colorField('setupAccent', 'Warna aksen', state.appearance.accent)}
                </div>
            </div>
            <div class="setup-form-section">
                <span class="eyebrow">Langkah 4</span>
                <label class="field"><span>Kategori starter (opsional)</span><input name="starterCategory" maxlength="50" placeholder="Contoh: Seasonal"></label>
                <div class="draft-safety-note"><i data-lucide="shield-check"></i><span><strong>Setup disimpan sebagai draft.</strong><small>Customer baru melihatnya setelah Anda menerbitkan.</small></span></div>
            </div>
        `,
        submit: (formData) => {
            state.business.name = String(formData.get('businessName') || '').trim();
            state.business.tagline = String(formData.get('tagline') || '').trim();
            state.publishSurfaces = formData.getAll('surfaces').map(String).filter((surface) => ['mobile', 'tablet'].includes(surface));
            if (!state.publishSurfaces.length) state.publishSurfaces = ['mobile'];
            state.appearance.primary = String(formData.get('setupPrimary') || state.appearance.primary);
            state.appearance.accent = String(formData.get('setupAccent') || state.appearance.accent);
            const starterCategory = String(formData.get('starterCategory') || '').trim();
            if (starterCategory && !state.categories.some((category) => category.name.toLocaleLowerCase('id') === starterCategory.toLocaleLowerCase('id'))) {
                state.categories.push({
                    id: `${slugify(starterCategory)}-${Date.now().toString(36).slice(-4)}`,
                    name: starterCategory,
                    description: 'Kategori starter dari setup katalog.',
                    visible: true,
                });
            }
            state.onboardingComplete = true;
            state.draft = true;
            persistState();
            recordPilotEvent('catalog_setup_saved', {
                surfaces: state.publishSurfaces,
                starterCategoryAdded: Boolean(starterCategory),
            });
            render();
            toast('Setup katalog disimpan', 'Lanjutkan mengisi menu lalu tinjau sebelum terbit.');
        },
    });
}

function closeSimpleDialog() {
    simpleDialog.close();
    simpleDialog.classList.remove('is-side-sheet');
    document.body.classList.remove('modal-open');
    simpleDialogHandler = null;
}

function mediaAltDialog(mediaId) {
    const asset = collectMediaAssets().find((entry) => entry.id === mediaId);
    if (!asset) return;
    openSimpleDialog({
        eyebrow: 'Media Library',
        title: 'Edit alt text',
        fields: `
            <div class="media-alt-preview"><img src="${safeImage(asset.image)}" alt=""></div>
            <label class="field"><span>Alt text</span><textarea name="alt" required rows="3" maxlength="160" placeholder="Jelaskan objek utama foto secara ringkas">${escapeHTML(asset.alt)}</textarea><small>Hindari kata "gambar" atau "foto". Jelaskan apa yang terlihat.</small></label>
            <div class="impact-summary"><i data-lucide="link-2"></i><span><strong>${asset.usage.length} pemakaian akan diperbarui</strong><small>${escapeHTML(asset.usage.map((entry) => entry.name).join(', ') || 'Asset belum dipakai menu')}</small></span></div>
        `,
        submitLabel: 'Simpan alt text',
        presentation: 'sheet',
        submit: (formData) => {
            const alt = String(formData.get('alt') || '').trim();
            const libraryAsset = (state.mediaAssets || []).find((entry) => entry.id === mediaId);
            if (libraryAsset) libraryAsset.alt = alt;
            state.items.forEach((item) => {
                if (item.image === asset.image) item.imageAlt = alt;
                if (asset.type === 'video' && item.video === asset.video) item.videoName = alt;
                item.gallery = (item.gallery || []).map((entry) => {
                    const normalized = typeof entry === 'string' ? { image: entry, alt: '' } : entry;
                    return normalized.image === asset.image ? { ...normalized, alt } : normalized;
                });
            });
            state.draft = true;
            persistState();
            render();
            toast('Alt text diperbarui', 'Semua pemakaian asset memakai deskripsi terbaru.');
        },
    });
}

function categoryDialog(categoryId = '', onSaved = null) {
    const category = state.categories.find((entry) => entry.id === categoryId);
    const usage = state.items.filter((item) => item.categoryId === categoryId);
    openSimpleDialog({
        eyebrow: 'Kategori',
        title: category ? 'Edit kategori' : 'Tambah kategori',
        fields: `
            <input type="hidden" name="entityId" value="${escapeHTML(category?.id || '')}">
            <label class="field"><span>Nama kategori</span><input name="name" required maxlength="50" value="${escapeHTML(category?.name || '')}" placeholder="Contoh: Seasonal"></label>
            <label class="field" style="margin-top:14px"><span>Deskripsi</span><textarea name="description" rows="3" maxlength="120" placeholder="Deskripsi singkat kategori">${escapeHTML(category?.description || '')}</textarea></label>
            <label class="check-line"><input type="checkbox" name="visible" ${category?.visible !== false ? 'checked' : ''}><span><strong>Tampilkan pada menu publik</strong><small>Kategori tersembunyi tetap tersimpan sebagai draft.</small></span></label>
            ${category ? `<div class="impact-summary"><i data-lucide="utensils"></i><span><strong>Dipakai oleh ${usage.length} menu</strong><small>${escapeHTML(usage.slice(0, 4).map((item) => item.name).join(', ') || 'Belum digunakan')}</small></span></div>` : ''}
        `,
        presentation: 'sheet',
        submit: (formData) => {
            const id = formData.get('entityId');
            let savedCategory;
            if (id) {
                const existing = state.categories.find((entry) => entry.id === id);
                existing.name = String(formData.get('name'));
                existing.description = String(formData.get('description'));
                existing.visible = formData.get('visible') === 'on';
                savedCategory = existing;
            } else {
                savedCategory = {
                    id: `${slugify(formData.get('name'))}-${Date.now().toString(36).slice(-4)}`,
                    name: String(formData.get('name')),
                    description: String(formData.get('description')),
                    visible: formData.get('visible') === 'on',
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
    const usage = state.items.filter((item) => item.addonGroupIds?.includes(addonId)
        || (addonId === 'milk' && item.milkOptions)
        || (addonId === 'extras' && item.extraOptions));
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
            ${group ? `<div class="impact-summary"><i data-lucide="link-2"></i><span><strong>Dipakai oleh ${usage.length} menu</strong><small>${escapeHTML(usage.slice(0, 4).map((item) => item.name).join(', ') || 'Belum digunakan')}</small></span></div>` : ''}
        `,
        presentation: 'sheet',
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
    const primaryMedia = item.video
        ? `<div class="detail-video-wrap"><video class="detail-video" controls muted playsinline preload="metadata" poster="${safeImage(item.image)}" aria-label="${escapeHTML(item.videoName || `Video ${item.name}`)}"><source src="${safeVideo(item.video)}" type="${item.video.startsWith('data:video/mp4') ? 'video/mp4' : 'video/webm'}">Browser tidak mendukung video menu.</video><span><i data-lucide="volume-x"></i>Video tidak diputar otomatis dengan suara</span></div>`
        : `<img class="detail-image" src="${safeImage(item.image)}" alt="${escapeHTML(item.imageAlt || item.name)}" style="object-position:${Number(item.focalX ?? 50)}% ${Number(item.focalY ?? 50)}%">`;
    detailDialog.querySelector('[data-detail-content]').innerHTML = `
        <div class="detail-layout">
            ${primaryMedia}
            <div class="detail-copy">
                <button class="icon-button detail-close" type="button" data-action="close-detail" aria-label="Tutup detail"><i data-lucide="x"></i></button>
                ${item.badge ? `<span class="badge badge-orange">${escapeHTML(item.badge)}</span>` : ''}
                <h2>${escapeHTML(item.name)}</h2>
                <span class="detail-price">${formatPrice(item.price)}</span>
                <p class="detail-description">${escapeHTML(item.description)} Dibuat untuk menampilkan detail rasa dan informasi penting sebelum customer datang ke outlet.</p>
                ${(item.gallery || []).length ? `<div class="detail-gallery">${item.gallery.map((entry) => {
                    const normalized = typeof entry === 'string' ? { image: entry, alt: '' } : entry;
                    return `<img src="${safeImage(normalized.image)}" alt="${escapeHTML(normalized.alt || '')}">`;
                }).join('')}</div>` : ''}
                ${(item.variants || []).length
                    ? item.variants.map((variant) => `
                        <section class="detail-section">
                            <h3>${escapeHTML(variant.name)} <small>${variant.required ? 'Wajib' : 'Opsional'}</small></h3>
                            ${variant.values.map((value) => `<div class="detail-option"><span>${escapeHTML(value.name)}</span><span>${value.price ? `+${formatPrice(value.price)}` : 'Termasuk'}</span></div>`).join('')}
                        </section>
                    `).join('')
                    : `<section class="detail-section"><h3>Penyajian</h3><div class="detail-option"><span>Harga dasar</span><span>${formatPrice(item.price)}</span></div></section>`}
                ${groups.filter(Boolean).map((group) => `
                    <section class="detail-section">
                        <h3>${escapeHTML(group.name)}</h3>
                        ${group.values.map((value) => `<div class="detail-option"><span>${escapeHTML(value.name)}</span><span>${value.price ? `+${formatPrice(value.price)}` : 'Termasuk'}</span></div>`).join('')}
                    </section>
                `).join('')}
                ${(item.ingredients || item.servingNote || item.allergens?.length || item.dietary?.length) ? `
                    <section class="detail-section detail-facts">
                        <h3>Detail menu</h3>
                        ${item.ingredients ? `<p><strong>Bahan:</strong> ${escapeHTML(item.ingredients)}</p>` : ''}
                        ${item.allergens?.length ? `<p><strong>Alergen:</strong> ${escapeHTML(item.allergens.join(', '))}</p>` : ''}
                        ${item.dietary?.length ? `<p><strong>Dietary:</strong> ${escapeHTML(item.dietary.join(', '))}</p>` : ''}
                        ${item.caffeine ? `<p><strong>Kafein:</strong> ${escapeHTML(item.caffeine)}</p>` : ''}
                        ${item.spiceLevel && item.spiceLevel !== 'none' ? `<p><strong>Pedas:</strong> ${escapeHTML(item.spiceLevel)}</p>` : ''}
                        ${item.servingNote ? `<p><strong>Penyajian:</strong> ${escapeHTML(item.servingNote)}</p>` : ''}
                    </section>
                ` : ''}
                <section class="detail-section"><p class="detail-note"><i data-lucide="info"></i><span>${item.containsMilk ? 'Mengandung susu. ' : ''}Pilihan ditampilkan sebagai informasi dan tidak menambahkan item ke keranjang.</span></p></section>
            </div>
        </div>
    `;
    detailDialog.showModal();
    document.body.classList.add('modal-open');
    refreshIcons();
}

function closeDetail() {
    detailDialog.querySelector('video')?.pause();
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

    const mediaSearch = document.querySelector('[data-media-search]');
    const mediaFilter = document.querySelector('[data-media-filter]');
    [mediaSearch, mediaFilter].forEach((control) => {
        control?.addEventListener('input', filterMediaLibrary);
        control?.addEventListener('change', filterMediaLibrary);
    });
    document.querySelector('[data-library-upload]')?.addEventListener('change', handleLibraryUpload);

    document.querySelectorAll('[data-color-key]').forEach((input) => {
        input.addEventListener('input', () => {
            state.appearance[input.dataset.colorKey] = input.value;
            input.nextElementSibling.textContent = input.value.toUpperCase();
            persistState();
            document.querySelectorAll('[data-public-menu]').forEach((preview) => preview.setAttribute('style', appearanceStyle()));
            document.querySelector('[data-action="save-appearance"]')?.removeAttribute('disabled');
            document.querySelector('[data-action="reset-appearance-changes"]')?.removeAttribute('disabled');
        });
    });

    document.querySelectorAll('[data-appearance-key]').forEach((control) => {
        control.addEventListener('change', () => {
            state.appearance[control.dataset.appearanceKey] = control.value;
            persistState();
            render();
        });
    });
    document.querySelector('[data-font-license]')?.addEventListener('change', (event) => {
        state.appearance.customFontLicenseConfirmed = event.target.checked;
        persistState();
        render();
    });
    document.querySelector('[data-font-upload]')?.addEventListener('change', handleFontUpload);
    document.querySelector('[data-logo-upload]')?.addEventListener('change', handleLogoUpload);
    document.querySelectorAll('[data-publish-surface]').forEach((input) => {
        input.addEventListener('change', () => {
            state.publishSurfaces = [...document.querySelectorAll('[data-publish-surface]:checked')].map((entry) => entry.value);
            persistState();
        });
    });
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

function filterMediaLibrary() {
    const term = (document.querySelector('[data-media-search]')?.value || '').trim().toLocaleLowerCase('id');
    const filter = document.querySelector('[data-media-filter]')?.value || '';
    let visible = 0;
    document.querySelectorAll('[data-media-card]').forEach((card) => {
        const matchesTerm = !term || card.dataset.search.includes(term);
        const matchesFilter = !filter
            || (filter === 'used' && card.dataset.used === 'true')
            || (filter === 'unused' && card.dataset.used === 'false')
            || (filter === 'missing-alt' && card.dataset.missingAlt === 'true')
            || (filter === 'video' && card.dataset.mediaType === 'video');
        card.hidden = !(matchesTerm && matchesFilter);
        if (!card.hidden) visible += 1;
    });
    const empty = document.querySelector('[data-media-empty]');
    if (empty) empty.hidden = visible > 0;
}

async function handleLibraryUpload(event) {
    const [file] = event.target.files || [];
    if (!file) return;
    const isVideo = ['video/mp4', 'video/webm'].includes(file.type);
    toast('Memproses asset', isVideo ? 'Video sedang diperiksa untuk preview.' : 'Foto sedang dikompresi menjadi WebP.');
    try {
        const source = isVideo ? await videoFileToDataUrl(file) : await imageFileToDataUrl(file);
        state.mediaAssets = state.mediaAssets || [];
        state.mediaAssets.unshift({
            id: `library-${Date.now().toString(36)}`,
            type: isVideo ? 'video' : 'image',
            image: isVideo ? FALLBACK_IMAGE : source.data || source,
            video: isVideo ? source.data : '',
            alt: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
            width: isVideo ? 1280 : 1400,
            height: isVideo ? 720 : 1050,
            duration: isVideo ? source.duration : 0,
        });
        state.draft = true;
        persistState();
        recordPilotEvent('media_asset_saved', { type: isVideo ? 'video' : 'image' });
        render();
        toast('Asset siap digunakan', `${file.name} masuk ke Media Library.`);
    } catch (error) {
        event.target.value = '';
        toast('Asset gagal diproses', error.message || 'Pilih file lain dan coba kembali.');
    }
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

async function handleLogoUpload(event) {
    const [file] = event.target.files || [];
    if (!file) return;
    try {
        state.appearance.logo = await imageFileToDataUrl(file);
        state.draft = true;
        persistState();
        render();
        toast('Logo diperbarui', 'Logo baru masuk ke draft Brand Kit.');
    } catch (error) {
        event.target.value = '';
        toast('Logo tidak dapat digunakan', error.message || 'Gunakan JPG, PNG, atau WebP.');
    }
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
    if (!state.publishSurfaces.length) {
        toast('Pilih surface publikasi', 'Aktifkan Bio Menu atau Store Display sebelum menerbitkan.');
        return;
    }
    if (state.appearance.customFontName && !state.appearance.customFontLicenseConfirmed) {
        toast('Font belum siap diterbitkan', 'Konfirmasi lisensi font dari halaman Tampilan.');
        return;
    }
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
        recordPilotEvent('publish_completed', { version: state.publishedVersion });
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
    if (action === 'edit-section') focusEditSection(actionButton.dataset.section);
    if (action === 'trigger-image-upload') itemForm.elements.imageUpload.click();
    if (action === 'retry-image-upload') processPrimaryImage(failedImageFile);
    if (action === 'retry-video-upload') processMenuVideo(failedVideoFile);
    if (action === 'remove-editor-video') {
        itemForm.elements.video.value = '';
        itemForm.elements.videoName.value = '';
        itemForm.elements.videoDuration.value = '0';
        itemForm.querySelector('[data-video-upload]').value = '';
        renderEditorVideo();
        queueEditorDraftSave();
    }
    if (action === 'choose-editor-media') {
        itemForm.elements.image.value = actionButton.dataset.image;
        const asset = collectMediaAssets().find((entry) => safeImage(entry.image) === actionButton.dataset.image);
        if (asset?.alt && !itemForm.elements.imageAlt.value.trim()) itemForm.elements.imageAlt.value = asset.alt;
        renderEditorMediaLibrary();
        renderEditorVideo();
        refreshItemEditorPreview();
        queueEditorDraftSave();
    }
    if (action === 'clear-editor-image') {
        itemForm.elements.image.value = '';
        itemForm.elements.imageUpload.value = '';
        renderEditorMediaLibrary();
        renderEditorVideo();
        refreshItemEditorPreview();
        queueEditorDraftSave();
    }
    if (action === 'remove-gallery-image') {
        const gallery = readEditorCollection('gallery');
        gallery.splice(Number(actionButton.dataset.galleryIndex), 1);
        writeEditorCollection('gallery', gallery);
        renderEditorGallery();
        queueEditorDraftSave();
    }
    if (action === 'new-variant-group') variantDialog();
    if (action === 'edit-variant-group') variantDialog(Number(actionButton.dataset.variantIndex));
    if (action === 'remove-variant-group') {
        const variants = readEditorCollection('variants');
        variants.splice(Number(actionButton.dataset.variantIndex), 1);
        writeEditorCollection('variants', variants);
        renderEditorVariants();
        queueEditorDraftSave();
    }
    if (action === 'move-variant-up' || action === 'move-variant-down') {
        const variants = readEditorCollection('variants');
        const from = Number(actionButton.dataset.variantIndex);
        const to = action === 'move-variant-up' ? from - 1 : from + 1;
        if (to >= 0 && to < variants.length) {
            [variants[from], variants[to]] = [variants[to], variants[from]];
            writeEditorCollection('variants', variants);
            renderEditorVariants();
            queueEditorDraftSave();
        }
    }
    if (action === 'move-attached-addon-up' || action === 'move-attached-addon-down') {
        const checked = [...itemForm.querySelectorAll('input[name="addonGroupIds"]:checked')].map((input) => input.value);
        const from = checked.indexOf(actionButton.dataset.addonId);
        const to = action === 'move-attached-addon-up' ? from - 1 : from + 1;
        if (from >= 0 && to >= 0 && to < checked.length) {
            [checked[from], checked[to]] = [checked[to], checked[from]];
            renderEditorAddonOptions(checked);
            queueEditorDraftSave();
        }
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
    if (action === 'edit-media-alt') mediaAltDialog(actionButton.dataset.mediaId);
    if (action === 'remove-media') {
        const asset = collectMediaAssets().find((entry) => entry.id === actionButton.dataset.mediaId);
        if (!asset) return;
        if (asset.usage.length) {
            toast('Asset masih digunakan', `Lepaskan dari ${asset.usage.length} pemakaian sebelum menghapus.`);
            return;
        }
        if (window.confirm(`Hapus asset "${asset.alt || asset.id}" dari Media Library?`)) {
            state.mediaAssets = (state.mediaAssets || []).filter((entry) => entry.id !== asset.id);
            persistState();
            render();
            toast('Asset dihapus', 'Asset yang tidak terpakai sudah dibersihkan.');
        }
    }
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
    if (action === 'open-pilot-review') openPilotReview();
    if (action === 'close-pilot-review') closePilotReview();
    if (action === 'toggle-pilot-session') togglePilotSession();
    if (action === 'mark-pilot-hesitation') {
        if (!pilotSession.active) {
            toast('Mulai sesi terlebih dahulu', 'Mode uji perlu aktif sebelum menandai keraguan.');
        } else {
            pilotSession.hesitations += 1;
            recordPilotEvent('hesitation_marked');
            renderPilotDialog();
        }
    }
    if (action === 'export-pilot-report') exportPilotReport();

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

    if (action === 'appearance-tab') {
        appearanceTab = ['identity', 'type', 'shape', 'presets'].includes(actionButton.dataset.appearanceTab)
            ? actionButton.dataset.appearanceTab
            : 'identity';
        render();
    }

    if (action === 'save-appearance') {
        if (state.appearance.customFontName && !state.appearance.customFontLicenseConfirmed) {
            toast('Konfirmasi lisensi font', 'Centang izin penggunaan font sebelum menyimpan Brand Kit.');
            return;
        }
        state.appearanceSaved = appearanceSnapshot(state.appearance);
        state.draft = true;
        persistState();
        recordPilotEvent('appearance_saved', {
            bioPreset: state.appearance.bioPreset,
            storePreset: state.appearance.storePreset,
        });
        render();
        toast('Tampilan disimpan', 'Perubahan tetap sebagai draft sampai diterbitkan.');
    }

    if (action === 'reset-appearance-changes') {
        state.appearance = { ...state.appearance, ...state.appearanceSaved };
        persistState();
        render();
        toast('Perubahan dibatalkan', 'Brand Kit kembali ke versi terakhir yang disimpan.');
    }

    if (action === 'select-surface-preset') {
        const key = actionButton.dataset.surface === 'mobile' ? 'bioPreset' : 'storePreset';
        state.appearance[key] = actionButton.dataset.preset;
        persistState();
        render();
        toast('Preset preview diterapkan', 'Simpan tampilan untuk mengunci pilihan ini.');
    }

    if (action === 'remove-brand-logo') {
        state.appearance.logo = '';
        persistState();
        render();
        toast('Logo dihapus', 'Monogram bisnis digunakan sebagai fallback.');
    }

    if (action === 'open-catalog-setup') openCatalogSetup();

    if (action === 'remove-custom-font') {
        state.appearance.customFontName = '';
        state.appearance.customFontLicenseConfirmed = false;
        state.appearance.headingFont = 'jakarta';
        state.appearance.bodyFont = 'jakarta';
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
        localStorage.removeItem(PILOT_STORAGE_KEY);
        pilotSession = createPilotSession();
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
    if (event.target.matches('input[name="addonGroupIds"]')) {
        const checked = [...itemForm.querySelectorAll('input[name="addonGroupIds"]:checked')].map((input) => input.value);
        renderEditorAddonOptions(checked);
    }
});

itemEditor.addEventListener('cancel', (event) => {
    event.preventDefault();
    dismissItemEditor();
});

async function processMenuVideo(file) {
    if (!file) return;
    const progress = itemForm.querySelector('[data-video-progress]');
    const errorState = itemForm.querySelector('[data-video-error]');
    errorState.hidden = true;
    progress.hidden = false;
    progress.querySelector('span').style.width = '35%';
    try {
        const result = await videoFileToDataUrl(file);
        progress.querySelector('span').style.width = '100%';
        itemForm.elements.video.value = result.data;
        itemForm.elements.videoName.value = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
        itemForm.elements.videoDuration.value = String(result.duration);
        failedVideoFile = null;
        renderEditorVideo();
        itemEditorDirty = true;
        if (persistEditorDraft()) {
            updateEditorSaveState('Video selesai diproses dan tersimpan di draft', 'cloud-check');
        }
        recordPilotEvent('media_asset_saved', { type: 'video', action: 'menu_upload' });
        window.setTimeout(() => {
            progress.hidden = true;
            progress.querySelector('span').style.width = '0';
        }, 500);
    } catch (error) {
        progress.hidden = true;
        failedVideoFile = file;
        itemForm.querySelector('[data-video-upload]').value = '';
        errorState.hidden = false;
        errorState.querySelector('[data-video-error-copy]').textContent = error.message || 'Coba gunakan file lain.';
        refreshIcons();
    }
}

async function processPrimaryImage(file) {
    if (!file) return;
    const progress = itemForm.querySelector('[data-upload-progress]');
    const errorState = itemForm.querySelector('[data-upload-error]');
    errorState.hidden = true;
    progress.hidden = false;
    progress.querySelector('span').style.width = '35%';
    try {
        const image = await imageFileToDataUrl(file);
        progress.querySelector('span').style.width = '100%';
        itemForm.elements.image.value = image;
        if (!itemForm.elements.imageAlt.value.trim()) {
            itemForm.elements.imageAlt.value = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
        }
        failedImageFile = null;
        renderEditorMediaLibrary();
        renderEditorVideo();
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
        failedImageFile = file;
        itemForm.elements.imageUpload.value = '';
        errorState.hidden = false;
        errorState.querySelector('[data-upload-error-copy]').textContent = error.message || 'Coba gunakan file lain.';
        refreshIcons();
    }
}

itemForm.elements.imageUpload.addEventListener('change', async (event) => {
    const [file] = event.target.files;
    await processPrimaryImage(file);
});

itemForm.querySelector('[data-video-upload]').addEventListener('change', async (event) => {
    const [file] = event.target.files;
    await processMenuVideo(file);
    event.target.value = '';
});

itemForm.querySelector('[data-focal-editor]').addEventListener('click', (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, Math.round(((event.clientX - bounds.left) / bounds.width) * 100)));
    const y = Math.min(100, Math.max(0, Math.round(((event.clientY - bounds.top) / bounds.height) * 100)));
    itemForm.elements.focalX.value = String(x);
    itemForm.elements.focalY.value = String(y);
    refreshItemEditorPreview();
    queueEditorDraftSave();
});

itemForm.querySelector('[data-gallery-upload]').addEventListener('change', async (event) => {
    const files = [...event.target.files].slice(0, Math.max(0, 4 - readEditorCollection('gallery').length));
    if (!files.length) return;
    const gallery = readEditorCollection('gallery');
    for (const file of files) {
        try {
            const image = await imageFileToDataUrl(file);
            gallery.push({
                image,
                alt: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
            });
        } catch (error) {
            toast('Satu foto gallery dilewati', error.message || file.name);
        }
    }
    writeEditorCollection('gallery', gallery.slice(0, 4));
    renderEditorGallery();
    queueEditorDraftSave();
    event.target.value = '';
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
    const shouldAddAnother = itemEditorMode === 'create' && event.submitter?.dataset.submitIntent === 'add-another';
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
        imageAlt: String(data.get('imageAlt') || '').trim(),
        focalX: Number(data.get('focalX') || 50),
        focalY: Number(data.get('focalY') || 50),
        gallery: readEditorCollection('gallery'),
        variants: readEditorCollection('variants'),
        video: String(data.get('video') || ''),
        videoName: String(data.get('videoName') || '').trim(),
        videoDuration: Math.max(0, Number(data.get('videoDuration') || 0)),
        badge: String(data.get('badge') || ''),
        availability: String(data.get('availability')),
        addonGroupIds: data.getAll('addonGroupIds').map(String),
        containsMilk: data.get('containsMilk') === 'on',
        allergens: data.getAll('allergens').map(String),
        dietary: data.getAll('dietary').map(String),
        ingredients: String(data.get('ingredients') || '').trim(),
        caffeine: String(data.get('caffeine') || ''),
        spiceLevel: String(data.get('spiceLevel') || 'none'),
        servingNote: String(data.get('servingNote') || '').trim(),
    };
    if (existing) {
        Object.assign(existing, item);
    } else {
        state.items.unshift(item);
    }
    persistState();
    removeEditorDraft(id);
    itemEditorDirty = false;
    recordPilotEvent(existing ? 'menu_edit_saved' : 'menu_created', {
        variants: item.variants.length,
        addons: item.addonGroupIds.length,
        hasVideo: Boolean(item.video),
    });
    closeItemEditor();
    routeTo('menus');
    toast('Menu disimpan', `${name} masuk ke draft.`);
    if (shouldAddAnother) {
        window.setTimeout(() => openItemEditor(), 80);
    }
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

pilotDialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closePilotReview();
});

pilotDialog.querySelector('[data-pilot-notes]').addEventListener('input', (event) => {
    pilotSession.notes = event.target.value;
    persistPilotSession();
});

detailDialog.addEventListener('click', (event) => {
    if (event.target === detailDialog) closeDetail();
});

itemEditor.addEventListener('close', () => document.body.classList.remove('modal-open'));
simpleDialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
detailDialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
pilotDialog.addEventListener('close', () => {
    window.clearInterval(pilotTimer);
    document.body.classList.remove('modal-open');
});

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
