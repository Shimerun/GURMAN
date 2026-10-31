<project_context>
Stack: React 18 + Vite (JavaScript, JSX), react-router-dom 7, Tailwind CSS 3.4 + DaisyUI 4, Zustand (persist), lucide-react, react-hot-toast, vite-plugin-pwa.
Goal: Frontend MVP for "GURMAN", a fictional supermarket chain operating only in Zhytomyr (`Житомир`, single city, no delivery): promo-first homepage, catalog, product pages, cart, stores. All brand assets and copy are original; never imitate a real retailer.
Business facts (owner decision, 2026-10-30): two stores — вул. Михайла Грушевського, 62 and вул. Гагаріна, 13/67 — both daily 07:00–22:00 (`src/data/mockStores.json`, `STORE_CONTACTS.storeHours`). UI copy must NOT mention delivery, round-the-clock stores or bread "from 5:00" (bread is simply "щоранку"). There is no checkout: the cart is a shopping list the visitor sends to themselves (`ShareListButton`: Web Share API; without it — plain http, desktop, messenger in-app browsers — Viber/Telegram links and copy) or prints (`PrintListButton` → `printShoppingList` sets `html[data-print]`, and print CSS swaps the page for `PrintableShoppingList`; browsers that ignore `window.print()` get a toast). Web Share and the Clipboard API need HTTPS or localhost: a phone opening the dev server by LAN IP only gets the fallbacks.
Data: mock JSON in `src/data/`, served only through `src/services/*Service.js`. Swapping services for a real API must require ZERO component changes. `productService` loads the catalog JSON lazily (`import()`, its own chunk, parallel with the simulated latency), so product data never sits in the entry bundle (guarded by `tests/e2e/performance.spec.js`).
Business content: contacts, socials, payment methods, seller details (`LEGAL_ENTITY`), company facts/history and content switches live ONLY in `src/config/business.js` (re-exported via `src/lib/constants.js`); values marked `DEMO` are placeholders. `IS_DEMO_CONTENT = true` shows the "fictional brand" footer note, the privacy-template notice and the invented product ratings (`FEATURES.productRatings`); set it to false for a real launch. `ANALYTICS.scriptSrc` (Plausible, off while null) and `SITE_URL` (absolute Open Graph URLs) live there too; the CSP adds the analytics host only when it is set. Custom events: `trackEvent` + `ANALYTICS_EVENTS` in `src/lib/analytics.js`. Never hard-code business facts in components.
SEO: the build (`scripts/seoPages.js`, a Vite plugin) writes one HTML file per route (`catalog.html`, `category/dairy.html`, `product/p-001.html`) — the same app shell with that page's title, description, preview image, canonical URL and schema.org JSON-LD (stores, products with offers, breadcrumbs; never the invented ratings) — plus `robots.txt` and, once `SITE_URL` is set, `sitemap.xml`. Page titles/descriptions live ONLY in `src/lib/pageMeta.js` (used by pages via `useDocumentTitle` and by the build); catalog derivation in `src/services/catalog.js` (pure, Node-importable). Cart and favourites are `noindex`.
SEO: the build (`scripts/seoPages.js`, a Vite plugin) writes one HTML file per route (`catalog.html`, `category/dairy.html`, `product/p-001.html`) — the same app shell with that page's title, description, preview image, canonical URL and schema.org JSON-LD (stores, products with offers, breadcrumbs; never the invented ratings) — plus `robots.txt` and, once `SITE_URL` is set, `sitemap.xml`. Page titles/descriptions live ONLY in `src/lib/pageMeta.js` (used by pages via `useDocumentTitle` and by the build); catalog derivation in `src/services/catalog.js` (pure, Node-importable). Cart and favourites are `noindex`.
</project_context>

<ai_persona>
- ACT AS: A Principal Software Engineer.
- TONE: Concise, direct, pragmatic. NO fluff. NO introductory filler ("Here is the code", "I understand").
- OUTPUT: Code first, minimal explanations unless asked. Highlight architectural tradeoffs explicitly. If modifying existing files, output only the changed blocks with `// ... existing code ...` for context, unless a full rewrite is requested.
</ai_persona>

<workflow_rules>
- Context First: Before writing new hooks, utilities, or UI components, search `src/hooks`, `src/lib`, and `src/components` to maintain DRY principles.
- No Hallucinations: READ `package.json` before importing or suggesting any third-party dependencies. Do not invent npm packages.
- Safe Refactoring: Do not break existing functionality. Keep JSDoc types accurate across module boundaries.
</workflow_rules>

<development_standards>
  <architecture>
  - Principles: KISS, DRY, YAGNI, SOLID. High cohesion, low coupling.
  - Data flow: components -> hooks (`useProducts`, `useStores`, built on `useAsyncData`) -> services. Components NEVER import services directly. `useAsyncData` exposes `{ data, isLoading, isFetching, error, refetch }` (a `null` query key skips fetching, e.g. `useProductSuggestions` below 2 characters) so it can be replaced by React Query later without touching components.
  - State Boundaries: Server/mock data lives in the hooks layer only. Zustand holds cart items and transient UI state (`useCartStore`) and product-id lists only (`useFavoritesStore`, `useRecentlyViewedStore`; sanitized by `store/productIds.js`, products fetched via `useProductsByIds`); the city is a constant (`CITY`), not state. NEVER copy fetched data into Zustand. Derived values are selectors (`selectTotalItems`, `selectTotalPrice`), not stored fields.
  - Listing filters live in the URL query (`useProductFilters`), so they are shareable and survive reloads.
  - Naming: Descriptive, verb-first functions (e.g., `getProducts`, `isStoreOpen`). No abbreviations.
  - Structure: pages in `src/pages/`, routes in `src/router.jsx` + `src/lib/routes.js`, reusable UI in `src/components/ui/`, domain components in `src/components/<domain>/`.
  - Comments: Explain the "WHY", not the "WHAT". The code itself is the documentation.
  </architecture>

  <javascript>
  - Plain JS with JSDoc: `@typedef` for domain shapes (`Product`, `Category`, `Store`, `CartItem`) next to the service/store that owns them; `@param` on public functions and component props.
  - BANNED: `/* eslint-disable */` and similar suppressions. Fix the underlying issue.
  - Lookup maps (`Record<Union, ...>`) over `switch` for union-typed values (sorts, stock statuses).
  </javascript>

  <react_and_tailwind>
  - Components: Functional components only. Extract complex business logic into custom hooks.
  - Styling: Tailwind utilities + DaisyUI components (`toggle`, `select`, `skeleton`).
  - Brand (from the logo sheet): `tailwind.config.cjs` REPLACES the stock `emerald` scale with the logo's forest green (`emerald-700` = #1F4B3A) and `amber` with the basket orange (`amber-400` = #E8A33D); `gray-50` is the cream page (#F6F4EF). Keep using `emerald-*` (primary) / `amber-*` (promo accent) classes — they are the brand. Body text `slate-800`.
  - Contrast on cream: secondary text is `slate-600` minimum (`slate-500` is only 4.3:1 on `gray-50`). Primary buttons/eyebrows use `emerald-700`. The e2e suite checks WCAG contrast and the 12px minimum on every page.
  - Fonts (self-hosted `@fontsource`, subsets imported in `src/main.jsx`): `font-display` = Unbounded 700 for the wordmark and h1/h2 headings only; `font-script` = Caveat 600 (Cyrillic only) for the "смачно щодня" tagline only. Body uses the system stack. Adding a weight or subset means adding its import.
  - Logo: `BrandLogo` (lockup, `isIntroAnimated` only in the header) and `BrandMark` (SVG basket, `isEmpty` variant). `BasketIllustration` (`empty` | `spilled` | `filled` | `loading`) is the illustration for empty cart, 404, checkout success and the lazy-page fallback. `logo-*` classes inside the mark are animation hooks for `index.css`.
  - DaisyUI CSS trap: Tailwind scans ALL source text and DaisyUI emits a component's full CSS whenever a word equals its class name. `tailwind.config.cjs` `blocklist` therefore blocks every DaisyUI component except the three in use (`select`, `skeleton`, `toggle`); to adopt another one (e.g. `badge`, `progress`), remove it from the list first. Compare CSS size in `npm run build` output after changes (~69 kB).
  - Classes: join with `cn()` from `src/lib/utils.js`. It is a plain join (no tailwind-merge), so never pass conflicting utilities. Buttons use `buttonClassName()` from `src/lib/buttonStyles.js`.
  - Images: always `SafeImage` (lazy by default, SVG placeholder on error); `isEager` only for above-the-fold images.
  - Avoid inline styles (exception: per-frame values like drag offsets).
  - Accessibility: `aria-label` on icon-only buttons; dialogs use `useFocusTrap` + `useBodyScrollLock`; respect `prefers-reduced-motion`; must work at 375px.
  </react_and_tailwind>

  <motion>
  - No animation libraries. Use CSS (scroll-linked `animation-timeline: view()` inside `@supports`, so unsupported browsers just show the final state) or the Web Animations API. Every effect must be disabled or reduced to its final state under `prefers-reduced-motion`; never hide above-the-fold content behind an animation.
  - Reuse before adding: `.scroll-reveal` (cards entering), `.swoosh-draw` (logo swoosh under `SectionHeader`), `useIsScrollingDown` (compact mobile header), `useAnimatedNumber` (rolling totals), `useFlipAnimation` (list reordering, items need `data-flip-key`), `useTypingPlaceholder`, `flyToCart` (targets `[data-cart-target]`), `showRemovedFromCartToast` (undo), `SafeImage` fade (`data-image-state`), `.cart-control-expand`/`.cart-control-collapse` (card button ↔ stepper), `.category-icon-accent` hop (brand icons in `CategoryIcon`), `animate-tab-pop` + sliding highlight (`BottomNav`), `vibrateOnTap` (Android haptics, inside tap handlers only), `SeasonalParticles` (home banner; season from `getSeason()` in Kyiv time, switch `FEATURES.seasonalDecor`), `.price-strike` (old price line drawn on scroll), `useAnimatedNumber(target, ms, 0)` (count-up), `.cart-drawer-lines` stagger, `.paper-plane-flight`, `.pin-drop`, the coffee cup pour (`data-pour`, started by an IntersectionObserver once the cup is in view — a scroll-scrubbed fill would happen below the fold), `ScrollProgress` (long pages, `isLongReadPath`), `BackToTop`, `.card-tilt` + `lib/cardTilt.js` (mouse only), phone page slide in `SiteLayout` (`usePageSlide`; skipped while `isViewTransitionRunning()`). Scroll-driven ranges must end within `entry`, so anything fully on screen without scrolling is already in its final state. Never wrap a scroll-driven effect in `overflow-hidden`: that box becomes its scroll container and freezes the effect; clip with `overflow-clip` instead (guarded by `design.spec.js`).
  - Opening splash (`LogoSplash`, `src/lib/logoSplash.js`): first home-page visit per session only, ~1.15s, skipped by any tap/key/scroll and under reduced motion; it replaces the header logo's intro and lands on the header logo (FLIP). e2e tests skip it by default — opt in with `test.use({ showLogoSplash: true })`.
  - View transitions: product card → product page via react-router `viewTransition` + `useViewTransitionState`. A `view-transition-name` must be unique per page: only the card being opened carries `product-image`, only the active category pill `active-category` (it glides between pills); grids on a product page pass `hasImageTransition={false}`. `src/lib/pageLoaders.js` prefetches the product chunk on card intent so the transition never captures the Suspense fallback.
  </motion>

  <error_handling>
  - Fail fast: services throw `ServiceError` (`service`, `operation`, `code`) with actionable messages.
  - Validate inputs at the service boundary (e.g., unknown sort -> `INVALID_INPUT`).
  - Edge Cases: Handle empty, loading (skeletons on first load only; dim stale data on refetch), error-with-retry and not-found states explicitly in the UI.
  - `VITE_MOCK_FAILURE_RATE` (0..1) simulates network failures to exercise error UI.
  </error_handling>

  <security>
  - Security headers (CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, HSTS) are defined once in `vite.config.js` (`SECURITY_HEADERS`): served by `vite preview` (so e2e runs under the real CSP) and emitted as `dist/_headers` for Netlify/Cloudflare Pages. Other hosts (e.g. Vercel) need the same values in their own config.
  - CSP: no inline scripts, no `eval`, no `dangerouslySetInnerHTML`. Any new external host (analytics, maps, API, image CDN) must be added to the CSP or the browser blocks it.
  - localStorage is untrusted input: the cart store sanitizes every rehydrated line (`sanitizeCartItems`) so stale or tampered data can never blank the site. Cart prices are a snapshot; a real backend must re-price on the server.
  - External links use `target="_blank" rel="noopener noreferrer"`; images send `referrerPolicy="no-referrer"`.
  - `npm audit --omit=dev` must stay at 0 (runtime). Remaining advisories are dev-only build tooling (Vite 5 dev server); keep the dev server on localhost.
  </security>

  <performance>
  - Complexity: Default to O(1)/O(N) structures (Sets/Maps over nested arrays).
  - React Optimization: Memoize (`useMemo`, `useCallback`) ONLY when proven necessary or to keep query keys / effect deps stable.
  </performance>
</development_standards>

<commands>
- Dev: npm run dev
- Build: npm run build
- Preview: npm run preview
- Test: npm test — Playwright e2e suite in `tests/e2e/` against the production build (`vite preview`, port 4173) using the installed Google Chrome (`channel: 'chrome'`). `npm run test:ui` for the interactive runner.
- Visual regression: `npm run test:visual` compares key pages (desktop + phone) with baselines in `tests/visual/*-snapshots/` (frozen clock, reduced motion). Baselines are per OS (Windows now), so this project is not run in CI; after an intended design change run `npm run test:visual:update` and review the new images before committing.
- Tests stub Unsplash images and fail on any console error. Use `tests/e2e/fixtures.js` (`test`, `open`, `waitForData`, `cartBadge`, `currentPath`). New behaviour gets a test; time-dependent checks use `page.clock`.
- CI: `.github/workflows/ci.yml` runs `npm ci`, build and `npm test` on every push and on PRs to `main`.
- No lint script yet.
</commands>
