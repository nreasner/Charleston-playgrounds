import { useState, useMemo, useCallback } from "react";

const P = {
  bg:"#FAF9F6",card:"#FFFFFF",primary:"#2D6A4F",primaryDark:"#1B4332",
  primaryLight:"#D8F3DC",accent:"#F4845F",accentLight:"#FDDDD2",
  text:"#1B1B1E",muted:"#6B7280",border:"#E8E8E8",sand:"#F5ECD7",
  ocean:"#CAF0F8",oceanDark:"#0077B6",warm:"#FFF8F0",red:"#EF4444",
  gold:"#F59E0B",green:"#059669",
};

const TAGS={fenced:"🔒 Fenced",shade:"🌳 Shaded",splashpad:"💦 Splash Pad",restrooms:"🚻 Restrooms",toddler:"👶 Toddler Area",parking:"🅿️ Parking",dogs:"🐕 Dogs OK",food:"🍔 Near Food",stroller:"🛤️ Stroller Paths",inclusive:"♿ Inclusive",swings:"🎪 Swings",picnic:"🧺 Picnic"};
const AREAS=["All","Downtown","West Ashley","Mt. Pleasant","North Charleston","James Island","Johns Island","Daniel Island","Sullivan's Island","Folly Beach"];
const RCATS=[{key:"overall",label:"Overall",icon:"⭐"},{key:"shade",label:"Shade",icon:"🌳"},{key:"equipment",label:"Equipment",icon:"🎠"},{key:"cleanliness",label:"Clean",icon:"✨"},{key:"bugs",label:"Low Bugs",icon:"🦟"},{key:"safety",label:"Safety",icon:"🛡️"},{key:"toddlerFriendly",label:"Tot-Friendly",icon:"👶"},{key:"nearbyFood",label:"Food Nearby",icon:"🍕"}];

const PG=[
  {id:1,name:"Park Circle Playground",area:"North Charleston",addr:"4800 Park Circle, North Charleston, SC 29405",lat:32.8891,lng:-79.9611,tags:["fenced","shade","inclusive","restrooms","toddler","parking","swings","picnic"],r:{overall:4.9,shade:5,equipment:5,cleanliness:4.5,bugs:3.5,safety:5,toddlerFriendly:5,nearbyFood:4.5},desc:"World's largest inclusive playground — 55,000 sq ft. Ninja courses, zip lines, climbing for all ages & abilities. Fully fenced with shade sails.",photo:"https://images.unsplash.com/photo-1596997000103-e597b3ca50df?w=800&h=450&fit=crop",pass:null,eats:[{n:"EVO Craft Bakery + Bar",t:"Bakery/Pizza",d:"Fresh pizzas, salads, pastries. Great patio.",a:"1075 E Montague Ave"},{n:"Jackrabbit Filly",t:"Farm-to-table",d:"Veggie-forward menu. Walk from playground.",a:"4628 Spruill Ave"},{n:"Madra Rua Irish Pub",t:"Pub/Family",d:"Kid-friendly outdoor seating in Park Circle.",a:"1034 E Montague Ave"}]},
  {id:2,name:"Mt. Pleasant Waterfront Park",area:"Mt. Pleasant",addr:"99 Harry M Hallman Jr Blvd, Mt. Pleasant, SC 29464",lat:32.7924,lng:-79.9086,tags:["shade","splashpad","restrooms","toddler","parking","food","stroller","swings","picnic"],r:{overall:4.8,shade:4,equipment:4.5,cleanliness:4.5,bugs:3,safety:4.5,toddlerFriendly:5,nearbyFood:4},desc:"Iconic pirate-ship playground beneath the Ravenel Bridge. Three age-separated play zones, pier fishing, dolphin watching.",photo:"https://images.unsplash.com/photo-1564429238961-bf8f8a7d0773?w=800&h=450&fit=crop",pass:null,eats:[{n:"Page's Okra Grill",t:"Lowcountry",d:"Fresh Lowcountry food, great kids' portions.",a:"302 Coleman Blvd"},{n:"Coastal Crust",t:"Wood-fire Pizza",d:"Outdoor seating with truck playground for kids!",a:"219 Simmons St"},{n:"Pitt Street Pharmacy",t:"Deli/Ice Cream",d:"Old-school soda fountain. Kids love it.",a:"111 Pitt St"}]},
  {id:3,name:"Hampton Park Playground",area:"Downtown",addr:"30 Mary Murray Dr, Charleston, SC 29403",lat:32.7968,lng:-79.9475,tags:["shade","stroller","toddler","dogs","picnic"],r:{overall:4.6,shade:5,equipment:4,cleanliness:4.5,bugs:3,safety:4.5,toddlerFriendly:5,nearbyFood:3.5},desc:"Beautiful shaded playground surrounded by gardens and duck ponds. Soft play surface, stroller-friendly loop.",photo:"https://images.unsplash.com/photo-1575783970733-1aaedde1db74?w=800&h=450&fit=crop",pass:null,eats:[{n:"Basic Kitchen",t:"Health-Forward",d:"Plant-based options, grilled salmon kids' meals, smoothies.",a:"82 Wentworth St"},{n:"Rodney Scott's BBQ",t:"BBQ",d:"Award-winning whole-hog BBQ. Family platters.",a:"1011 King St"}]},
  {id:4,name:"Hazel Parker Playground",area:"Downtown",addr:"70 East Bay St, Charleston, SC 29401",lat:32.7716,lng:-79.9251,tags:["shade","restrooms","toddler","dogs","swings","stroller"],r:{overall:4.5,shade:4,equipment:4,cleanliness:4,bugs:3,safety:4,toddlerFriendly:4.5,nearbyFood:5},desc:"Beloved downtown park with refurbished equipment, dog run, basketball & tennis courts. Walk to East Bay restaurants.",photo:"https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&h=450&fit=crop",pass:null,eats:[{n:"Fleet Landing",t:"Seafood/Casual",d:"Waterfront deck, fresh seafood, great kids' menu.",a:"186 Concord St"},{n:"Callie's Hot Little Biscuit",t:"Bakery",d:"Mini biscuits to-go. Kids love the variety.",a:"476 King St"}]},
  {id:5,name:"West Ashley Park",area:"West Ashley",addr:"3601 Mary Ader Dr, Charleston, SC 29414",lat:32.8135,lng:-79.9924,tags:["shade","restrooms","toddler","parking","dogs","stroller","swings","picnic"],r:{overall:4.5,shade:4,equipment:4.5,cleanliness:4,bugs:3,safety:4,toddlerFriendly:4.5,nearbyFood:3},desc:"260 acres — climbing webs, tunnels, toddler area, fishing dock, disc golf, walking trails.",photo:"https://images.unsplash.com/photo-1680458841867-345ded733087?w=800&h=450&fit=crop",pass:null,eats:[{n:"Swig & Swine",t:"BBQ/Casual",d:"Great BBQ, kid-friendly menu.",a:"1217 Savannah Hwy"},{n:"Boxcar Betty's",t:"Sandwiches",d:"Famous fried chicken sandwiches.",a:"1922 Savannah Hwy"}]},
  {id:6,name:"Ackerman Park",area:"West Ashley",addr:"55 Sycamore Ave, Charleston, SC 29407",lat:32.7841,lng:-79.9793,tags:["toddler","dogs","parking","swings"],r:{overall:4.2,shade:2.5,equipment:4,cleanliness:4,bugs:3,safety:4,toddlerFriendly:4,nearbyFood:3.5},desc:"Hidden gem — modern climbing equipment, slides, spinning structures. Dog park adjacent. Limited shade!",photo:"https://images.unsplash.com/photo-1566454825481-f8f0e2d84bba?w=800&h=450&fit=crop",pass:null,eats:[{n:"Edmund's Oast Brewing Co",t:"Brewery/Casual",d:"Spacious lawn for kids. Great food + beer for parents.",a:"1505 King St Ext"}]},
  {id:7,name:"Palmetto Islands County Park",area:"Mt. Pleasant",addr:"444 Needlerush Pkwy, Mt. Pleasant, SC 29464",lat:32.8357,lng:-79.8366,tags:["shade","restrooms","toddler","parking","picnic","swings"],r:{overall:4.7,shade:5,equipment:5,cleanliness:4.5,bugs:2.5,safety:4.5,toddlerFriendly:4.5,nearbyFood:2},desc:"Heavily shaded with the 50-foot 'Big Toy' observation tower, sandbox, covered picnic areas with grills.",photo:"https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&h=450&fit=crop",pass:"gold",eats:[{n:"Lillie Fuel",t:"Healthy/Quick",d:"Great kid options, sandwiches. Order ahead.",a:"426 W Coleman Blvd"}]},
  {id:8,name:"James Island County Park",area:"James Island",addr:"871 Riverland Dr, Charleston, SC 29412",lat:32.7467,lng:-79.968,tags:["shade","restrooms","splashpad","toddler","parking","dogs","stroller","swings","picnic"],r:{overall:4.8,shade:4.5,equipment:4.5,cleanliness:5,bugs:3,safety:5,toddlerFriendly:5,nearbyFood:2.5},desc:"Massive county park — playground, Splash Zone waterpark, dog park, fishing, climbing wall, Holiday Festival of Lights.",photo:"https://images.unsplash.com/photo-1596997000103-e597b3ca50df?w=800&h=450&fit=crop",pass:"gold",eats:[{n:"Kickin' Chicken",t:"Chicken/Casual",d:"Kids love the chicken fingers. Quick and easy.",a:"1626 Camp Rd"}]},
  {id:9,name:"Wannamaker County Park",area:"North Charleston",addr:"8888 University Blvd, N. Charleston, SC 29406",lat:32.9278,lng:-80.0411,tags:["shade","restrooms","splashpad","toddler","parking","stroller","swings","picnic"],r:{overall:4.6,shade:5,equipment:4.5,cleanliness:4.5,bugs:3,safety:4.5,toddlerFriendly:4.5,nearbyFood:2},desc:"Famous shaded playgrounds, paved stroller trails. Home to Whirlin' Waters and SK8 Charleston.",photo:"https://images.unsplash.com/photo-1564429238961-bf8f8a7d0773?w=800&h=450&fit=crop",pass:"gold",eats:[]},
  {id:10,name:"Gadsdenboro Park",area:"Downtown",addr:"30 Concord St, Charleston, SC 29401",lat:32.7837,lng:-79.9264,tags:["shade","stroller","toddler","food","swings"],r:{overall:4.3,shade:3.5,equipment:4,cleanliness:4,bugs:3.5,safety:4,toddlerFriendly:4,nearbyFood:5},desc:"Near the SC Aquarium — nautical-themed playground. Perfect before/after aquarium visits.",photo:"https://images.unsplash.com/photo-1575783970733-1aaedde1db74?w=800&h=450&fit=crop",pass:null,eats:[{n:"Harken Café",t:"Bakery/Healthy",d:"Fresh pastries, sandwiches, coffee.",a:"62 Queen St"}]},
  {id:11,name:"Tiedemann Park",area:"Downtown",addr:"370 Huger St, Charleston, SC 29403",lat:32.7921,lng:-79.9401,tags:["toddler","food"],r:{overall:3.8,shade:3,equipment:3.5,cleanliness:4,bugs:3,safety:4,toddlerFriendly:4,nearbyFood:5},desc:"Small but charming — 1 block from Visitors Center and Upper King St. Quick energy burn before a restaurant.",photo:"https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&h=450&fit=crop",pass:null,eats:[{n:"Taco Boy",t:"Tex-Mex",d:"Great kids' menu — tacos, burritos, quesadillas.",a:"217 Huger St"}]},
  {id:12,name:"Folly Beach Playground",area:"Folly Beach",addr:"500 W Cooper St, Folly Beach, SC 29439",lat:32.6523,lng:-79.9433,tags:["shade","restrooms","toddler","parking","swings","picnic"],r:{overall:4.4,shade:4,equipment:4,cleanliness:4,bugs:3,safety:4,toddlerFriendly:4,nearbyFood:4.5},desc:"Colorful playground with playhouse, slides, swings. Skate park and table tennis nearby. Steps from beach!",photo:"https://images.unsplash.com/photo-1566454825481-f8f0e2d84bba?w=800&h=450&fit=crop",pass:null,eats:[{n:"Lost Dog Café",t:"Café/Healthy",d:"Wraps, salads, sandwiches. Dog-friendly patio.",a:"106 W Huron Ave"}]},
  {id:13,name:"N. Charleston Inclusive Playground",area:"North Charleston",addr:"2244 Cosgrove Ave, N. Charleston, SC 29405",lat:32.8648,lng:-80.0029,tags:["inclusive","shade","restrooms","toddler","parking","splashpad","swings"],r:{overall:4.5,shade:4,equipment:4.5,cleanliness:4,bugs:3,safety:4.5,toddlerFriendly:5,nearbyFood:3},desc:"26,000+ sq ft inclusive playground — pavilion, courts, volleyball, walking trails, splash pad.",photo:"https://images.unsplash.com/photo-1596997000103-e597b3ca50df?w=800&h=450&fit=crop",pass:null,eats:[]},
  {id:14,name:"Shipyard Park",area:"Daniel Island",addr:"1501 Daniel Island Dr, Charleston, SC 29492",lat:32.859,lng:-79.8768,tags:["shade","restrooms","parking","stroller","swings","picnic"],r:{overall:4.3,shade:4,equipment:4,cleanliness:4.5,bugs:3,safety:4.5,toddlerFriendly:4,nearbyFood:3.5},desc:"Daniel Island — tennis center, soccer/baseball fields, waterfront trails.",photo:"https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&h=450&fit=crop",pass:null,eats:[{n:"King's Tide",t:"Waterfront",d:"Waterfront dining, great for families.",a:"1959 Daniel Island Dr"}]},
  {id:15,name:"Magnolia Children's Garden",area:"West Ashley",addr:"3550 Ashley River Rd, Charleston, SC 29414",lat:32.8503,lng:-80.0703,tags:["shade","restrooms","stroller","parking"],r:{overall:4.7,shade:5,equipment:4,cleanliness:5,bugs:2.5,safety:4.5,toddlerFriendly:5,nearbyFood:2},desc:"Enchanting fairy garden with villages, gnomes, storybook walk. Included with plantation admission.",photo:"https://images.unsplash.com/photo-1575783970733-1aaedde1db74?w=800&h=450&fit=crop",pass:null,eats:[]},
  {id:16,name:"Plymouth Park",area:"James Island",addr:"1309 Ft Johnson Rd, Charleston, SC 29412",lat:32.7398,lng:-79.9245,tags:["shade","toddler","swings","picnic"],r:{overall:4.2,shade:5,equipment:3.5,cleanliness:3.5,bugs:3,safety:4,toddlerFriendly:4,nearbyFood:3},desc:"Waterfront park under ancient oaks. Community-donated toys. Fire station across the street — toddlers love the trucks!",photo:"https://images.unsplash.com/photo-1680458841867-345ded733087?w=800&h=450&fit=crop",pass:null,eats:[]},
  {id:17,name:"Sullivan's Island Park",area:"Sullivan's Island",addr:"2056 Middle St, Sullivan's Island, SC 29482",lat:32.7627,lng:-79.8437,tags:["shade","toddler","food","swings"],r:{overall:4.3,shade:4,equipment:4,cleanliness:4.5,bugs:3,safety:4.5,toddlerFriendly:4,nearbyFood:4.5},desc:"Oak-canopied island playground. Walk to beach, restaurants, Fort Moultrie.",photo:"https://images.unsplash.com/photo-1566454825481-f8f0e2d84bba?w=800&h=450&fit=crop",pass:null,eats:[{n:"The Obstinate Daughter",t:"Italian/Pizza",d:"Small plates + pizza. Beardcats ice cream downstairs!",a:"2063 Middle St"},{n:"Home Team BBQ",t:"BBQ/Family",d:"Outdoor space, corn hole. Kids' menu from $2.75.",a:"2209 Middle St"}]},
  {id:18,name:"Chadwick Park",area:"West Ashley",addr:"600 Playground Rd, Charleston, SC 29407",lat:32.7869,lng:-79.9945,tags:["toddler","fenced","shade","food"],r:{overall:4.1,shade:4,equipment:3.5,cleanliness:4,bugs:3,safety:4.5,toddlerFriendly:5,nearbyFood:4.5},desc:"Enclosed toddler area, tennis & basketball courts. Surrounded by restaurants.",photo:"https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&h=450&fit=crop",pass:null,eats:[{n:"Zombie Bob's Pizza",t:"Pizza",d:"Huge slices inside Frothy Beard Brewery. Toys for kids.",a:"1401 Sam Rittenberg Blvd"}]},
  {id:19,name:"Laurel Hill County Park",area:"Mt. Pleasant",addr:"2351 Rifle Range Rd, Mt. Pleasant, SC 29464",lat:32.8176,lng:-79.8302,tags:["shade","restrooms","parking","dogs","stroller"],r:{overall:4.4,shade:5,equipment:4,cleanliness:4.5,bugs:2.5,safety:4.5,toddlerFriendly:3.5,nearbyFood:2},desc:"1.5 miles hiking through 70 acres of forest & wetlands. Nature walk — great for adventure toddlers.",photo:"https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&h=450&fit=crop",pass:"gold",eats:[]},
  {id:20,name:"Riverfront Park",area:"North Charleston",addr:"1001 Everglades Dr, N. Charleston, SC 29405",lat:32.8781,lng:-79.9612,tags:["shade","restrooms","parking","splashpad","stroller","picnic"],r:{overall:4.4,shade:4,equipment:4,cleanliness:4.5,bugs:3,safety:4.5,toddlerFriendly:4,nearbyFood:3},desc:"Playground, splash pad, walking paths, river views, community events.",photo:"https://images.unsplash.com/photo-1596997000103-e597b3ca50df?w=800&h=450&fit=crop",pass:null,eats:[]},
];

const ACTS=[
  {id:100,name:"South Carolina Aquarium",area:"Downtown",addr:"100 Aquarium Wharf, Charleston, SC 29401",icon:"🐠",url:"https://scaquarium.org",hrs:"Daily 9am–5pm",cost:"~$30-45 dynamic / Under 2 free",desc:"5,000+ marine animals, touch tanks, sea turtle care center. Plan 90 min–2 hrs.",tags:["Indoor","Educational"]},
  {id:101,name:"Children's Museum of the Lowcountry",area:"Downtown",addr:"25 Ann St, Charleston, SC 29403",icon:"🎨",url:"https://explorecml.org",hrs:"Mon–Sat 10am–5pm, Sun 12–5pm",cost:"$15 door / $13 advance / $3 SNAP/WIC",desc:"Pirate ship, Imagination Playground, art room, Lowcountry Livin'. Plan 2–3 hrs.",tags:["Indoor","Hands-on"]},
  {id:102,name:"Charles Towne Landing",area:"West Ashley",addr:"1500 Old Towne Rd, Charleston, SC 29407",icon:"🦬",url:"https://southcarolinaparks.com/charles-towne-landing",hrs:"Daily 9am–5pm",cost:"$10 adults / $6 kids 6-15 / Free under 6",desc:"Animal Forest zoo, replica sailing ship, 80 acres of gardens, 6 miles of trails.",tags:["Outdoor","Historical","🌲 State Park Pass"]},
  {id:103,name:"Pack Athletics — West Ashley",area:"West Ashley",addr:"1012 St. Andrews Blvd, Charleston, SC 29407",icon:"🤸",url:"https://www.allaboutthepack.com/west-ashley",hrs:"Varies by class",cost:"Varies",desc:"Cheer, tumbling, ninja classes, tot open gym, birthday parties, camps (ages 4+).",tags:["Indoor","Active","Classes"]},
  {id:104,name:"Pack Athletics — Mt. Pleasant",area:"Mt. Pleasant",addr:"1172 US Hwy 41, Mt. Pleasant, SC 29466",icon:"🤸",url:"https://www.allaboutthepack.com",hrs:"Varies by class",cost:"Varies",desc:"Tumbling, cheer, open gym, birthday parties, camps.",tags:["Indoor","Active","Classes"]},
  {id:105,name:"Whirlin' Waters Waterpark",area:"North Charleston",addr:"8888 University Blvd, N. Charleston, SC 29406",icon:"🌊",url:"https://www.ccprc.com",hrs:"Seasonal (May–Sep)",cost:"Splash Pass or day admission",desc:"Water slides, lazy river, splash zones at Wannamaker County Park.",tags:["Outdoor","Seasonal","🏅 Gold Pass park"]},
  {id:106,name:"Splash Zone Waterpark",area:"James Island",addr:"871 Riverland Dr, Charleston, SC 29412",icon:"🦜",url:"https://www.ccprc.com",hrs:"Seasonal (May–Sep)",cost:"Splash Pass or day admission",desc:"Rainforest-themed waterpark at James Island County Park.",tags:["Outdoor","Seasonal","🏅 Gold Pass park"]},
  {id:107,name:"SK8 Charleston",area:"North Charleston",addr:"8888 University Blvd, N. Charleston, SC 29406",icon:"🛹",url:"https://www.ccprc.com",hrs:"See ccprc.com",cost:"Day pass or SK8 Pass ($40/yr)",desc:"32,000 sq ft — two bowls, street course, 200+ ft snake run. All ages.",tags:["Outdoor","Active"]},
  {id:108,name:"Patriots Point Naval Museum",area:"Mt. Pleasant",addr:"40 Patriots Point Rd, Mt. Pleasant, SC 29464",icon:"🚢",url:"https://www.patriotspoint.org",hrs:"Daily 9am–5pm",cost:"~$30 adults / $20 kids 6-11",desc:"USS Yorktown aircraft carrier, submarine, Medal of Honor Museum. Best ages 6+.",tags:["Indoor/Outdoor","Historical"]},
  {id:109,name:"Magnolia Plantation & Gardens",area:"West Ashley",addr:"3550 Ashley River Rd, Charleston, SC 29414",icon:"🧚",url:"https://www.magnoliaplantation.com",hrs:"Daily 9am–4:30pm",cost:"~$25 adults / $15 kids 6-12 / Free under 6",desc:"Fairy garden, nature train, petting zoo, beautiful gardens.",tags:["Outdoor","Nature"]},
  {id:110,name:"Middleton Place",area:"West Ashley",addr:"4300 Ashley River Rd, Charleston, SC 29414",icon:"🐴",url:"https://www.middletonplace.org",hrs:"Daily 9am–5pm",cost:"~$29 adults / $18 kids 6-13",desc:"Historic plantation with farm animals, stableyards, stroller-friendly trails.",tags:["Outdoor","Historical"]},
];

const BEACHES=[
  {id:300,name:"Isle of Palms County Park",area:"Isle of Palms",addr:"14th Ave, Isle of Palms, SC 29451",pass:"gold",desc:"Best family beach in Charleston — playground right at the park, snack shack, lifeguards, showers, changing rooms, beach wheelchair available.",tips:["🕐 Arrive before 9:30am on summer Saturdays — lot fills fast","💰 $10/car without Gold Pass, free with Gold Pass","🛝 Playground right at the park entrance — great for breaks","♿ Beach wheelchair available — ask at entrance","🍔 Snack shack on-site so you don't have to pack everything"],url:"https://www.ccprc.com"},
  {id:301,name:"Folly Beach County Park",area:"Folly Beach",addr:"1010 W Ashley Ave, Folly Beach, SC 29439",pass:"gold",desc:"Lifeguards, outdoor showers, restrooms, chair/umbrella rentals, snack bar. Wide beach with gentle waves great for toddlers.",tips:["🕐 Arrive before 10am on summer weekends — lot fills by 11","💰 $10/car without Gold Pass, free with Gold Pass","⛱️ Chair & umbrella rentals available if you travel light","🚿 Rinse stations at parking lot for sandy kids","☀️ Bring a pop-up tent — limited natural shade on beach"],url:"https://www.ccprc.com"},
  {id:302,name:"Kiawah Beachwalker Park",area:"Kiawah Island",addr:"8 Beachwalker Dr, Kiawah Island, SC 29455",pass:"gold",desc:"Pristine, less crowded beach surrounded by natural dunes and maritime forest. More remote, peaceful feel. Seasonal lifeguards.",tips:["🕐 About 45 min from downtown — worth the drive for quiet","💰 $10/car without Gold Pass, free with Gold Pass","🧊 Pack a cooler with lunch — very limited food options nearby","🌿 Long beautiful boardwalk through dunes to reach beach","📅 Seasonal hours — check ccprc.com before going off-season"],url:"https://www.ccprc.com"},
  {id:303,name:"Sullivan's Island Beach",area:"Sullivan's Island",addr:"Sullivan's Island, SC 29482",pass:"free",desc:"Beautiful island beach with free street parking. No facilities but charming island feel. Walk to Middle St restaurants after.",tips:["✨ Free! No parking pass needed — park on side streets","🚫 No lifeguards, restrooms, or showers — bring everything","🧴 Pack water, shade, snacks, and changing supplies","🍽️ Walk to restaurants after: Obstinate Daughter, Home Team BBQ, Beardcats ice cream","👥 Less crowded than Folly or IOP, especially weekdays"],url:"https://maps.google.com/?q=Sullivan's+Island+Beach+SC"},
  {id:304,name:"Edisto Beach State Park",area:"Edisto Island",addr:"8377 State Cabin Rd, Edisto Island, SC 29438",pass:"state",desc:"Quieter beach about 1 hour from Charleston. Maritime forest trails, nature center, and the ONLY beachfront camping in Charleston County.",tips:["🕐 About 1 hour from downtown — great day trip or overnight","💰 $8 adults / $5 kids 6-15 / Free with State Park Pass","🏕️ Only beachfront camping in the area — book months ahead","🌲 4-mile nature trail through maritime forest with kids","🔬 Environmental Learning Center is great for curious kids"],url:"https://southcarolinaparks.com/edisto-beach"},
  {id:305,name:"Hunting Island State Park",area:"Beaufort",addr:"2555 Sea Island Pkwy, Hunting Island, SC 29920",pass:"state",desc:"5 miles of beach, dramatic driftwood shore, lighthouse, nature center. About 2 hrs from Charleston but unforgettable.",tips:["🕐 About 2 hours from Charleston — make it a special day","💰 $8 adults / $5 kids 6-15 / Free with State Park Pass","🪵 Driftwood beach is incredible — kids love climbing on logs","🧺 Pack lunch — very limited food on the island","🐊 Alligators live in the lagoon — keep distance with toddlers","🗼 Lighthouse under repair but grounds are still beautiful"],url:"https://southcarolinaparks.com/hunting-island"},
];

const LIBS=[
  {id:200,name:"Main Library Downtown",area:"Downtown",addr:"68 Calhoun St, Charleston, SC 29401",note:"Large children's section. Regular storytimes and crafts."},
  {id:201,name:"Bees Ferry Library",area:"West Ashley",addr:"3689 Bees Ferry Rd, Charleston, SC 29414",note:"Two outdoor areas with a fully gated children's play space. Fan favorite!"},
  {id:202,name:"Mt. Pleasant Library",area:"Mt. Pleasant",addr:"1133 Mathis Ferry Rd, Mt. Pleasant, SC 29464",note:"Excellent children's programs, baby & toddler storytimes."},
  {id:203,name:"Otranto Road Library",area:"North Charleston",addr:"2261 Otranto Rd, N. Charleston, SC 29406",note:"Weekly storytimes and seasonal reading programs."},
  {id:204,name:"James Island Library",area:"James Island",addr:"1248 Camp Rd, Charleston, SC 29412",note:"Cozy branch with baby and toddler storytimes."},
  {id:205,name:"John's Island Library",area:"Johns Island",addr:"3531 Maybank Hwy, Johns Island, SC 29455",note:"Community storytimes and summer reading programs."},
  {id:206,name:"Hurd/St. Andrews Library",area:"West Ashley",addr:"1735 N Woodmere Dr, Charleston, SC 29407",note:"Newly renovated! Magic Mailbox for Santa letters."},
  {id:207,name:"Dorchester Road Library",area:"North Charleston",addr:"6325 Dorchester Rd, N. Charleston, SC 29418",note:"30+ themed Storytime Kits to check out."},
];

const COMMUNITY=[
  {handle:"@jetsetchristina",name:"JetsetChristina",url:"https://www.instagram.com/jetsetchristina/",desc:"Charleston luxury travel & family blogger. 116K followers. Kid-friendly restaurant guides & activity roundups.",color:"#E8D5B7",initials:"JC"},
  {handle:"@chswithkids",name:"CHS With Kids",url:"https://www.instagram.com/chswithkids/",desc:"Local parent recs, weekend activity ideas, seasonal event guides.",color:"#B5EAD7",initials:"CK"},
  {handle:"@charlestontoddlers",name:"Charleston Toddlers",url:"https://www.instagram.com/charlestontoddlers/",desc:"Toddler activities, playdate meetups, playground reviews, camp guides.",color:"#C7CEEA",initials:"CT"},
  {handle:"@littlesinthelowcountry",name:"Littles in the Lowcountry",url:"https://www.instagram.com/littlesinthelowcountry/",desc:"Family adventures, hidden gems, seasonal events.",color:"#FFD6E0",initials:"LL"},
];

// Helpers
const Stars=({v,sz=13})=><span style={{display:"inline-flex",alignItems:"center",gap:1}}>{[1,2,3,4,5].map(i=><span key={i} style={{fontSize:sz,color:v>=i?"#F59E0B":v>=i-.5?"#FCD34D":"#D1D5DB"}}>★</span>)}<span style={{fontSize:sz*.8,fontWeight:700,color:P.muted,marginLeft:3}}>{v.toFixed(1)}</span></span>;
const Bdg=({children,bg="#E0F2FE",fg="#0369A1",s={}})=><span style={{display:"inline-block",padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:bg,color:fg,whiteSpace:"nowrap",...s}}>{children}</span>;
const Lnk=({href,children,s={}})=><a href={href} target="_blank" rel="noopener noreferrer" style={{color:P.primary,textDecoration:"none",fontWeight:700,...s}}>{children}</a>;
const mU=a=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a)}`;
const PassBdg=({p})=>p==="gold"?<Bdg bg="#FEF3C7" fg="#92400E">🏅 Gold Pass</Bdg>:p==="state"?<Bdg bg="#D1FAE5" fg="#065F46">🌲 State Park Pass</Bdg>:p==="free"?<Bdg bg="#E0F2FE" fg="#0369A1">✨ Free</Bdg>:null;

// Auth
const AuthModal=({onClose,onAuth})=>{const[e,sE]=useState("");const[n,sN]=useState("");return(
  <div style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
    <div onClick={ev=>ev.stopPropagation()} style={{background:"white",borderRadius:24,padding:"32px 24px",maxWidth:400,width:"100%",boxShadow:"0 24px 48px rgba(0,0,0,0.2)"}}>
      <h2 style={{fontFamily:"'Lilita One',cursive",fontSize:22,color:P.primary,margin:"0 0 6px",textAlign:"center"}}>Join Charleston Playgrounds</h2>
      <p style={{color:P.muted,fontSize:14,textAlign:"center",margin:"0 0 20px",lineHeight:1.5}}>Save favorites, build your bucket list, rate playgrounds & share with friends.</p>
      <input value={n} onChange={ev=>sN(ev.target.value)} placeholder="Your name" style={{width:"100%",padding:"14px 16px",borderRadius:12,border:`2px solid ${P.border}`,fontSize:15,marginBottom:10,boxSizing:"border-box",fontFamily:"inherit",outline:"none"}} />
      <input value={e} onChange={ev=>sE(ev.target.value)} placeholder="Email address" type="email" style={{width:"100%",padding:"14px 16px",borderRadius:12,border:`2px solid ${P.border}`,fontSize:15,marginBottom:16,boxSizing:"border-box",fontFamily:"inherit",outline:"none"}} />
      <button onClick={()=>{if(e.includes("@"))onAuth({name:n,email:e})}} disabled={!e.includes("@")} style={{width:"100%",padding:"15px",borderRadius:14,background:e.includes("@")?P.primary:"#ccc",color:"white",border:"none",fontSize:16,fontWeight:800,cursor:e.includes("@")?"pointer":"not-allowed",fontFamily:"inherit"}}>Let's Go! →</button>
      <button onClick={onClose} style={{width:"100%",marginTop:8,padding:"10px",background:"none",border:"none",color:P.muted,fontSize:14,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Just browsing for now</button>
    </div>
  </div>
);};

// App
export default function App(){
  const[view,setView]=useState("playgrounds");
  const[area,setArea]=useState("All");
  const[tags,setTags]=useState([]);
  const[sort,setSort]=useState("overall");
  const[search,setSearch]=useState("");
  const[detail,setDetail]=useState(null);
  const[favs,setFavs]=useState([]);
  const[bucket,setBucket]=useState([]);
  const[visited,setVisited]=useState([]);
  const[showProfile,setShowProfile]=useState(false);
  const[user,setUser]=useState(null);
  const[showAuth,setShowAuth]=useState(false);
  const[uR,setUR]=useState({});

  const guard=useCallback(fn=>(...a)=>{if(!user){setShowAuth(true);return;}fn(...a);},[user]);
  const tF=guard(id=>setFavs(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]));
  const tB=guard(id=>setBucket(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]));
  const tV=guard(id=>setVisited(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]));
  const tT=t=>setTags(p=>p.includes(t)?p.filter(x=>x!==t):[...p,t]);

  const filt=useMemo(()=>{
    let r=PG;
    if(area!=="All")r=r.filter(p=>p.area===area);
    if(tags.length)r=r.filter(p=>tags.every(t=>p.tags.includes(t)));
    if(search){const s=search.toLowerCase();r=r.filter(p=>p.name.toLowerCase().includes(s)||p.desc.toLowerCase().includes(s)||p.area.toLowerCase().includes(s));}
    return[...r].sort((a,b)=>(b.r[sort]||0)-(a.r[sort]||0));
  },[area,tags,search,sort]);

  const bp=bucket.length>0?Math.round((bucket.filter(id=>visited.includes(id)).length/bucket.length)*100):0;
  const nav=[{k:"playgrounds",l:"Playgrounds",i:"🛝"},{k:"activities",l:"Activities",i:"🎪"},{k:"beaches",l:"Beaches",i:"🏖️"},{k:"libraries",l:"Libraries",i:"📚"},{k:"passes",l:"Passes",i:"🎫"},{k:"community",l:"Community",i:"💬"}];

  return(
    <div style={{fontFamily:"'Nunito',sans-serif",background:P.bg,minHeight:"100vh",color:P.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Lilita+One&display=swap');*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}body{margin:0}.c:hover{box-shadow:0 8px 20px rgba(0,0,0,0.1)!important;transform:translateY(-1px)}@media(max-width:640px){.g2{grid-template-columns:1fr!important}.cardrow{flex-direction:column!important}.cardimg{width:100%!important;height:180px!important}}`}</style>
      {showAuth&&<AuthModal onClose={()=>setShowAuth(false)} onAuth={u=>{setUser(u);setShowAuth(false);}} />}

      <header style={{background:`linear-gradient(135deg,${P.primary},${P.primaryDark})`,color:"white",padding:"14px 16px"}}>
        <div style={{maxWidth:960,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{cursor:"pointer"}} onClick={()=>{setView("playgrounds");setDetail(null);}}>
            <h1 style={{fontFamily:"'Lilita One',cursive",fontSize:20,margin:0}}>🛝 Charleston Playgrounds</h1>
            <p style={{fontSize:11,opacity:.8,margin:"2px 0 0",fontWeight:600}}>Scout every playground in the Lowcountry</p>
          </div>
          <button onClick={()=>user?setShowProfile(!showProfile):setShowAuth(true)} style={{background:"rgba(255,255,255,.15)",border:"2px solid rgba(255,255,255,.3)",borderRadius:12,padding:"8px 14px",color:"white",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{user?`👋 ${user.name||"Profile"}`:"Sign In"}</button>
        </div>
      </header>

      <nav style={{background:"white",borderBottom:`1px solid ${P.border}`,position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 6px rgba(0,0,0,.04)"}}>
        <div style={{maxWidth:960,margin:"0 auto",display:"flex",overflowX:"auto"}}>
          {nav.map(n=><button key={n.k} onClick={()=>{setView(n.k);setDetail(null);}} style={{flex:"1 0 auto",padding:"11px 10px",border:"none",background:"none",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:view===n.k?800:600,color:view===n.k?P.primary:P.muted,borderBottom:view===n.k?`3px solid ${P.primary}`:"3px solid transparent",whiteSpace:"nowrap"}}>{n.i} {n.l}</button>)}
        </div>
      </nav>

      {showProfile&&user&&<div style={{background:P.warm,borderBottom:`1px solid ${P.border}`,padding:"14px 16px"}}><div style={{maxWidth:960,margin:"0 auto"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><h2 style={{fontFamily:"'Lilita One',cursive",fontSize:17,margin:0,color:P.primary}}>{user.name}'s Dashboard</h2><button onClick={()=>setShowProfile(false)} style={{background:"none",border:"none",fontSize:16,cursor:"pointer"}}>✕</button></div><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}} className="g2">{[{l:"Favorites",v:favs.length,i:"❤️",c:"#FEE2E2"},{l:"Bucket List",v:bucket.length,i:"🪣",c:"#E0F2FE"},{l:"Visited",v:visited.length,i:"✅",c:"#D1FAE5"},{l:"Rated",v:Object.keys(uR).length,i:"⭐",c:"#FEF3C7"}].map(s=><div key={s.l} style={{background:s.c,borderRadius:12,padding:10,textAlign:"center"}}><div style={{fontSize:20}}>{s.i}</div><div style={{fontSize:20,fontWeight:900}}>{s.v}</div><div style={{fontSize:11,fontWeight:700,color:P.muted}}>{s.l}</div></div>)}</div>{bucket.length>0&&<div style={{background:"white",borderRadius:12,padding:"12px 14px",marginTop:10,border:`1px solid ${P.border}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontWeight:800,fontSize:13}}>🪣 Bucket List Progress</span><span style={{fontWeight:800,fontSize:13,color:P.primary}}>{bp}%</span></div><div style={{background:P.border,borderRadius:8,height:8,overflow:"hidden"}}><div style={{background:`linear-gradient(90deg,${P.primary},#52B788)`,height:"100%",width:`${bp}%`,borderRadius:8,transition:"width .5s"}}/></div></div>}</div></div>}

      <main style={{maxWidth:960,margin:"0 auto",padding:"0 14px 80px"}}>

{/* PLAYGROUNDS LIST */}
{view==="playgrounds"&&!detail&&<>
<div style={{marginTop:14}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search playgrounds..." style={{width:"100%",padding:"13px 16px",borderRadius:14,border:`2px solid ${P.border}`,fontSize:15,boxSizing:"border-box",fontFamily:"inherit",background:"white",outline:"none"}} onFocus={e=>e.target.style.borderColor=P.primary} onBlur={e=>e.target.style.borderColor=P.border}/></div>
<div style={{display:"flex",gap:6,marginTop:12,overflowX:"auto",paddingBottom:4}}>{AREAS.map(a=><button key={a} onClick={()=>setArea(a)} style={{padding:"8px 14px",borderRadius:20,border:"none",cursor:"pointer",background:area===a?P.primary:"white",color:area===a?"white":P.text,fontWeight:700,fontSize:12,fontFamily:"inherit",boxShadow:area===a?"0 2px 8px rgba(45,106,79,.3)":"0 1px 3px rgba(0,0,0,.06)",flexShrink:0}}>{a}</button>)}</div>
<div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:8}}>{Object.entries(TAGS).map(([k,l])=><button key={k} onClick={()=>tT(k)} style={{padding:"5px 10px",borderRadius:14,cursor:"pointer",border:tags.includes(k)?`2px solid ${P.accent}`:"2px solid transparent",background:tags.includes(k)?P.accentLight:"#F3F4F6",color:tags.includes(k)?"#C2410C":P.muted,fontWeight:600,fontSize:11,fontFamily:"inherit"}}>{l}</button>)}</div>
<div style={{display:"flex",alignItems:"center",gap:6,marginTop:12}}><span style={{fontSize:12,fontWeight:700,color:P.muted}}>Sort:</span><select value={sort} onChange={e=>setSort(e.target.value)} style={{padding:"6px 10px",borderRadius:10,border:`1px solid ${P.border}`,fontSize:12,fontWeight:600,fontFamily:"inherit",background:"white"}}>{RCATS.map(c=><option key={c.key} value={c.key}>{c.icon} {c.label}</option>)}</select><span style={{marginLeft:"auto",fontSize:12,fontWeight:700,color:P.muted}}>{filt.length} results</span></div>
<div style={{display:"flex",flexDirection:"column",gap:12,marginTop:12}}>
  {filt.map(pg=>(
    <div key={pg.id} className="c" onClick={()=>setDetail(pg)} style={{background:"white",borderRadius:16,overflow:"hidden",cursor:"pointer",border:`1px solid ${P.border}`,transition:"all .2s",boxShadow:"0 1px 4px rgba(0,0,0,.04)"}}>
      <div style={{display:"flex"}} className="cardrow">
        <div className="cardimg" style={{width:120,minHeight:110,background:`url(${pg.photo}) center/cover`,flexShrink:0}}/>
        <div style={{padding:"14px 16px",flex:1,minWidth:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:4}}>
            <div style={{minWidth:0}}>
              <h3 style={{margin:0,fontSize:15,fontWeight:800,lineHeight:1.3}}>{pg.name}</h3>
              <a href={mU(pg.addr)} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:12,color:P.primary,textDecoration:"none",fontWeight:600}}>📍 {pg.area}</a>
            </div>
            <div style={{display:"flex",gap:4,flexShrink:0}} onClick={e=>e.stopPropagation()}>
              <button onClick={()=>tF(pg.id)} style={{background:favs.includes(pg.id)?"#FEE2E2":"#F9FAFB",border:`1px solid ${favs.includes(pg.id)?P.red:P.border}`,borderRadius:10,padding:"6px 10px",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit",minHeight:32}}>{favs.includes(pg.id)?"❤️":"🤍"}</button>
              <button onClick={()=>tB(pg.id)} style={{background:bucket.includes(pg.id)?"#E0F2FE":"#F9FAFB",border:`1px solid ${bucket.includes(pg.id)?P.oceanDark:P.border}`,borderRadius:10,padding:"6px 10px",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit",minHeight:32}}>{bucket.includes(pg.id)?"✅":"🪣"}</button>
            </div>
          </div>
          <div style={{margin:"5px 0"}}><Stars v={pg.r.overall} sz={13}/></div>
          <p style={{margin:"0 0 6px",fontSize:13,color:"#555",lineHeight:1.45,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{pg.desc}</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
            {pg.pass&&<PassBdg p={pg.pass}/>}
            {pg.tags.slice(0,3).map(t=><Bdg key={t}>{TAGS[t]}</Bdg>)}
            {pg.tags.length>3&&<Bdg bg="#F3F4F6" fg={P.muted}>+{pg.tags.length-3}</Bdg>}
          </div>
        </div>
      </div>
    </div>
  ))}
  {!filt.length&&<div style={{textAlign:"center",padding:48,color:P.muted}}><div style={{fontSize:40}}>🔍</div><p style={{fontWeight:700,margin:"8px 0 0"}}>No playgrounds match</p></div>}
</div>
</>}

{/* PLAYGROUND DETAIL */}
{view==="playgrounds"&&detail&&(()=>{const pg=detail;return(
<div style={{marginTop:14}}>
  <button onClick={()=>setDetail(null)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:700,color:P.primary,padding:0,marginBottom:12}}>← Back</button>
  <div style={{background:"white",borderRadius:18,overflow:"hidden",border:`1px solid ${P.border}`,boxShadow:"0 4px 16px rgba(0,0,0,.06)"}}>
    <div style={{width:"100%",height:220,background:`url(${pg.photo}) center/cover`}}/>
    <div style={{padding:"20px"}}>
      <h2 style={{fontFamily:"'Lilita One',cursive",fontSize:22,color:P.primary,margin:"0 0 4px"}}>{pg.name}</h2>
      <a href={mU(pg.addr)} target="_blank" rel="noopener noreferrer" style={{color:P.primary,textDecoration:"none",fontWeight:600,fontSize:14}}>📍 {pg.addr}</a>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,margin:"14px 0"}}>
        <button onClick={()=>tF(pg.id)} style={{padding:"10px 16px",borderRadius:12,border:`2px solid ${favs.includes(pg.id)?P.red:P.border}`,background:favs.includes(pg.id)?"#FEE2E2":"white",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:14}}>
          {favs.includes(pg.id)?"❤️ Favorited":"🤍 Favorite"}
        </button>
        <button onClick={()=>tB(pg.id)} style={{padding:"10px 16px",borderRadius:12,border:`2px solid ${bucket.includes(pg.id)?P.oceanDark:P.border}`,background:bucket.includes(pg.id)?P.ocean:"white",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:14}}>
          {bucket.includes(pg.id)?"🪣 On Bucket List":"🪣 Add to List"}
        </button>
        <button onClick={()=>tV(pg.id)} style={{padding:"10px 16px",borderRadius:12,border:`2px solid ${visited.includes(pg.id)?P.green:P.border}`,background:visited.includes(pg.id)?"#D1FAE5":"white",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:14}}>
          {visited.includes(pg.id)?"✅ Visited!":"☐ Mark Visited"}
        </button>
      </div>
      <p style={{fontSize:15,lineHeight:1.7,color:"#374151",margin:"0 0 16px"}}>{pg.desc}</p>
      {pg.pass&&<div style={{marginBottom:14}}><PassBdg p={pg.pass}/></div>}
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:20}}>{pg.tags.map(t=><Bdg key={t}>{TAGS[t]}</Bdg>)}</div>

      <h3 style={{fontFamily:"'Lilita One',cursive",fontSize:16,color:P.primary,margin:"0 0 10px"}}>Community Ratings</h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:6,marginBottom:18}} className="g2">
        {RCATS.map(c=><div key={c.key} style={{background:"#F9FAFB",borderRadius:10,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:12,fontWeight:700}}>{c.icon} {c.label}</span><Stars v={pg.r[c.key]||0} sz={11}/></div>)}
      </div>

      <div style={{background:P.warm,borderRadius:12,padding:"14px",marginBottom:18}}>
        <h4 style={{margin:"0 0 8px",fontWeight:800,fontSize:14}}>⭐ Rate This Playground</h4>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:5}} className="g2">
          {RCATS.map(c=><div key={c.key} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:12,fontWeight:600}}>{c.icon} {c.label}</span><div>{[1,2,3,4,5].map(n=><button key={n} onClick={guard(()=>setUR(p=>({...p,[`${pg.id}-${c.key}`]:n})))} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",padding:"0 2px",color:(uR[`${pg.id}-${c.key}`]||0)>=n?"#F59E0B":"#D1D5DB"}}>★</button>)}</div></div>)}
        </div>
      </div>

      {pg.eats&&pg.eats.length>0&&<>
        <h3 style={{fontFamily:"'Lilita One',cursive",fontSize:16,color:P.primary,margin:"0 0 10px"}}>🍽️ Kid-Friendly Eats Nearby</h3>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
          {pg.eats.map((r,i)=><a key={i} href={mU(r.a)} target="_blank" rel="noopener noreferrer" style={{display:"block",background:"#F9FAFB",borderRadius:12,padding:"12px 16px",textDecoration:"none",color:P.text,border:`1px solid ${P.border}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:800,fontSize:14}}>{r.n}</span><Bdg bg={P.primaryLight} fg={P.primary}>{r.t}</Bdg></div><p style={{margin:"4px 0 0",fontSize:13,color:P.muted,lineHeight:1.4}}>{r.d}</p><p style={{margin:"3px 0 0",fontSize:12,color:P.primary,fontWeight:600}}>📍 {r.a} →</p></a>)}
        </div>
      </>}
      <a href={mU(pg.addr)} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"12px 20px",background:P.primary,color:"white",borderRadius:14,textDecoration:"none",fontWeight:800,fontSize:14,fontFamily:"inherit"}}>📍 Open in Google Maps</a>
    </div>
  </div>
</div>);})()}

{/* ACTIVITIES */}
{view==="activities"&&<div style={{marginTop:14}}>
  <h2 style={{fontFamily:"'Lilita One',cursive",fontSize:20,color:P.primary,margin:"0 0 12px"}}>More Things to Do with Kids</h2>
  <div style={{display:"flex",flexDirection:"column",gap:10}}>
    {ACTS.map(a=><div key={a.id} style={{background:"white",borderRadius:16,padding:"16px",border:`1px solid ${P.border}`}}>
      <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
        <div style={{fontSize:28,width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",background:P.ocean,borderRadius:12,flexShrink:0}}>{a.icon}</div>
        <div style={{flex:1}}>
          <Lnk href={a.url}><h3 style={{margin:0,fontSize:15,fontWeight:800,color:P.text}}>{a.name} ↗</h3></Lnk>
          <a href={mU(a.addr)} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:P.primary,textDecoration:"none",fontWeight:600}}>📍 {a.addr}</a>
          <p style={{margin:"5px 0",fontSize:13,color:"#555",lineHeight:1.5}}>{a.desc}</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,fontSize:12,marginBottom:6}}>
            <span style={{fontWeight:700,color:P.primary}}>🕐 {a.hrs}</span>
            <span style={{fontWeight:700,color:"#92400E"}}>💰 {a.cost}</span>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{a.tags.map(t=><Bdg key={t} bg={t.includes("Gold")||t.includes("State")?"#FEF3C7":"#E0F2FE"} fg={t.includes("Gold")||t.includes("State")?"#92400E":"#0369A1"}>{t}</Bdg>)}</div>
        </div>
      </div>
    </div>)}
  </div>
</div>}

{/* BEACHES */}
{view==="beaches"&&<div style={{marginTop:14}}>
  <h2 style={{fontFamily:"'Lilita One',cursive",fontSize:20,color:P.primary,margin:"0 0 4px"}}>Beaches</h2>
  <p style={{color:P.muted,fontSize:13,margin:"0 0 14px",lineHeight:1.5}}>Charleston's best beaches for families — with parking tips, what to bring, and which pass gets you in.</p>
  <div style={{display:"flex",flexDirection:"column",gap:14}}>
    {BEACHES.map(b=><div key={b.id} style={{background:"white",borderRadius:18,padding:"20px",border:`1px solid ${P.border}`,boxShadow:"0 2px 8px rgba(0,0,0,.04)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,flexWrap:"wrap",gap:8}}>
        <div>
          <h3 style={{margin:0,fontSize:17,fontWeight:800}}>🏖️ {b.name}</h3>
          <a href={mU(b.addr)} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:P.primary,textDecoration:"none",fontWeight:600}}>📍 {b.addr}</a>
        </div>
        <PassBdg p={b.pass}/>
      </div>
      <p style={{fontSize:14,lineHeight:1.6,color:"#374151",margin:"0 0 12px"}}>{b.desc}</p>
      <div style={{background:"#F9FAFB",borderRadius:14,padding:"14px 16px"}}>
        <h4 style={{margin:"0 0 8px",fontWeight:800,fontSize:14,color:P.primary}}>🏝️ Tips for Families</h4>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {b.tips.map((t,i)=><div key={i} style={{fontSize:13,lineHeight:1.5,color:"#374151"}}>{t}</div>)}
        </div>
      </div>
      <a href={b.url} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",marginTop:12,fontSize:13,color:P.primary,fontWeight:700,textDecoration:"none"}}>More info →</a>
    </div>)}
  </div>
</div>}

{/* LIBRARIES */}
{view==="libraries"&&<div style={{marginTop:14}}>
  <h2 style={{fontFamily:"'Lilita One',cursive",fontSize:20,color:P.primary,margin:"0 0 4px"}}>Library Storytimes & Programs</h2>
  <p style={{color:P.muted,fontSize:13,margin:"0 0 10px",lineHeight:1.5}}>Free storytimes, crafts, reading programs, and passes to museums & parks.</p>
  <div style={{background:P.primaryLight,borderRadius:12,padding:"12px 16px",marginBottom:14,fontSize:13,lineHeight:1.6,fontWeight:600}}>💡 <strong>Pro tip:</strong> Ask about <Lnk href="https://www.ccpl.org">Storytime Kits</Lnk> (30+ themes!) and <strong>Explore with CCPL</strong> for free passes to the Aquarium, Children's Museum & State Parks.</div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}} className="g2">
    {LIBS.map(l=><div key={l.id} style={{background:"white",borderRadius:14,padding:"16px",border:`1px solid ${P.border}`}}>
      <h3 style={{margin:"0 0 3px",fontSize:14,fontWeight:800}}>📚 {l.name}</h3>
      <a href={mU(l.addr)} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:P.primary,textDecoration:"none",fontWeight:600}}>📍 {l.addr}</a>
      <p style={{margin:"5px 0 4px",fontSize:13,color:"#555",lineHeight:1.5}}>{l.note}</p>
      <Lnk href="https://www.ccpl.org" s={{fontSize:12}}>Visit CCPL →</Lnk>
    </div>)}
  </div>
</div>}

{/* PASSES */}
{view==="passes"&&<div style={{marginTop:14}}>
  <h2 style={{fontFamily:"'Lilita One',cursive",fontSize:20,color:P.primary,margin:"0 0 12px"}}>Passes & Memberships</h2>
  <div style={{display:"flex",flexDirection:"column",gap:14}}>

    <div style={{background:"linear-gradient(135deg,#FEF3C7,#FDE68A)",borderRadius:18,padding:"20px",border:"2px solid #F59E0B"}}>
      <h3 style={{margin:"0 0 4px",fontSize:18,fontWeight:900,color:"#78350F"}}>🏅 Charleston County Gold Pass</h3>
      <p style={{margin:"0 0 10px",fontSize:13,color:"#92400E",fontWeight:700}}>$84/yr residents · $99/yr non-residents · $69/yr seniors · Up to 15 per vehicle</p>
      <p style={{fontSize:13,lineHeight:1.6,color:"#78350F",margin:"0 0 8px",fontWeight:700}}>Parks & Facilities:</p>
      <p style={{fontSize:12,lineHeight:1.7,color:"#78350F",margin:"0 0 10px"}}>James Island County Park · Palmetto Islands County Park · Wannamaker County Park · Wannamaker North Trail · Caw Caw Interpretive Center · Johns Island County Park · McLeod Plantation Historic Site (up to 4) · Laurel Hill County Park · Lighthouse Inlet Heritage Preserve · Meggett County Park · Stono River County Park · West County Aquatic Center (up to 4)</p>
      <p style={{fontSize:13,lineHeight:1.6,color:"#78350F",margin:"0 0 4px",fontWeight:700}}>Beaches:</p>
      <p style={{fontSize:12,lineHeight:1.7,color:"#78350F",margin:"0 0 10px"}}>Folly Beach County Park · Isle of Palms County Park · Kiawah Beachwalker Park</p>
      <p style={{fontSize:13,lineHeight:1.6,color:"#78350F",margin:"0 0 4px",fontWeight:700}}>Events included:</p>
      <p style={{fontSize:12,lineHeight:1.7,color:"#78350F",margin:"0 0 10px"}}>Harvest Festival · Holiday Festival of Lights (one-time) · Latin American Festival · Lowcountry Cajun Festival · Palmetto Park Jam · Reggae Nights Concert Series</p>
      <p style={{fontSize:11,color:"#92400E",margin:"0 0 8px",fontStyle:"italic"}}>⚠️ Does NOT include waterparks (need Splash Pass), state parks, or city parks. Beach parking not guaranteed April–Labor Day.</p>
      <Lnk href="https://www.ccprc.com/16/Park-Passes" s={{color:"#78350F",fontSize:13}}>Buy Gold Pass →</Lnk>
    </div>

    <div style={{background:"linear-gradient(135deg,#D1FAE5,#A7F3D0)",borderRadius:18,padding:"20px",border:"2px solid #059669"}}>
      <h3 style={{margin:"0 0 4px",fontSize:18,fontWeight:900,color:"#064E3B"}}>🌲 SC State Park Pass (All Park Passport)</h3>
      <p style={{margin:"0 0 10px",fontSize:13,color:"#065F46",fontWeight:700}}>Buy online, at any park, or borrow free from your library for 1 week!</p>
      <p style={{fontSize:13,lineHeight:1.6,color:"#064E3B",margin:"0 0 4px",fontWeight:700}}>Near Charleston (day trips):</p>
      <p style={{fontSize:12,lineHeight:1.7,color:"#064E3B",margin:"0 0 10px"}}>Charles Towne Landing (zoo, ship, gardens) — 15 min · Colonial Dorchester Historic Site — 20 min · Givhans Ferry State Park (Edisto River, canoeing) — 45 min · Edisto Beach State Park (beach, camping, trails) — 1 hr · Colleton State Park (river, trails) — 1 hr · Hampton Plantation — 1 hr</p>
      <p style={{fontSize:13,lineHeight:1.6,color:"#064E3B",margin:"0 0 4px",fontWeight:700}}>Beach parks:</p>
      <p style={{fontSize:12,lineHeight:1.7,color:"#064E3B",margin:"0 0 10px"}}>Edisto Beach State Park — 1 hr · Hunting Island (lighthouse, driftwood beach) — 2 hrs · Huntington Beach (near Brookgreen Gardens) — 2 hrs · Myrtle Beach State Park — 2.5 hrs</p>
      <Lnk href="https://southcarolinaparks.com" s={{color:"#064E3B",fontSize:13}}>SC State Parks →</Lnk>
    </div>

    <div style={{background:"linear-gradient(135deg,#E0F2FE,#BAE6FD)",borderRadius:18,padding:"20px",border:"2px solid #0284C7"}}>
      <h3 style={{margin:"0 0 4px",fontSize:18,fontWeight:900,color:"#0C4A6E"}}>📚 Explore with CCPL (Free!)</h3>
      <p style={{margin:"0 0 8px",fontSize:13,color:"#0369A1",fontWeight:700}}>Borrow passes from Charleston County libraries</p>
      <p style={{fontSize:13,lineHeight:1.6,color:"#0C4A6E",margin:"0 0 10px"}}>Free entry for 2 adults + 8 kids to SC Aquarium, Children's Museum, Gibbes Museum, County Parks & State Parks. Also: telescope checkout and Gold Pass checkout (5 per library branch, 1-week loan).</p>
      <Lnk href="https://www.ccpl.org" s={{color:"#0C4A6E",fontSize:13}}>CCPL →</Lnk>
    </div>

    <div style={{background:"white",borderRadius:18,padding:"20px",border:`1px solid ${P.border}`}}>
      <h3 style={{margin:"0 0 4px",fontSize:18,fontWeight:900}}>🐠 SC Aquarium Membership</h3>
      <p style={{margin:"0 0 8px",fontSize:13,color:P.muted,fontWeight:700}}>Unlimited visits · $15 off with Gold Pass · Free passes at libraries</p>
      <p style={{fontSize:13,lineHeight:1.6,color:"#4B5563",margin:"0 0 8px"}}>Family membership pays for itself in 2 visits. Dynamic pricing ~$30-45/ticket. Daily 9am–5pm. Under 2 free. $40 Angelfish membership for SNAP/WIC families.</p>
      <Lnk href="https://scaquarium.org/tickets/" s={{fontSize:13}}>SC Aquarium →</Lnk>
    </div>

    <div style={{background:"white",borderRadius:18,padding:"20px",border:`1px solid ${P.border}`}}>
      <h3 style={{margin:"0 0 4px",fontSize:18,fontWeight:900}}>🎨 Children's Museum Membership</h3>
      <p style={{margin:"0 0 8px",fontSize:13,color:P.muted,fontWeight:700}}>$15 at door · $13 advance · $3 SNAP/WIC · Members enter at 9am</p>
      <p style={{fontSize:13,lineHeight:1.6,color:"#4B5563",margin:"0 0 8px"}}>Mon–Sat 10am–5pm (members 9am), Sun 12–5pm. SuperStars Sundays: free for special needs families (2nd & 4th Sundays, 10am–12pm). Look for Quarter Day = 25¢ admission! Located at 25 Ann St downtown.</p>
      <Lnk href="https://explorecml.org/visit/" s={{fontSize:13}}>Children's Museum →</Lnk>
    </div>

  </div>
</div>}

{/* COMMUNITY */}
{view==="community"&&<div style={{marginTop:14}}>
  <h2 style={{fontFamily:"'Lilita One',cursive",fontSize:20,color:P.primary,margin:"0 0 4px"}}>Community & Local Voices</h2>
  <p style={{color:P.muted,fontSize:13,margin:"0 0 14px",lineHeight:1.5}}>Follow these Charleston parents and creators for playground reviews, weekend ideas & family events.</p>
  <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
    {COMMUNITY.map(c=><a key={c.handle} href={c.url} target="_blank" rel="noopener noreferrer" className="c" style={{display:"flex",gap:14,alignItems:"center",background:"white",borderRadius:16,padding:"16px 18px",border:`1px solid ${P.border}`,textDecoration:"none",color:P.text,boxShadow:"0 1px 4px rgba(0,0,0,.04)",transition:"all .2s"}}>
      <div style={{width:52,height:52,borderRadius:16,background:c.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <span style={{fontWeight:900,fontSize:18,color:"#333",fontFamily:"'Lilita One',cursive"}}>{c.initials}</span>
      </div>
      <div style={{minWidth:0}}>
        <div style={{fontWeight:800,fontSize:15}}>{c.name}</div>
        <div style={{fontSize:13,color:P.primary,fontWeight:700}}>{c.handle}</div>
        <div style={{fontSize:12,color:P.muted,marginTop:2,lineHeight:1.4}}>{c.desc}</div>
      </div>
    </a>)}
  </div>
  <h3 style={{fontFamily:"'Lilita One',cursive",fontSize:16,color:P.primary,margin:"0 0 10px"}}>More Local Resources</h3>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10,marginBottom:20}} className="g2">
    {[{n:"Kidding Around Charleston",d:"Events, guides & bucket lists",u:"https://kiddingaroundcharleston.com",i:"🎉"},{n:"Charleston Moms",d:"Parenting resources & guides",u:"https://charlestonmoms.com",i:"👩‍👧‍👦"},{n:"Lowcountry Parent",d:"Activities, camps & family news",u:"https://www.postandcourier.com/lowcountryparent/",i:"📰"},{n:"CCPL Events",d:"Library storytimes & programs",u:"https://ccplsc.libcal.com/calendar",i:"📅"}].map(r=><a key={r.n} href={r.u} target="_blank" rel="noopener noreferrer" style={{background:"white",borderRadius:14,padding:14,border:`1px solid ${P.border}`,textDecoration:"none",color:P.text}}><div style={{fontSize:22,marginBottom:4}}>{r.i}</div><div style={{fontWeight:800,fontSize:13}}>{r.n}</div><div style={{fontSize:12,color:P.muted}}>{r.d}</div></a>)}
  </div>
  <div style={{background:P.warm,borderRadius:16,padding:"20px",textAlign:"center"}}>
    <div style={{fontSize:32,marginBottom:6}}>💌</div>
    <h3 style={{fontFamily:"'Lilita One',cursive",fontSize:16,color:P.primary,margin:"0 0 6px"}}>Know a playground we're missing?</h3>
    <p style={{fontSize:13,color:P.muted,lineHeight:1.5,margin:0}}>Built by Charleston parents, for Charleston parents.</p>
  </div>
</div>}

      </main>
      <footer style={{background:P.primaryDark,color:"rgba(255,255,255,.7)",textAlign:"center",padding:"20px",fontSize:11,lineHeight:1.8}}>
        <div style={{fontFamily:"'Lilita One',cursive",fontSize:15,color:"white",marginBottom:2}}>🛝 charlestonplaygrounds.com</div>
        <p style={{margin:0}}>Made with ❤️ by Charleston parents</p>
        <p style={{margin:"2px 0 0",fontSize:10,opacity:.5}}>Inspired by a two-year-old's resolution to visit every playground in Charleston</p>
      </footer>
    </div>
  );
}
