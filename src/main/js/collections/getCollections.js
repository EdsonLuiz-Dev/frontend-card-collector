import { API_URL } from '../config.js';

const getToken = () => localStorage.getItem('authorization');

const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
});

const redirectIfUnauth = (status) => {
    if (status === 401) {
        window.location.href = 'login.html';
        return true;
    }
    return false;
};

const fetchCollections = async () => {
    const res = await fetch(`${API_URL}/collection`, {
        method: 'GET',
        headers: authHeaders()
    });
    if (redirectIfUnauth(res.status)) return null;
    const data = await res.json();
    return Array.isArray(data) ? data : [];
};

const createCollection = async (nameCollection) => {
    const res = await fetch(`${API_URL}/collection`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ nameCollection })
    });
    if (redirectIfUnauth(res.status)) return null;
    return res.json();
};

const renameCollection = async (collectionId, nameCollection) => {
    const res = await fetch(`${API_URL}/collection`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ collectionId, nameCollection })
    });
    if (redirectIfUnauth(res.status)) return null;
    return res.json();
};

const deleteCollection = async (collectionId) => {
    const res = await fetch(`${API_URL}/collection`, {
        method: 'DELETE',
        headers: authHeaders(),
        body: JSON.stringify({ collectionId })
    });
    if (redirectIfUnauth(res.status)) return null;
    return res.json();
};

const renderCollections = (collections) => {
    const list = document.getElementById('collection-list');
    const empty = document.getElementById('collections-empty');

    list.innerHTML = '';

    if (!collections || collections.length === 0) {
        empty.hidden = false;
        return;
    }

    empty.hidden = true;

    collections.forEach(col => {
        const li = document.createElement('li');
        li.className = 'collection-item';
        li.innerHTML = `
            <div class="collection-item-view">
                <a class="collection-item-name" href="collection-detail.html?id=${col._id}">${col.nameCollection}</a>
                <span class="collection-count">${col.cards.length} cards</span>
                <div class="collection-item-actions">
                    <button class="btn btn-secondary btn-rename-collection" data-id="${col._id}" data-name="${col.nameCollection}">Rename</button>
                    <button class="btn btn-danger btn-delete-collection" data-id="${col._id}">Delete</button>
                </div>
            </div>
            <form class="collection-item-edit" hidden>
                <input type="text" class="edit-name-input" value="${col.nameCollection}" required />
                <div class="collection-item-actions">
                    <button class="btn btn-primary btn-save-rename" type="submit">Save</button>
                    <button class="btn btn-secondary btn-cancel-rename" type="button">Cancel</button>
                </div>
                <div class="rename-error form-error" hidden></div>
            </form>
        `;
        list.appendChild(li);

        const viewEl = li.querySelector('.collection-item-view');
        const editEl = li.querySelector('.collection-item-edit');
        const nameInput = li.querySelector('.edit-name-input');
        const renameError = li.querySelector('.rename-error');

        li.querySelector('.btn-rename-collection').addEventListener('click', () => {
            viewEl.hidden = true;
            editEl.hidden = false;
            nameInput.focus();
            nameInput.select();
        });

        li.querySelector('.btn-cancel-rename').addEventListener('click', () => {
            editEl.hidden = true;
            viewEl.hidden = false;
            renameError.hidden = true;
        });

        editEl.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newName = nameInput.value.trim();
            if (!newName) return;

            renameError.hidden = true;
            const saveBtn = editEl.querySelector('.btn-save-rename');
            saveBtn.disabled = true;

            const res = await renameCollection(col._id, newName);
            saveBtn.disabled = false;

            if (!res || res.message !== 'Coleção atualizada com sucesso!') {
                renameError.textContent = res?.message || 'Erro ao renomear.';
                renameError.hidden = false;
                return;
            }

            const updated = await fetchCollections();
            if (updated !== null) renderCollections(updated);
        });

        li.querySelector('.btn-delete-collection').addEventListener('click', async () => {
            await deleteCollection(col._id);
            const updated = await fetchCollections();
            if (updated !== null) renderCollections(updated);
        });
    });
};

addEventListener('DOMContentLoaded', async () => {
    const collections = await fetchCollections();
    if (collections === null) return;
    renderCollections(collections);

    const form = document.getElementById('form-create-collection');
    const errorEl = document.getElementById('create-error');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameCollection = document.getElementById('collection-name').value.trim();
        if (!nameCollection) return;

        errorEl.hidden = true;
        const res = await createCollection(nameCollection);
        if (!res) return;

        if (res.message && res.message !== 'Coleção criada com sucesso!') {
            errorEl.textContent = res.message;
            errorEl.hidden = false;
            return;
        }

        form.reset();
        const updated = await fetchCollections();
        if (updated !== null) renderCollections(updated);
    });
});
