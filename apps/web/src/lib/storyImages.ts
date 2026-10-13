/**
 * Real aesthetic story images from Unsplash (free license).
 * Sourced via web search for cafe / Kolkata monsoon / books / river / festival themes.
 * Each story has at least 3 images.
 */

export type StoryImage = {
  url: string;
  alt: string;
  credit: string;
};

const u = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

/** Theme pools — rotated so each story gets a unique trio */
const POOLS = {
  cafe: [
    { id: "photo-1757010055832-de355d2f8f06", alt: "Warm cafe interior with plants", credit: "Caroline Badran / Unsplash" },
    { id: "photo-1768051424304-e1f2422c3356", alt: "Cozy cafe seating and warm light", credit: "Đào Việt Hoàng / Unsplash" },
    { id: "photo-1758900393800-4e5d9d20c4d7", alt: "Cafe interior with framed art", credit: "Sadia Alam / Unsplash" },
    { id: "photo-1747994569247-f0fdd6fb4b5f", alt: "Sunlit cafe tables and chairs", credit: "Unsplash" },
    { id: "photo-1746040669847-d680018f7ecd", alt: "Coffee shop warm copper light", credit: "Unsplash" },
    { id: "photo-1495474472287-4d71bcdd2085", alt: "Coffee cup in soft morning light", credit: "Unsplash" },
    { id: "photo-1501339847302-ac426a4a7cbb", alt: "Coffee shop counter atmosphere", credit: "Unsplash" },
    { id: "photo-1442512595331-e89e73853f31", alt: "Espresso and cafe mood", credit: "Unsplash" },
    { id: "photo-1511920170033-f8396924c348", alt: "Latte art close-up", credit: "Unsplash" },
    { id: "photo-1554118811-1e0d58224f24", alt: "Bright airy cafe interior", credit: "Unsplash" },
    { id: "photo-1521017432531-fbd92d768814", alt: "Friends at a cafe table", credit: "Unsplash" },
    { id: "photo-1760351065294-b069f6bcadc4", alt: "Friends studying together at cafe", credit: "Unsplash" },
    { id: "photo-1755882941433-935ff9b7ad0e", alt: "Latte beside a book", credit: "Esra Afşar / Unsplash" },
    { id: "photo-1453614512568-c4024d13c247", alt: "Coffee beans and warm tones", credit: "Unsplash" },
  ],
  rain: [
    { id: "photo-1665905276136-4d9ddb24fc92", alt: "Kolkata flooded street in monsoon", credit: "Dibakar Roy / Unsplash" },
    { id: "photo-1702658509997-86458a6493e2", alt: "Walking through Kolkata rain water", credit: "Dibakar Roy / Unsplash" },
    { id: "photo-1702658509667-f9939f3d1676", alt: "Blue bus on rain-soaked Kolkata street", credit: "Dibakar Roy / Unsplash" },
    { id: "photo-1756427680913-7f02e8bb9a5b", alt: "Wet street neon reflections at night", credit: "Unsplash" },
    { id: "photo-1515694346937-94d85e16e0f0", alt: "Rain on window glass", credit: "Unsplash" },
    { id: "photo-1428908728789-d2de25dbd4e2", alt: "Umbrella in the rain", credit: "Unsplash" },
    { id: "photo-1501999635878-71cb5379c2d8", alt: "City street after rain", credit: "Unsplash" },
    { id: "photo-1534274988757-a28bf1a57c17", alt: "Rainy pavement reflections", credit: "Unsplash" },
  ],
  books: [
    { id: "photo-1754887966034-ca5fccaf5774", alt: "Cozy bookstore wooden shelves", credit: "Madeline Liu / Unsplash" },
    { id: "photo-1739471781934-dbf34176990a", alt: "Shelf of old vintage books", credit: "Miom / Unsplash" },
    { id: "photo-1728506972831-193841eb2961", alt: "Room of books dark academia mood", credit: "Anastasia Meraki / Unsplash" },
    { id: "photo-1524995997946-a1c2e315a42f", alt: "Library aisle of books", credit: "Unsplash" },
    { id: "photo-1481627834876-b7833e8f5570", alt: "Open book in warm light", credit: "Unsplash" },
    { id: "photo-1512820790803-83ca734da794", alt: "Stacked books aesthetic", credit: "Unsplash" },
    { id: "photo-1495446815901-a7297e633e8d", alt: "Books on a wooden table", credit: "Unsplash" },
    { id: "photo-1456513080880-7d93ddd5d14c", alt: "Reading in soft light", credit: "Unsplash" },
  ],
  tram: [
    { id: "photo-1516900557549-41557d405adf", alt: "Tram at night by the station", credit: "Unsplash" },
    { id: "photo-1759433568456-1eec5629359c", alt: "Illuminated station cityscape at night", credit: "Jonny Gios / Unsplash" },
    { id: "photo-1544620341-11cbdc6832be", alt: "Yellow bus urban transit", credit: "Unsplash" },
    { id: "photo-1474487548417-781cb71495f3", alt: "Train tracks vanishing point", credit: "Unsplash" },
    { id: "photo-1558618666-fcd25c85cd64", alt: "City street traffic blur", credit: "Unsplash" },
    { id: "photo-1449824913935-59a10b8d2000", alt: "Urban street at dusk", credit: "Unsplash" },
  ],
  night: [
    { id: "photo-1519501025264-65ba15a82390", alt: "City lights at night", credit: "Unsplash" },
    { id: "photo-1480714378408-67cf0d13bc1b", alt: "Neon city night street", credit: "Unsplash" },
    { id: "photo-1514565131-fce0801e5785", alt: "Night street wet reflections", credit: "Unsplash" },
    { id: "photo-1496442226666-8d4d0e62e6e9", alt: "Taxi and city night glow", credit: "Unsplash" },
    { id: "photo-1548013146-72479768bada", alt: "India Gate evening atmosphere", credit: "Unsplash" },
    { id: "photo-1469474968028-56623f02e42e", alt: "Golden hour atmosphere", credit: "Unsplash" },
  ],
  river: [
    { id: "photo-1536421469767-80559bb6f5e1", alt: "Howrah Bridge lit at night", credit: "Unsplash" },
    { id: "photo-1742325646212-f917ba1feeaa", alt: "Howrah Bridge at dusk", credit: "Unsplash" },
    { id: "photo-1677307816181-1446ab18913e", alt: "Bridge spanning the river", credit: "Unsplash" },
    { id: "photo-1571679654681-ba01b9e1e117", alt: "Boat on the river by day", credit: "Unsplash" },
    { id: "photo-1700569497006-01c3eeb6f744", alt: "River bridge lights at night", credit: "Unsplash" },
    { id: "photo-1761408941664-482ae65fd164", alt: "Illuminated steel bridge detail", credit: "Unsplash" },
    { id: "photo-1683581911616-d5cd604f6184", alt: "Shore beside the bridge", credit: "Unsplash" },
    { id: "photo-1507525428034-b723cf961d3e", alt: "Water and soft horizon", credit: "Unsplash" },
  ],
  festival: [
    { id: "photo-1666638787411-c5c8ef25d229", alt: "Festival candles in the dark", credit: "Miguel Alcântara / Unsplash" },
    { id: "photo-1765106892441-c70c527066ae", alt: "Durga Puja shrine lights", credit: "Dibakar Roy / Unsplash" },
    { id: "photo-1703245588710-20d1b727b75c", alt: "Festival gathering in Kolkata rain", credit: "Dibakar Roy / Unsplash" },
    { id: "photo-1604608672516-f1b9b1d37076", alt: "Diwali diyas glowing", credit: "Unsplash" },
    { id: "photo-1634979141916-0f44586c6c3d", alt: "Festival lights bokeh", credit: "Unsplash" },
    { id: "photo-1545558014-8694373e834d", alt: "Warm festival lantern glow", credit: "Unsplash" },
  ],
  clay: [
    { id: "photo-1753164726260-5825324a7fc4", alt: "Potter shaping clay in workshop", credit: "Unsplash" },
    { id: "photo-1565193566173-7a0ee3dbe261", alt: "Hands working with clay", credit: "Unsplash" },
    { id: "photo-1578749556568-bc2c40e68b61", alt: "Ceramic pottery on shelves", credit: "Unsplash" },
    { id: "photo-1490312278390-ab6421933b65", alt: "Artisan craft textures", credit: "Unsplash" },
    { id: "photo-1459411552884-841db9b3cb2a", alt: "Handmade earthy craft details", credit: "Unsplash" },
    { id: "photo-1513364776144-60967b0f800f", alt: "Art studio warm light", credit: "Unsplash" },
  ],
  campus: [
    { id: "photo-1523050854058-8df90110c9f1", alt: "Campus graduation mood", credit: "Unsplash" },
    { id: "photo-1541339907198-e08756dedf3f", alt: "University building exterior", credit: "Unsplash" },
    { id: "photo-1523240795612-9a054b0db644", alt: "Students walking on campus", credit: "Unsplash" },
    { id: "photo-1627556704290-2b1f5853ff78", alt: "Campus gate and path", credit: "Unsplash" },
    { id: "photo-1498243691581-b145c3f54a5a", alt: "Library steps and architecture", credit: "Unsplash" },
    { id: "photo-1562774053-701939374585", alt: "College corridor light", credit: "Unsplash" },
  ],
  sweets: [
    { id: "photo-1606313564200-e75d5e30476c", alt: "Chocolate dessert with warm tones", credit: "Unsplash" },
    { id: "photo-1551024506-0bccd828d307", alt: "Pastries and dessert plate", credit: "Unsplash" },
    { id: "photo-1563805042-7684c019e1cb", alt: "Ice cream scoops aesthetic", credit: "Unsplash" },
    { id: "photo-1464349095431-e9a21285b5f3", alt: "Birthday cake soft light", credit: "Unsplash" },
    { id: "photo-1565958011703-44f9829ba187", alt: "Berry cake overhead", credit: "Unsplash" },
    { id: "photo-1505253758473-96b7015fcd40", alt: "Colorful Indian thali meal", credit: "Unsplash" },
  ],
  train: [
    { id: "photo-1474487548417-781cb71495f3", alt: "Railway tracks perspective", credit: "Unsplash" },
    { id: "photo-1523987355523-c7b5b0dd90a8", alt: "Train station platform", credit: "Unsplash" },
    { id: "photo-1557223562-6c77ef16210f", alt: "Passenger waiting mood", credit: "Unsplash" },
    { id: "photo-1464037866556-6812c9d1c72f", alt: "Airport/station departure feel", credit: "Unsplash" },
    { id: "photo-1436491865332-7a61a109cc05", alt: "Travel window light", credit: "Unsplash" },
    { id: "photo-1504150558240-0b4fd8946624", alt: "Tea cup travel pause", credit: "Unsplash" },
  ],
} as const;

type PoolKey = keyof typeof POOLS;

function trio(pool: PoolKey, start: number, alts?: string[]): StoryImage[] {
  const items = POOLS[pool];
  const out: StoryImage[] = [];
  for (let i = 0; i < 3; i++) {
    const item = items[(start + i) % items.length]!;
    out.push({
      url: u(item.id),
      alt: alts?.[i] ?? item.alt,
      credit: item.credit,
    });
  }
  return out;
}

/** Minimum 3 aesthetic images per story id */
export const STORY_IMAGES: Record<string, StoryImage[]> = {
  // Coffee House
  mem_ch_friends: trio("cafe", 0, [
    "Cafe table where friendships begin",
    "Warm interior light for long adda",
    "Shared coffee and conversation",
  ]),
  mem_ch_dada: trio("cafe", 2),
  mem_ch_bandh: [...trio("rain", 0), ...trio("cafe", 4)].slice(0, 3),
  mem_ch_closed: trio("cafe", 5),
  mem_ch_first_city: trio("cafe", 7),
  mem_ch_exam: trio("cafe", 9),
  mem_ch_quiet: trio("cafe", 11),
  mem_ch_sugar: trio("cafe", 1),
  mem_ch_music: trio("cafe", 3),

  // Boi Para
  mem_book_monsoon: [...trio("books", 0).slice(0, 2), ...trio("rain", 1).slice(0, 1)],
  mem_book_lost: trio("books", 2),
  mem_book_owner: trio("books", 4),

  // Tram
  mem_tram_bell: trio("tram", 0),
  mem_tram_flood: trio("rain", 0),
  mem_tram_last: trio("tram", 2),
  mem_tram_night: trio("night", 0),

  // Park Street
  mem_park_taxi: trio("night", 1),
  mem_park_music: trio("night", 3),
  mem_park_before: trio("night", 2),

  // Kumartuli
  mem_kumar_hands: trio("clay", 0),
  mem_kumar_before: trio("clay", 2),
  mem_kumar_child: trio("clay", 1),

  // JU
  mem_ju_first: trio("campus", 0),
  mem_ju_last: trio("campus", 2),
  mem_ju_paint: trio("campus", 3),

  // Golpark
  mem_gol_mishti: trio("sweets", 0),
  mem_gol_books: [...trio("books", 1).slice(0, 2), ...trio("sweets", 2).slice(0, 1)],
  mem_gol_before: trio("tram", 3),

  // Ghat / river
  mem_ghat_dusk: trio("river", 0),
  mem_ghat_ferry: trio("river", 2),
  mem_ghat_rain: [...trio("rain", 2).slice(0, 1), ...trio("river", 4).slice(0, 2)],

  // Pandal
  mem_pandal_lamps: trio("festival", 0),
  mem_pandal_quiet: trio("festival", 2),
  mem_pandal_old: trio("festival", 1),

  // Sealdah
  mem_seal_goodbye: trio("train", 0),
  mem_seal_first: trio("train", 2),
  mem_seal_old: trio("train", 3),
  mem_seal_sound: trio("train", 1),
};

export function imagesForStory(storyId: string): StoryImage[] {
  const images = STORY_IMAGES[storyId];
  if (images && images.length >= 3) return images;
  // Fallback aesthetic set so no story is image-less
  return trio("cafe", Math.abs(hash(storyId)) % 10);
}

export function coverImageForStory(storyId: string): string | null {
  return imagesForStory(storyId)[0]?.url ?? null;
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

/** Place-level cover for storybook thumb — first image of richest theme */
export function aestheticCoverForPlace(placeId: string): string | null {
  const map: Record<string, PoolKey> = {
    place_coffee_house: "cafe",
    place_boi_para: "books",
    place_tram_crossing: "tram",
    place_park_street: "night",
    place_kumartuli: "clay",
    place_ju_gate: "campus",
    place_golpark: "sweets",
    place_ghat: "river",
    place_pandal: "festival",
    place_sealdah_tea: "train",
  };
  const pool = map[placeId];
  if (!pool) return null;
  return u(POOLS[pool][0]!.id);
}
