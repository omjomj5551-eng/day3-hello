import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

describe('site structure', () => {
  const html = readFileSync('index.html', 'utf-8');

  it('contains required sections and CTA anchors', () => {
    expect(html).toContain('id="hero"');
    expect(html).toContain('id="gallery"');
    expect(html).toContain('id="policy"');
    expect(html).toContain('id="faq"');
    expect((html.match(/data-instagram-link/g) || []).length).toBeGreaterThanOrEqual(3);
  });
});
