# ТЗ: NEMO Hotel — Promo Landing на Next.js (Фаза 1: без видео, только текст + анимации)

Референс механики скролла: moonrock-sigma.vercel.app (в фазе 1 повторяем ТОЛЬКО текстовые reveal-анимации и структуру секций/пиннинга — видео-флайсру добавим в фазе 2, поэтому архитектуру нужно закладывать с учётом будущей видео-вставки).

---

## 1. Стек

- **Next.js 15**, App Router, TypeScript
- **Tailwind CSS** — вся стилизация
- **GSAP + ScrollTrigger** (`gsap`, `@gsap/react` → хук `useGSAP`) — анимации по скроллу.
  ⚠️ Не Framer Motion. Берём GSAP сразу, потому что в фазе 2 видео-скраб будет строиться на том же ScrollTrigger (pin + onUpdate) — не придётся переписывать движок анимаций.
- **Lenis** (`@studio-freight/lenis` или `lenis`) — плавный инерционный скролл, синхронизировать с `ScrollTrigger.ticker`.
- `next/font` — подключение шрифта (см. п.3).
- `next/image` — все фото.

Установка:
```bash
npm i gsap @gsap/react lenis
```

---

## 2. Структура проекта

```
app/
  layout.tsx
  page.tsx                 # собирает 5 секций
  globals.css
components/
  layout/
    Header.tsx              # sticky nav, прозрачный → solid при скролле
    Footer.tsx / ContactBar.tsx
  sections/
    HeroSection.tsx
    RoomsSection.tsx
    SpaSection.tsx
    RestaurantSection.tsx
    BeachClubSection.tsx
  ui/
    Section.tsx              # обёртка: full-height, pin-контейнер, media-slot
    TextReveal.tsx            # переиспользуемый компонент построчного/пословного reveal
    Label.tsx                 # маленький eyebrow-текст (ODESSA · LANGERON BEACH)
    CTAButton.tsx
    RoomCard.tsx
  providers/
    SmoothScrollProvider.tsx  # инициализация Lenis + связка с ScrollTrigger
lib/
  content.ts                 # весь текстовый контент (см. п.6) — единственный источник правды
  gsap.ts                    # регистрация плагинов (ScrollTrigger), общие ease/durations
```

---

## 3. Дизайн-токены (плейсхолдер, подогнать под реальный бренд-гайд отеля при наличии)

```css
--color-bg: #0B1620;        /* глубокий тёмно-синий, "море ночью" */
--color-bg-alt: #F5F1EA;    /* тёплый песочный для светлых секций, если нужно */
--color-text: #F5F1EA;
--color-accent: #C9A24B;    /* приглушённое золото — акценты, CTA, лейблы */
--color-muted: rgba(245,241,234,0.6);
```

- Заголовки: крупный serif или condensed sans (5-звёздочный отель → не дефолтный geometric sans). Предложение: `next/font/google` → "Fraunces" (headline) + "Inter" (body/UI). Финальный выбор — на усмотрение дизайнера.
- Скругления минимальные/нулевые, лаконичный минимализм, много воздуха, крупная типографика.

---

## 4. Архитектура скролла (важно для совместимости с будущим видео)

Каждая секция = **pinned full-viewport блок** через ScrollTrigger:

```tsx
ScrollTrigger.create({
  trigger: sectionRef.current,
  start: 'top top',
  end: '+=100%',      // длина "жизни" секции в скролле
  pin: true,
  scrub: false,        // в фазе 1 контент не скрабится, просто триггерится вход/выход
  onEnter: () => playRevealTimeline(),
  onLeaveBack: () => reverseRevealTimeline(),
});
```

Внутри `Section.tsx` уже сейчас закладываем **media-slot** — пустой контейнер-фон, куда в фазе 2 встанет canvas с покадровым видео:

```tsx
<section ref={sectionRef} className="relative h-screen overflow-hidden">
  <div data-media-slot className="absolute inset-0 -z-10">
    {/* Фаза 1: статичное фото/градиент-заглушка. Фаза 2: <canvas> с видео-кадрами */}
    <Image src={fallbackImage} fill className="object-cover opacity-40" alt="" />
    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-[var(--color-bg)]/40" />
  </div>
  <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-20">
    {children}
  </div>
</section>
```

Это гарантирует, что при добавлении видео в фазе 2 меняется **только содержимое `data-media-slot`**, а не структура секций/анимаций.

---

## 5. Компонент TextReveal — спецификация анимации

Единая логика на все 5 секций (переиспользуемый компонент, принимает `text` и `type: 'label' | 'headline' | 'body'`):

**Поведение при входе в viewport (`onEnter`):**
1. `label` (eyebrow) — fade + translateY(12px→0), duration 0.5s, ease `power2.out`.
2. `headline` — сплит на строки (или слова через `SplitText`/ручной word-wrap), каждая строка: `opacity 0→1`, `translateY(30px→0)`, `stagger 0.06s`, старт через 0.15s после label, ease `power3.out`, duration 0.7s.
3. `subheadline/body` — fade + translateY(16px→0), старт через 0.1s после последней строки headline, duration 0.6s.
4. `CTA` — `scale 0.9→1` + fade, старт последним, duration 0.4s, ease `back.out(1.4)`.

**Поведение при выходе (скролл дальше / назад):**
- При скролле вниз за пределы секции — лёгкий fade-out + translateY(-20px) всего блока текста (parallax-уход вверх).
- При скролле назад (`onLeaveBack`) — реверс timeline, чтобы при повторном входе анимация повторялась чисто.

**Технически:** один `gsap.timeline({ paused: true })` на секцию, вызывается из `onEnter`/`onEnterBack`, `.reverse()` из `onLeave`/`onLeaveBack`. НЕ создавать новый timeline на каждый вход — таймлайн создаётся один раз в `useGSAP`, дальше только play/reverse.

**Доступность:** обернуть весь GSAP-код в проверку `window.matchMedia('(prefers-reduced-motion: reduce)')` — если true, показывать контент сразу без анимации (`gsap.set` вместо `timeline.play`).

---

## 6. Контент (источник правды — `lib/content.ts`)

```ts
export const content = {
  header: {
    nav: ['Rooms', 'Spa', 'Restaurants', 'Beach Club', 'Contacts'],
    cta: 'Book Now',
  },
  hero: {
    label: 'ODESSA · LANGERON BEACH',
    headline: 'Where the Sea Meets Luxury',
    subheadline:
      "NEMO Hotel Resort & SPA — the leading 5-star resort on Odessa's Black Sea coast, with 11 heated pools, a private beach club and panoramic sea views from every terrace.",
    cta: 'Book Your Stay',
    scrollHint: 'SCROLL TO FLY',
  },
  rooms: {
    label: 'ACCOMMODATION',
    headline: 'Six Ways to Rest',
    subheadline:
      'From bright Standard rooms to the Presidential Suite — every room features a hydromassage jacuzzi and a view of the sea, the park or the city.',
    items: [
      { name: 'Standard', text: 'Bright and comfortable, with all essentials for a relaxed stay.' },
      { name: 'Superior Standard', text: 'Extra space and an upgraded outlook over the resort grounds.' },
      { name: 'Luxury Suite', text: 'Refined interiors with a private lounge zone and sea view.' },
      { name: 'Two-Room Suite', text: 'Separate living and sleeping areas — ideal for longer stays.' },
      { name: 'Family Suite', text: 'Designed for families, with extra room for children.' },
      { name: 'Presidential Suite', text: "The hotel's finest address: panoramic sea views and top-tier comfort." },
    ],
    cta: 'View Rooms & Rates',
  },
  spa: {
    label: 'WELLNESS',
    headline: 'A Ritual of Water and Warmth',
    subheadline:
      'Saunas, steam rooms and thermal baths from around the world — Finnish, Roman, Japanese OFURO — plus a heated indoor pool and an outdoor jacuzzi at +38°C, open all year round.',
    cta: 'Explore the Spa',
  },
  restaurant: {
    label: 'DINING',
    headline: 'Four Restaurants, One Sea View',
    subheadline:
      'European, Mediterranean and Asian cuisine across Pianorama, Dolphin, Nautilus Lounge Cafe and the Food Court — every table with a view of the Black Sea.',
    cta: 'View Restaurants',
  },
  beachClub: {
    label: 'NEMO BEACH CLUB',
    headline: 'Your Private Shore',
    subheadline:
      'A private beach on Langeron promenade with the dolphin-shaped pool, the Infinity Pool merging into the sea, and the Pirate Bay water park for kids — open daily, May to October.',
    cta: 'Discover the Beach Club',
  },
} as const;
```

Фото-заглушки для `data-media-slot` в фазе 1 (реальные фото отеля, взять как fallback background, opacity ~30-40% + затемняющий градиент, см. отдельный файл `NEMO_visual_materials.md` со списком ссылок по секциям).

---

## 7. RoomsSection — доп. требования

- Grid карточек (`grid-cols-1 md:grid-cols-3`), каждая карточка = `RoomCard` (название + 1 строка текста).
- Карточки анимируются **individually staggered** при входе секции в viewport (`stagger: 0.08`, `translateY(20px→0)`, `opacity 0→1`), после того как отыграл headline.
- На мобильном — горизонтальный swipe-carousel (`overflow-x-auto snap-x`) вместо грида, чтобы не растягивать секцию по высоте.

---

## 8. Header

- Позиция `fixed top-0`, изначально прозрачный (текст белый, без фона).
- При скролле > 80px — плавный переход в `bg-[var(--color-bg)]/90 backdrop-blur`, через GSAP или простой `ScrollTrigger.create({ start: 80, toggleClass: {...} })`.
- Мобильное меню — full-screen overlay, простая fade+stagger анимация пунктов меню при открытии.

---

## 9. Производительность и качество

- Все изображения — `next/image`, `priority` только на hero, остальные `loading="lazy"`.
- Lighthouse mobile: Performance ≥ 85, CLS ≈ 0 (зарезервировать высоту media-slot заранее, не допускать прыжков layout).
- `will-change: transform` только на анимируемых элементах, снимать после анимации.
- GSAP: `ScrollTrigger.refresh()` вызывать после загрузки шрифтов/изображений (`document.fonts.ready`), чтобы позиции триггеров не съезжали.
- Убедиться, что `Lenis` не конфликтует с нативным scroll-restoration Next.js (отключить `scrollRestoration` в `next.config` при необходимости).

---

## 10. Definition of Done (фаза 1)

- [ ] 5 полноэкранных pinned-секций, скролл через Lenis + ScrollTrigger, без рывков.
- [ ] В каждой секции текст (label → headline построчно → subheadline → CTA) появляется по описанной анимации при входе в viewport и корректно реверсируется при обратном скролле.
- [ ] Rooms-секция — 6 карточек, staggered reveal, мобильная версия — карусель.
- [ ] Header меняет состояние прозрачности при скролле, мобильное меню работает.
- [ ] `prefers-reduced-motion` — анимации отключаются, контент виден сразу.
- [ ] Каждая секция имеет `data-media-slot` контейнер с фото-заглушкой — готов к замене на видео в фазе 2 без изменения разметки/анимаций.
- [ ] Lighthouse mobile Performance ≥ 85, без layout shift.
- [ ] Контент только из `lib/content.ts` — никаких хардкодов текста в компонентах.
