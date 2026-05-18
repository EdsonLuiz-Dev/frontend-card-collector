import { API_URL } from '/src/main/js/config.js';

const getToken = () => localStorage.getItem('authorization');

const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
});

const getCollectionId = () => new URLSearchParams(location.search).get('id');

const fetchCollection = async (collectionId) => {
    const res = await fetch(`${API_URL}/collection`, { headers: authHeaders() });
    if (res.status === 401) { location.href = '/src/main/pages/login.html'; return null; }
    const data = await res.json();
    if (!Array.isArray(data)) return null;
    return data.find(c => c._id === collectionId) || null;
};

const fetchCardSets = async (name) => {
    const res = await fetch(`${API_URL}/collection/card/add/${encodeURIComponent(name)}`, {
        headers: authHeaders()
    });
    if (!res.ok) return null;
    return res.json();
};

const deleteCard = async (collectionId, cardId, set) => {
    const res = await fetch(`${API_URL}/collection/card`, {
        method: 'DELETE',
        headers: authHeaders(),
        body: JSON.stringify({ collectionId, cardId, set })
    });
    return res.json();
};

const updateCard = async (collectionId, cardId, set, qtd) => {
    const res = await fetch(`${API_URL}/collection/card`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ collectionId, cardId, set, qtd })
    });
    return res.json();
};

const renderCards = (collection) => {
    const collectionId = collection._id;
    const cards = collection.cards;

    document.getElementById('collection-name').textContent = collection.nameCollection;
    document.getElementById('breadcrumb-collection-name').textContent = collection.nameCollection;
    document.getElementById('card-count').textContent = cards.length;
    document.getElementById('btn-add-card').href = `/src/main/pages/add-card.html?id=${collectionId}`;
    document.getElementById('btn-edit-collection').href = `/src/main/pages/edit-collection.html?id=${collectionId}&name=${encodeURIComponent(collection.nameCollection)}`;

    const list = document.getElementById('card-list');
    const empty = document.getElementById('cards-empty');
    list.innerHTML = '';

    if (!cards || cards.length === 0) {
        empty.hidden = false;
        return;
    }
    empty.hidden = true;

    cards.forEach(card => {
        const li = document.createElement('li');
        li.className = 'card-item';
        li.innerHTML = `
            <div class="card-image"><img src="${card.image}" alt="${card.name}" /></div>
            <div class="card-info">
                <h3 class="card-name">${card.name}</h3>
                <p class="card-set">Set: <span class="card-set-name">${card.setName || ''}</span> (<span class="card-set-code">${card.set}</span>)</p>
            </div>
            <div class="card-edit-form">
                <div class="form-group">
                    <label>Set</label>
                    <select class="edit-set-select"><option disabled selected>Loading…</option></select>
                </div>
                <div class="form-group">
                    <label>Qty</label>
                    <input type="number" class="edit-qty-input" min="1" value="${card.qtd || 1}" />
                </div>
                <div class="card-edit-actions">
                    <button class="btn btn-primary btn-save-edit" type="button" disabled>Save</button>
                    <button class="btn btn-danger btn-remove-card" type="button">Remove</button>
                </div>
                <div class="edit-error form-error" hidden></div>
            </div>
        `;
        list.appendChild(li);

        const setSelect = li.querySelector('.edit-set-select');
        const qtyInput = li.querySelector('.edit-qty-input');
        const saveBtn = li.querySelector('.btn-save-edit');
        const editError = li.querySelector('.edit-error');

        // Busca os sets e popula o select
        fetchCardSets(card.name).then(data => {
            setSelect.innerHTML = '';
            if (!data) {
                const opt = document.createElement('option');
                opt.textContent = `${card.setName || card.set} (${card.set})`;
                opt.value = card.set;
                setSelect.appendChild(opt);
            } else {
                data.sets.forEach(s => {
                    const opt = document.createElement('option');
                    opt.value = s.set;
                    opt.textContent = `${s.set_name} (${s.set})`;
                    if (s.set === card.set) opt.selected = true;
                    setSelect.appendChild(opt);
                });
            }
            saveBtn.disabled = false;
        });

        saveBtn.addEventListener('click', async () => {
            const newSet = setSelect.value;
            const newQty = parseInt(qtyInput.value, 10) || 1;

            editError.hidden = true;
            saveBtn.disabled = true;

            const res = await updateCard(collectionId, card._id, newSet, newQty);
            saveBtn.disabled = false;

            if (res.message !== 'Carta atualizada com sucesso!') {
                editError.textContent = res.message;
                editError.hidden = false;
                return;
            }

            init();
        });

        li.querySelector('.btn-remove-card').addEventListener('click', async () => {
            await deleteCard(collectionId, card._id, card.set);
            init();
        });
    });
};

const init = async () => {
    const collectionId = getCollectionId();
    if (!collectionId) { location.href = '/index.html'; return; }
    const collection = await fetchCollection(collectionId);
    if (!collection) { location.href = '/index.html'; return; }
    renderCards(collection);
};

addEventListener('DOMContentLoaded', init);
