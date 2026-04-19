import { describe, it, expect } from 'vitest';
import { applyInstagramLinks } from '../scripts/main.js';

function createAnchor() {
  const attrs = new Map([['href', '#']]);

  return {
    setAttribute(name, value) {
      attrs.set(name, value);
    },
    getAttribute(name) {
      return attrs.get(name) ?? null;
    }
  };
}

describe('instagram links', () => {
  it('applies instagram URL and safe target attrs to all CTA anchors', () => {
    const anchors = [createAnchor(), createAnchor(), createAnchor()];
    const root = {
      querySelectorAll(selector) {
        return selector === '[data-instagram-link]' ? anchors : [];
      }
    };

    applyInstagramLinks('https://instagram.com/example_artist', root);

    expect(anchors).toHaveLength(3);
    for (const anchor of anchors) {
      expect(anchor.getAttribute('href')).toBe('https://instagram.com/example_artist');
      expect(anchor.getAttribute('target')).toBe('_blank');
      expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
    }
  });

  it('ignores non-http protocols and leaves existing href untouched', () => {
    const anchors = [createAnchor(), createAnchor()];
    const root = {
      querySelectorAll(selector) {
        return selector === '[data-instagram-link]' ? anchors : [];
      }
    };

    applyInstagramLinks('javascript:alert(1)', root);

    for (const anchor of anchors) {
      expect(anchor.getAttribute('href')).toBe('#');
      expect(anchor.getAttribute('target')).toBe(null);
      expect(anchor.getAttribute('rel')).toBe(null);
    }
  });
});
