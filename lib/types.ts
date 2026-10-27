export type Area =
  | "Downtown"
  | "West Ashley"
  | "Mt. Pleasant"
  | "North Charleston"
  | "James Island"
  | "Johns Island"
  | "Daniel Island"
  | "Sullivan's Island"
  | "Folly Beach"
  | "Isle of Palms"
  | "Kiawah Island";

export type TagKey =
  | "fenced"
  | "shade"
  | "splashpad"
  | "restrooms"
  | "toddler"
  | "parking"
  | "dogs"
  | "food"
  | "stroller"
  | "inclusive"
  | "swings"
  | "picnic"
  | "water";

export type RatingKey =
  | "overall"
  | "shade"
  | "equipment"
  | "cleanliness"
  | "bugs"
  | "safety"
  | "toddler"
  | "food";

export type Ratings = Record<RatingKey, number>;

export type PassKey = "gold" | "state" | "free";

export interface Eat {
  name: string;
  type: string;
  tip: string;
  address: string;
}

export interface Playground {
  slug: string;
  name: string;
  area: Area;
  address: string;
  lat: number;
  lng: number;
  placeId: string;
  hours?: string;
  pass?: PassKey;
  fee?: string;
  tags: TagKey[];
  ratings: Ratings;
  short: string;
  description: string[];
  goodToKnow: string[];
  ages?: string;
  eats: Eat[];
  isNew?: boolean;
}

export interface BeachSection {
  name: string;
  pass?: PassKey;
  parking: string;
  facilities: string;
  bestFor: string;
}

export interface Beach {
  slug: string;
  name: string;
  town: string;
  address: string;
  lat: number;
  lng: number;
  placeId: string;
  pass: PassKey;
  driveTime: string;
  short: string;
  description: string[];
  sections: BeachSection[];
  withPass: string[];
  withoutPass: string[];
  tips: string[];
  lifeguards: string;
  dogs: string;
  links: { label: string; url: string }[];
}

export interface Library {
  slug: string;
  name: string;
  area: string;
  address: string;
  lat: number;
  lng: number;
  placeId: string;
  phone: string;
  hours: string[];
  short: string;
  highlights: string[];
  nearby?: string;
}

export interface Activity {
  slug: string;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  placeId?: string;
  url: string;
  phone?: string;
  hours: string[];
  prices: { label: string; value: string }[];
  ages: string;
  timeNeeded: string;
  short: string;
  description: string[];
  schedule?: { title: string; rows: { day: string; time: string; who: string; cost: string; where: string }[] };
  tips: string[];
  pass?: string;
  locations?: { name: string; address: string }[];
}

export interface Pass {
  slug: string;
  name: string;
  accent: "gold" | "green" | "blue" | "coral" | "purple";
  price: string;
  priceTable: { label: string; value: string }[];
  short: string;
  bestFor: string;
  includes: { heading: string; items: string[] }[];
  notIncluded: string[];
  math?: string;
  howToBuy: string[];
  links: { label: string; url: string }[];
  verifiedNote: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // YYYY-MM-DD
  end?: string;
  when: string;
  where: string;
  cost: string;
  description: string;
  url?: string;
  tags: string[];
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: "Playgrounds" | "Locals" | "Visitors" | "Seasonal" | "Family Life" | "Passes & Beaches";
  emoji: string;
  body: string;
}
