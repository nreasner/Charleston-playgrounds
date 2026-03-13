import { useState, useEffect, useRef, useMemo, useCallback } from "react";

// ─── Data ───────────────────────────────────────────────────────────────────
const AREAS = ["All Areas", "Downtown", "West Ashley", "Mt. Pleasant", "North Charleston", "James Island", "Johns Island", "Daniel Island", "Sullivan's Island", "Folly Beach", "Goose Creek", "Summerville"];

const TAGS = {
  fenced: "🔒 Fenced",
  shade: "🌳 Shaded",
  splashpad: "💦 Splash Pad",
  restrooms: "🚻 Restrooms",
  toddler: "👶 Toddler Area",
  parking: "🅿️ Free Parking",
  dogs: "🐕 Dog Friendly",
  food: "🍔 Near Food",
  stroller: "🛤️ Stroller Paths",
  inclusive: "♿ Inclusive",
  swings: "🎪 Swings",
  picnic: "🧺 Picnic Area",
};

const RATING_CATS = [
  { key: "overall", label: "Overall", icon: "⭐" },
  { key: "shade", label: "Shade", icon: "🌳" },
  { key: "equipment", label: "Equipment", icon: "🎠" },
  { key: "cleanliness", label: "Cleanliness", icon: "✨" },
  { key: "bugs", label: "Low Bugs", icon: "🦟" },
  { key: "safety", label: "Safety", icon: "🛡️" },
  { key: "toddlerFriendly", label: "Toddler Friendly", icon: "👶" },
  { key: "nearbyFood", label: "Nearby Food", icon: "🍕" },
];

const PLAYGROUNDS = [
  { id: 1, name: "Park Circle Playground", area: "North Charleston", address: "4800 Park Circle, N. Charleston", lat: 32.8891, lng: -79.9611, tags: ["fenced", "shade", "inclusive", "restrooms", "toddler", "parking", "swings", "picnic"], ratings: { overall: 4.9, shade: 5, equipment: 5, cleanliness: 4.5, bugs: 3.5, safety: 5, toddlerFriendly: 5, nearbyFood: 4.5 }, desc: "The world's largest inclusive playground at 55,000 sq ft. Ninja course, zip lines, climbing structures for all ages and abilities. Fully fenced with shade sails throughout.", passType: null, img: "🏰" },
  { id: 2, name: "Mt. Pleasant Memorial Waterfront Park", area: "Mt. Pleasant", address: "99 Harry M Hallman Jr Blvd", lat: 32.7924, lng: -79.9086, tags: ["shade", "splashpad", "restrooms", "toddler", "parking", "food", "stroller", "swings", "picnic"], ratings: { overall: 4.8, shade: 4, equipment: 4.5, cleanliness: 4.5, bugs: 3, safety: 4.5, toddlerFriendly: 5, nearbyFood: 4 }, desc: "Iconic pirate-ship playground under the Ravenel Bridge with three age-separated play zones, pier fishing, and dolphin watching. Currently expanding!", passType: null, img: "🏴‍☠️" },
  { id: 3, name: "Hampton Park Playground", area: "Downtown", address: "30 Mary Murray Dr, Charleston", lat: 32.7968, lng: -79.9475, tags: ["shade", "stroller", "toddler", "dogs", "picnic"], ratings: { overall: 4.6, shade: 5, equipment: 4, cleanliness: 4.5, bugs: 3, safety: 4.5, toddlerFriendly: 5, nearbyFood: 3.5 }, desc: "Large shaded playground surrounded by gorgeous gardens and duck ponds. Soft play surface, stroller-friendly loop. Perfect for picnics.", passType: null, img: "🦆" },
  { id: 4, name: "Hazel Parker Playground", area: "Downtown", address: "70 East Bay St, Charleston", lat: 32.7716, lng: -79.9251, tags: ["shade", "restrooms", "toddler", "dogs", "swings", "stroller"], ratings: { overall: 4.5, shade: 4, equipment: 4, cleanliness: 4, bugs: 3, safety: 4, toddlerFriendly: 4.5, nearbyFood: 5 }, desc: "Beloved downtown park with refurbished playground, dog run, basketball & tennis courts. Walking distance to great restaurants on East Bay.", passType: null, img: "🎾" },
  { id: 5, name: "West Ashley Park", area: "West Ashley", address: "3601 Mary Ader Dr, Charleston", lat: 32.8135, lng: -79.9924, tags: ["shade", "restrooms", "toddler", "parking", "dogs", "stroller", "swings", "picnic"], ratings: { overall: 4.5, shade: 4, equipment: 4.5, cleanliness: 4, bugs: 3, safety: 4, toddlerFriendly: 4.5, nearbyFood: 3 }, desc: "One of Charleston's largest parks at 260 acres. Climbing webs, tunnels, toddler area, fishing dock, disc golf, and miles of walking trails.", passType: null, img: "🎣" },
  { id: 6, name: "Ackerman Park", area: "West Ashley", address: "55 Sycamore Ave, Charleston", lat: 32.7841, lng: -79.9793, tags: ["toddler", "dogs", "parking", "swings"], ratings: { overall: 4.2, shade: 2.5, equipment: 4, cleanliness: 4, bugs: 3, safety: 4, toddlerFriendly: 4, nearbyFood: 3.5 }, desc: "Hidden gem with modern climbing equipment, slides, and spinning structures. Adjacent dog park. Limited shade — bring sunscreen!", passType: null, img: "🎡" },
  { id: 7, name: "Palmetto Islands County Park", area: "Mt. Pleasant", address: "444 Needlerush Pkwy, Mt. Pleasant", lat: 32.8357, lng: -79.8366, tags: ["shade", "restrooms", "toddler", "parking", "picnic", "swings"], ratings: { overall: 4.7, shade: 5, equipment: 5, cleanliness: 4.5, bugs: 2.5, safety: 4.5, toddlerFriendly: 4.5, nearbyFood: 2 }, desc: "Spacious, heavily shaded playground with the 50-foot observation tower 'Big Toy', sandbox, and covered picnic areas. County park admission required.", passType: "gold", img: "🗼" },
  { id: 8, name: "James Island County Park", area: "James Island", address: "871 Riverland Dr, Charleston", lat: 32.7467, lng: -79.9680, tags: ["shade", "restrooms", "splashpad", "toddler", "parking", "dogs", "stroller", "swings", "picnic"], ratings: { overall: 4.8, shade: 4.5, equipment: 4.5, cleanliness: 5, bugs: 3, safety: 5, toddlerFriendly: 5, nearbyFood: 2.5 }, desc: "Massive county park with playground, Splash Zone waterpark, dog park, fishing, climbing wall, and seasonal Holiday Festival of Lights.", passType: "gold", img: "🎄" },
  { id: 9, name: "Wannamaker County Park", area: "North Charleston", address: "8888 University Blvd, N. Charleston", lat: 32.9278, lng: -80.0411, tags: ["shade", "restrooms", "splashpad", "toddler", "parking", "stroller", "swings", "picnic"], ratings: { overall: 4.6, shade: 5, equipment: 4.5, cleanliness: 4.5, bugs: 3, safety: 4.5, toddlerFriendly: 4.5, nearbyFood: 2 }, desc: "Famous for large shaded playgrounds, paved stroller trails, Whirlin' Waters waterpark, and SK8 Charleston skatepark.", passType: "gold", img: "🛹" },
  { id: 10, name: "Gadsdenboro Park", area: "Downtown", address: "30 Concord St, Charleston", lat: 32.7837, lng: -79.9264, tags: ["shade", "stroller", "toddler", "food", "swings"], ratings: { overall: 4.3, shade: 3.5, equipment: 4, cleanliness: 4, bugs: 3.5, safety: 4, toddlerFriendly: 4, nearbyFood: 5 }, desc: "Downtown green space near the SC Aquarium with nautical-themed playground, walking paths, and game tables. Perfect before or after aquarium visits.", passType: null, img: "⚓" },
  { id: 11, name: "Tiedemann Park", area: "Downtown", address: "370 Huger St, Charleston", lat: 32.7921, lng: -79.9401, tags: ["toddler", "food"], ratings: { overall: 3.8, shade: 3, equipment: 3.5, cleanliness: 4, bugs: 3, safety: 4, toddlerFriendly: 4, nearbyFood: 5 }, desc: "Small but charming park just a block from the Visitors Center and Upper King Street. Great spot to let kids burn energy before a restaurant.", passType: null, img: "🏘️" },
  { id: 12, name: "Folly Beach Playground", area: "Folly Beach", address: "500 W Cooper St, Folly Beach", lat: 32.6523, lng: -79.9433, tags: ["shade", "restrooms", "toddler", "parking", "swings", "picnic"], ratings: { overall: 4.4, shade: 4, equipment: 4, cleanliness: 4, bugs: 3, safety: 4, toddlerFriendly: 4, nearbyFood: 4.5 }, desc: "Colorful playground with playhouse centerpiece, slides, ropes, and swings. Near the beach with a skate park and gazebo with table tennis.", passType: null, img: "🏖️" },
  { id: 13, name: "North Charleston Inclusive Playground", area: "North Charleston", address: "2244 Cosgrove Ave, N. Charleston", lat: 32.8648, lng: -80.0029, tags: ["inclusive", "shade", "restrooms", "toddler", "parking", "splashpad", "swings"], ratings: { overall: 4.5, shade: 4, equipment: 4.5, cleanliness: 4, bugs: 3, safety: 4.5, toddlerFriendly: 5, nearbyFood: 3 }, desc: "26,000+ sq ft inclusive playground with pavilion, basketball/tennis courts, volleyball, walking trails, and splash pad.", passType: null, img: "🌈" },
  { id: 14, name: "Shipyard Park", area: "Daniel Island", address: "1501 Daniel Island Dr, Charleston", lat: 32.8590, lng: -79.8768, tags: ["shade", "restrooms", "parking", "stroller", "swings", "picnic"], ratings: { overall: 4.3, shade: 4, equipment: 4, cleanliness: 4.5, bugs: 3, safety: 4.5, toddlerFriendly: 4, nearbyFood: 3.5 }, desc: "Daniel Island park near the tennis center with soccer/baseball fields, waterfront trails, playground and lots of green space.", passType: null, img: "⛵" },
  { id: 15, name: "Mary Utsey / Orange Grove Park", area: "West Ashley", address: "1350 Orange Grove Rd, Charleston", lat: 32.7956, lng: -79.9711, tags: ["restrooms", "toddler", "parking", "swings"], ratings: { overall: 4.0, shade: 3, equipment: 3.5, cleanliness: 4, bugs: 3, safety: 4, toddlerFriendly: 4, nearbyFood: 3 }, desc: "Eight-acre park with two tennis courts, baseball/softball field, basketball courts, and playground equipment.", passType: null, img: "🎯" },
  { id: 16, name: "Magnolia Plantation Children's Garden", area: "West Ashley", address: "3550 Ashley River Rd, Charleston", lat: 32.8503, lng: -80.0703, tags: ["shade", "restrooms", "stroller", "parking"], ratings: { overall: 4.7, shade: 5, equipment: 4, cleanliness: 5, bugs: 2.5, safety: 4.5, toddlerFriendly: 5, nearbyFood: 2 }, desc: "Enchanting fairy garden with villages, houses, gnomes, and a storybook walk. Included with basic plantation admission.", passType: null, img: "🧚" },
  { id: 17, name: "Plymouth Park", area: "James Island", address: "1309 Ft. Johnson Rd, Charleston", lat: 32.7398, lng: -79.9245, tags: ["shade", "toddler", "swings", "picnic"], ratings: { overall: 4.2, shade: 5, equipment: 3.5, cleanliness: 3.5, bugs: 3, safety: 4, toddlerFriendly: 4, nearbyFood: 3 }, desc: "Waterfront park shaded by ancient oak trees. Community-donated toys for kids to play with. Across from a fire station.", passType: null, img: "🌊" },
  { id: 18, name: "Laurel Hill County Park", area: "Mt. Pleasant", address: "2351 Rifle Range Rd, Mt. Pleasant", lat: 32.8176, lng: -79.8302, tags: ["shade", "restrooms", "parking", "dogs", "stroller"], ratings: { overall: 4.4, shade: 5, equipment: 4, cleanliness: 4.5, bugs: 2.5, safety: 4.5, toddlerFriendly: 3.5, nearbyFood: 2 }, desc: "Pet-friendly park with 1.5 miles of hiking trails through 70 acres of protected bottomland forest and wetlands along the Ashley Scenic River.", passType: "gold", img: "🌲" },
  { id: 19, name: "Chadwick Park", area: "West Ashley", address: "600 Playground Rd, Charleston", lat: 32.7869, lng: -79.9945, tags: ["toddler", "fenced", "shade", "food"], ratings: { overall: 4.1, shade: 4, equipment: 3.5, cleanliness: 4, bugs: 3, safety: 4.5, toddlerFriendly: 5, nearbyFood: 4.5 }, desc: "Separate enclosed area for little ones, tennis court, basketball courts, and lots of local restaurants nearby.", passType: null, img: "🏀" },
  { id: 20, name: "Corrine Jones Playground", area: "Downtown", address: "36 Marlow Dr, Charleston", lat: 32.7929, lng: -79.9547, tags: ["toddler", "swings"], ratings: { overall: 3.7, shade: 3, equipment: 3.5, cleanliness: 3.5, bugs: 3, safety: 3.5, toddlerFriendly: 4, nearbyFood: 3 }, desc: "Community playground on the peninsula with basic play equipment and open space for running around.", passType: null, img: "🎈" },
  { id: 21, name: "Sol Legare Playground", area: "James Island", address: "2895 Sol Legare Rd, Johns Island", lat: 32.6932, lng: -79.9887, tags: ["parking", "toddler"], ratings: { overall: 3.5, shade: 2.5, equipment: 3, cleanliness: 3.5, bugs: 2.5, safety: 3.5, toddlerFriendly: 3.5, nearbyFood: 2 }, desc: "Quiet neighborhood playground off the beaten path. Good for a quick stop if you're in the area.", passType: null, img: "🌾" },
  { id: 22, name: "Sullivan's Island Park", area: "Sullivan's Island", address: "2056 Middle St, Sullivan's Island", lat: 32.7627, lng: -79.8437, tags: ["shade", "toddler", "food", "swings"], ratings: { overall: 4.3, shade: 4, equipment: 4, cleanliness: 4.5, bugs: 3, safety: 4.5, toddlerFriendly: 4, nearbyFood: 4.5 }, desc: "Charming island playground surrounded by oak trees. Walk to the beach, restaurants, and the Fort Moultrie visitors center.", passType: null, img: "🐚" },
  { id: 23, name: "Riverfront Park (North Charleston)", area: "North Charleston", address: "1001 Everglades Dr, N. Charleston", lat: 32.8781, lng: -79.9612, tags: ["shade", "restrooms", "parking", "splashpad", "stroller", "picnic"], ratings: { overall: 4.4, shade: 4, equipment: 4, cleanliness: 4.5, bugs: 3, safety: 4.5, toddlerFriendly: 4, nearbyFood: 3 }, desc: "Riverfront park with playground, splash pad, walking paths, and beautiful views. Regular community events.", passType: null, img: "🏞️" },
];

const ACTIVITIES = [
  { id: 100, name: "South Carolina Aquarium", area: "Downtown", address: "100 Aquarium Wharf, Charleston", type: "attraction", desc: "5,000+ marine animals, touch tanks, daily feedings. Great Ocean Tank with sharks and sea turtles.", icon: "🐠", link: "scaquarium.org", tags: ["Indoor", "Educational"] },
  { id: 101, name: "Children's Museum of the Lowcountry", area: "Downtown", address: "25 Ann St, Charleston", type: "attraction", desc: "Hands-on exhibits for little explorers. Pirate ship, Imagination Playground, and Lowcountry Livin' role play.", icon: "🎨", link: "explorecml.org", tags: ["Indoor", "Hands-on"] },
  { id: 102, name: "Charles Towne Landing", area: "West Ashley", address: "1500 Old Towne Rd, Charleston", type: "state_park", desc: "Where South Carolina began in 1670. Animal Forest zoo, replica sailing ship, 80 acres of gardens and trails.", icon: "🦬", link: "southcarolinaparks.com/charles-towne-landing", tags: ["Outdoor", "Historical", "State Park Pass"] },
  { id: 103, name: "Pack Athletics", area: "West Ashley", address: "1012 St. Andrews Blvd, Charleston", type: "activity", desc: "Family-oriented gym with cheerleading, tumbling, ninja classes, tot open gym, and summer camps for ages 4+.", icon: "🤸", link: "allaboutthepack.com", tags: ["Indoor", "Active", "Classes"] },
  { id: 104, name: "Pack Athletics Mt. Pleasant", area: "Mt. Pleasant", address: "1172 US Hwy 41, Mt. Pleasant", type: "activity", desc: "Second location with same great programs. Tumbling, cheer, open gym, birthday parties, and camps.", icon: "🤸", link: "allaboutthepack.com", tags: ["Indoor", "Active", "Classes"] },
  { id: 105, name: "Whirlin' Waters Waterpark", area: "North Charleston", address: "8888 University Blvd, N. Charleston", type: "attraction", desc: "Adrenaline-pumping water rides at Wannamaker County Park. Seasonal. Gold Pass gets you in!", icon: "🌊", link: "ccprc.com", tags: ["Outdoor", "Seasonal", "Gold Pass"] },
  { id: 106, name: "Splash Zone Waterpark", area: "James Island", address: "871 Riverland Dr, Charleston", type: "attraction", desc: "Rainforest-themed waterpark at James Island County Park. Perfect for younger kids.", icon: "🦜", link: "ccprc.com", tags: ["Outdoor", "Seasonal", "Gold Pass"] },
  { id: 107, name: "SK8 Charleston", area: "North Charleston", address: "8888 University Blvd, N. Charleston", type: "activity", desc: "32,000 sq ft skatepark with two bowls, street course, and 200+ ft snake run. All ages welcome.", icon: "🛹", link: "ccprc.com", tags: ["Outdoor", "Active", "Gold Pass"] },
  { id: 108, name: "Climbing Wall at JICP", area: "James Island", address: "871 Riverland Dr, Charleston", type: "activity", desc: "Outdoor climbing wall at James Island County Park. Great for adventurous kids 5+.", icon: "🧗", link: "ccprc.com", tags: ["Outdoor", "Active", "Gold Pass"] },
  { id: 109, name: "Patriots Point", area: "Mt. Pleasant", address: "40 Patriots Point Rd, Mt. Pleasant", type: "attraction", desc: "Explore the USS Yorktown aircraft carrier, submarine, and Medal of Honor Museum on Charleston Harbor.", icon: "🚢", link: "patriotspoint.org", tags: ["Indoor/Outdoor", "Historical", "Educational"] },
  { id: 110, name: "Magnolia Plantation & Gardens", area: "West Ashley", address: "3550 Ashley River Rd, Charleston", type: "attraction", desc: "Beautiful gardens with an enchanting children's fairy garden, nature train, and petting zoo.", icon: "🧚", link: "magnoliaplantation.com", tags: ["Outdoor", "Nature", "Educational"] },
  { id: 111, name: "Middleton Place", area: "West Ashley", address: "4300 Ashley River Rd, Charleston", type: "attraction", desc: "Historic plantation with stableyards, farm animals, and beautiful landscaped trails great for strollers.", icon: "🐴", link: "middletonplace.org", tags: ["Outdoor", "Historical", "Nature"] },
];

const LIBRARIES = [
  { id: 200, name: "Main Library Downtown", area: "Downtown", address: "68 Calhoun St, Charleston", icon: "📚", note: "Large children's section. Regular storytimes and crafts." },
  { id: 201, name: "Bees Ferry Library", area: "West Ashley", address: "3689 Bees Ferry Rd, Charleston", icon: "📚", note: "Two outdoor areas including a gated children's play space. Fan favorite!" },
  { id: 202, name: "Mt. Pleasant Library", area: "Mt. Pleasant", address: "1133 Mathis Ferry Rd, Mt. Pleasant", icon: "📚", note: "Excellent children's programs and reading areas." },
  { id: 203, name: "Otranto Road Library", area: "North Charleston", address: "2261 Otranto Rd, N. Charleston", icon: "📚", note: "Weekly storytimes and seasonal reading programs." },
  { id: 204, name: "James Island Library", area: "James Island", address: "1248 Camp Rd, Charleston", icon: "📚", note: "Cozy neighborhood branch with baby and toddler storytimes." },
  { id: 205, name: "John's Island Library", area: "Johns Island", address: "3531 Maybank Hwy, Johns Island", icon: "📚", note: "Community storytimes and summer reading programs." },
  { id: 206, name: "Hurd/St. Andrews Library", area: "West Ashley", address: "1735 N Woodmere Dr, Charleston", icon: "📚", note: "Newly renovated! Magic Mailbox for letters to Santa during holidays." },
  { id: 207, name: "Dorchester Road Library", area: "North Charleston", address: "6325 Dorchester Rd, N. Charleston", icon: "📚", note: "Regular children's programming and storytime kits available for checkout." },
];

const COMMUNITY = [
  { handle: "@chswithkids", name: "CHS With Kids", url: "https://www.instagram.com/chswithkids/", desc: "Local parent recommendations and weekend activity ideas" },
  { handle: "@charlestontoddlers", name: "Charleston Toddlers", url: "https://www.instagram.com/charlestontoddlers/", desc: "Toddler-specific activities, playdate meetups, and playground reviews" },
  { handle: "@littlesinthelowcountry", name: "Littles in the Lowcountry", url: "https://www.instagram.com/littlesinthelowcountry/", desc: "Family adventures, hidden gems, and seasonal events" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const StarRating = ({ value, size = 16 }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const fill = value >= i ? 1 : value >= i - 0.5 ? 0.5 : 0;
    stars.push(
      <span key={i} style={{ fontSize: size, color: fill > 0 ? "#F59E0B" : "#D1D5DB", position: "relative", display: "inline-block", lineHeight: 1 }}>
        {fill === 0.5 ? (
          <span style={{ position: "relative" }}>
            <span style={{ color: "#D1D5DB" }}>★</span>
            <span style={{ position: "absolute", left: 0, top: 0, width: "50%", overflow: "hidden", color: "#F59E0B" }}>★</span>
          </span>
        ) : fill === 1 ? "★" : "★"}
      </span>
    );
  }
  return <span style={{ display: "inline-flex", gap: 1, alignItems: "center" }}>{stars} <span style={{ fontSize: size * 0.75, color: "#6B7280", marginLeft: 4, fontWeight: 600 }}>{value.toFixed(1)}</span></span>;
};

const Badge = ({ children, color = "#E0F2FE", textColor = "#0369A1", style = {} }) => (
  <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: color, color: textColor, whiteSpace: "nowrap", ...style }}>{children}</span>
);

const PassBadge = ({ type }) => {
  if (type === "gold") return <Badge color="#FEF3C7" textColor="#92400E">🏅 Gold Pass</Badge>;
  if (type === "state") return <Badge color="#D1FAE5" textColor="#065F46">🌲 State Park Pass</Badge>;
  return null;
};

// ─── Main App ────────────────────────────────────────────────────────────────
export default function CharlestonPlaygrounds() {
  const [view, setView] = useState("playgrounds");
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState("overall");
  const [search, setSearch] = useState("");
  const [selectedPlayground, setSelectedPlayground] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [bucketList, setBucketList] = useState([]);
  const [visited, setVisited] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRatings, setUserRatings] = useState({});
  const [showOnboarding, setShowOnboarding] = useState(true);

  const toggleFav = useCallback((id) => setFavorites(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]), []);
  const toggleBucket = useCallback((id) => setBucketList(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]), []);
  const toggleVisited = useCallback((id) => setVisited(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]), []);
  const toggleTag = useCallback((tag) => setSelectedTags(p => p.includes(tag) ? p.filter(x => x !== tag) : [...p, tag]), []);

  const filtered = useMemo(() => {
    let result = PLAYGROUNDS;
    if (selectedArea !== "All Areas") result = result.filter(p => p.area === selectedArea);
    if (selectedTags.length) result = result.filter(p => selectedTags.every(t => p.tags.includes(t)));
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(s) || p.desc.toLowerCase().includes(s) || p.area.toLowerCase().includes(s));
    }
    result = [...result].sort((a, b) => (b.ratings[sortBy] || 0) - (a.ratings[sortBy] || 0));
    return result;
  }, [selectedArea, selectedTags, search, sortBy]);

  const bucketProgress = bucketList.length > 0 ? Math.round((bucketList.filter(id => visited.includes(id)).length / bucketList.length) * 100) : 0;

  // ─── Styles ──────────────────────────────────────────────────────────────
  const palette = {
    bg: "#FEFCF3",
    card: "#FFFFFF",
    primary: "#2D6A4F",
    primaryLight: "#D8F3DC",
    accent: "#F4845F",
    accentLight: "#FDDDD2",
    text: "#1B1B1E",
    textMuted: "#6B7280",
    border: "#E5E7EB",
    sand: "#F5ECD7",
    ocean: "#CAF0F8",
    oceanDark: "#0077B6",
    warm: "#FFF8F0",
  };

  const navItems = [
    { key: "playgrounds", label: "Playgrounds", icon: "🛝" },
    { key: "activities", label: "Activities", icon: "🎪" },
    { key: "libraries", label: "Libraries", icon: "📚" },
    { key: "passes", label: "Passes", icon: "🎫" },
    { key: "community", label: "Community", icon: "💬" },
  ];

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Nunito', 'Segoe UI', sans-serif", background: palette.bg, minHeight: "100vh", color: palette.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Lilita+One&display=swap" rel="stylesheet" />

      {/* ─── Onboarding Modal ─── */}
      {showOnboarding && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "white", borderRadius: 24, padding: "40px 32px", maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 24px 48px rgba(0,0,0,0.15)" }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>🛝</div>
            <h1 style={{ fontFamily: "'Lilita One', cursive", fontSize: 28, color: palette.primary, margin: "0 0 8px" }}>Charleston Playgrounds</h1>
            <p style={{ color: palette.textMuted, fontSize: 15, lineHeight: 1.6, margin: "0 0 24px" }}>
              Every playground in the Charleston area — rated, reviewed, and mapped so you can scout before you go. From shade and fencing to bug levels and nearby lunch spots.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
              {["🔒 Fenced?", "🌳 Shaded?", "🦟 Bugs?", "🍔 Food?", "👶 Toddler?", "♿ Inclusive?"].map(t => (
                <span key={t} style={{ background: palette.primaryLight, color: palette.primary, padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>{t}</span>
              ))}
            </div>
            <input
              value={userName}
              onChange={e => setUserName(e.target.value)}
              placeholder="Your name (optional)"
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `2px solid ${palette.border}`, fontSize: 15, marginBottom: 16, boxSizing: "border-box", outline: "none", fontFamily: "inherit" }}
            />
            <button
              onClick={() => setShowOnboarding(false)}
              style={{ width: "100%", padding: "14px", borderRadius: 14, background: palette.primary, color: "white", border: "none", fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", transition: "transform 0.15s" }}
              onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
            >
              Start Exploring →
            </button>
          </div>
        </div>
      )}

      {/* ─── Header ─── */}
      <header style={{ background: `linear-gradient(135deg, ${palette.primary} 0%, #1B4332 100%)`, color: "white", padding: "20px 24px 16px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontFamily: "'Lilita One', cursive", fontSize: 22, margin: 0, letterSpacing: 0.5 }}>
              🛝 Charleston Playgrounds
            </h1>
            <p style={{ fontSize: 12, opacity: 0.8, margin: "4px 0 0", fontWeight: 600 }}>Scout every playground in the Lowcountry</p>
          </div>
          <button onClick={() => setShowProfile(!showProfile)} style={{ background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)", borderRadius: 12, padding: "8px 14px", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            {userName || "My Profile"} ✦
          </button>
        </div>
      </header>

      {/* ─── Nav ─── */}
      <nav style={{ background: "white", borderBottom: `1px solid ${palette.border}`, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", overflowX: "auto", padding: "0 8px" }}>
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => { setView(item.key); setSelectedPlayground(null); }}
              style={{
                flex: "0 0 auto", padding: "12px 16px", border: "none", background: "none", cursor: "pointer",
                fontFamily: "inherit", fontSize: 13, fontWeight: view === item.key ? 800 : 600,
                color: view === item.key ? palette.primary : palette.textMuted,
                borderBottom: view === item.key ? `3px solid ${palette.primary}` : "3px solid transparent",
                transition: "all 0.2s", whiteSpace: "nowrap"
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ─── Profile Drawer ─── */}
      {showProfile && (
        <div style={{ background: palette.warm, borderBottom: `1px solid ${palette.border}`, padding: "20px 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'Lilita One', cursive", fontSize: 20, margin: 0, color: palette.primary }}>
                {userName ? `${userName}'s Dashboard` : "Your Dashboard"}
              </h2>
              <button onClick={() => setShowProfile(false)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 16 }}>
              {[
                { label: "Favorites", val: favorites.length, icon: "❤️", color: "#FEE2E2" },
                { label: "Bucket List", val: bucketList.length, icon: "🪣", color: "#E0F2FE" },
                { label: "Visited", val: visited.length, icon: "✅", color: "#D1FAE5" },
                { label: "Rated", val: Object.keys(userRatings).length, icon: "⭐", color: "#FEF3C7" },
              ].map(s => (
                <div key={s.label} style={{ background: s.color, borderRadius: 16, padding: "14px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 24 }}>{s.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, margin: "4px 0" }}>{s.val}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: palette.textMuted }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Bucket List Progress */}
            {bucketList.length > 0 && (
              <div style={{ background: "white", borderRadius: 16, padding: "16px 20px", border: `1px solid ${palette.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontWeight: 800, fontSize: 14 }}>🪣 Bucket List Progress</span>
                  <span style={{ fontWeight: 800, fontSize: 14, color: palette.primary }}>{bucketProgress}%</span>
                </div>
                <div style={{ background: palette.border, borderRadius: 8, height: 10, overflow: "hidden" }}>
                  <div style={{ background: `linear-gradient(90deg, ${palette.primary}, #52B788)`, height: "100%", width: `${bucketProgress}%`, borderRadius: 8, transition: "width 0.5s ease" }} />
                </div>
                <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {bucketList.map(id => {
                    const pg = PLAYGROUNDS.find(p => p.id === id);
                    if (!pg) return null;
                    return (
                      <span key={id} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: visited.includes(id) ? "#D1FAE5" : "#F3F4F6", padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600, textDecoration: visited.includes(id) ? "line-through" : "none", opacity: visited.includes(id) ? 0.7 : 1 }}>
                        {pg.img} {pg.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Main Content ─── */}
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 100px" }}>

        {/* ═══ PLAYGROUNDS VIEW ═══ */}
        {view === "playgrounds" && !selectedPlayground && (
          <>
            {/* Search */}
            <div style={{ marginTop: 20 }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="🔍 Search playgrounds by name, area, or feature..."
                style={{ width: "100%", padding: "14px 18px", borderRadius: 16, border: `2px solid ${palette.border}`, fontSize: 15, boxSizing: "border-box", outline: "none", fontFamily: "inherit", background: "white", transition: "border 0.2s" }}
                onFocus={e => e.target.style.borderColor = palette.primary}
                onBlur={e => e.target.style.borderColor = palette.border}
              />
            </div>

            {/* Area Filter */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
              {AREAS.map(a => (
                <button
                  key={a}
                  onClick={() => setSelectedArea(a)}
                  style={{
                    padding: "8px 14px", borderRadius: 20, border: "none", cursor: "pointer",
                    background: selectedArea === a ? palette.primary : "white",
                    color: selectedArea === a ? "white" : palette.text,
                    fontWeight: 700, fontSize: 12, fontFamily: "inherit",
                    boxShadow: selectedArea === a ? "0 2px 8px rgba(45,106,79,0.3)" : "0 1px 3px rgba(0,0,0,0.08)",
                    transition: "all 0.2s"
                  }}
                >
                  {a}
                </button>
              ))}
            </div>

            {/* Tag Filters */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
              {Object.entries(TAGS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => toggleTag(key)}
                  style={{
                    padding: "6px 12px", borderRadius: 16, cursor: "pointer",
                    border: selectedTags.includes(key) ? `2px solid ${palette.accent}` : "2px solid transparent",
                    background: selectedTags.includes(key) ? palette.accentLight : "#F9FAFB",
                    color: selectedTags.includes(key) ? "#C2410C" : palette.textMuted,
                    fontWeight: 600, fontSize: 11, fontFamily: "inherit", transition: "all 0.15s"
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: palette.textMuted }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{ padding: "6px 12px", borderRadius: 10, border: `1px solid ${palette.border}`, fontSize: 12, fontWeight: 600, fontFamily: "inherit", background: "white", cursor: "pointer" }}
              >
                {RATING_CATS.map(c => <option key={c.key} value={c.key}>{c.icon} {c.label}</option>)}
              </select>
              <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 700, color: palette.textMuted }}>
                {filtered.length} playground{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Playground Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 12 }}>
              {filtered.map(pg => (
                <div
                  key={pg.id}
                  onClick={() => setSelectedPlayground(pg)}
                  style={{
                    background: "white", borderRadius: 20, padding: "20px", cursor: "pointer",
                    border: `1px solid ${palette.border}`, transition: "all 0.2s",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ fontSize: 40, width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", background: palette.sand, borderRadius: 16, flexShrink: 0 }}>
                      {pg.img}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        <div>
                          <h3 style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 800 }}>{pg.name}</h3>
                          <p style={{ margin: 0, fontSize: 12, color: palette.textMuted, fontWeight: 600 }}>📍 {pg.area} — {pg.address}</p>
                        </div>
                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                          <button onClick={e => { e.stopPropagation(); toggleFav(pg.id); }} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", padding: 0 }} title="Favorite">
                            {favorites.includes(pg.id) ? "❤️" : "🤍"}
                          </button>
                          <button onClick={e => { e.stopPropagation(); toggleBucket(pg.id); }} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", padding: 0 }} title="Bucket list">
                            {bucketList.includes(pg.id) ? "🪣" : "🪣"}
                          </button>
                        </div>
                      </div>
                      <div style={{ margin: "8px 0 6px" }}>
                        <StarRating value={pg.ratings.overall} size={15} />
                      </div>
                      <p style={{ margin: "0 0 8px", fontSize: 13, color: "#4B5563", lineHeight: 1.5 }}>{pg.desc}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {pg.passType && <PassBadge type={pg.passType} />}
                        {pg.tags.slice(0, 5).map(t => <Badge key={t} style={{ fontSize: 11 }}>{TAGS[t]}</Badge>)}
                        {pg.tags.length > 5 && <Badge color="#F3F4F6" textColor="#6B7280" style={{ fontSize: 11 }}>+{pg.tags.length - 5} more</Badge>}
                      </div>
                      {(bucketList.includes(pg.id) || visited.includes(pg.id)) && (
                        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                          {bucketList.includes(pg.id) && <Badge color="#E0F2FE" textColor="#0369A1" style={{ fontSize: 11 }}>🪣 On Bucket List</Badge>}
                          {visited.includes(pg.id) && <Badge color="#D1FAE5" textColor="#065F46" style={{ fontSize: 11 }}>✅ Visited</Badge>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: 60, color: palette.textMuted }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                  <p style={{ fontWeight: 700 }}>No playgrounds match your filters</p>
                  <p style={{ fontSize: 13 }}>Try adjusting your area or tag selections</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ═══ PLAYGROUND DETAIL VIEW ═══ */}
        {view === "playgrounds" && selectedPlayground && (() => {
          const pg = selectedPlayground;
          return (
            <div style={{ marginTop: 20 }}>
              <button onClick={() => setSelectedPlayground(null)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700, color: palette.primary, marginBottom: 16, padding: 0 }}>
                ← Back to all playgrounds
              </button>
              <div style={{ background: "white", borderRadius: 24, padding: "28px 24px", border: `1px solid ${palette.border}`, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 56, width: 72, height: 72, display: "flex", alignItems: "center", justifyContent: "center", background: palette.sand, borderRadius: 20 }}>{pg.img}</div>
                  <div>
                    <h2 style={{ margin: "0 0 4px", fontFamily: "'Lilita One', cursive", fontSize: 24, color: palette.primary }}>{pg.name}</h2>
                    <p style={{ margin: 0, fontSize: 14, color: palette.textMuted, fontWeight: 600 }}>📍 {pg.area} — {pg.address}</p>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                  <button onClick={() => toggleFav(pg.id)} style={{ padding: "10px 16px", borderRadius: 12, border: `2px solid ${favorites.includes(pg.id) ? "#EF4444" : palette.border}`, background: favorites.includes(pg.id) ? "#FEE2E2" : "white", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 13 }}>
                    {favorites.includes(pg.id) ? "❤️ Favorited" : "🤍 Favorite"}
                  </button>
                  <button onClick={() => toggleBucket(pg.id)} style={{ padding: "10px 16px", borderRadius: 12, border: `2px solid ${bucketList.includes(pg.id) ? palette.oceanDark : palette.border}`, background: bucketList.includes(pg.id) ? palette.ocean : "white", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 13 }}>
                    {bucketList.includes(pg.id) ? "🪣 On Bucket List" : "🪣 Add to Bucket List"}
                  </button>
                  <button onClick={() => toggleVisited(pg.id)} style={{ padding: "10px 16px", borderRadius: 12, border: `2px solid ${visited.includes(pg.id) ? "#059669" : palette.border}`, background: visited.includes(pg.id) ? "#D1FAE5" : "white", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 13 }}>
                    {visited.includes(pg.id) ? "✅ Visited!" : "☐ Mark Visited"}
                  </button>
                </div>

                <p style={{ fontSize: 15, lineHeight: 1.7, color: "#374151", margin: "0 0 20px" }}>{pg.desc}</p>

                {pg.passType && <div style={{ marginBottom: 16 }}><PassBadge type={pg.passType} /></div>}

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
                  {pg.tags.map(t => <Badge key={t}>{TAGS[t]}</Badge>)}
                </div>

                {/* Ratings Grid */}
                <h3 style={{ fontFamily: "'Lilita One', cursive", fontSize: 18, color: palette.primary, margin: "0 0 12px" }}>Community Ratings</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 24 }}>
                  {RATING_CATS.map(cat => (
                    <div key={cat.key} style={{ background: "#F9FAFB", borderRadius: 14, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{cat.icon} {cat.label}</span>
                      <StarRating value={pg.ratings[cat.key] || 0} size={14} />
                    </div>
                  ))}
                </div>

                {/* User Rating */}
                <div style={{ background: palette.warm, borderRadius: 16, padding: "20px", marginBottom: 16 }}>
                  <h4 style={{ margin: "0 0 12px", fontWeight: 800, fontSize: 15 }}>⭐ Rate This Playground</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
                    {RATING_CATS.map(cat => (
                      <div key={cat.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{cat.icon} {cat.label}</span>
                        <div style={{ display: "flex", gap: 2 }}>
                          {[1,2,3,4,5].map(n => (
                            <button
                              key={n}
                              onClick={() => setUserRatings(prev => ({ ...prev, [`${pg.id}-${cat.key}`]: n }))}
                              style={{
                                background: "none", border: "none", fontSize: 18, cursor: "pointer", padding: "0 1px",
                                color: (userRatings[`${pg.id}-${cat.key}`] || 0) >= n ? "#F59E0B" : "#D1D5DB"
                              }}
                            >★</button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map link */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${pg.lat},${pg.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", background: palette.primary, color: "white", borderRadius: 14, textDecoration: "none", fontWeight: 800, fontSize: 14, fontFamily: "inherit" }}
                >
                  📍 Open in Google Maps
                </a>
              </div>
            </div>
          );
        })()}

        {/* ═══ ACTIVITIES VIEW ═══ */}
        {view === "activities" && (
          <div style={{ marginTop: 20 }}>
            <h2 style={{ fontFamily: "'Lilita One', cursive", fontSize: 22, color: palette.primary, margin: "0 0 4px" }}>More Things to Do with Kids</h2>
            <p style={{ color: palette.textMuted, fontSize: 14, margin: "0 0 20px", fontWeight: 600 }}>Museums, attractions, sports, and outdoor adventures around Charleston</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {ACTIVITIES.map(act => (
                <div key={act.id} style={{ background: "white", borderRadius: 20, padding: "20px", border: `1px solid ${palette.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ fontSize: 36, width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", background: act.type === "state_park" ? "#D1FAE5" : act.type === "activity" ? "#FEF3C7" : palette.ocean, borderRadius: 14, flexShrink: 0 }}>
                      {act.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 800 }}>{act.name}</h3>
                      <p style={{ margin: "0 0 6px", fontSize: 12, color: palette.textMuted, fontWeight: 600 }}>📍 {act.area} — {act.address}</p>
                      <p style={{ margin: "0 0 8px", fontSize: 13, color: "#4B5563", lineHeight: 1.5 }}>{act.desc}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {act.tags.map(t => (
                          <Badge key={t} color={t.includes("Gold") || t.includes("State") ? "#FEF3C7" : "#E0F2FE"} textColor={t.includes("Gold") || t.includes("State") ? "#92400E" : "#0369A1"} style={{ fontSize: 11 }}>
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ LIBRARIES VIEW ═══ */}
        {view === "libraries" && (
          <div style={{ marginTop: 20 }}>
            <h2 style={{ fontFamily: "'Lilita One', cursive", fontSize: 22, color: palette.primary, margin: "0 0 4px" }}>Library Storytimes & Programs</h2>
            <p style={{ color: palette.textMuted, fontSize: 14, margin: "0 0 8px", fontWeight: 600 }}>
              Charleston County Public Libraries offer free storytimes, crafts, reading programs, playrooms, and even passes to the SC Aquarium, Children's Museum, and State Parks through the Explore with CCPL program.
            </p>
            <div style={{ background: palette.primaryLight, borderRadius: 16, padding: "14px 18px", marginBottom: 20, fontSize: 13, lineHeight: 1.6, fontWeight: 600 }}>
              💡 <strong>Pro tip:</strong> Ask your library about Storytime Kits (30+ themed kits with books, games, puzzles, and stuffed animals) and the Explore with CCPL program for free museum and park passes!
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {LIBRARIES.map(lib => (
                <div key={lib.id} style={{ background: "white", borderRadius: 18, padding: "18px 20px", border: `1px solid ${palette.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{lib.icon}</div>
                  <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 800 }}>{lib.name}</h3>
                  <p style={{ margin: "0 0 8px", fontSize: 12, color: palette.textMuted, fontWeight: 600 }}>📍 {lib.area} — {lib.address}</p>
                  <p style={{ margin: 0, fontSize: 13, color: "#4B5563", lineHeight: 1.5 }}>{lib.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ PASSES VIEW ═══ */}
        {view === "passes" && (
          <div style={{ marginTop: 20 }}>
            <h2 style={{ fontFamily: "'Lilita One', cursive", fontSize: 22, color: palette.primary, margin: "0 0 16px" }}>Passes & Memberships</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Gold Pass */}
              <div style={{ background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)", borderRadius: 24, padding: "24px", border: "2px solid #F59E0B" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 36 }}>🏅</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#78350F" }}>Charleston County Gold Pass</h3>
                    <p style={{ margin: "2px 0 0", fontSize: 13, color: "#92400E", fontWeight: 600 }}>$84/yr residents • $99/yr non-residents • $69/yr seniors</p>
                  </div>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#78350F", margin: "0 0 12px" }}>
                  Unlimited admission to 15+ county parks for up to 15 people per vehicle. Includes beaches (Isle of Palms, Folly, Kiawah), all county parks, waterparks, Holiday Festival of Lights, and $15 off SC Aquarium memberships.
                </p>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#92400E" }}>
                  🛝 Playgrounds included: Palmetto Islands, James Island County Park, Wannamaker, Laurel Hill, and more
                </div>
              </div>

              {/* State Park Pass */}
              <div style={{ background: "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)", borderRadius: 24, padding: "24px", border: "2px solid #059669" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 36 }}>🌲</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#064E3B" }}>SC State Park Pass (All Park Passport)</h3>
                    <p style={{ margin: "2px 0 0", fontSize: 13, color: "#065F46", fontWeight: 600 }}>Available online, at parks, or borrow free from your library!</p>
                  </div>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#064E3B", margin: "0 0 12px" }}>
                  Access to all SC State Parks including Charles Towne Landing (Animal Forest zoo, replica sailing ship, 80 acres of gardens), plus beaches at Edisto, Hunting Island, Huntington Beach, and Myrtle Beach state parks.
                </p>
              </div>

              {/* Explore with CCPL */}
              <div style={{ background: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)", borderRadius: 24, padding: "24px", border: "2px solid #0284C7" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 36 }}>📚</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#0C4A6E" }}>Explore with CCPL (Free!)</h3>
                    <p style={{ margin: "2px 0 0", fontSize: 13, color: "#0369A1", fontWeight: 600 }}>Borrow passes from Charleston County libraries</p>
                  </div>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#0C4A6E", margin: "0 0 12px" }}>
                  Free entry for 2 adults and up to 8 children to the SC Aquarium, Children's Museum, Gibbes Museum, Charleston County Parks, and SC State Parks. Also includes telescope checkout! Note: popular passes have waitlists.
                </p>
              </div>

              {/* SC Aquarium Membership */}
              <div style={{ background: "white", borderRadius: 24, padding: "24px", border: `1px solid ${palette.border}` }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 36 }}>🐠</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>SC Aquarium Membership</h3>
                    <p style={{ margin: "2px 0 0", fontSize: 13, color: palette.textMuted, fontWeight: 600 }}>$15 off with Gold Pass • Free passes available at libraries</p>
                  </div>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#4B5563" }}>
                  Unlimited visits, guest passes, member events, and reciprocal admission at aquariums nationwide. If you plan to visit more than twice a year, a membership pays for itself.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══ COMMUNITY VIEW ═══ */}
        {view === "community" && (
          <div style={{ marginTop: 20 }}>
            <h2 style={{ fontFamily: "'Lilita One', cursive", fontSize: 22, color: palette.primary, margin: "0 0 4px" }}>Community & Local Voices</h2>
            <p style={{ color: palette.textMuted, fontSize: 14, margin: "0 0 20px", fontWeight: 600 }}>
              Follow these local accounts for playground reviews, weekend ideas, and the latest family events
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
              {COMMUNITY.map(c => (
                <a
                  key={c.handle}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", gap: 16, alignItems: "center",
                    background: "white", borderRadius: 20, padding: "18px 20px",
                    border: `1px solid ${palette.border}`, textDecoration: "none", color: palette.text,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "all 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #F472B6, #C084FC, #818CF8)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 900, fontSize: 20, flexShrink: 0 }}>
                    📷
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{c.name}</div>
                    <div style={{ fontSize: 13, color: palette.primary, fontWeight: 700 }}>{c.handle}</div>
                    <div style={{ fontSize: 13, color: palette.textMuted, marginTop: 2 }}>{c.desc}</div>
                  </div>
                </a>
              ))}
            </div>

            <div style={{ background: palette.warm, borderRadius: 20, padding: "24px", textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>💌</div>
              <h3 style={{ fontFamily: "'Lilita One', cursive", fontSize: 18, color: palette.primary, margin: "0 0 8px" }}>Know a playground we're missing?</h3>
              <p style={{ fontSize: 14, color: palette.textMuted, lineHeight: 1.6, margin: 0 }}>
                Charleston is full of hidden gems. If you know a playground, park, or activity we should add, share it with the community! This site is built by Charleston parents, for Charleston parents.
              </p>
            </div>

            <div style={{ marginTop: 24 }}>
              <h3 style={{ fontFamily: "'Lilita One', cursive", fontSize: 18, color: palette.primary, margin: "0 0 12px" }}>More Local Resources</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
                {[
                  { name: "Kidding Around Charleston", desc: "Events, guides, and bucket lists", icon: "🎉" },
                  { name: "Charleston Moms", desc: "Parenting resources and local guides", icon: "👩‍👧‍👦" },
                  { name: "Lowcountry Parent", desc: "Activities, camps, and family news", icon: "📰" },
                  { name: "CCPL Events Calendar", desc: "Library storytimes and programs", icon: "📅" },
                ].map(r => (
                  <div key={r.name} style={{ background: "white", borderRadius: 16, padding: "16px", border: `1px solid ${palette.border}` }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{r.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 2 }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: palette.textMuted }}>{r.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─── Footer ─── */}
      <footer style={{ background: "#1B4332", color: "rgba(255,255,255,0.7)", textAlign: "center", padding: "24px 20px", fontSize: 12, lineHeight: 1.8 }}>
        <div style={{ fontFamily: "'Lilita One', cursive", fontSize: 16, color: "white", marginBottom: 4 }}>🛝 charlestonplaygrounds.com</div>
        <p style={{ margin: 0 }}>Made with ❤️ by Charleston parents, for Charleston parents</p>
        <p style={{ margin: "4px 0 0", fontSize: 11, opacity: 0.6 }}>Inspired by a two-year-old's New Year's resolution to visit every playground in Charleston</p>
      </footer>
    </div>
  );
}
