import { existsSync, readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

describe('content and accessibility', () => {
  const html = readFileSync('index.html', 'utf-8');

  it('includes Korean conversion copy and accessible landmarks', () => {
    const normalizedText = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    expect(html).toContain('lang="ko"');
    expect(html).toContain('<main id="main-content">');
    expect(html).toContain('class="skip-link" href="#main-content"');
    expect(html).toContain('id="hero"');
    expect(html).toContain('id="gallery"');
    expect(html).toContain('id="policy"');
    expect(html).toContain('id="faq"');
    expect(html).toContain('aria-label="주요 내비게이션"');
    expect(normalizedText).toContain('감성적 AI 아트');
    expect(normalizedText).toContain('라이선스를 개별 협의');
    expect(html).toContain('작품 문의하기 (Instagram DM)');
    expect((html.match(/data-instagram-link/g) || []).length).toBeGreaterThanOrEqual(3);
  });

  it('loads external stylesheet and keeps motion/focus safeguards', () => {
    expect(html).toContain('<link rel="stylesheet" href="./styles.css" />');
    expect(existsSync('styles.css')).toBe(true);

    const css = existsSync('styles.css') ? readFileSync('styles.css', 'utf-8') : '';
    expect(css).toContain(':focus-visible');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('.floating-cta');
    expect(css).toContain('.cta-primary');
  });
});
