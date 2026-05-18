import { API_URL } from '/src/main/js/config.js';

const getToken = () => localStorage.getItem('authorization');

const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
});

const getCollectionId = () => new URLSearchParams(location.search).get('id');

const searchCard = async (name) => {
    const res = await fetch(`${API_URL}/collection/card/add/${encodeURIComponent(name)}`, {
        headers: authHeaders()
    });
    if (res.status === 401) { location.href = '/src/main/pages/login.html'; return null; }
    if (!res.ok) return null;
    return res.json();
};

const addCard = async (name, set, qtd, collectionId) => {
    const res = await fetch(`${API_URL}/collection/card/add/${encodeURIComponent(name)}`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ set, qtd, collectionId })
    });
    if (res.status === 401) { location.href = '/src/main/pages/login.html'; return null; }
    return res.json();
};

const fetchSuggestions = async (query) => {
    if (query.length < 2) return [];
    try {
        const res = await fetch(`https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(query)}`);
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
    } catch {
        return [];
    }
};

const showToast = (message) => {
    const toast = document.getElementById('toast-success');
    toast.textContent = message;
    toast.hidden = false;
    setTimeout(() => { toast.hidden = true; }, 3000);
};

addEventListener('DOMContentLoaded', () => {
    const collectionId = getCollectionId();
    if (!collectionId) { location.href = '/index.html'; return; }

    document.getElementById('breadcrumb-collection-link').href = `/src/main/pages/collection-detail.html?id=${collectionId}`;
    document.getElementById('btn-back-to-collection').href = `/src/main/pages/collection-detail.html?id=${collectionId}`;
    document.getElementById('back-action').hidden = false;
    document.getElementById('add-collection-id').value = collectionId;

    const sectionSearch = document.getElementById('section-search');
    const sectionResult = document.getElementById('section-card-result');
    const searchError = document.getElementById('search-error');
    const addError = document.getElementById('add-error');
    const datalist = document.getElementById('card-suggestions');
    const cardNameInput = document.getElementById('card-name');

    // Autocomplete com debounce
    let debounceTimer;
    cardNameInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            const suggestions = await fetchSuggestions(cardNameInput.value.trim());
            datalist.innerHTML = '';
            suggestions.forEach(name => {
                const opt = document.createElement('option');
                opt.value = name;
                datalist.appendChild(opt);
            });
        }, 300);
    });

    document.getElementById('form-search-card').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = cardNameInput.value.trim();
        if (!name) return;

        searchError.hidden = true;
        const card = await searchCard(name);

        if (!card) {
            searchError.textContent = 'Card not found.';
            searchError.hidden = false;
            return;
        }

        document.getElementById('preview-name').textContent = card.name;
        document.getElementById('preview-image').src = card.image;
        document.getElementById('preview-image').alt = card.name;
        document.getElementById('add-card-name').value = card.name;

        const select = document.getElementById('card-set');
        select.innerHTML = '';
        card.sets.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.set;
            opt.textContent = `${s.set_name}`;
            select.appendChild(opt);
        });

        sectionResult.hidden = false;
    });

    document.getElementById('form-add-card').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('add-card-name').value;
        const set = document.getElementById('card-set').value;
        const qtd = parseInt(document.getElementById('card-qty').value, 10) || 1;

        addError.hidden = true;
        const res = await addCard(name, set, qtd, collectionId);
        if (!res) return;

        if (res.message !== 'Carta adicionada com sucesso!') {
            addError.textContent = res.message;
            addError.hidden = false;
            return;
        }

        showToast(`✓ ${name} added to collection!`);
        sectionResult.hidden = true;
        document.getElementById('form-search-card').reset();
        datalist.innerHTML = '';
        cardNameInput.focus();
    });
});
