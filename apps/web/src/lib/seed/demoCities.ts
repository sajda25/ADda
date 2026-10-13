/**
 * Extra demo cities beyond Kolkata — illustrative places + a few memories each.
 */

import { DEMO_CITIES } from "@memory-streets/shared";
import type { SeedMemory, SeedPlace } from "@/lib/seed/demoNeighborhood";

export type SeedNeighborhood = {
  id: string;
  city: string;
  state: string;
  label: string;
  description: string;
  centerLat: number;
  centerLng: number;
};

export type SeedCityPlace = SeedPlace & { neighborhoodId: string };

function mem(
  partial: Omit<SeedMemory, "contentHash"> & { contentHash?: string },
): SeedMemory {
  const contentHash =
    partial.contentHash ??
    `demo:${partial.id}:${partial.title.length}:${partial.text.length}`;
  return { ...partial, contentHash };
}

export const seedNeighborhoods: SeedNeighborhood[] = DEMO_CITIES.map((c) => ({
  id: c.id,
  city: c.name,
  state: c.state,
  label: `${c.name} Demo District, ${c.state} (Illustrative)`,
  description: `A fictionalized demonstration district for ${c.name}. Places and memories are illustrative demo content — not attributed to real people.`,
  centerLat: c.centerLat,
  centerLng: c.centerLng,
}));

/** Kolkata places live in demoNeighborhood.seedPlaces; these are other cities. */
export const seedCityPlaces: SeedCityPlace[] = [
  // Bengaluru
  {
    id: "place_blr_brigade",
    neighborhoodId: "bengaluru-demo",
    name: "Brigade Road Crossing",
    description:
      "Neon, weekend crowds, and the particular bravery of holding hands in public traffic.",
    approxLat: 12.9738,
    approxLng: 77.6081,
  },
  {
    id: "place_blr_cubbon",
    neighborhoodId: "bengaluru-demo",
    name: "Cubbon Park Bench",
    description:
      "Shade, squirrels, and conversations that run longer than any standup meeting.",
    approxLat: 12.9763,
    approxLng: 77.5929,
  },
  {
    id: "place_blr_indiranagar",
    neighborhoodId: "bengaluru-demo",
    name: "Indiranagar 100 Feet Road",
    description:
      "Café spillover onto the pavement — an empty chair under the fairy lights still waiting for its first scrap.",
    approxLat: 12.9784,
    approxLng: 77.6408,
  },
  // Mumbai
  {
    id: "place_mum_marine",
    neighborhoodId: "mumbai-demo",
    name: "Marine Drive Sea Wall",
    description:
      "The Queen's Necklace at dusk — where confessions compete with the Arabian Sea wind.",
    approxLat: 18.9432,
    approxLng: 72.8235,
  },
  {
    id: "place_mum_bandra",
    neighborhoodId: "mumbai-demo",
    name: "Bandra Bandstand",
    description:
      "Salt air, selfie sticks, and the quiet corners locals still claim after dark.",
    approxLat: 19.0428,
    approxLng: 72.8192,
  },
  {
    id: "place_mum_cst",
    neighborhoodId: "mumbai-demo",
    name: "CST Platform Tea Stall",
    description:
      "Rush-hour chaos, cutting chai, and goodbyes timed to the local train whistle.",
    approxLat: 18.9398,
    approxLng: 72.8355,
  },
  // Delhi
  {
    id: "place_del_cp",
    neighborhoodId: "delhi-demo",
    name: "Connaught Place Inner Circle",
    description:
      "White colonnades, winter smog romance, and arguments about which block has better chai.",
    approxLat: 28.6315,
    approxLng: 77.2167,
  },
  {
    id: "place_del_hauz",
    neighborhoodId: "delhi-demo",
    name: "Hauz Khas Village Lake",
    description:
      "Ruins, bass from nearby bars, and the classic almost-kiss on the stones.",
    approxLat: 28.5494,
    approxLng: 77.2001,
  },
  {
    id: "place_del_india_gate",
    neighborhoodId: "delhi-demo",
    name: "India Gate Lawn Edge",
    description:
      "Ice cream carts, picnic blankets, and first I-love-yous whispered under floodlights.",
    approxLat: 28.6129,
    approxLng: 77.2295,
  },
  // Chandigarh
  {
    id: "place_chd_sukna",
    neighborhoodId: "chandigarh-demo",
    name: "Sukhna Lake Promenade",
    description:
      "Morning walkers, evening couples, and the soft geometry of a planned city learning to flirt.",
    approxLat: 30.7421,
    approxLng: 76.8188,
  },
  {
    id: "place_chd_sector17",
    neighborhoodId: "chandigarh-demo",
    name: "Sector 17 Plaza",
    description:
      "Open-air shopping square where school uniforms turn into weekend courage.",
    approxLat: 30.7411,
    approxLng: 76.7822,
  },
  // Chennai
  {
    id: "place_che_marina",
    neighborhoodId: "chennai-demo",
    name: "Marina Beach Sand Strip",
    description:
      "Sundal carts, Bay of Bengal roar, and conversations shouted over the waves.",
    approxLat: 13.0500,
    approxLng: 80.2824,
  },
  {
    id: "place_che_filter",
    neighborhoodId: "chennai-demo",
    name: "Filter Coffee Corner, Besant Nagar",
    description:
      "Steel tumblers, morning filter coffee, and the auntie who knows every regular's order.",
    approxLat: 13.0006,
    approxLng: 80.2667,
  },
  // Hyderabad
  {
    id: "place_hyd_charminar",
    neighborhoodId: "hyderabad-demo",
    name: "Charminar Lane Bangle Shop",
    description:
      "Lac bangles, pearl gossip, and festival crowds that excuse standing too close.",
    approxLat: 17.3616,
    approxLng: 78.4747,
  },
  {
    id: "place_hyd_hitech",
    neighborhoodId: "hyderabad-demo",
    name: "Hitech City Food Street",
    description:
      "Post-standup dinners, drizzle on metro glass, and office crushes who 'just happened' to share an Uber.",
    approxLat: 17.4483,
    approxLng: 78.3915,
  },
  // Pune
  {
    id: "place_pune_fc",
    neighborhoodId: "pune-demo",
    name: "FC Road Bookstore Steps",
    description:
      "College energy, secondhand paperbacks, and monsoon excuses to share an umbrella.",
    approxLat: 18.5286,
    approxLng: 73.8417,
  },
  {
    id: "place_pune_sinhagad",
    neighborhoodId: "pune-demo",
    name: "Sinhagad Mist Point",
    description:
      "Early treks, packed poha, and the kind of view that makes people confess things.",
    approxLat: 18.3662,
    approxLng: 73.7559,
  },
];

export const seedCityMemories: SeedMemory[] = [
  mem({
    id: "mem_blr_brigade",
    placeId: "place_blr_brigade",
    authorId: "user_nila",
    title: "He held my hand in the traffic",
    text: "Brigade Road on a Saturday is not designed for romance — too many elbows, too many shop lights. He held my hand anyway, mid-crosswalk, like the signal owed us thirty extra seconds.\n\nI had liked him for months in the polite Bengaluru way: shared Docs, shared memes, never shared pulse rates. That night the city smelled of rain on hot tar and someone frying bhajji nearby.\n\n'Is this okay?' he asked, already knowing. I squeezed once. The crowd pushed us closer. We laughed like conspirators.\n\nI still cross that junction slower than traffic allows — muscle memory of fingers that chose me in public.",
    layer: "NOW",
    tags: ["crush", "traffic", "rain", "bengaluru"],
    cloaked: false,
    readCount: 84,
    publishedAt: "2025-04-02T18:20:00.000Z",
  }),
  mem({
    id: "mem_blr_cubbon",
    placeId: "place_blr_cubbon",
    authorId: "user_kabir",
    title: "The bench where we almost broke up",
    text: "Cubbon Park looks too gentle for ultimatums. We sat on the peeling green bench anyway. She said she needed someone who planned weekends. I said I needed someone who forgave cancelled ones.\n\nA squirrel judged us. A family picnicked with more emotional stability than we had.\n\nWe did not break up that day. We ordered filter coffee afterward and pretended the argument was about logistics. It was about fear.\n\nI walk past that bench sometimes and nod — respect to the place that held our almost-ending and let us rewrite it.",
    layer: "NOW",
    tags: ["love", "park", "argument", "bengaluru"],
    cloaked: false,
    readCount: 61,
    publishedAt: "2024-11-16T10:00:00.000Z",
  }),
  mem({
    id: "mem_mum_marine",
    placeId: "place_mum_marine",
    authorId: "user_sohini",
    title: "Marine Drive made me brave",
    text: "The sea wall was damp. My courage was damper. I had practised the sentence from Churchgate to Chowpatty in my head until it sounded less ridiculous.\n\nI said it facing the water, not him — classic coward choreography. He heard anyway. The wind stole half the words and delivered the important ones.\n\nHe did not say it back immediately. He put his jacket around my shoulders and said, 'Say it again looking at me.' So I did. Mumbai applauded with a taxi horn.\n\nSome cities give you skyline. This one gave me a rehearsed confession that finally left my mouth.",
    layer: "NOW",
    tags: ["love", "sea", "confession", "mumbai"],
    cloaked: false,
    readCount: 132,
    publishedAt: "2025-01-28T19:40:00.000Z",
  }),
  mem({
    id: "mem_mum_bandra",
    placeId: "place_mum_bandra",
    authorId: "user_arnab",
    title: "Bandstand after the fight",
    text: "We stormed out of a Bandra café mid-argument about whose friends were more exhausting. Classic Mumbai couple content.\n\nAt Bandstand the Arabian Sea refused to take sides. She sat on the rocks. I stood like an unpaid security guard for my own ego. Ten minutes of silence. Then she said, 'I'm hungry,' which in our dialect meant 'I still choose you.'\n\nWe shared vada pav that tasted like truce. Tourists took photos of the skyline. We took photos of each other's faces looking less angry.\n\nI mark that night as the fight that taught us exits can loop back to the same sea wall.",
    layer: "NOW",
    tags: ["fight", "sea", "mumbai", "love"],
    cloaked: true,
    readCount: 77,
    publishedAt: "2024-09-09T21:15:00.000Z",
  }),
  mem({
    id: "mem_del_hauz",
    placeId: "place_del_hauz",
    authorId: "user_tania",
    title: "Almost-kiss on the Hauz Khas stones",
    text: "Winter in Delhi makes everyone dramatic. We climbed down toward the lake ruins because the bar queue was long and our patience was short.\n\nHe leaned in. I leaned in. A group of strangers chose that exact second to blast a wedding reel on full volume. The moment shattered into laughter.\n\nWe tried again behind a pillar. This time it worked — brief, cold-nosed, perfect. Someone whistled. We did not care.\n\nEvery winter since, Hauz Khas smells like possibility mixed with cheap perfume and unfinished sentences.",
    layer: "CHILDHOOD_CAMPUS",
    tags: ["kiss", "winter", "delhi", "crush"],
    cloaked: false,
    readCount: 119,
    publishedAt: "2024-12-14T20:05:00.000Z",
  }),
  mem({
    id: "mem_del_cp",
    placeId: "place_del_cp",
    authorId: "user_joy",
    title: "Connaught Place, wrong block, right person",
    text: "I waited at Block B. She waited at Block N. Delhi's geometry humiliated us for forty minutes until we both called, laughing, slightly furious, completely smitten.\n\nWhen we finally met under the white colonnade, she said, 'Next time we pin location like adults.' I said, 'Next time you choose the block.' We were already holding hands.\n\nCP taught me that romance in this city includes navigation errors and forgiveness chai.\n\nI still arrive early to the wrong block on purpose sometimes — nostalgia is a weird GPS.",
    layer: "NOW",
    tags: ["delhi", "date", "chai", "crush"],
    cloaked: false,
    readCount: 93,
    publishedAt: "2025-02-11T16:30:00.000Z",
  }),
  mem({
    id: "mem_chd_sukna",
    placeId: "place_chd_sukna",
    authorId: "user_paro",
    title: "Sukhna Lake, sunrise courage",
    text: "We went for a 'healthy morning walk' which was code for I need to tell you something before office ruins my nerve.\n\nMist on the water. Joggers with more discipline than me. He listened without interrupting — rare and devastating.\n\nI told him I had liked him since the Sector 17 book fair. He told me he had rewritten three texts and deleted all of them. We sat on the railing like the planned city had planned this too.\n\nChandigarh looks orderly until your heart refuses the grid.",
    layer: "NOW",
    tags: ["chandigarh", "crush", "sunrise", "lake"],
    cloaked: false,
    readCount: 58,
    publishedAt: "2025-03-19T05:50:00.000Z",
  }),
  mem({
    id: "mem_che_marina",
    placeId: "place_che_marina",
    authorId: "user_mim",
    title: "Marina waves stole my confession",
    text: "I shouted 'I like you' at Marina and the Bay of Bengal ate the middle of the sentence. He heard 'I — you' and grinned like that was enough data.\n\nWe ate sundal. Sand in everything. My dignity somewhere near the lighthouse.\n\nHe wrote YES in the wet sand with a stick, then the foam erased it, then he wrote it again higher up. Persistence: hot.\n\nChennai taught me love can be loud, salty, and slightly ridiculous — and still count.",
    layer: "NOW",
    tags: ["chennai", "beach", "confession", "crush"],
    cloaked: false,
    readCount: 101,
    publishedAt: "2024-08-22T18:00:00.000Z",
  }),
  mem({
    id: "mem_hyd_charminar",
    placeId: "place_hyd_charminar",
    authorId: "user_aparna",
    title: "Bangles, crowds, and a festival crush",
    text: "Charminar lane during festival shopping is legally chaos. He kept getting separated from me by bangle aunties and somehow finding me again like a plot device.\n\nHe bought a pair I pointed at for half a second. 'For luck,' he said. I wore them home and could not sleep.\n\nWe shared Irani chai afterward, knees touching under a sticky table, arguing about which route back had fewer scooters. Flirting, Hyderabad edition.\n\nThose bangles cracked last year. The memory did not.",
    layer: "NOW",
    tags: ["hyderabad", "festival", "crush", "bangles"],
    cloaked: false,
    readCount: 88,
    publishedAt: "2024-10-18T14:20:00.000Z",
  }),
  mem({
    id: "mem_pune_fc",
    placeId: "place_pune_fc",
    authorId: "user_ritwik",
    title: "FC Road umbrella treaty",
    text: "Monsoon hit mid-argument about whose turn it was to pay for photocopying. She had the only umbrella. I had the pride of a broke student.\n\nShe pulled me under anyway. 'Don't be cinematic,' she said, while being extremely cinematic. Bookstore steps, wet asphalt, one shared canopy.\n\nWe missed two buses inventing reasons to stay. The third bus we boarded still arguing — softer now, smiling traitors.\n\nPune rains still smell like that treaty: half irritation, half destiny, fully damp.",
    layer: "CHILDHOOD_CAMPUS",
    tags: ["pune", "rain", "crush", "campus"],
    cloaked: false,
    readCount: 72,
    publishedAt: "2025-06-03T12:10:00.000Z",
  }),
];
