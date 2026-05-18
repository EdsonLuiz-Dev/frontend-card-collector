async function loadPartial(path, targetId) {
  const res = await fetch(path);
  const html = await res.text();
  document.getElementById(targetId).innerHTML = html;
}

async function initHeader() {
  await loadPartial('/src/partials/templates/header.html', 'site-header');

  document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.removeItem('authorization');
    window.location.href = '/src/main/pages/login.html';
  });
}

initHeader();
loadPartial('/src/partials/templates/footer.html', 'site-footer');
