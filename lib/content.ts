export const stageVideo = "/videos/stages.mp4";
/** Same cut, small enough to be worth a phone's data plan. */
export const stageVideoMobile = "/videos/stages-mobile.mp4";
/** First frame of the clip: the LCP image, and the whole stage when motion is off. */
export const stagePoster = "/videos/stages-poster.jpg";

// Rest frames, one per section. The camera holds on these while the section text
// is on screen; between two of them the clip plays through — forward on scroll
// down, rewound on scroll up.
// The clip opens on an approach from open water, cut straight into the original
// aerial at 1.833s — no dissolve: the two shots are joined by scale instead, the
// original's first 48 frames carrying a 1.15x correction that eases back to its own
// framing by 2s, so the seam reads as one continuous flight. Its far half is cut away
// so the first frame already shows the hotel rather than a horizon. What the original
// footage carried therefore sits 1.833s later than it used to. Each rest still lands
// just before its cut (which now run 10.875, 15.917, 20.958) so the held frame is a
// clean shot, never a blend of two clips.
export const stageTimes = [0, 5.08, 10.72, 15.76, 20.8, 26.83] as const;

export const content = {
  header: {
    nav: ["Rooms", "Spa", "Restaurants", "Beach Club", "Contacts"],
    cta: "Book Now",
  },
  hero: {
    label: "ODESA · LANZHERON BEACH",
    // "Where the Sea Meets Luxury" is the line every coastal hotel on the internet
    // already owns. This one is true of this property and of no other on the coast:
    // the resort stands on the Lanzheron spit with water round three of its faces,
    // which is exactly what the opening shot flies in on.
    headline: "Sea on Three Sides",
    subheadline:
      "NEMO Hotel Resort & SPA — the leading 5-star resort on Odesa's Black Sea coast, with 11 heated pools, a private beach club and panoramic sea views from every terrace.",
    cta: "Explore the resort",
    scrollHint: "Scroll",
  },
  rooms: {
    label: "ACCOMMODATION",
    headline: "Six Ways to Rest",
    subheadline:
      "From bright Standard rooms to the Presidential Suite — every room features a hydromassage jacuzzi and a view of the sea, the park or the city.",
    // `meta` is what a card's marker slot carries: size, sleeps, outlook — the three
    // things a guest compares rooms on. PLACEHOLDER FIGURES: replace with the hotel's
    // own room sheet before launch.
    items: [
      {
        name: "Standard",
        meta: "26 m² · sleeps 2 · park view",
        text: "Bright and comfortable, with all essentials for a relaxed stay.",
      },
      {
        name: "Superior Standard",
        meta: "32 m² · sleeps 2 · resort view",
        text: "Extra space and an upgraded outlook over the resort grounds.",
      },
      {
        name: "Luxury Suite",
        meta: "45 m² · sleeps 2 · sea view",
        text: "Refined interiors with a private lounge zone and sea view.",
      },
      {
        name: "Two-Room Suite",
        meta: "58 m² · sleeps 3 · sea view",
        text: "Separate living and sleeping areas — ideal for longer stays.",
      },
      {
        name: "Family Suite",
        meta: "65 m² · sleeps 4 · park view",
        text: "Designed for families, with extra room for children.",
      },
      {
        name: "Presidential Suite",
        meta: "120 m² · sleeps 4 · sea view",
        text: "The hotel's finest address: panoramic sea views and top-tier comfort.",
      },
    ],
    cta: "Check rates and availability",
  },
  // PLACEHOLDER COPY: the approach shot was added after the copy deck was written,
  // so this rest speaks in the hotel's voice but says nothing the hotel signed off.
  // Replace before launch.
  resort: {
    label: "THE RESORT",
    headline: "Eleven Pools Above the Water",
    subheadline:
      "Heated pools, sun terraces and gardens run the length of the shoreline, and the sea is a few steps from every one of them.",
    cta: "See the grounds",
  },
  spa: {
    label: "WELLNESS",
    headline: "A Ritual of Water and Warmth",
    subheadline:
      "Saunas, steam rooms and thermal baths from around the world — Finnish, Roman, Japanese OFURO — plus a heated indoor pool and an outdoor jacuzzi at +38°C, open all year round.",
    cta: "Book a spa session",
  },
  restaurant: {
    label: "DINING",
    headline: "Four Restaurants, One Sea View",
    subheadline:
      "European, Mediterranean and Asian cuisine across Pianorama, Dolphin, Nautilus Lounge Cafe and the Food Court — every table with a view of the Black Sea.",
    cta: "Reserve a table",
  },
  beachClub: {
    label: "NEMO BEACH CLUB",
    headline: "Your Private Shore",
    subheadline:
      "A private beach on Lanzheron promenade with the dolphin-shaped pool, the Infinity Pool merging into the sea, and the Pirate Bay water park for kids — open daily, May to October.",
    cta: "Book a beach day",
  },
  footer: {
    address: "Lanzheron Beach, Odesa, Ukraine",
    phone: "+380 48 700 00 00",
    email: "stay@nemohotel.com",
  },
} as const;

// Stage order follows the footage, not the brochure: the clip comes in off the water,
// arrives at the resort, then flies the pool deck, the restaurant, the spa and finally
// a room, so each rest holds the shot its own copy is talking about.
export const sections = [
  { id: "hero", label: content.hero.label },
  { id: "resort", label: content.resort.label },
  { id: "beach-club", label: content.beachClub.label },
  { id: "restaurants", label: content.restaurant.label },
  { id: "spa", label: content.spa.label },
  { id: "rooms", label: content.rooms.label },
] as const;
