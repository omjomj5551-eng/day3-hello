function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function renderArtworks(artworks, root = document) {
  const grid = root.querySelector('#artwork-grid');
  if (!grid) return;

  grid.innerHTML = artworks
    .map(
      (item) => `
      <article class="artwork-card gallery-card">
        <img class="artwork-image" src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.alt)}" loading="lazy" />
        <h3 class="artwork-title">${escapeHtml(item.title)}</h3>
      </article>
    `
    )
    .join('');
}

export function renderFaq(items, root = document) {
  const faqList = root.querySelector('#faq-list');
  if (!faqList) return;

  faqList.innerHTML = items
    .map(
      (item) => `
      <details class="faq-item">
        <summary class="faq-question">${escapeHtml(item.q)}</summary>
        <p class="faq-answer">${escapeHtml(item.a)}</p>
      </details>
    `
    )
    .join('');
}
