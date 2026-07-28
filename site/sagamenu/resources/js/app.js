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
    });
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

function applySearch() {
    const term = (search?.value || '').trim().toLocaleLowerCase('id');
    let visibleCount = 0;

    document.querySelectorAll('[data-search-item]').forEach((item) => {
        const visible = !term || item.dataset.searchItem.includes(term);
        item.hidden = !visible;
        if (visible) visibleCount += 1;
    });

    document.querySelectorAll('[data-collection]').forEach((section) => {
        section.hidden = !section.querySelector('[data-search-item]:not([hidden])');
    });

    if (searchEmpty) {
        searchEmpty.hidden = visibleCount > 0;
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
