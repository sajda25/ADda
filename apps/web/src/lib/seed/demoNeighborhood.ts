/**
 * Deterministic Kolkata demo district seed data.
 * All stories are fictional and illustrative — not attributed to real people.
 */

import type { RelationType, TemporalLayer } from "@adda/shared";
import {
  DEMO_DISTRICT_ID,
  DEMO_DISTRICT_LABEL,
} from "@adda/shared";

export const SEED_VERSION = "india-cities-v1";

export interface SeedUser {
  id: string;
  displayName: string;
  cloakedDefault: boolean;
}

export interface SeedPlace {
  id: string;
  name: string;
  description: string;
  approxLat: number;
  approxLng: number;
}

export interface SeedMemory {
  id: string;
  placeId: string;
  authorId: string;
  title: string;
  text: string;
  layer: TemporalLayer;
  tags: string[];
  cloaked: boolean;
  readCount: number;
  publishedAt: string;
  contentHash: string;
}

export interface SeedRelation {
  id: string;
  sourceMemoryId: string;
  targetMemoryId: string;
  relationType: RelationType;
  description: string;
}

export interface SeedEpoch {
  id: string;
  placeId: string;
  epochNumber: number;
  seed: string;
  contributingMemoryIds: string[];
  engineVersion: string;
  artworkHash: string;
  preservationScore: number;
  createdAt: string;
}

/** College Street corridor — approximate neighborhood center */
export const demoNeighborhood = {
  id: DEMO_DISTRICT_ID,
  label: DEMO_DISTRICT_LABEL,
  description:
    "A fictionalized demonstration district woven from the textures of College Street, tram lines, adda corners, and monsoon Kolkata. All memories are illustrative demo content.",
  centerLat: 22.5758,
  centerLng: 88.3639,
};

export const seedUsers: SeedUser[] = [
  { id: "user_aparna", displayName: "Aparna B.", cloakedDefault: false },
  { id: "user_ritwik", displayName: "Ritwik S.", cloakedDefault: false },
  { id: "user_tania", displayName: "Tania", cloakedDefault: true },
  { id: "user_debashis", displayName: "Debashis M.", cloakedDefault: false },
  { id: "user_sohini", displayName: "Sohini D.", cloakedDefault: false },
  { id: "user_kabir", displayName: "Kabir", cloakedDefault: false },
  { id: "user_nila", displayName: "Nilanjana R.", cloakedDefault: false },
  { id: "user_arnab", displayName: "Arnab", cloakedDefault: true },
  { id: "user_paro", displayName: "Paromita", cloakedDefault: false },
  { id: "user_joy", displayName: "Joydeep", cloakedDefault: false },
  { id: "user_mim", displayName: "Mimi Chatterjee", cloakedDefault: false },
  { id: "user_ghost", displayName: "A neighbor", cloakedDefault: true },
];

export const seedPlaces: SeedPlace[] = [
  {
    id: "place_coffee_house",
    name: "Coffee House Steps",
    description:
      "The stone steps outside the legendary adda room — cigarette smoke of memory, political arguments, and coffee that arrives when the debate needs a pause.",
    approxLat: 22.5759,
    approxLng: 88.3635,
  },
  {
    id: "place_boi_para",
    name: "Boi Para Lane",
    description:
      "A canyon of secondhand spines where monsoon arrives as the smell of damp paper before the first drop hits the asphalt.",
    approxLat: 22.5768,
    approxLng: 88.3648,
  },
  {
    id: "place_tram_crossing",
    name: "Esplanade Tram Crossing",
    description:
      "Bell, spark, and the long yellow body turning — the city's oldest moving sentence.",
    approxLat: 22.5645,
    approxLng: 88.3502,
  },
  {
    id: "place_park_street",
    name: "Park Street After Rain",
    description:
      "Neon puddles, taxi meters ticking, and the particular hush that follows a Kolkata downpour on this stretch.",
    approxLat: 22.5534,
    approxLng: 88.3516,
  },
  {
    id: "place_kumartuli",
    name: "Kumartuli Clay Lane",
    description:
      "Bamboo ribs and wet earth — goddesses taking shape under tin roofs while the river keeps its own counsel.",
    approxLat: 22.5992,
    approxLng: 88.3601,
  },
  {
    id: "place_ju_gate",
    name: "Jadavpur Gate No. 4",
    description:
      "The teal-painted campus threshold where protest songs, first loves, and last exams all share the same iron bars.",
    approxLat: 22.4991,
    approxLng: 88.3712,
  },
  {
    id: "place_golpark",
    name: "Golpark Crossing",
    description:
      "South Kolkata's roundabout of errands — bookshops, sweet boxes, and conversations that miss three buses on purpose.",
    approxLat: 22.5148,
    approxLng: 88.3655,
  },
  {
    id: "place_ghat",
    name: "Millennial Park Ghat Edge",
    description:
      "A riverside pause where the Hooghly looks like molten pewter at dusk and strangers share umbrella space without negotiating.",
    approxLat: 22.5602,
    approxLng: 88.3368,
  },
  {
    id: "place_pandal",
    name: "Para Pandal Square",
    description:
      "For eleven days a year this empty lot becomes a cathedral of light, dhak, and borrowed chairs from every household.",
    approxLat: 22.5185,
    approxLng: 88.3489,
  },
  {
    id: "place_sealdah_tea",
    name: "Sealdah Platform Tea",
    description:
      "Earthen cups, arrival boards flickering, and goodbyes timed to the whistle rather than courage.",
    approxLat: 22.5667,
    approxLng: 88.3712,
  },
  {
    id: "place_unclaimed_bench",
    name: "The Unclaimed Bench",
    description:
      "A quiet bench behind the old magazine stall — always dry under the tin awning, always empty. Waiting for the first scrap to sit down.",
    approxLat: 22.5742,
    approxLng: 88.3618,
  },
];

function mem(
  partial: Omit<SeedMemory, "contentHash"> & { contentHash?: string },
): SeedMemory {
  const contentHash =
    partial.contentHash ??
    `demo:${partial.id}:${partial.title.length}:${partial.text.length}`;
  return { ...partial, contentHash };
}

export const seedMemories: SeedMemory[] = [
  // —— Coffee House (rich) ——
  mem({
    id: "mem_ch_friends",
    placeId: "place_coffee_house",
    authorId: "user_aparna",
    title: "The table where we became friends",
    text: "We were both waiting for a professor who never came. Classic College Street betrayal — the noticeboard said 11:30, the ceiling fan said otherwise.\n\nShe ordered filter coffee like she had been coming here for years. I ordered the same, purely to avoid looking like a fresher who needed a menu. The first five minutes were silence and spoon-clinking. The next five were complaints about the humidity. By the second refill we had exchanged hostel names, favourite mishti shops, and a solemn pact to meet again before the next bandh ruined the city.\n\nWe laughed so loudly at a terrible political joke that the neighbouring table of serious uncles glared at us. We lowered our voices for approximately eleven seconds.\n\nThe coffee was bitter. The friendship was not. Every time I climb those steps now, I still look for that same corner table — even when I know she has moved cities.",
    layer: "CHILDHOOD_CAMPUS",
    tags: ["coffee", "adda", "friendship", "campus"],
    cloaked: false,
    readCount: 192,
    publishedAt: "2024-03-12T09:00:00.000Z",
  }),
  mem({
    id: "mem_ch_dada",
    placeId: "place_coffee_house",
    authorId: "user_ritwik",
    title: "Adda with my dadu",
    text: "Every Sunday Dadu insisted on the corner table near the window that barely opened. He claimed the breeze was better there. The breeze was mostly bus exhaust, but I never corrected him.\n\nHe would tip the cup twice — once to taste, once to approve — and then begin his weekly lecture: which bookshops used to stand where, which poets argued louder, which waiters remembered his name before he had grey hair. I pretended to be bored. I was taking notes in my head the whole time.\n\nOne Sunday he ordered an extra toast 'for the student who looks hungry' and nodded at a stranger two tables away. The stranger looked confused, then grateful. Dadu winked at me like he had funded a revolution.\n\nI still tip the cup twice. Some rituals are inheritance, not habit.",
    layer: "BEFORE_CHANGE",
    tags: ["coffee", "family", "sunday", "tradition"],
    cloaked: false,
    readCount: 161,
    publishedAt: "2024-01-20T11:30:00.000Z",
  }),
  mem({
    id: "mem_ch_bandh",
    placeId: "place_coffee_house",
    authorId: "user_tania",
    title: "The rainy bandh afternoon",
    text: "The city stopped like someone had pulled its plug. No buses, no trams, only rain arguing with the shutters.\n\nInside, though, it was a festival of the stranded. Someone brought a transistor radio that mostly crackled. Someone else produced a deck of cards so old the kings looked unemployed. A boy tried to impress a girl by shuffling; the cards exploded across three tables. We all clapped. He bowed.\n\nThe waiter refused money for the third round and announced, with great dignity, 'Today the rain is paying.' We tipped him anyway in biscuits stolen from someone's tiffin.\n\nI still don't know everyone's names from that afternoon. I remember their laughter between thunderclaps — the specific Kolkata joy of being stuck together with nowhere else to be.",
    layer: "NOW",
    tags: ["rain", "coffee", "community", "bandh"],
    cloaked: true,
    readCount: 104,
    publishedAt: "2025-06-02T15:10:00.000Z",
  }),
  mem({
    id: "mem_ch_closed",
    placeId: "place_coffee_house",
    authorId: "user_debashis",
    title: "When the shutters stayed down",
    text: "For weeks the steps collected only rain, leaflets, and the stubborn optimism of regulars who still arrived 'just to check.' People tucked notes into the lock like it was a wishing well for caffeine.\n\nI wrote one too. It said: 'Please don't renovate the sugar tin.' Ridiculous. Necessary.\n\nWhen it finally reopened, the cups were new and suspiciously shiny. The sugar tin, thank the gods of adda, was the same dented veteran. Continuity, I learned that morning, can be a metal box that survives every upgrade.\n\nWe celebrated by arguing for two hours about whether the coffee tasted different. Conclusion: yes, no, maybe, refill please.",
    layer: "BEFORE_CHANGE",
    tags: ["coffee", "change", "continuity"],
    cloaked: false,
    readCount: 91,
    publishedAt: "2023-11-08T08:45:00.000Z",
  }),
  mem({
    id: "mem_ch_first_city",
    placeId: "place_coffee_house",
    authorId: "user_sohini",
    title: "My first evening in Kolkata",
    text: "I arrived with one suitcase, a printed map that lied about walking times, and the particular panic of someone who has not yet learned which side of College Street is which.\n\nI sat on the steps because sitting felt safer than choosing a wrong direction. A stranger at the next table asked if I was lost in a way that was kind, not mocking. I said yes before my pride could stop me. He sketched a route to a paying-guest house on a paper napkin, refused payment for his coffee advice, and made me promise to order proper filter coffee next time — not the tourist hesitation order.\n\nKindness has coordinates. Mine began on these steps, napkin still folded in my wallet years later, map ink faded, promise kept.",
    layer: "NOW",
    tags: ["coffee", "arrival", "kindness", "city"],
    cloaked: false,
    readCount: 78,
    publishedAt: "2025-01-14T07:20:00.000Z",
  }),
  mem({
    id: "mem_ch_exam",
    placeId: "place_coffee_house",
    authorId: "user_kabir",
    title: "We bunked the tutorial for 'important research'",
    text: "Official reason written in the attendance register of our hearts: academic field visit. Actual reason: the tutorial was on a chapter none of us had opened, and the Coffee House fan looked more educational.\n\nWe arrived like fugitives and ordered like scholars. Rana brought three photocopied pages and pretended they were a syllabus. Meera brought nothing except confidence. I brought guilt, which dissolved by the second cup.\n\nWe argued about Tagore versus physics with the seriousness of a national debate. A waiter swept around our feet like we were furniture that paid rent. Outside, the real class continued without us. Inside, we learned the more useful syllabus: how to share one plate of toast four ways, how to laugh without looking at the time, and how bunking feels holy when friendship is everywhere.\n\nI failed that paper. I still remember the formulas we shouted over tram bells — and the way Meera said, 'We'll pass life instead.'",
    layer: "CHILDHOOD_CAMPUS",
    tags: ["coffee", "campus", "exams", "friendship"],
    cloaked: false,
    readCount: 144,
    publishedAt: "2024-08-19T19:00:00.000Z",
  }),
  mem({
    id: "mem_ch_quiet",
    placeId: "place_coffee_house",
    authorId: "user_ghost",
    title: "A cup for no one in particular",
    text: "Some evenings I buy two cuttings and leave one on the ledge outside, as if the city might sit down and accept the invitation.\n\nIt is not for a ghost. It is for the version of myself who once needed someone to notice — the fresher with trembling directions, the heartbroken one who stirred sugar for too long, the exam-week zombie who forgot their own name.\n\nUsually a stray cat investigates. Sometimes a student takes it with a confused thank-you to the air. Once, an old man raised the cup toward me like a toast across time.\n\nThe ledge understands Kolkata weather better than I do. It keeps my secret without asking for the story.",
    layer: "NOW",
    tags: ["coffee", "solitude", "ritual"],
    cloaked: true,
    readCount: 14,
    publishedAt: "2025-09-01T18:30:00.000Z",
  }),
  mem({
    id: "mem_ch_sugar",
    placeId: "place_coffee_house",
    authorId: "user_arnab",
    title: "We disagree about the sugar",
    text: "People romanticise this place as eternally sweet — coffee soft enough to make adda gentle. That is not how I remember the nineties.\n\nBack then it was bitter, fast, almost rude in the best way: journalists with three minutes between editions, students pretending to be journalists, waiters who could insult you affectionately in two languages. Sugar was optional. Ego was not.\n\nMy cousin swears it was always dessert-level sweet. We have fought this battle at family dinners for years. Last month we returned together, ordered the same cup, tasted like scientists, and still disagreed.\n\nMemory is a recipe with missing measurements. The Coffee House keeps both our truths on the same menu.",
    layer: "BEFORE_CHANGE",
    tags: ["coffee", "memory", "contradiction"],
    cloaked: true,
    readCount: 33,
    publishedAt: "2024-05-03T10:15:00.000Z",
  }),
  mem({
    id: "mem_ch_music",
    placeId: "place_coffee_house",
    authorId: "user_nila",
    title: "I saw my crush steal the window seat",
    text: "I had a carefully practised plan: arrive early, look casually brilliant with a book I was not reading, and hope he noticed. He arrived earlier. He stole the window seat. Villain behaviour. Attractive villain behaviour.\n\nI sat two tables away and performed the ancient ritual of pretending not to look. He dropped his pen. I dropped my dignity and picked it up. Our fingers did not touch, but my heartbeat filed a formal complaint.\n\nWe talked about nothing important — monsoon exams, a film neither of us had watched, whether the toast was overpriced. It felt like everything important. When he laughed, the ceiling fan seemed to spin in celebration.\n\nI never got his number that day. I got something better and more useless: a story I still smile about whenever I pass that window seat, still secretly hoping it remembers me too.",
    layer: "CHILDHOOD_CAMPUS",
    tags: ["coffee", "crush", "campus", "friendship"],
    cloaked: false,
    readCount: 171,
    publishedAt: "2025-05-21T17:45:00.000Z",
  }),

  // —— Boi Para ——
  mem({
    id: "mem_book_monsoon",
    placeId: "place_boi_para",
    authorId: "user_aparna",
    title: "He found me hiding in Fiction",
    text: "Class Twelve. Uniform still damp from the walk. I ducked into Boi Para because the rain had turned College Street into a river and because my school crush — let's call him R — had just walked past with his cricket bag and I needed somewhere private to die of embarrassment.\n\nHe found me anyway. Between a leaning tower of secondhand pulp and a shelf labeled 'Philosophy (mostly unread).' He pretended to look for a book. I pretended my heart was not auditioning for a dhak.\n\n'You're dripping on Tagore,' he said. Then he handed me his handkerchief like we were in a film neither of our parents would approve of. Our fingers brushed. The owner cleared his throat from the doorway with the skill of a man who had chaperoned a thousand almost-romances.\n\nWe stood there for forty minutes arguing about whether Chetan Bhagat counted as literature (it did not) while the monsoon washed the city clean. He wrote his number on a torn receipt. The ink bled. I memorised it anyway.\n\nI never called. He never asked why. But every time rain hits that doorway, I still smell damp paper and almost-courage — and I still wonder what would have happened if I had dialled before the ink disappeared.",
    layer: "CHILDHOOD_CAMPUS",
    tags: ["books", "rain", "crush", "campus"],
    cloaked: false,
    readCount: 96,
    publishedAt: "2024-02-28T14:00:00.000Z",
  }),
  mem({
    id: "mem_book_lost",
    placeId: "place_boi_para",
    authorId: "user_tania",
    title: "The paperback that knew my secret",
    text: "I found a blue novel with no price sticker and someone else's handwriting in the margins — sharp, impatient, a little mean in the way clever people are mean when they are lonely. Page 87: 'She leaves because she is scared, not because she doesn't love him.' Page 142: a phone number, half scribbled out.\n\nI put it back to buy later. When I returned after tuition, the shelf had been reshuffled like the city denying a conspiracy. The owner shrugged. 'Books migrate. Like people.'\n\nTwo weeks later I saw a boy at Coffee House reading the same blue cover. Same handwriting peeking from the edge. Same almost-number. I nearly said hello. I nearly said I had been inside his private thoughts. Instead I ordered cutting chai and watched him underline something with the seriousness of a proposal.\n\nI still hunt that edition in every lane. Not for the story. For the margins. For proof that someone in this city once felt as loudly as I did — and left the evidence in secondhand fiction.",
    layer: "NOW",
    tags: ["books", "crush", "strangers", "secret"],
    cloaked: true,
    readCount: 41,
    publishedAt: "2025-05-09T11:25:00.000Z",
  }),
  mem({
    id: "mem_book_owner",
    placeId: "place_boi_para",
    authorId: "user_paro",
    title: "The uncle who caught us kissing",
    text: "Not by our names — by the last book we almost bought. 'Travel shelf girl,' he called me. 'Poetry boy,' he called him. We thought we were invisible behind the tall stacks of exam guides. We were not.\n\nThe afternoon we finally stopped pretending the kiss was an accident, Uncle coughed so loudly a dust-cloud rose from the history section. Then he said, without looking up from his ledger, 'If you are going to ruin my alphabetising, at least buy something.'\n\nWe bought a battered atlas. Useless. Perfect. We signed our initials inside the cover like criminals documenting a happy crime.\n\nFive years later I walked in alone. He looked up once. 'Travel shelf. You were the one who laughed too much.' No lecture. No nostalgia tax. Just recognition — the softest kind of surveillance.\n\nI still have the atlas. The initials have faded. The memory has not.",
    layer: "BEFORE_CHANGE",
    tags: ["books", "crush", "secret", "community"],
    cloaked: false,
    readCount: 58,
    publishedAt: "2023-06-18T10:00:00.000Z",
  }),

  // —— Tram ——
  mem({
    id: "mem_tram_bell",
    placeId: "place_tram_crossing",
    authorId: "user_nila",
    title: "Our hands met on the pole",
    text: "I had been riding the same tram route for months hoping to 'accidentally' share a compartment with him after coaching. The universe finally cooperated on a Thursday that smelled of wet iron and cheap perfume.\n\nThe tram jolted. My hand landed on the pole. His hand landed on mine. Neither of us moved for three full stops. The city outside blurred into neon and banana-leaf stalls. Inside, my pulse was doing illegal speeds.\n\nHe asked if I got off at Esplanade. I said yes even though I lived two stops earlier. Bravery tastes like metal rails and borrowed time.\n\nWe walked the crossing after, pretending to wait for another tram we both knew we would not board. He said my name like he had been practising it. I said his like a dare.\n\nI still glance up when I hear that particular bell. Not for the destination. For the ghost of a hand that once chose not to pull away.",
    layer: "BEFORE_CHANGE",
    tags: ["tram", "crush", "waiting", "city"],
    cloaked: false,
    readCount: 118,
    publishedAt: "2023-09-15T12:00:00.000Z",
  }),
  mem({
    id: "mem_tram_flood",
    placeId: "place_tram_crossing",
    authorId: "user_joy",
    title: "Stranded with my ex's best friend",
    text: "Water filled the tracks in twenty minutes. My phone died. My umbrella turned inside out like a bad mood. And then — of course — she appeared. My ex's best friend. The one who knew too much. The one I had blocked on every platform except real life, which refuses block features.\n\nWe stood knee-deep with a dozen strangers forming a human chain around a stranded scooter. Someone started singing a film song off-key. She laughed. I hated that I still liked her laugh.\n\n'You look like a drowned chicken,' she said. I said, 'You look like a bad decision.' We both smiled like traitors.\n\nFor one soaked hour the city suspended our history. We shared a packet of peanuts. She told me he had moved to Pune. I pretended not to care with Olympic skill. When the water finally dropped, she squeezed my wrist once — not romantic, not cruel, just human — and vanished into a shared auto.\n\nDisaster, for sixty minutes, felt like the only honest conversation we ever had.",
    layer: "NOW",
    tags: ["rain", "tram", "flood", "drama"],
    cloaked: false,
    readCount: 137,
    publishedAt: "2025-07-22T16:40:00.000Z",
  }),
  mem({
    id: "mem_tram_last",
    placeId: "place_tram_crossing",
    authorId: "user_debashis",
    title: "Last ride before she left the city",
    text: "She had the acceptance letter folded in her bag like a secret weapon. I had a speech prepared in my head that began with 'stay' and ended with something dignified. Neither version survived the tram bell.\n\nWe took the route we always took — the long way, the scenic lie. She rested her head on my shoulder for the first time in public. I counted the poles like rosary beads. Vendors shouted. A child cried. The city kept being a city while my private apocalypse unfolded at 15 km/h.\n\nAt the crossing she said, 'Don't make this a film scene.' So I didn't. I bought her a cutting chai. She cried into it anyway. Progress, the newspapers said that week, would quiet these wires. Progress did not mention heartbreak.\n\nShe left two days later. The stretch went silent the year after. I mark both losses on the same mental map: the year the city forgot how to glide, and the year I learned that some goodbyes arrive seated, knee to knee, pretending to talk about the weather.",
    layer: "BEFORE_CHANGE",
    tags: ["tram", "goodbye", "love", "change"],
    cloaked: false,
    readCount: 82,
    publishedAt: "2022-12-01T09:00:00.000Z",
  }),
  mem({
    id: "mem_tram_night",
    placeId: "place_tram_crossing",
    authorId: "user_mim",
    title: "We snuck out after the last bell",
    text: "Hostel curfew was 9:30. We were still outside at 11, walking the median like it was a pier, neon stuttering pink and guilty green across wet metal. My roommate thought I was at the library. His friends thought he was asleep. The crossing knew better.\n\nHe dared me to stand on the rail. I dared him to say what he was actually thinking. He said it. Soft. Dangerous. The kind of sentence that rearranges your semester.\n\nWe did not kiss — not then. We did something worse and better: we promised to meet again at the same spot if either of us ever felt brave. I returned six times. He returned on the seventh, late, out of breath, holding two paper cones of jhal muri like a peace offering to the night.\n\nShops were closed. The signs kept working. Kolkata felt unfinished and generous — exactly the right setting for a secret that still makes my stomach flip when a tram bell rings after dark.",
    layer: "NOW",
    tags: ["night", "tram", "crush", "secret"],
    cloaked: false,
    readCount: 66,
    publishedAt: "2025-04-11T23:10:00.000Z",
  }),

  // —— Park Street ——
  mem({
    id: "mem_park_taxi",
    placeId: "place_park_street",
    authorId: "user_sohini",
    title: "Yellow taxi, almost a confession",
    text: "The meter ticked louder than we spoke. Rain drew childish maps on the windshield. I had planned, for three whole days, to say something brave about liking him. Park Street after rain felt cinematic enough to support the attempt.\n\nI said, instead: 'Nice weather for pneumonia.' He laughed. My confession postponed itself like a delayed train.\n\nAt the signal he paid for half without asking who owed what. Our shoulders touched once when the taxi jolted — and stayed touching, for a red light that felt illegally long. He looked at me. I looked at the neon. Cowardice has excellent timing.\n\nOutside Flurys he almost said something. I almost let him. Then a scooter sprayed both of us and the moment drowned laughing.\n\nCities invent temporary families in the back seat of yellow taxis. Sometimes they invent almost-love stories that still make you smile — and wince — when the neon hits the puddles just right.",
    layer: "NOW",
    tags: ["taxi", "rain", "night", "crush"],
    cloaked: false,
    readCount: 89,
    publishedAt: "2025-03-08T21:00:00.000Z",
  }),
  mem({
    id: "mem_park_music",
    placeId: "place_park_street",
    authorId: "user_kabir",
    title: "She lent me her coat — and almost her mouth",
    text: "December on Park Street is a costume the city wears sincerely. I was underdressed on purpose — trying to look effortless, succeeding at looking cold. She noticed. She always noticed.\n\n'You'll die of pride,' she said, and wrapped her coat around my shoulders. It smelled of mothballs, jasmine, and the particular danger of a girl who knows she is the plot twist.\n\nWe stood under the Christmas lights while a street band butchered a carol into something holy. Her lipstick left a faint mark on the coat collar when she leaned in to fix my scarf. Almost a kiss. Almost an earthquake.\n\nWe did not exchange numbers. We exchanged a look that still follows me into every December. The lights did the remembering for us — pink, gold, and slightly unfair.",
    layer: "NOW",
    tags: ["festival", "night", "crush", "winter"],
    cloaked: false,
    readCount: 73,
    publishedAt: "2024-12-24T20:15:00.000Z",
  }),
  mem({
    id: "mem_park_before",
    placeId: "place_park_street",
    authorId: "user_arnab",
    title: "The night I got dumped outside the jazz bar",
    text: "There were more doorways you could enter without a reservation. Jazz leaked onto the pavement like gossip. She chose the doorway, not the table, to end us — efficient, public, unforgettable.\n\n'I need someone who shows up,' she said. I had shown up late to everything that year: love, ambition, my own life. A saxophone somewhere inside hit a note that felt personally targeted.\n\nI walked Park Street until my shoes complained. A stranger offered me a cigarette I did not smoke. A couple argued about dessert with more passion than we had argued about forever.\n\nProgress built taller menus and thinner shadows. I miss the unfinished edges — and the version of me who still believed a doorway conversation could be rewritten if the band played one more song.",
    layer: "BEFORE_CHANGE",
    tags: ["change", "heartbreak", "night"],
    cloaked: true,
    readCount: 39,
    publishedAt: "2023-03-11T08:00:00.000Z",
  }),

  // —— Kumartuli ——
  mem({
    id: "mem_kumar_hands",
    placeId: "place_kumartuli",
    authorId: "user_paro",
    title: "Clay under the fingernails for weeks",
    text: "I came to photograph idols and stayed because a boy with plaster dust in his hair asked if I could 'make myself useful instead of hovering.' Rude. Correct. Fatal.\n\nI carried bamboo. I mixed clay. I learned that devotion has a smell — wet earth, turpentine, tea boiled too hard. By the second week my hands remembered a city my mind was still learning. By the third week I remembered the exact shape of his laugh when I dropped a bucket.\n\nWe never dated, officially. Official is for people with clean fingernails. We sat on the ghat steps after work sharing one cigarette we both pretended not to want, talking about gods as if they were difficult relatives.\n\nOctober ended. He stayed. I left for a job in another pin code. For weeks after, clay still lived under my nails like a rumour I refused to scrub away.",
    layer: "NOW",
    tags: ["clay", "festival", "crush", "durga"],
    cloaked: false,
    readCount: 112,
    publishedAt: "2024-10-05T06:30:00.000Z",
  }),
  mem({
    id: "mem_kumar_before",
    placeId: "place_kumartuli",
    authorId: "user_ritwik",
    title: "Before the tour buses",
    text: "The lane was narrower and the river closer in the telling. Families worked without an audience. My cousin fell in love with an artisan's daughter the summer before the cameras arrived — the kind of love that lived in stolen tea breaks and arguments about whether Ma Durga preferred red or maroon.\n\nThey thought the lane would stay private forever. Then the tour buses came, and every whisper acquired a lens. Their story became careful. Their glances became shorter.\n\nI am glad people come to witness. I also mourn the privacy that left with the shutters clicking. Some sacred things prefer to be overheard by neighbours, not hashtags.\n\nThey married anyway — quietly, stubbornly, with clay still drying on the windowsill. Proof that even when a place becomes famous, a heart can keep a back-alley exit.",
    layer: "BEFORE_CHANGE",
    tags: ["clay", "love", "change", "community"],
    cloaked: false,
    readCount: 47,
    publishedAt: "2023-10-29T05:00:00.000Z",
  }),
  mem({
    id: "mem_kumar_child",
    placeId: "place_kumartuli",
    authorId: "user_mim",
    title: "The afternoon the idol looked like my crush",
    text: "I was ten and ridiculous. The artisan painted eyes onto a face and for one blasphemous second I swore it looked like the boy from the next para — the one who stole my eraser and my dignity.\n\nI held my breath. My mother pinched my arm. 'Don't stare like that. She is Ma.' I stared anyway. Childhood is the original heresy.\n\nYears later I brought a camera and pretended to be a documentarian. Same shed smell. Same hush when the gaze arrives. I no longer see my crush in the clay. I see every version of wanting I have ever been — loud, secret, a little holy, a little foolish.\n\nThe moment a face receives its eyes, the shed becomes a temple. I still hold my breath. Some habits outgrow the crush that started them.",
    layer: "CHILDHOOD_CAMPUS",
    tags: ["clay", "durga", "crush", "childhood"],
    cloaked: false,
    readCount: 85,
    publishedAt: "2024-09-20T11:00:00.000Z",
  }),

  // —— JU Gate ——
  mem({
    id: "mem_ju_first",
    placeId: "place_ju_gate",
    authorId: "user_kabir",
    title: "I waited every morning for her cycle",
    text: "Mothers gathered in a constellation of umbrellas. The gate opened at the same minute every day, as if time itself had a prefect. I arrived seven minutes early for one reason only: the girl with the blue Hero cycle and the braid that never stayed obedient.\n\nShe never looked at me. I looked enough for both of us. I learned her timetable better than my own syllabus — 8:11 if it rained, 8:07 if the sun was showing off, 8:20 if her mother was lecturing her at the corner.\n\nOne morning her chain slipped. I finally had an excuse that was not creepy. I fixed it with trembling hands and the mechanical knowledge of a boy who had watched too many YouTube videos the night before in preparation for a fantasy moment.\n\nShe said thank you. She smiled. My entire academic career briefly became irrelevant.\n\nI can still hear the hinge arguing with humidity. I can still hear my heart filing a complaint with the universe for making school gates so romantic and so cruel.",
    layer: "CHILDHOOD_CAMPUS",
    tags: ["school", "crush", "morning", "campus"],
    cloaked: false,
    readCount: 108,
    publishedAt: "2024-06-10T05:50:00.000Z",
  }),
  mem({
    id: "mem_ju_last",
    placeId: "place_ju_gate",
    authorId: "user_aparna",
    title: "Last day, shirts untucked",
    text: "We signed each other's kurtas because yearbooks felt too formal and too expensive. Someone had a blue gel pen that smudged like emotion. Someone else had a black marker that took permanent too seriously.\n\nHe signed right over my heart — literally, on the fabric — and wrote 'don't become boring.' I signed his sleeve with a joke so bad he groaned, then hugged me like the semester was ending twice.\n\nWe took photos that were mostly thumbs and monsoon light. We promised to meet every month. We met twice. On the second meeting he mentioned a girlfriend from his new college with the casual cruelty of people who think honesty is a virtue at all hours.\n\nInk bled in the wash later. The signatures lasted longer in memory than on cotton. Whenever I pass Gate No. 4, I still instinctively untuck my shirt a little — old freedom, old almost, old ache.",
    layer: "CHILDHOOD_CAMPUS",
    tags: ["campus", "crush", "ending", "friendship"],
    cloaked: false,
    readCount: 99,
    publishedAt: "2024-06-11T12:00:00.000Z",
  }),
  mem({
    id: "mem_ju_paint",
    placeId: "place_ju_gate",
    authorId: "user_paro",
    title: "We carved our initials under the teal",
    text: "Every summer they painted the gate. Every monsoon peeled it. We used that cycle like criminals with a calendar.\n\nOne June, behind the peepal's cover, he carved our initials into a chipped corner while I kept watch for the chowkidar. Tiny. Shaky. Immortal for approximately one academic year.\n\nBy August the paint crew returned. Teal number six buried us politely. I pretended to be mature about it. I was not. I went back after dark with a phone torch like a detective mourning graffiti.\n\nI count at least seven teals now. Somewhere under the layers, two letters still argue with time. That is enough permanence for a campus love story that never got a second semester.",
    layer: "BEFORE_CHANGE",
    tags: ["campus", "crush", "secret", "time"],
    cloaked: false,
    readCount: 29,
    publishedAt: "2023-07-04T09:40:00.000Z",
  }),

  // —— Golpark ——
  mem({
    id: "mem_gol_mishti",
    placeId: "place_golpark",
    authorId: "user_joy",
    title: "Rosogolla negotiations",
    text: "We always bought one extra for the uncle who refused payment and then accepted it as insulted affection. That evening I was buying for two — myself and the girl I had finally asked out after four months of 'accidental' collisions at the crossing.\n\nShe chose the sweets. I chose the bravery. Uncle looked at us, looked at the sky, and said, 'Two boxes. One future. Don't mess it up.' South Kolkata uncles have no chill and excellent accuracy.\n\nWe sat on the low wall sharing syrup and silence. A bus splashed us. She laughed with her whole face. I thought: okay, this is the scene I will replay when I am old and dramatic.\n\nShe ghosted me three weeks later. The uncle still asks, every time I pass, 'Where is mishti girl?' I still don't have an answer that isn't embarrassing. The crossing taught economics and heartbreak better than any tutorial.",
    layer: "NOW",
    tags: ["food", "crush", "market", "heartbreak"],
    cloaked: false,
    readCount: 71,
    publishedAt: "2025-01-05T04:30:00.000Z",
  }),
  mem({
    id: "mem_gol_books",
    placeId: "place_golpark",
    authorId: "user_nila",
    title: "Missing three buses on purpose",
    text: "We were supposed to be 'just friends' catching the bus to a cousin's place. That lasted until bus number one. By bus number two our shoulders had filed a joint petition. By bus number three he admitted he had taken the wrong route last week just to stand at this stop at this hour.\n\nI should have been angry. I was delighted. Dangerous combination.\n\nThe conversation got sharper — exes, almosts, the stupid fight that ended our previous almost. He apologised with the sincerity of someone who had rehearsed in the shower. I forgave him with the recklessness of someone who likes rain and bad ideas.\n\nWhen the fourth bus came we finally boarded, laughing at our own inefficiency, knees touching like a secret handshake. South Kolkata forgives delay if the adda is honest. That night, honesty won by three buses and one almost-kiss at the handrail.",
    layer: "NOW",
    tags: ["bus", "crush", "adda", "romance"],
    cloaked: false,
    readCount: 63,
    publishedAt: "2024-12-18T03:55:00.000Z",
  }),
  mem({
    id: "mem_gol_before",
    placeId: "place_golpark",
    authorId: "user_debashis",
    title: "Before the signal cameras",
    text: "Vendors owned the geometry of the roundabout. Lovers owned the blind spots. My brother used to meet his girlfriend behind the flower stall where the traffic police couldn't be bothered and the aunties could be bribed with a smile.\n\nThen the cameras arrived. Suddenly every glance had an archive. The flower stall moved. The choreography changed. Young people learned to fight via text instead of face-to-face under a neon 'OPEN' sign.\n\nI am not anti-progress. I am pro-the era when a roundabout could keep a secret. Infrastructure changes; taste remembers — and so does every couple who lost their favourite corner to a red blinking eye.",
    layer: "BEFORE_CHANGE",
    tags: ["road", "love", "change", "secret"],
    cloaked: false,
    readCount: 36,
    publishedAt: "2023-10-29T05:00:00.000Z",
  }),

  // —— Ghat ——
  mem({
    id: "mem_ghat_dusk",
    placeId: "place_ghat",
    authorId: "user_tania",
    title: "I almost said I love you to the river",
    text: "We sat until the bridge lights switched on one by one. I had the sentence ready — three words, no footnotes. He was talking about a job in Hyderabad like it was weather.\n\nI said, 'The Hooghly looks like pewter tonight,' which is not 'I love you,' but in my dialect of cowardice it was close.\n\nHe took my hand. Not casually. Deliberately. Like signing something. A ferry horn cut the air. A priest somewhere clapped twice. The city offered us every cinematic prop and I still bottled the confession.\n\nNo proposal. No audience. Just the certainty that the river would outlast our plans — and that some loves are spoken in the grip of a hand, not in vocabulary. I still replay that dusk when I need to remember I was once brave enough to sit still beside almost.",
    layer: "NOW",
    tags: ["river", "dusk", "love", "crush"],
    cloaked: true,
    readCount: 94,
    publishedAt: "2025-02-20T19:30:00.000Z",
  }),
  mem({
    id: "mem_ghat_ferry",
    placeId: "place_ghat",
    authorId: "user_ritwik",
    title: "Ferry horns as timekeeping",
    text: "Dad checked his watch against the ferry, not the other way around. Punctuality, he said, is a river skill. What he didn't say: he was once late to this ghat and lost the girl who would not wait for men who treated time like a suggestion.\n\nHe told me that story on my eighteenth birthday, half joke, half warning, while we shared peanuts and watched the Howrah skyline bruise into evening.\n\n'If you love someone,' he said, 'arrive before the horn.' I laughed. Then I thought of the girl in my class who always left tutorials early. The next week I was waiting at the gate ten minutes ahead of schedule like a reformed character.\n\nI still arrive early to water. Some inheritance is logistics. Some is romance disguised as discipline.",
    layer: "BEFORE_CHANGE",
    tags: ["river", "ferry", "family", "love"],
    cloaked: false,
    readCount: 52,
    publishedAt: "2023-05-16T10:10:00.000Z",
  }),
  mem({
    id: "mem_ghat_rain",
    placeId: "place_ghat",
    authorId: "user_ghost",
    title: "Shared umbrella, no names",
    text: "A stranger and I discovered we were both waiting out the same violent cell of rain. Their umbrella was barely big enough for one and a half people. We became the half.\n\nShoulders wet. Breath close. The kind of proximity that would be scandalous if it weren't raining hard enough to erase sin. They smelled like wet denim and orange soap. I smelled like panic and hope.\n\nWe did not exchange names. We exchanged a look when thunder cracked — the look that asks, without language, 'Are you also suddenly alive?' When the rain thinned, they folded the umbrella, tipped an imaginary hat, and walked toward the ferry with the elegance of a plot twist leaving the scene.\n\nI still check that stretch of ghat when it pours. Not for a reunion. For proof that the city can invent intimacy without demanding paperwork.",
    layer: "NOW",
    tags: ["rain", "river", "strangers", "tension"],
    cloaked: true,
    readCount: 21,
    publishedAt: "2025-08-14T06:45:00.000Z",
  }),

  // —— Pandal ——
  mem({
    id: "mem_pandal_lamps",
    placeId: "place_pandal",
    authorId: "user_paro",
    title: "He held my hand under the lamps",
    text: "Festival nights turn the lot into a river of light. Children carry sparklers with excessive confidence. Elders pretend not to worry. I was pretending not to notice that he had been walking exactly half a step closer with every pandal.\n\nAt our para's gate, between two rows of lamps, his fingers found mine. Not accidental. Claimed. My cousin saw and made a face that said she would blackmail me later.\n\nWe sat on the plastic chairs afterward, thighs touching, arguing about which dhak team slapped harder, while my pulse auditioned for the percussion section. Someone offered us bhog. Someone asked if we were 'a thing.' He said, 'Ask her.' I said, 'Ask the lamps.'\n\nThe chairs held us without complaint. October held the secret for as long as October can. I still walk that lamp-row slower than necessary — muscle memory of a hand that once chose mine in public.",
    layer: "NOW",
    tags: ["festival", "crush", "lamps", "durga"],
    cloaked: false,
    readCount: 124,
    publishedAt: "2024-10-31T19:45:00.000Z",
  }),
  mem({
    id: "mem_pandal_quiet",
    placeId: "place_pandal",
    authorId: "user_arnab",
    title: "The empty lot in January",
    text: "No dhak. No crowd. Just weeds and a faded flex banner arguing with the wind. I went looking for October and found the ghost of the night she told me it was over — right here, beside a generator that smelled of diesel and endings.\n\nIn Puja we had been golden. In January we were two people standing in a rectangle of dirt pretending the chairs were still there.\n\nI am not proud of how long I stayed after she left. Long enough for a street dog to judge me. Long enough to memorise the exact emptiness where the idol had been.\n\nCities rest between miracles. Hearts, less gracefully. I still pass the lot and feel the echo of a festival that ended twice.",
    layer: "NOW",
    tags: ["festival", "heartbreak", "quiet"],
    cloaked: true,
    readCount: 18,
    publishedAt: "2025-01-16T08:20:00.000Z",
  }),
  mem({
    id: "mem_pandal_old",
    placeId: "place_pandal",
    authorId: "user_joy",
    title: "Before the theme pandals",
    text: "Ours was simpler — bamboo, cloth, devotion without a hashtag. My first stolen kiss happened behind that bamboo, during Sandhi puja, while the adults were busy being holy and the generator covered our crime with a roar.\n\nShe tasted like mishti doi and panic. I tasted like a boy who could not believe his luck. A neighbour's torch swept past. We froze like idol-thieves. Then we laughed into our sleeves until our stomachs hurt.\n\nI am not against spectacle. I am for the memory of when spectacle still fit in a neighbor's courtyard — and when love still fit behind a bamboo screen, unthemed, unposted, unforgettable.",
    layer: "BEFORE_CHANGE",
    tags: ["festival", "kiss", "secret", "community"],
    cloaked: false,
    readCount: 55,
    publishedAt: "2022-08-09T17:00:00.000Z",
  }),

  // —— Sealdah ——
  mem({
    id: "mem_seal_goodbye",
    placeId: "place_sealdah_tea",
    authorId: "user_sohini",
    title: "I kissed him before the whistle",
    text: "We never hugged until the train was visible. Superstition or efficiency — I still don't know. That morning I broke the rule.\n\nPlatform tea in earthen cups. His suitcase between us like a chaperone. He kept saying 'it's only two years' as if time were a polite guest. I kept nodding like a liar.\n\nWhen the whistle cut through the station, I pulled him in by the collar and kissed him — brief, public, slightly tea-flavoured, completely insane. A coolie cheered. An auntie clicked her tongue. Worth it.\n\nWhen the train pulled away, the platform felt larger by exactly one person and one unfinished sentence. I still time my bravest decisions to whistles.",
    layer: "NOW",
    tags: ["train", "goodbye", "kiss", "love"],
    cloaked: false,
    readCount: 87,
    publishedAt: "2025-03-08T21:00:00.000Z",
  }),
  mem({
    id: "mem_seal_first",
    placeId: "place_sealdah_tea",
    authorId: "user_kabir",
    title: "Earthen cup, first salary",
    text: "I bought tea for my parents with money that still felt fictional. The cups were warm and rough. Pride tasted like cardamom and platform dust.\n\nThen I did something stupid and perfect: I bought a third cup for the girl from accounts who had helped me survive probation — and who I had a crush on so loud my colleagues could have charged rent for it.\n\nShe arrived late, hair escaping her bun, smile escaping her professionalism. 'For me?' she asked. 'For courage,' I said, which was somehow worse and better.\n\nWe missed her train talking. She caught the next one. I floated home on steam and possibility. First salary taught me I could provide. First tea taught me I could risk looking foolish for someone worth the burn.",
    layer: "CHILDHOOD_CAMPUS",
    tags: ["tea", "crush", "train", "ritual"],
    cloaked: false,
    readCount: 68,
    publishedAt: "2024-07-21T16:00:00.000Z",
  }),
  mem({
    id: "mem_seal_old",
    placeId: "place_sealdah_tea",
    authorId: "user_debashis",
    title: "When the boards were painted by hand",
    text: "Arrival times arrived as chalk. Conductors knew faces. I once watched a man rewrite 'on time' to 'late' with a flourish, then wink at a woman waiting with flowers — as if the delay were a gift he had arranged personally.\n\nThey left the platform together laughing. Progress later built screens and removed the flourish of a wrist writing destiny in dust.\n\nI miss the handwriting of the city. I miss believing a chalk stroke could conspire with lovers. Every LED board since has been more accurate and somehow less romantic.",
    layer: "BEFORE_CHANGE",
    tags: ["train", "change", "love", "tea"],
    cloaked: false,
    readCount: 42,
    publishedAt: "2023-01-22T07:30:00.000Z",
  }),
  mem({
    id: "mem_seal_sound",
    placeId: "place_sealdah_tea",
    authorId: "user_ghost",
    title: "I still hear the interval bell",
    text: "Passing the old footbridge at dusk, I hear a bell that no longer rings for me. Maybe it is a scooter. Maybe it is memory doing what Kolkata does best — insisting.\n\nThat bell meant the end of tuition and the start of the twenty minutes when she and I walked the long way to the bus, inventing errands, inventing reasons, inventing a future that did not survive the board exams.\n\nI do not know where she lives now. I know exactly how her laugh sounded between the tea stall and the ticket queue. Some sounds refuse deletion.\n\nIf you hear a phantom bell at Sealdah, don't correct yourself too quickly. It might be the city filing an old romance under 'still playing.'",
    layer: "NOW",
    tags: ["train", "crush", "memory", "sound"],
    cloaked: true,
    readCount: 16,
    publishedAt: "2025-08-30T18:00:00.000Z",
  }),
];

export const seedRelations: SeedRelation[] = [
  {
    id: "rel_1",
    sourceMemoryId: "mem_ch_friends",
    targetMemoryId: "mem_ch_dada",
    relationType: "ECHO",
    description: "Different generations finding belonging at the same table.",
  },
  {
    id: "rel_2",
    sourceMemoryId: "mem_ch_friends",
    targetMemoryId: "mem_ch_bandh",
    relationType: "RELATED",
    description: "Rain and pause as the weather that opens strangers into company.",
  },
  {
    id: "rel_3",
    sourceMemoryId: "mem_ch_closed",
    targetMemoryId: "mem_ch_dada",
    relationType: "TRANSFORM",
    description: "Before and after the shutters' long rest.",
  },
  {
    id: "rel_4",
    sourceMemoryId: "mem_ch_sugar",
    targetMemoryId: "mem_ch_dada",
    relationType: "CONTRADICTION",
    description: "Disagreement about how the coffee used to taste.",
  },
  {
    id: "rel_5",
    sourceMemoryId: "mem_ch_first_city",
    targetMemoryId: "mem_ch_friends",
    relationType: "ECHO",
    description: "Arrivals that began with an unexpected kindness.",
  },
  {
    id: "rel_6",
    sourceMemoryId: "mem_tram_last",
    targetMemoryId: "mem_tram_bell",
    relationType: "TRANSFORM",
    description: "The crossing before and after the wires quieted.",
  },
  {
    id: "rel_7",
    sourceMemoryId: "mem_pandal_lamps",
    targetMemoryId: "mem_pandal_old",
    relationType: "CONTINUATION",
    description: "The para keeps inventing October under new themes.",
  },
  {
    id: "rel_8",
    sourceMemoryId: "mem_kumar_child",
    targetMemoryId: "mem_kumar_hands",
    relationType: "ECHO",
    description: "Watching and later working in the same clay air.",
  },
  {
    id: "rel_9",
    sourceMemoryId: "mem_ju_first",
    targetMemoryId: "mem_ju_last",
    relationType: "CONTINUATION",
    description: "The gate as beginning and ending ritual.",
  },
  {
    id: "rel_10",
    sourceMemoryId: "mem_park_before",
    targetMemoryId: "mem_park_music",
    relationType: "TRANSFORM",
    description: "Park Street nights across changing facades.",
  },
  {
    id: "rel_11",
    sourceMemoryId: "mem_seal_old",
    targetMemoryId: "mem_seal_goodbye",
    relationType: "RELATED",
    description: "Platforms that hold departures across eras.",
  },
  {
    id: "rel_12",
    sourceMemoryId: "mem_ghat_ferry",
    targetMemoryId: "mem_ghat_dusk",
    relationType: "RELATED",
    description: "The Hooghly as family clock and private cathedral.",
  },
];

export const seedEpochs: SeedEpoch[] = [
  {
    id: "epoch_ch_1",
    placeId: "place_coffee_house",
    epochNumber: 1,
    seed: "kolkata-coffee-epoch-1",
    contributingMemoryIds: ["mem_ch_friends", "mem_ch_dada", "mem_ch_closed"],
    engineVersion: "1.0.0",
    artworkHash: "demo:artwork:coffee:1",
    preservationScore: 0.2,
    createdAt: "2024-06-01T00:00:00.000Z",
  },
  {
    id: "epoch_ch_2",
    placeId: "place_coffee_house",
    epochNumber: 2,
    seed: "kolkata-coffee-epoch-2",
    contributingMemoryIds: [
      "mem_ch_friends",
      "mem_ch_dada",
      "mem_ch_bandh",
      "mem_ch_first_city",
      "mem_ch_sugar",
    ],
    engineVersion: "1.0.0",
    artworkHash: "demo:artwork:coffee:2",
    preservationScore: 0.45,
    createdAt: "2025-06-15T00:00:00.000Z",
  },
  {
    id: "epoch_tram_1",
    placeId: "place_tram_crossing",
    epochNumber: 1,
    seed: "kolkata-tram-epoch-1",
    contributingMemoryIds: [
      "mem_tram_bell",
      "mem_tram_flood",
      "mem_tram_last",
    ],
    engineVersion: "1.0.0",
    artworkHash: "demo:artwork:tram:1",
    preservationScore: 0.3,
    createdAt: "2025-01-10T00:00:00.000Z",
  },
  {
    id: "epoch_pandal_1",
    placeId: "place_pandal",
    epochNumber: 1,
    seed: "kolkata-pandal-epoch-1",
    contributingMemoryIds: [
      "mem_pandal_lamps",
      "mem_pandal_old",
      "mem_pandal_quiet",
    ],
    engineVersion: "1.0.0",
    artworkHash: "demo:artwork:pandal:1",
    preservationScore: 0.35,
    createdAt: "2025-03-01T00:00:00.000Z",
  },
];

export function assertSeedIntegrity(
  extraPlaceIds: string[] = [],
  extraMemories: SeedMemory[] = [],
): void {
  const placeIds = new Set([...seedPlaces.map((p) => p.id), ...extraPlaceIds]);
  const userIds = new Set(seedUsers.map((u) => u.id));
  const allMemories = [...seedMemories, ...extraMemories];
  const memoryIds = new Set(allMemories.map((m) => m.id));

  for (const memory of allMemories) {
    if (!placeIds.has(memory.placeId)) {
      throw new Error(`Memory ${memory.id} references missing place`);
    }
    if (!userIds.has(memory.authorId)) {
      throw new Error(`Memory ${memory.id} references missing author`);
    }
  }
  for (const relation of seedRelations) {
    if (
      !memoryIds.has(relation.sourceMemoryId) ||
      !memoryIds.has(relation.targetMemoryId)
    ) {
      throw new Error(`Relation ${relation.id} references missing memory`);
    }
  }
  if (seedMemories.length < 35) {
    throw new Error(`Expected ~40 Kolkata memories, found ${seedMemories.length}`);
  }
}
