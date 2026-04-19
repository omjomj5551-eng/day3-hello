import { INSTAGRAM_URL, ARTWORKS, FAQ_ITEMS } from './config.js';
import { renderArtworks, renderFaq } from './render.js';

function isAllowedHttpUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
}

export function applyInstagramLinks(url, root = document) {
  if (!isAllowedHttpUrl(url)) return;

  const anchors = root.querySelectorAll('[data-instagram-link]');

  for (const anchor of anchors) {
    anchor.setAttribute('href', url);
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('rel', 'noopener noreferrer');
  }
}

if (typeof document !== 'undefined') {
  applyInstagramLinks(INSTAGRAM_URL);
  renderArtworks(ARTWORKS);
  renderFaq(FAQ_ITEMS);
}
