import { API_URL } from '/src/main/js/config.js';

const getToken = () => localStorage.getItem('authorization');

const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
});

const getParams = () => {
    const params = new URLSearchParams(location.search);
    return { id: params.get('id'), name: params.get('name') };
};

const updateCollection = async (collectionId, nameCollection) => {
    const res = await fetch(`${API_URL}/collection`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ collectionId, nameCollection })
    });
    if (res.status === 401) { location.href = '/src/main/pages/login.html'; return null; }
    return res.json();
};

addEventListener('DOMContentLoaded', () => {
    const { id: collectionId, name: currentName } = getParams();
    if (!collectionId) { location.href = '/index.html'; return; }

    document.getElementById('collection-id').value = collectionId;
    if (currentName) {
        document.getElementById('collection-name').value = currentName;
        document.getElementById('breadcrumb-collection-name').textContent = currentName;
    }

    const errorEl = document.getElementById('edit-error');

    document.getElementById('form-edit-collection').addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameCollection = document.getElementById('collection-name').value.trim();
        if (!nameCollection) return;

        errorEl.hidden = true;
        const res = await updateCollection(collectionId, nameCollection);
        if (!res) return;

        if (res.message !== 'Coleção atualizada com sucesso!') {
            errorEl.textContent = res.message;
            errorEl.hidden = false;
            return;
        }

        location.href = '/index.html';
    });
});
