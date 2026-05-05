async function loadPartial(path, targetId) {
  const res = await fetch(path);
  const html = await res.text();
  document.getElementById(targetId).innerHTML = html;
}

loadPartial('/src/partials/templates/header.html', 'site-header');
loadPartial('/src/partials/templates/footer.html', 'site-footer');
