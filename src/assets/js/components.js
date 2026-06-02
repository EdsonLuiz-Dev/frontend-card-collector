async function loadPartial(path, targetId) {
  const res = await fetch(path);
  const html = await res.text();
  document.getElementById(targetId).innerHTML = html;
}

async function initHeader() {
  await loadPartial('/src/partials/templates/header.html', 'site-header');

  const isAuthPage = window.location.pathname.includes('login') || window.location.pathname.includes('register');
  const btnLogout = document.getElementById('btn-logout');

  if (isAuthPage) {
    btnLogout.style.display = 'none';

    const navLinks = document.querySelector('.nav-links');
    if (navLinks) navLinks.style.display = 'none';
  } else {
    btnLogout.addEventListener('click', () => {
      localStorage.removeItem('authorization');
      window.location.href = '/src/main/pages/login.html';
    });
  }
}

initHeader();
loadPartial('/src/partials/templates/footer.html', 'site-footer');
