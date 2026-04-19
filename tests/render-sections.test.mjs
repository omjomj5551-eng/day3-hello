import { describe, it, expect } from 'vitest';
import { renderArtworks, renderFaq } from '../scripts/render.js';

function createContainer() {
  return { innerHTML: '' };
}

describe('section renderers', () => {
  it('renders artwork cards and faq items', () => {
    const artworkGrid = createContainer();
    const faqList = createContainer();
    const root = {
      querySelector(selector) {
        if (selector === '#artwork-grid') return artworkGrid;
        if (selector === '#faq-list') return faqList;
        return null;
      }
    };

    const artworks = [
      { title: '네온 시티', imageUrl: './assets/neon.webp', alt: '네온 도시 풍경' },
      { title: '고요한 숲', imageUrl: './assets/forest.webp', alt: '고요한 숲 풍경' }
    ];

    const faqItems = [{ q: '상업 사용 가능한가요?', a: '작품별 개별 협의합니다.' }];

    renderArtworks(artworks, root);
    renderFaq(faqItems, root);

    expect((artworkGrid.innerHTML.match(/artwork-card/g) || []).length).toBe(2);
    expect(artworkGrid.innerHTML).toContain('loading="lazy"');
    expect(artworkGrid.innerHTML).toContain('네온 시티');
    expect(faqList.innerHTML).toContain('상업 사용 가능한가요?');
    expect((faqList.innerHTML.match(/class="faq-item"/g) || []).length).toBe(1);
  });

  it('escapes untrusted values to prevent scriptable HTML injection', () => {
    const artworkGrid = createContainer();
    const faqList = createContainer();
    const root = {
      querySelector(selector) {
        if (selector === '#artwork-grid') return artworkGrid;
        if (selector === '#faq-list') return faqList;
        return null;
      }
    };

    renderArtworks(
      [
        {
          title: '<img src=x onerror=alert(1)>',
          imageUrl: 'x" onerror="alert(2)',
          alt: '<script>alert(3)</script>'
        }
      ],
      root
    );

    renderFaq([{ q: '<svg onload=alert(4)>', a: '<a href="javascript:alert(5)">x</a>' }], root);

    expect(artworkGrid.innerHTML).not.toContain('<script>');
    expect(artworkGrid.innerHTML).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(artworkGrid.innerHTML).toContain('x&quot; onerror=&quot;alert(2)');
    expect(faqList.innerHTML).toContain('&lt;svg onload=alert(4)&gt;');
    expect(faqList.innerHTML).toContain('&lt;a href=&quot;javascript:alert(5)&quot;&gt;x&lt;/a&gt;');
  });
});
