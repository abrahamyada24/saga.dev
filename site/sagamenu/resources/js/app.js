const body = document.body;
const analyticsEndpoint = body.dataset.analyticsEndpoint;
const isPreview = body.dataset.preview === 'true';
const sessionStorageKey = 'sagamenu_session';

function sessionKey() {
    let value = sessionStorage.getItem(sessionStorageKey);

    if (!value) {
        value = crypto.randomUUID();
        sessionStorage.setItem(sessionStorageKey, value);
    }

    return value;
}

function track(eventName, properties = {}) {
    if (!analyticsEndpoint || isPreview) {
        return;
    }

    const payload = {
        event_id: crypto.randomUUID(),
        brand: body.dataset.brand,
        catalog: body.dataset.catalog,
        event_name: eventName,
        surface: body.dataset.surface,
        session_key: sessionKey(),
        ...properties,
    };

    fetch(analyticsEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
    }).catch(() => {});
}

track('catalog_viewed');

document.querySelectorAll('[data-image-container] img').forEach((image) => {
    const markFailed = () => image.closest('[data-image-container]')?.classList.add('image-failed');
    image.addEventListener('error', markFailed);

    if (image.complete && image.naturalWidth === 0) {
        markFailed();
    }
});

document.querySelectorAll('[data-offering-open]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
        const slug = trigger.dataset.offeringOpen;
        const dialog = document.querySelector(`[data-offering-dialog="${CSS.escape(slug)}"]`);

        if (!dialog) {
            return;
        }

        dialog.dataset.returnFocus = slug;
        dialog.showModal();
        body.classList.add('dialog-open');
        track('offering_opened', { offering_slug: slug });
        if (trigger.closest('[data-availability-state]')?.dataset.availabilityState === 'sold_out') {
            track('sold_out_opened', { offering_slug: slug });
        }
        history.replaceState(null, '', `${location.pathname}${location.search}#item-${slug}`);
    });
});

document.querySelectorAll('[data-offering-dialog]').forEach((dialog) => {
    const closeButton = dialog.querySelector('[data-dialog-close]');
    closeButton?.addEventListener('click', () => dialog.close());

    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });

    dialog.addEventListener('close', () => {
        dialog.querySelectorAll('video').forEach((video) => video.pause());
        body.classList.remove('dialog-open');
        const trigger = document.querySelector(`[data-offering-open="${CSS.escape(dialog.dataset.returnFocus || '')}"]`);
        trigger?.focus();
        if (location.hash.startsWith('#item-')) {
            history.replaceState(null, '', `${location.pathname}${location.search}`);
        }
    });
});

document.querySelectorAll('[data-offering-dialog] video').forEach((video) => {
    video.addEventListener('play', () => {
        const dialog = video.closest('[data-offering-dialog]');
        track('video_played', { offering_slug: dialog?.dataset.offeringDialog });
    }, { once: true });
});

document.querySelectorAll('[data-collection-link]').forEach((link) => {
    link.addEventListener('click', () => {
        document.querySelectorAll('[data-collection-link]').forEach((item) => item.classList.remove('is-active'));
        link.classList.add('is-active');
        track('collection_selected', { collection_slug: link.dataset.collectionLink });
    });
});

document.querySelectorAll('[data-external-action]').forEach((link) => {
    link.addEventListener('click', () => {
        track('external_action_clicked', { metadata: { action_label: link.dataset.externalAction } });
    });
});

const search = document.querySelector('[data-catalog-search]');
const searchEmpty = document.querySelector('[data-search-empty]');
const searchReset = document.querySelector('[data-search-reset]');
const searchClear = document.querySelector('[data-search-clear]');
const resultCount = document.querySelector('[data-result-count]');
let dietaryFilter = '';

function applySearch() {
    const term = (search?.value || '').trim().toLocaleLowerCase('id');
    let visibleCount = 0;

    document.querySelectorAll('[data-search-item]').forEach((item) => {
        const matchesTerm = !term || item.dataset.searchItem.includes(term);
        const dietary = item.dataset.dietary || '';
        const matchesDietary = !dietaryFilter
            || (dietaryFilter === 'milk-free' ? !dietary.includes('susu') : dietary.includes(dietaryFilter));
        const visible = matchesTerm && matchesDietary;
        item.hidden = !visible;
        if (visible) visibleCount += 1;
    });

    document.querySelectorAll('[data-collection]').forEach((section) => {
        section.hidden = !section.querySelector('[data-search-item]:not([hidden])');
    });

    if (searchEmpty) {
        searchEmpty.hidden = visibleCount > 0;
    }
    if (resultCount) {
        resultCount.textContent = `${visibleCount} menu ditemukan`;
    }

    return { term, visibleCount };
}

let searchTimer;
search?.addEventListener('input', () => {
    clearTimeout(searchTimer);
    const result = applySearch();
    searchTimer = setTimeout(() => {
        if (!result.term) return;
        track(result.visibleCount > 0 ? 'search_performed' : 'search_zero_result', {
            search_term: result.term,
            metadata: { result_count: result.visibleCount },
        });
    }, 450);
});

searchReset?.addEventListener('click', () => {
    if (!search) return;
    search.value = '';
    applySearch();
    search.focus();
});

searchClear?.addEventListener('click', () => {
    if (!search) return;
    search.value = '';
    applySearch();
    search.focus();
});

document.querySelectorAll('[data-dietary-filter]').forEach((button) => {
    button.addEventListener('click', () => {
        dietaryFilter = button.dataset.dietaryFilter || '';
        document.querySelectorAll('[data-dietary-filter]').forEach((item) => {
            item.classList.toggle('is-active', item === button);
        });
        applySearch();
    });
});

const requestedItem = location.hash.startsWith('#item-') ? location.hash.slice(6) : '';
if (requestedItem) {
    document.querySelector(`[data-offering-open="${CSS.escape(requestedItem)}"]`)?.click();
}

applySearch();
