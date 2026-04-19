# AI Art DM 판매 원페이지 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** AI 이미지 디지털 작품을 소개하고 방문자를 인스타그램 DM 문의로 전환하는 정적 원페이지를 구현한다.

**Architecture:** `index.html`은 섹션 골격과 접근성 마크업을 담당하고, `scripts/config.js`는 작품/FAQ/인스타 URL 단일 설정을 담당한다. `scripts/render.js`는 작품 카드와 FAQ를 DOM에 렌더링하며, `scripts/main.js`는 CTA 링크 주입과 렌더링 초기화를 수행한다. 테스트는 Vitest+JSDOM으로 CTA 링크 주입, 섹션 렌더링, 핵심 카피/접근성 스모크를 검증한다.

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript(ES Modules), Node.js, Vitest, JSDOM

---

## 파일 구조 및 책임

- Create: `package.json` — 테스트/실행 스크립트와 의존성 정의
- Modify: `index.html` — 원페이지 섹션 구조, CTA 버튼, 스크립트/스타일 연결
- Create: `styles.css` — 모바일 우선 레이아웃, CTA/카드 스타일
- Create: `scripts/config.js` — `INSTAGRAM_URL`, `ARTWORKS`, `FAQ_ITEMS` 단일 데이터 소스
- Create: `scripts/render.js` — `renderArtworks`, `renderFaq` 렌더 함수
- Create: `scripts/main.js` — `applyInstagramLinks`, 앱 초기화
- Create: `tests/site-structure.test.mjs` — 섹션 구조 및 CTA 존재 검증
- Create: `tests/instagram-links.test.mjs` — CTA 링크 주입 검증
- Create: `tests/render-sections.test.mjs` — 작품/FAQ 렌더링 검증
- Create: `tests/content-accessibility.test.mjs` — 핵심 카피/이미지 속성/링크 보안 속성 검증

### Task 1: 페이지 골격과 테스트 환경 준비

**Files:**
- Create: `package.json`
- Modify: `index.html`
- Test: `tests/site-structure.test.mjs`

- [ ] **Step 1: 실패하는 구조 테스트 작성**

```js
// tests/site-structure.test.mjs
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
```

- [ ] **Step 2: 테스트 실행 후 실패 확인**

Run: `npm run test -- tests/site-structure.test.mjs`
Expected: FAIL with section id 또는 `data-instagram-link` 누락 메시지

- [ ] **Step 3: 최소 구현으로 테스트 통과**

```json
// package.json
{
  "name": "ai-art-dm-sales",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "serve": "python -m http.server 4173"
  },
  "devDependencies": {
    "vitest": "^3.2.4"
  }
}
```

```html
<!-- index.html -->
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Art Store</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <main>
      <section id="hero">
        <h1>감성적 AI 아트, 당신의 공간과 브랜드를 위한 디지털 작품</h1>
        <a data-instagram-link href="#">작품 문의하기 (Instagram DM)</a>
      </section>
      <section id="gallery"><div id="artwork-grid"></div></section>
      <section id="policy">
        <p>모든 작품은 사용 목적에 따라 라이선스를 개별 협의합니다.</p>
        <a data-instagram-link href="#">작품 문의하기 (Instagram DM)</a>
      </section>
      <section id="faq"><div id="faq-list"></div></section>
      <footer>
        <a data-instagram-link href="#">작품 문의하기 (Instagram DM)</a>
      </footer>
    </main>
    <script type="module" src="./scripts/main.js"></script>
  </body>
</html>
```

- [ ] **Step 4: 테스트 재실행 후 통과 확인**

Run: `npm install && npm run test -- tests/site-structure.test.mjs`
Expected: PASS (1 file, 1 test passed)

- [ ] **Step 5: 커밋**

```bash
git add package.json index.html tests/site-structure.test.mjs
git commit -m "feat: add one-page structure and base test"
```

### Task 2: 인스타그램 링크 단일 설정 및 CTA 주입

**Files:**
- Create: `scripts/config.js`
- Create: `scripts/main.js`
- Test: `tests/instagram-links.test.mjs`
- Modify: `index.html`

- [ ] **Step 1: 실패하는 CTA 링크 주입 테스트 작성**

```js
// tests/instagram-links.test.mjs
import { describe, it, expect } from 'vitest';
import { applyInstagramLinks } from '../scripts/main.js';

describe('instagram links', () => {
  it('applies instagram URL and safe target attrs to all CTA anchors', () => {
    document.body.innerHTML = `
      <a data-instagram-link href="#">A</a>
      <a data-instagram-link href="#">B</a>
      <a data-instagram-link href="#">C</a>
    `;

    applyInstagramLinks('https://instagram.com/example_artist');

    const anchors = [...document.querySelectorAll('[data-instagram-link]')];
    expect(anchors).toHaveLength(3);
    for (const a of anchors) {
      expect(a.getAttribute('href')).toBe('https://instagram.com/example_artist');
      expect(a.getAttribute('target')).toBe('_blank');
      expect(a.getAttribute('rel')).toBe('noopener noreferrer');
    }
  });
});
```

- [ ] **Step 2: 테스트 실행 후 실패 확인**

Run: `npm run test -- tests/instagram-links.test.mjs`
Expected: FAIL with `applyInstagramLinks is not a function` 또는 import error

- [ ] **Step 3: 최소 구현 작성**

```js
// scripts/config.js
export const INSTAGRAM_URL = 'https://instagram.com/example_artist';
```

```js
// scripts/main.js
import { INSTAGRAM_URL } from './config.js';

export function applyInstagramLinks(url, root = document) {
  const anchors = root.querySelectorAll('[data-instagram-link]');
  for (const a of anchors) {
    a.setAttribute('href', url);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  }
}

if (typeof document !== 'undefined') {
  applyInstagramLinks(INSTAGRAM_URL);
}
```

```html
<!-- index.html head 내부 -->
<meta name="description" content="AI 이미지 디지털 작품 문의 판매 페이지" />
```

- [ ] **Step 4: 테스트 재실행 후 통과 확인**

Run: `npm run test -- tests/instagram-links.test.mjs`
Expected: PASS (CTA 링크 3개 모두 동일 URL/속성 적용)

- [ ] **Step 5: 커밋**

```bash
git add scripts/config.js scripts/main.js tests/instagram-links.test.mjs index.html
git commit -m "feat: centralize instagram link and apply CTA bindings"
```

### Task 3: 작품/FAQ 렌더링 함수 구현

**Files:**
- Create: `scripts/render.js`
- Modify: `scripts/config.js`
- Modify: `scripts/main.js`
- Test: `tests/render-sections.test.mjs`

- [ ] **Step 1: 실패하는 렌더링 테스트 작성**

```js
// tests/render-sections.test.mjs
import { describe, it, expect } from 'vitest';
import { renderArtworks, renderFaq } from '../scripts/render.js';

describe('section renderers', () => {
  it('renders artwork cards and faq items', () => {
    document.body.innerHTML = `
      <div id="artwork-grid"></div>
      <div id="faq-list"></div>
    `;

    const artworks = [
      { title: 'Neon City', imageUrl: './assets/neon.webp', alt: '네온 도시 풍경' },
      { title: 'Silent Forest', imageUrl: './assets/forest.webp', alt: '고요한 숲 풍경' }
    ];

    const faqItems = [
      { q: '상업 사용 가능한가요?', a: '작품별 개별 협의합니다.' }
    ];

    renderArtworks(artworks);
    renderFaq(faqItems);

    expect(document.querySelectorAll('.artwork-card')).toHaveLength(2);
    expect(document.querySelector('#faq-list')?.textContent).toContain('상업 사용 가능한가요?');
  });
});
```

- [ ] **Step 2: 테스트 실행 후 실패 확인**

Run: `npm run test -- tests/render-sections.test.mjs`
Expected: FAIL with missing export or empty renderer output

- [ ] **Step 3: 최소 구현 작성**

```js
// scripts/config.js
export const INSTAGRAM_URL = 'https://instagram.com/example_artist';

export const ARTWORKS = [
  { title: 'Neon City', imageUrl: './assets/neon.webp', alt: '네온 도시 풍경' },
  { title: 'Silent Forest', imageUrl: './assets/forest.webp', alt: '고요한 숲 풍경' },
  { title: 'Blue Dawn', imageUrl: './assets/dawn.webp', alt: '푸른 새벽 풍경' },
  { title: 'Aurora Dream', imageUrl: './assets/aurora.webp', alt: '오로라 추상 아트' },
  { title: 'Golden Hour', imageUrl: './assets/golden.webp', alt: '골든아워 풍경' },
  { title: 'Monochrome Mood', imageUrl: './assets/mono.webp', alt: '모노크롬 무드 아트' }
];

export const FAQ_ITEMS = [
  { q: '상업 사용 가능한가요?', a: '모든 작품은 사용 목적에 따라 라이선스를 개별 협의합니다.' },
  { q: '수정 요청 가능한가요?', a: '작품별로 가능한 범위를 안내해 드립니다.' },
  { q: '전달까지 얼마나 걸리나요?', a: '협의 후 보통 24~72시간 내 전달합니다.' }
];
```

```js
// scripts/render.js
export function renderArtworks(artworks, root = document) {
  const grid = root.querySelector('#artwork-grid');
  if (!grid) return;

  grid.innerHTML = artworks
    .map(
      (item) => `
      <article class="artwork-card">
        <img src="${item.imageUrl}" alt="${item.alt}" loading="lazy" />
        <h3>${item.title}</h3>
      </article>
    `
    )
    .join('');
}

export function renderFaq(items, root = document) {
  const faq = root.querySelector('#faq-list');
  if (!faq) return;

  faq.innerHTML = items
    .map(
      (item) => `
      <details class="faq-item">
        <summary>${item.q}</summary>
        <p>${item.a}</p>
      </details>
    `
    )
    .join('');
}
```

```js
// scripts/main.js
import { INSTAGRAM_URL, ARTWORKS, FAQ_ITEMS } from './config.js';
import { renderArtworks, renderFaq } from './render.js';

export function applyInstagramLinks(url, root = document) {
  const anchors = root.querySelectorAll('[data-instagram-link]');
  for (const a of anchors) {
    a.setAttribute('href', url);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  }
}

if (typeof document !== 'undefined') {
  applyInstagramLinks(INSTAGRAM_URL);
  renderArtworks(ARTWORKS);
  renderFaq(FAQ_ITEMS);
}
```

- [ ] **Step 4: 테스트 재실행 후 통과 확인**

Run: `npm run test -- tests/render-sections.test.mjs`
Expected: PASS (작품 카드 2개/FAQ 텍스트 렌더)

- [ ] **Step 5: 커밋**

```bash
git add scripts/config.js scripts/render.js scripts/main.js tests/render-sections.test.mjs
git commit -m "feat: render artwork grid and faq from config"
```

### Task 4: 전환 중심 카피/스타일 반영 및 회귀 검증

**Files:**
- Modify: `index.html`
- Create: `styles.css`
- Test: `tests/content-accessibility.test.mjs`

- [ ] **Step 1: 실패하는 카피/접근성 테스트 작성**

```js
// tests/content-accessibility.test.mjs
import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

describe('content and accessibility', () => {
  const html = readFileSync('index.html', 'utf-8');

  it('contains conversion copy and policy text', () => {
    expect(html).toContain('작품 문의하기 (Instagram DM)');
    expect(html).toContain('라이선스를 개별 협의');
    expect(html).toContain('감성적 AI 아트');
  });

  it('has lazy-loading images and safe external link attrs from script behavior', () => {
    expect(html).toContain('id="artwork-grid"');
    expect(html).toContain('id="faq-list"');
  });
});
```

- [ ] **Step 2: 테스트 실행 후 실패 확인**

Run: `npm run test -- tests/content-accessibility.test.mjs`
Expected: FAIL with missing copy text assertions

- [ ] **Step 3: 최소 구현 작성**

```html
<!-- index.html 주요 본문 구조 -->
<main class="container">
  <section id="hero" class="section hero">
    <p class="kicker">AI Digital Art</p>
    <h1>감성적 AI 아트, 당신의 공간과 브랜드를 위한 디지털 작품</h1>
    <p class="lead">디지털 파일로 전달되며, 라이선스는 작품별로 개별 협의합니다.</p>
    <a class="cta" data-instagram-link href="#">작품 문의하기 (Instagram DM)</a>
  </section>

  <section id="gallery" class="section">
    <h2>대표 작품</h2>
    <div id="artwork-grid" class="grid"></div>
  </section>

  <section id="policy" class="section">
    <h2>구매 및 라이선스 안내</h2>
    <p>디지털 파일을 제공하며, 모든 작품은 사용 목적에 따라 라이선스를 개별 협의합니다.</p>
    <a class="cta" data-instagram-link href="#">작품 문의하기 (Instagram DM)</a>
  </section>

  <section id="faq" class="section">
    <h2>자주 묻는 질문</h2>
    <div id="faq-list"></div>
  </section>
</main>
<footer class="footer-cta">
  <a class="cta" data-instagram-link href="#">작품 문의하기 (Instagram DM)</a>
</footer>
```

```css
/* styles.css */
:root {
  --bg: #0f1115;
  --card: #181c23;
  --text: #f3f5f7;
  --muted: #b8bec8;
  --accent: #7c5cff;
}

* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: Inter, Pretendard, system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
}

.container { width: min(1080px, 92%); margin: 0 auto; }
.section { padding: 48px 0; }
.hero { padding-top: 72px; }
.kicker { color: var(--muted); margin: 0 0 8px; }
.lead { color: var(--muted); }

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.artwork-card {
  background: var(--card);
  border-radius: 14px;
  overflow: hidden;
}

.artwork-card img {
  width: 100%;
  display: block;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.cta {
  display: inline-block;
  margin-top: 16px;
  padding: 12px 18px;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  text-decoration: none;
  font-weight: 600;
}

.footer-cta {
  position: sticky;
  bottom: 0;
  padding: 14px;
  background: rgba(15, 17, 21, 0.92);
  backdrop-filter: blur(8px);
  text-align: center;
}

@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
```

- [ ] **Step 4: 전체 테스트 및 수동 검증 실행**

Run: `npm run test`
Expected: PASS (all test files passed)

Run: `npm run serve`
Expected: `Serving HTTP on 0.0.0.0 port 4173` 출력 후 브라우저에서 `http://localhost:4173` 확인 가능

수동 검증 체크:
- 상단/중단/하단 CTA 모두 인스타그램으로 이동
- 모바일 폭에서 CTA 탭 영역이 충분함
- 갤러리/FAQ가 정상 렌더됨

- [ ] **Step 5: 커밋**

```bash
git add index.html styles.css tests/content-accessibility.test.mjs
git commit -m "feat: add conversion-focused copy and responsive styling"
```

## 스펙 대비 자체 점검

1. **Spec coverage**
- IA(히어로/갤러리/정책/FAQ/하단 CTA): Task 1, Task 4
- 문의 전환(CTA 반복, DM 유도): Task 1, Task 2, Task 4
- 라이선스 개별 협의 문구: Task 4
- 정적 데이터 기반 렌더링(작품/FAQ): Task 3
- 성능/접근성(지연 로딩, 모바일 우선): Task 3, Task 4
- 테스트 전략(자동+수동): Task 1~4 Step 4

2. **Placeholder scan**
- `TBD`, `TODO`, 모호한 지시문 없음

3. **Type consistency**
- `applyInstagramLinks`, `renderArtworks`, `renderFaq` 함수명 전 Task 일관성 확인
- `ARTWORKS`, `FAQ_ITEMS`, `INSTAGRAM_URL` 상수명 일관성 확인
