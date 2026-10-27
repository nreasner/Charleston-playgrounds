import type { RatingKey, TagKey, Area, PassKey } from "./types";

export const SITE = {
  name: "Charleston Playgrounds",
  url: "https://www.charlestonplaygrounds.com",
  tagline: "Every playground in the Lowcountry, rated by parents.",
  origin: "Inspired by a two-year-old's New Year's resolution to visit every playground in Charleston.",
};

export const TAGS: Record<TagKey, { label: string; icon: string }> = {
  fenced: { label: "Fenced", icon: "🔒" },
  shade: { label: "Shaded", icon: "🌳" },
  splashpad: { label: "Splash pad", icon: "💦" },
  restrooms: { label: "Restrooms", icon: "🚻" },
  toddler: { label: "Toddler area", icon: "👶" },
  parking: { label: "Parking lot", icon: "🅿️" },
  dogs: { label: "Dog park", icon: "🐕" },
  food: { label: "Food nearby", icon: "🍔" },
  stroller: { label: "Stroller paths", icon: "🛤️" },
  inclusive: { label: "Inclusive", icon: "♿" },
  swings: { label: "Swings", icon: "🎪" },
  picnic: { label: "Picnic tables", icon: "🧺" },
  water: { label: "Water views", icon: "🌊" },
};

export const RATING_KEYS: { key: RatingKey; label: string; icon: string }[] = [
  { key: "overall", label: "Overall", icon: "⭐" },
  { key: "shade", label: "Shade", icon: "🌳" },
  { key: "equipment", label: "Equipment", icon: "🎠" },
  { key: "cleanliness", label: "Clean", icon: "✨" },
  { key: "bugs", label: "Low(er) bugs", icon: "🦟" },
  { key: "safety", label: "Safety", icon: "🛡️" },
  { key: "toddler", label: "Tot-friendly", icon: "👶" },
  { key: "food", label: "Food nearby", icon: "🍕" },
];

export const AREAS: Area[] = [
  "Downtown",
  "West Ashley",
  "Mt. Pleasant",
  "North Charleston",
  "James Island",
  "Johns Island",
  "Daniel Island",
  "Sullivan's Island",
  "Folly Beach",
  "Isle of Palms",
  "Kiawah Island",
];

export const PASS_LABEL: Record<PassKey, { label: string; cls: string; href?: string }> = {
  gold: { label: "🏅 Gold Pass", cls: "badge-gold", href: "/passes/gold-pass" },
  state: { label: "🌲 State Park Pass", cls: "badge-green", href: "/passes/state-park-passport" },
  free: { label: "✨ Free", cls: "badge-blue" },
};

export const mapsLink = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
export const directionsLink = (q: string) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;
export const placePhotosLink = (placeId: string, name: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=${placeId}`;

export const NAV = [
  { href: "/", label: "Playgrounds", icon: "🛝" },
  { href: "/activities", label: "Activities", icon: "🎪" },
  { href: "/beaches", label: "Beaches", icon: "🏖️" },
  { href: "/libraries", label: "Libraries", icon: "📚" },
  { href: "/passes", label: "Passes", icon: "🎫" },
  { href: "/community", label: "Community", icon: "💬" },
];

export const MENU = [
  { href: "/profile", label: "My profile", icon: "👤" },
  { href: "/blog", label: "Tips & guides", icon: "💡" },
  { href: "/map", label: "Map", icon: "🗺️" },
  { href: "/calendar", label: "Calendar", icon: "📅" },
  { href: "/contact", label: "Contact us", icon: "📬" },
];
