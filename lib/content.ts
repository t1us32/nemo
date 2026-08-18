export const stageVideo = "/videos/stages.mp4";

// Rest frames, one per section. The camera holds on these while the section text
// is on screen; between two of them the clip plays through — forward on scroll
// down, rewound on scroll up.
// Each rest sits just before its cut (which run 9.042, 14.083, 19.125) so the held
// frame is a clean shot, never a half-dissolved blend of two clips.
export const stageTimes = [0, 8.89, 13.93, 18.97, 25.0] as const;

export const content = {
  header: {
    nav: ["Rooms", "Spa", "Restaurants", "Beach Club", "Contacts"],
    cta: "Book Now",
  },
  hero: {
    label: "ODESA · LANZHERON BEACH",
    headline: "Where the Sea Meets Luxury",
    subheadline:
      "NEMO Hotel Resort & SPA — the leading 5-star resort on Odesa's Black Sea coast, with 11 heated pools, a private beach club and panoramic sea views from every terrace.",
    cta: "Book Your Stay",
    scrollHint: "SCROLL TO DIVE",
  },
  rooms: {
    label: "ACCOMMODATION",
    headline: "Six Ways to Rest",
    subheadline:
      "From bright Standard rooms to the Presidential Suite — every room features a hydromassage jacuzzi and a view of the sea, the park or the city.",
    items: [
      { name: "Standard", text: "Bright and comfortable, with all essentials for a relaxed stay." },
      { name: "Superior Standard", text: "Extra space and an upgraded outlook over the resort grounds." },
      { name: "Luxury Suite", text: "Refined interiors with a private lounge zone and sea view." },
      { name: "Two-Room Suite", text: "Separate living and sleeping areas — ideal for longer stays." },
      { name: "Family Suite", text: "Designed for families, with extra room for children." },
      { name: "Presidential Suite", text: "The hotel's finest address: panoramic sea views and top-tier comfort." },
    ],
    cta: "View Rooms & Rates",
  },
  spa: {
    label: "WELLNESS",
    headline: "A Ritual of Water and Warmth",
    subheadline:
      "Saunas, steam rooms and thermal baths from around the world — Finnish, Roman, Japanese OFURO — plus a heated indoor pool and an outdoor jacuzzi at +38°C, open all year round.",
    cta: "Explore the Spa",
  },
  restaurant: {
    label: "DINING",
    headline: "Four Restaurants, One Sea View",
    subheadline:
      "European, Mediterranean and Asian cuisine across Pianorama, Dolphin, Nautilus Lounge Cafe and the Food Court — every table with a view of the Black Sea.",
    cta: "View Restaurants",
  },
  beachClub: {
    label: "NEMO BEACH CLUB",
    headline: "Your Private Shore",
    subheadline:
      "A private beach on Lanzheron promenade with the dolphin-shaped pool, the Infinity Pool merging into the sea, and the Pirate Bay water park for kids — open daily, May to October.",
    cta: "Discover the Beach Club",
  },
  footer: {
    address: "Lanzheron Beach, Odesa, Ukraine",
    phone: "+380 48 700 00 00",
    email: "stay@nemohotel.com",
  },
} as const;

// Stage order follows the footage, not the brochure: the clip flies from the aerial
// establisher to the pool deck, the restaurant, the spa and finally a room, so each
// rest holds the shot its own copy is talking about. Depth is positional.
export const sections = [
  { id: "hero", label: content.hero.label, depth: "0M" },
  { id: "beach-club", label: content.beachClub.label, depth: "10M" },
  { id: "restaurants", label: content.restaurant.label, depth: "20M" },
  { id: "spa", label: content.spa.label, depth: "30M" },
  { id: "rooms", label: content.rooms.label, depth: "40M" },
] as const;
