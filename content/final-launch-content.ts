import type { HomePageDefinition, PageSection, SeoPageDefinition } from "@/config/types";
import rawHome from "./generated/home.json";
import rawPages from "./generated/pages.json";

const reviewedAt = "2026-09-26";
const basePages = rawPages as SeoPageDefinition[];
const baseHome = rawHome as HomePageDefinition;

function replaceSection(sections: PageSection[], id: string, next: PageSection): PageSection[] {
  return sections.map((section) => section.id === id ? next : section);
}

function addSections(sections: PageSection[], ...next: Array<PageSection | PageSection[]>): PageSection[] {
  // Several focused replacements can be composed without restating an entire page.
  // A replacement created by replaceSection is a new object; untouched source sections
  // retain their original object identity and must not overwrite an earlier replacement.
  let result = sections;
  for (const item of next) {
    if (!Array.isArray(item)) {
      result = [...result.filter((section) => section.id !== item.id), item];
      continue;
    }
    for (const section of item) {
      const untouched = basePages.some((page) => page.sections.includes(section));
      if (!untouched) result = replaceSection(result, section.id, section);
    }
  }
  return [...result.filter((section) => section.id !== "faq"), ...result.filter((section) => section.id === "faq")];
}

function enrich(slug: string, update: (page: SeoPageDefinition) => SeoPageDefinition) {
  const page = basePages.find((item) => item.slug === slug);
  if (!page) throw new Error(`Missing launch page: ${slug}`);
  return update(page);
}

const eggLocations = enrich("ride-a-pet-egg-locations", (page) => ({
  ...page,
  sections: addSections(
    replaceSection(page.sections, "search-areas", {
      id: "search-areas",
      heading: "Six Reported Ride A Pet Egg Search Zones",
      intro: "Use these six zones as one repeatable sweep when a rare egg is announced. The order matters: it starts with the landmarks nearest the central route and finishes at the desert-side checkpoints, so you do not keep doubling back.",
      table: {
        caption: "Ride A Pet rare egg route: six reported zones",
        columns: ["Zone", "Where to start", "What to check", "Next landmark", "Best route cue"],
        rows: [
          ["Giant Tree", "Leave the central service area toward the large tree.", "Tree room, canopy platforms, lower branches, and roots.", "Waterfall Cave", "Clear it first while the route is short."],
          ["Waterfall Cave", "Approach the falls from the Track-side path.", "Cave behind the water, opening, and exit-side ground.", "Cave-side Cliffs", "Use the cave exit as your direction reset."],
          ["Cliffs Outside the Cave", "Take the raised ground on either side of the cave.", "Visible edges and the line leading away from the falls.", "Forest–Desert Edge", "Keep the waterfall behind you before turning out."],
          ["Forest–Desert Cliff Edge", "Follow the terrain where the green area changes to sand.", "High ledges and the open line toward the desert.", "Desert Pyramid", "Do not cut back through the forest."],
          ["Desert Pyramid", "Use the large desert structure as the anchor.", "Approach, interior opening, and nearby paths.", "Pond / Maze Entrance", "The pyramid marks the final third of the loop."],
          ["Hidden Maze", "Find the pond-side entrance near the pyramid route.", "Entrance, corners, ladder-side path, and exit.", "Return route", "Finish here, then take the cleanest known way home."]
        ]
      },
      paragraphs: [
        "The zones are reported search areas, not six permanent coordinates. That distinction is useful in practice: you are learning a route that works even when the exact egg position changes. Clear each named checkpoint once, then move on. If a player callout names a landmark you have already cleared, you immediately know whether it is worth reversing.",
        "Black Hole and Cherub searches can use the same broad circuit because the public route reports overlap. Read the live egg name before you leave, then let that target decide whether to run only the first two zones or the complete six-zone loop."
      ]
    }),
    replaceSection(page.sections, "fast-route", {
      id: "fast-route",
      heading: "Fast 6-Zone Route",
      intro: "This is the practical full-map order. Ride straight through it on your fastest available mount; the route is designed to avoid a second trip through the same landmarks.",
      steps: [
        { heading: "Check Track and the active target.", description: "Make sure the egg you are chasing is actually listed or announced before you spend a radar charge or leave the hub." },
        { heading: "Clear Giant Tree.", description: "Sweep the room, branches, and roots, then immediately take the line toward the falls." },
        { heading: "Run Waterfall Cave and both outside cliffs.", description: "Search behind the waterfall first, use the exit to orient yourself, then check the raised ground outside." },
        { heading: "Follow the forest–desert edge to the Pyramid.", description: "Stay on the visible biome boundary instead of weaving back through the trees." },
        { heading: "Finish at the pond-side maze.", description: "Check the entrance, corners, and path behind the ladder before deciding whether to return or restart." },
        { heading: "Return directly after pickup.", description: "Head to My Plot with an empty nest ready; carrying an egg is the moment to stop sightseeing." }
      ],
      paragraphs: [
        "Bring basket or nest space before the run, equip the quickest pet you can control comfortably, and use the live target name as your first filter. Players with a directional radar should follow its marker over a general route, because the marker is information from the current server rather than a historical report.",
        "If the first two zones are empty and the egg has already been claimed, reset rather than completing the long loop out of habit. The route is valuable because it tells you what to skip as well as what to search."
      ]
    }),
    { id: "route-reading", heading: "How to Read a Rare-Egg Callout", paragraphs: [
      "Server callouts are more useful when everyone uses the same landmark vocabulary. “Tree” should send you to Giant Tree; “falls” should mean Waterfall Cave; “pyramid” and “maze” are the desert-side anchors. Ask for the landmark, not a vague direction such as “near desert,” and you can join a hunt without stopping to decode another player’s route.",
      "A live banner or Track row is the best reason to start the route. A screenshot is best used to learn what an area looks like. Keep those jobs separate: current game information decides whether to run, while this page decides the most efficient order to run in."
    ], links: [{ label: "Black Hole Egg route", slug: "ride-a-pet-black-hole-egg", description: "Use the target-specific pickup and recovery plan." }, { label: "Ride A Pet locations", slug: "ride-a-pet-locations", description: "Learn the route anchors before a long hunt." }] }
  ),
  faq: [
    ...(page.faq ?? []),
    { question: "What is the fastest Ride A Pet egg route?", answer: "Run Giant Tree, Waterfall Cave, cave-side cliffs, the forest–desert edge, Desert Pyramid, and the pond-side maze in that order." },
    { question: "Can Black Hole and Cherub eggs use the same route?", answer: "Yes. Public reports place both searches around the same broad landmark circuit; confirm the active egg name before you leave." }
  ],
  lastReviewed: reviewedAt
}));

const blackHoleEgg = enrich("ride-a-pet-black-hole-egg", (page) => ({
  ...page,
  hero: { ...page.hero, lead: "Black Hole and Blackhole describe the same player search intent. Use this Ride A Pet Black Hole Egg route when the target is active: start at Giant Tree, clear Waterfall Cave and its cliffs, then follow the forest–desert edge to the Pyramid and pond-side maze." },
  sections: addSections(
    replaceSection(page.sections, "where-to-look", {
      id: "where-to-look", heading: "Black Hole Egg Search Areas", intro: "The current route reports consistently point to these six zones. Treat them as an ordered search circuit, not as a promise that the egg will be on the same rock in every server.",
      table: { caption: "Black Hole Egg landmark sweep", columns: ["Area", "Check first", "What to inspect", "Move on to"], rows: [
        ["Giant Tree", "Tree room and branches", "Canopy platforms, roots, both lower sides", "Waterfall Cave"],
        ["Waterfall Cave", "Behind the falls", "Cave floor, opening, exit-side path", "Outside Cliffs"],
        ["Outside Cliffs", "Cave-side elevation", "Edges overlooking the route", "Forest–Desert Edge"],
        ["Forest–Desert Edge", "Biome boundary", "High line facing the sand", "Desert Pyramid"],
        ["Desert Pyramid", "Approach and opening", "Paths around the structure", "Pond-side Maze"],
        ["Pond-side Maze", "Entrance and corners", "Ladder-side path and exit", "Return to My Plot"]
      ] },
      paragraphs: [
        "Start at Giant Tree because it is close, recognisable, and easy to clear. Waterfall Cave is the next anchor; once you leave it, stay moving toward the desert instead of zig-zagging through the forest. The Pyramid and maze are the final checks, which makes them efficient places to stop when the target has already been taken.",
        "The broad locations route also works for Cherub. This Ride A Pet Black Hole Egg page narrows the job to one target: read the label, clear the six areas in order, pick up quickly, and return with the egg before its timer expires."
      ]
    }),
    replaceSection(page.sections, "after-pickup", {
      id: "after-pickup", heading: "After Pickup: Return and Hatch", paragraphs: [
        "Once you pick up a Black Hole Egg, switch from searching to delivery. Ride the clearest line back to My Plot, avoid optional landmarks, and make sure a nest is available before the egg’s break timer reaches zero. The game rewards a clean return more than an ambitious shortcut that leaves you stuck on terrain.",
        "Place the egg in the open nest, wait for the hatch result, then inspect the pet in Pets and Index. Keep any pet needed for a coming rebirth rather than selling it for a short-term cash gain. If the hatch adds a mutation, compare its displayed result with the pet you currently use for travel or income."
      ]
    }),
    { id: "spawn-announcement", heading: "What to Do After a Spawn Announcement", steps: [
      { heading: "Read the egg name.", description: "Confirm that the announcement or Track entry says Black Hole / Blackhole before committing to the long route." },
      { heading: "Check a nest and mount.", description: "An empty nest and a fast ride should be ready before you see the target." },
      { heading: "Use radar if the current server offers one.", description: "A live direction marker beats a static route; use the map loop when you do not have a useful marker." },
      { heading: "Call out a landmark, not a coordinate.", description: "Tree, falls, pyramid, and maze are repeatable directions that teammates can understand immediately." }
    ], paragraphs: ["The announcement tells you when to act; the route tells you where to act. Keeping those two decisions separate prevents a common mistake: running the entire desert loop when the server is announcing a different egg or when another player has already collected it."] },
    { id: "blackhole-troubleshooting", heading: "If the Egg Is Not There", bullets: [
      "Confirm the active target on Track or in the current announcement; a similar old screenshot is not a target confirmation.",
      "Ask whether a player already picked it up before clearing the same six zones again.",
      "Check that your radar, if equipped, is pointed at the current egg rather than an older selection.",
      "Mark the last landmark you searched so a return run does not repeat the Tree and skip the maze.",
      "Use the time between targets to learn the route or improve a faster mount instead of camping one reported point."
    ] }
  ),
  faq: [
    { question: "Is Blackhole Egg the same as Black Hole Egg?", answer: "Yes. Players use both spellings for the same Ride A Pet search intent; read the live game label for the current target." },
    { question: "Where should I search for a Black Hole Egg first?", answer: "Start at Giant Tree, then clear Waterfall Cave and its outside cliffs before taking the forest–desert route to the Pyramid and maze." },
    { question: "What should I do after picking up a Black Hole Egg?", answer: "Return directly to My Plot, place it in an empty nest before the break timer ends, then inspect the hatch result." },
    { question: "Why is the Black Hole Egg not in a reported zone?", answer: "The target may not be active, another player may have collected it, or the search may have skipped a checkpoint. Recheck the live target and run the route once in order." }
  ],
  lastReviewed: reviewedAt
}));

const locations = enrich("ride-a-pet-locations", (page) => ({
  ...page,
  sections: addSections(
    replaceSection(page.sections, "landmarks", {
      id: "landmarks", heading: "Important Ride A Pet Landmarks", intro: "These landmarks turn a large map into a sequence of useful decisions. Learn the central services first, then use the Tree, falls, desert edge, Pyramid, and maze to build a route you can repeat without coordinates.",
      table: { caption: "Ride A Pet landmark navigation table", columns: ["Landmark", "Nearby feature", "Used for", "How to recognise it", "Where to go next"], rows: [
        ["Sell", "Central service area", "Cash-out and route reset", "Named service point near the hub", "Giant Tree or Track"],
        ["Track", "Central market route", "Reading current eggs and orienting hunts", "Visible tracking service", "Waterfall path"],
        ["Giant Tree", "Early green route", "First rare-egg checkpoint", "Large climbable tree and branches", "Waterfall Cave"],
        ["Waterfall Cave", "Behind the falls", "Second egg checkpoint", "Cave entrance under falling water", "Cave-side cliffs"],
        ["Forest–Desert Edge", "Green-to-sand boundary", "Long route connector", "Raised terrain facing the desert", "Desert Pyramid"],
        ["Desert Pyramid", "Desert structure", "Late-loop anchor", "Large pyramid visible from the sand", "Pond / Maze Entrance"],
        ["Pond / Maze Entrance", "Near Pyramid route", "Final egg checkpoint", "Pond-side route into the maze", "Return to My Plot"]
      ] },
      paragraphs: [
        "You do not need every landmark for every task. Sell and Track are the best reset points when you are new; Giant Tree and Waterfall Cave are the short egg route; the forest–desert edge, Pyramid, and maze extend that route when a rare target justifies the travel.",
        "The important habit is to leave each landmark knowing the next one. That turns “go toward the desert” into a route you can execute: cave exit, cliffs, biome edge, Pyramid, then maze."
      ]
    }),
    { id: "new-player-route", heading: "Best Landmark Route for New Players", steps: [
      { heading: "Start at Sell.", description: "Use it as the home anchor whenever you lose your bearings." },
      { heading: "Find Track.", description: "Read the current board before buying gear or choosing an egg hunt." },
      { heading: "Ride to Giant Tree.", description: "Learn the first major exploration landmark and the start of the rare-egg circuit." },
      { heading: "Continue to Waterfall Cave.", description: "Memorise both the entrance and the exit-side cliffs." },
      { heading: "Extend once to the Pyramid and maze.", description: "Do one full route slowly, then use the same order when a rare target becomes active." }
    ], paragraphs: ["New players get lost when they use only directions such as left, right, or behind. Landmarks survive camera changes and give other players something to call out. Do one slow learning lap before you need a fast lap."] },
    { id: "rare-egg-landmarks", heading: "Landmarks Used in Rare Egg Hunts", paragraphs: [
      "Rare egg hunts use the same map language as normal exploration, but the priorities change. Giant Tree and Waterfall Cave are fast checks. The outside cliffs and forest–desert edge are the bridge to the desert. The Pyramid and pond-side maze are the final search anchors. A Black Hole or Cherub hunt is easier when you already know this order.",
      "Open the Egg Locations guide when you need the full search checklist, or the Black Hole Egg guide when you already know the target. This locations page stays focused on navigation: what you are looking at, why it matters, and where to go next."
    ], links: [{ label: "Egg Locations route", slug: "ride-a-pet-egg-locations", description: "Use the six-zone search table." }, { label: "Black Hole Egg route", slug: "ride-a-pet-black-hole-egg", description: "Use a target-specific hunt plan." }] },
    { id: "stop-getting-lost", heading: "How to Stop Getting Lost", bullets: [
      "Reset at Sell or Track instead of wandering until a familiar tree appears.",
      "Name the previous landmark before moving: “cave to cliffs” is a usable next step.",
      "Keep the same direction through the full six-zone route; reversing at random creates duplicate checks.",
      "Use the Pyramid as the desert visual anchor and the pond as the maze anchor.",
      "After an egg pickup, take a route you already learned instead of discovering a shortcut while carrying a timer."
    ] }
  ),
  lastReviewed: reviewedAt
}));

const rebirth = enrich("ride-a-pet-rebirth-guide", (page) => ({
  ...page,
  sections: addSections(
    replaceSection(page.sections, "requirements", {
      id: "requirements", heading: "Ride A Pet Rebirth Requirements", intro: "Each rebirth needs the listed pet in your inventory plus the listed cash amount. The seven-tier chain below is cross-checked against the current Pro Game Guides walkthrough and independent September 2026 requirement tables; read the in-game Rebirth panel once before pressing the final button after a future update.",
      table: { caption: "All seven Ride A Pet rebirth requirements", columns: ["Rebirth", "Required pet", "Required cash", "Main unlock / reward", "What to prepare"], rows: [
        ["1", "Horse", "$1M", "2× money multiplier, +1 pet slot, Gold Base", "Keep Horse and stop spending near $1M."],
        ["2", "Fox", "$50M", "Next permanent multiplier and pet slot", "Keep Fox after hatching; rebuild cash after Rebirth 1."],
        ["3", "Unicorn", "$2.5B", "Next permanent multiplier and pet slot", "Hold Unicorn and plan the larger income grind."],
        ["4", "Phoenix", "$125B", "Next permanent multiplier and pet slot", "Do not sell the required Phoenix."],
        ["5", "Kitsune", "$6.2T", "Next permanent multiplier and pet slot", "Save a Kitsune for the panel check."],
        ["6", "Kitsune", "$325T", "Next permanent multiplier and pet slot", "You need another eligible Kitsune for this later tier."],
        ["7", "Dragon", "$50Qa", "Final listed multiplier and pet slot", "Keep Dragon in inventory until the final reset."]
      ] },
      paragraphs: [
        "The chain is easier when you treat the required pet as locked progression inventory, not as a sellable duplicate. Horse leads to Fox, Fox leads to Unicorn, and the later requirements rise through Phoenix, two Kitsunes, and Dragon. Keep the next required pet even if a short-term sale looks tempting.",
        "A completed rebirth increases the money multiplier and adds a ranch pet slot, which is why the cash rebuild becomes easier over time. The requirement values are a direct answer to the search query, not a reason to skip the live panel: the panel is the final confirmation if an update changes a tier."
      ]
    }),
    replaceSection(page.sections, "rebirth-one", {
      id: "rebirth-one", heading: "How to Complete Rebirth 1", steps: [
      { heading: "Keep a Horse in inventory.", description: "The first reset checks for Horse as well as cash, so reaching $1M by itself is not enough." },
      { heading: "Earn and hold $1M cash.", description: "Avoid spending the final amount on another purchase until the Rebirth panel is ready." },
      { heading: "Open Rebirth from the in-game menu.", description: "Read the requirement and reset summary on the panel, then use the Rebirth button when both checks are complete." },
      { heading: "Rebuild with the new multiplier and slot.", description: "Place an income pet, restore your route setup, and begin keeping a Fox for Rebirth 2." },
      { heading: "Do not sell the next requirement.", description: "Fox is the next gating pet, and the next cash target is $50M." }
    ], paragraphs: ["Rebirth 1 is the point where the system becomes concrete. The reviewed panel evidence shows Horse, $1M, a change from 1× to 2× money, one additional pet slot, and Gold Base. The practical win is not just the cosmetic: more permanent income capacity makes the Fox-and-$50M target more manageable."] }),
    replaceSection(page.sections, "rebirth-two", {
      id: "rebirth-two", heading: "Rebirth 2 and Fox", paragraphs: [
        "Rebirth 2 requires a Fox and $50M. Keep the Fox in your inventory while you rebuild after Rebirth 1; it is a requirement, not merely a pet you can replace with any similar rarity. The dedicated Fox guide covers the currently reported free and paid acquisition paths, but the key rebirth decision is simple: do not sell your Fox before the reset.",
        "When the panel shows both checks as complete, rebirth to gain the next permanent multiplier and pet slot. If cash is ready but the button is unavailable, inspect Pets first. If the Fox is present but cash is low, focus your plot on income until the $50M line is complete."
      ], links: [{ label: "How to get Fox", slug: "ride-a-pet-fox", description: "Free Glass Egg searches and the reviewed Dragon Egg shop pool." }] }),
    replaceSection(page.sections, "resets-and-gains", {
      id: "resets-and-gains", heading: "What Resets vs What You Keep", table: { caption: "Rebirth reset decision", columns: ["Item", "After rebirth", "Why it matters"], rows: [
        ["Cash", "Resets", "Spend the final requirement only when you are ready to rebuild."],
        ["Purchased luck", "Resets", "Reviewed guides and the Rebirth panel describe luck as part of the reset summary."],
        ["Required pet", "Must be in inventory to qualify", "Keep the named pet until the panel accepts the rebirth."],
        ["Money multiplier", "Increases permanently", "Each listed rebirth adds a lasting income boost."],
        ["Ranch pet slots", "Increase permanently", "Each rebirth adds a slot for another placed pet."],
        ["Ranch appearance", "New cosmetic reward", "Gold Base is shown for the first rebirth; later cosmetics should be read from the live panel."]
      ] }, paragraphs: ["The important reset decision is timing. Cash and purchased luck are the short-term resources you give up; the money multiplier, extra slot, and ranch progression make the next cycle stronger. Read the current panel for any update-specific retention rule, but do not let that one final check hide the core answer: rebirth trades the current cash run for permanent earning capacity."] }),
    { id: "rebirth-troubleshooting", heading: "Rebirth Troubleshooting", bullets: [
      "Enough cash but no button: confirm the exact required pet is in inventory, not sold or missing from the current account.",
      "Pet ready but not enough cash: leave the pet protected and switch the plot to income until the panel reaches the listed target.",
      "A later tier looks different: use the current in-game panel as the tie-breaker after an update, then update your saved plan.",
      "Rebuild feels slow after reset: place your best income pets first, use the new slot, and avoid buying away the next target cash.",
      "You own one Kitsune only: remember that the documented chain uses Kitsune for both Rebirth 5 and Rebirth 6."
    ] }
  ),
  faq: [
    { question: "What does Rebirth 1 require in Ride A Pet?", answer: "Rebirth 1 requires Horse and $1M cash. Reviewed sources show it raises the money multiplier to 2×, adds a pet slot, and awards Gold Base." },
    { question: "What does Rebirth 2 require?", answer: "Rebirth 2 requires Fox and $50M cash. Keep the Fox in inventory until the Rebirth panel accepts the reset." },
    { question: "What does Ride A Pet rebirth reset?", answer: "Cash and purchased luck reset; the reviewed requirement guides describe permanent money-multiplier and ranch-slot gains in return." },
    { question: "How many Ride A Pet rebirths are listed?", answer: "The current cross-checked requirement chain lists seven: Horse, Fox, Unicorn, Phoenix, Kitsune, Kitsune, then Dragon." }
  ],
  sourceNotes: ["Roblox official game page", "Pro Game Guides Ride a Pet Rebirth walkthrough, reviewed 2026-09-26", "AllThingsHow Rebirth requirement guide, reviewed 2026-09-26"],
  lastReviewed: reviewedAt
}));

const fox = enrich("ride-a-pet-fox", (page) => ({
  ...page,
  primaryKeyword: "ride a pet fox",
  secondaryKeywords: ["fox ride a pet", "how to get fox in ride a pet", "ride a pet fox rebirth", "ride a pet rebirth 2 fox"],
  sections: addSections(
    replaceSection(page.sections, "quick-answer", { id: "quick-answer", heading: "How to Get Fox in Ride A Pet — Quick Answer", paragraphs: [
      "Fox is the required pet for Rebirth 2, which also needs $50M cash. The currently cross-checked acquisition information gives players two useful routes: hunt the reported free Glass Egg route near the stone-tower area, or use the paid Dragon Egg [Instant Hatch] shop offer when its live pool lists Fox.",
      "The reviewed Dragon Egg shop pool lists Fox at 30%, alongside Crocodile, T-Rex, Phoenix, and Dragon. That is a captured offer, not a guarantee or a permanent price promise, so read the live shop card before spending Robux. Free Glass Egg reports are a route to pursue rather than a claim that every map egg will hatch Fox."
    ] }),
    replaceSection(page.sections, "why-it-matters", { id: "why-it-matters", heading: "Fox and Rebirth 2", paragraphs: [
      "Ride A Pet Rebirth 2 requires Fox plus $50M. This is the reason Fox is a progression target rather than just another collection entry: selling it can force you to repeat the hatch grind before the reset. Put it aside in inventory once you get it, then build cash with your strongest income setup.",
      "The requirement is supported by the same current tier chain that lists Horse + $1M for Rebirth 1, Unicorn + $2.5B for Rebirth 3, and later Phoenix, Kitsune, and Dragon requirements. Open the Rebirth panel before the reset after any future update, but do not wait for the panel to begin preparing Fox and $50M."
    ], links: [{ label: "Ride A Pet Rebirth requirements", slug: "ride-a-pet-rebirth-guide", description: "See the complete seven-tier table and reset effects." }] }),
    replaceSection(page.sections, "how-to-get", { id: "how-to-get", heading: "Verified Fox Acquisition Routes", table: { caption: "Ride A Pet Fox acquisition options", columns: ["Route", "What is confirmed", "What to do", "Important limit"], rows: [
      ["Free Glass Egg route", "Independent current guides report Fox from Glass Egg runs near the stone-tower area.", "Run the free egg route, carry the egg back to an open nest, and check the hatch result.", "A reported free source is not a guaranteed hatch rate."],
      ["Dragon Egg [Instant Hatch]", "The reviewed shop pool shows Fox at 30% in one captured offer.", "Open Shop, inspect the live Dragon Egg pool, then decide whether the displayed chance and price are acceptable.", "The offer can change; do not buy from a copied screenshot alone."],
      ["Your existing collection", "A Fox already in Pets satisfies the progression side once the Rebirth panel recognises it.", "Protect it until Rebirth 2 and build the $50M cash requirement.", "Do not sell it for short-term cash."]
    ] }, paragraphs: ["The paid route is fast because it resolves immediately, but more rolls buy more attempts rather than certainty. The free route costs time and travel instead of Robux. Pick the route that fits your goal, then verify the result in Pets before treating the Fox requirement as complete."] }),
    { id: "free-claims", heading: "Free Hatch Claims: What Is Confirmed", paragraphs: [
      "Current independent guides identify Glass Egg runs near the stone-tower area as the reported free Fox route. They do not justify inventing a fixed Fox percentage for every free egg, and a route report does not mean a single Glass Egg is a guaranteed Fox. Use Track, ride a fast pet, carry the egg straight to an empty nest, and read the actual hatch result.",
      "This is still useful information: it gives players a no-Robux starting path and a map objective instead of telling them only to “check the game.” If the live egg list or source changes, trust the current in-game card over an older guide."
    ] },
    { id: "keep-fox", heading: "Keep Fox Before Rebirth", bullets: [
      "After hatching Fox, confirm it appears in Pets and leave it in inventory for the Rebirth 2 check.",
      "Build and hold $50M cash; the Fox alone does not unlock the reset.",
      "Use other income pets on the plot while protecting the Fox requirement.",
      "Read the Rebirth panel before committing, especially after a game update.",
      "After Rebirth 2, begin protecting the next required pet: Unicorn for the $2.5B tier."
    ] }
  ),
  faq: [
    { question: "How do you get Fox in Ride A Pet?", answer: "Current guides report a free Glass Egg route near the stone-tower area, while a reviewed Dragon Egg [Instant Hatch] shop pool lists Fox at 30%. Check the live shop card before spending." },
    { question: "Do you need Fox for Rebirth 2?", answer: "Yes. The cross-checked Rebirth 2 requirement is Fox plus $50M cash." },
    { question: "Does Dragon Egg guarantee Fox?", answer: "No. The reviewed offer is a mixed reward pool; Fox appears at 30% in that captured pool, so each roll remains a chance rather than a guarantee." },
    { question: "Should I sell Fox after getting it?", answer: "No. Keep it in inventory until you complete Rebirth 2, or you may need to hatch another Fox before the reset." }
  ],
  sourceNotes: ["AllThingsHow Fox for Rebirth 2 guide, reviewed 2026-09-26", "AllThingsHow Dragon Egg guide, reviewed 2026-09-26", "Pro Game Guides / AllThingsHow Rebirth guides"],
  lastReviewed: reviewedAt
}));

const mutations = enrich("ride-a-pet-mutations", (page) => ({
  ...page,
  sections: addSections(
    replaceSection(page.sections, "quick-answer", { id: "quick-answer", heading: "Ride A Pet Mutations — Quick Answer", paragraphs: [
      "Ride A Pet has five weather mutations that are consistently listed as Shocked (2×), Volted (3×), Rage (4×), Void (10×), and Eternal (100×). They are not just decorative labels: current guide and Index reporting connects mutations with pet value, cash-per-second earnings, and speed or movement fields.",
      "Weather is one path to a mutation; current guides also describe three hatch mutations—Gold (2×), Diamond (3×), and Rainbow (10×). Read the result on the pet you actually own, because a multiplier changes the base pet it is attached to rather than making every pet equally useful."
    ] }),
    replaceSection(page.sections, "multipliers", { id: "multipliers", heading: "Ride A Pet Mutation List and Multipliers", intro: "The table gives the confirmed multiplier ladder from independent current guides and published Index reporting. Shocked, Volted, and Rage have direct coin and lightning-field support; Void and Eternal are safely listed for their confirmed multiplier while field-scope reporting has varied across sources.", table: { caption: "Ride A Pet mutation multiplier reference", columns: ["Mutation", "Multiplier", "How obtained", "Confirmed effect", "Notes"], rows: [
      ["Shocked", "2×", "Thunder weather", "Cash, speed / movement, and sale-value improvement are consistently reported.", "Published Index reporting shows 2× coin and lightning fields."],
      ["Volted", "3×", "Volt weather", "Cash, speed / movement, and sale-value improvement are consistently reported.", "Published Index reporting shows 3× coin and lightning fields."],
      ["Rage", "4×", "Raging weather", "Cash, speed / movement, and sale-value improvement are consistently reported.", "Published Index reporting shows 4× coin and lightning fields."],
      ["Void", "10×", "Void weather", "10× multiplier is consistently reported; exact field scope differs in current summaries.", "Use the pet card / Index for the live speed and cash readout."],
      ["Eternal", "100×", "Eternal weather", "100× multiplier is consistently reported and is the highest listed weather tier.", "Use the live pet card for the current field breakdown."],
      ["Gold", "2×", "Hatch mutation", "Current mutation guides list it as a hatch result.", "Read the hatch result rather than assuming weather availability."],
      ["Diamond", "3×", "Hatch mutation", "Current mutation guides list it as a hatch result.", "Read the hatch result rather than assuming weather availability."],
      ["Rainbow", "10×", "Hatch mutation", "Current mutation guides list it as a hatch result.", "Read the hatch result rather than assuming weather availability."]
    ] }, paragraphs: ["The five weather names form the practical ladder most players search for: Shocked, Volted, Rage, Void, and Eternal. Eternal is the highest published multiplier. A large multiplier does not erase the value of the base pet, so compare the current cash and movement fields when choosing what to ride and what to leave earning on the plot."] }),
    replaceSection(page.sections, "how-to-get", { id: "how-to-get", heading: "How to Get Mutations", steps: [
      { heading: "Watch for a weather event.", description: "Thunder maps to Shocked, Volt to Volted, Raging to Rage, Void to Void, and Eternal to Eternal in current guide reporting." },
      { heading: "Put the intended pet where it can be affected.", description: "Current guides report placed plot pets and the pet you are riding as eligible, while an inventory pet is not the route to use." },
      { heading: "Inspect the changed label and fields.", description: "Use the pet card and Index to confirm the mutation, its cash result, and its movement result." },
      { heading: "Use hatches as a separate route.", description: "Gold, Diamond, and Rainbow are reported hatch mutations; they should not be treated as weather events." }
    ], paragraphs: ["Weather events are the task-oriented route: prepare the pet you intend to keep, let the event run, then inspect the resulting label. Hatching is a separate source of mutation outcomes. This distinction keeps a player from waiting for a weather event when their actual goal is to hatch another egg."] }),
    replaceSection(page.sections, "stacking", { id: "stacking", heading: "Do Mutations Stack or Replace Each Other?", paragraphs: [
      "Yes. One Hatch Mutation can stack with one Weather Mutation on the same pet. Gold, Diamond, and Rainbow form the hatch layer; Shocked, Volted, Rage, Void, and Eternal form the weather layer. For example, a Rainbow pet can also carry Eternal.",
      "Two Weather Mutations do not stack. A stronger weather trait can replace a weaker one: Shocked can be replaced by Volted, rather than becoming a combined Shocked-plus-Volted bonus. The two categories can coexist, but neither category stacks without limit. Compare the resulting pet card to see the effect on your pet."
    ] }),
    { id: "mutation-decisions", heading: "Choose Mutations by the Job", paragraphs: [
      "For egg runs, compare the mounted pet’s movement field and choose the faster result. For cash, compare the cash-per-second field of a pet placed on the plot. For selling, use the sale-value information shown on the pet you actually intend to part with. The same mutation name can be valuable in different ways depending on the base pet beneath it.",
      "A Fox you are saving for Rebirth 2 is a progression item first. Do not treat a mutation event as a reason to sell it. Likewise, use Rebirth’s permanent income multiplier and extra slots alongside mutations rather than assuming a mutation replaces a full progression plan."
    ], links: [{ label: "Rebirth requirements", slug: "ride-a-pet-rebirth-guide", description: "See permanent multiplier and slot progression." }, { label: "Fox for Rebirth 2", slug: "ride-a-pet-fox", description: "Protect a needed Fox before the reset." }] }
  ),
  faq: [
    { question: "What are the Ride A Pet mutation multipliers?", answer: "The five weather mutations are Shocked 2×, Volted 3×, Rage 4×, Void 10×, and Eternal 100×. Gold 2×, Diamond 3×, and Rainbow 10× are reported hatch mutations." },
    { question: "What is the best mutation in Ride A Pet?", answer: "Eternal is the highest currently listed weather multiplier at 100×. Compare the live pet card before deciding how it affects your specific pet." },
    { question: "Can Ride A Pet mutations stack?", answer: "Yes. One Hatch Mutation can stack with one Weather Mutation on the same pet. Two Weather Mutations do not stack; a stronger weather trait can replace a weaker one." },
    { question: "Can inventory pets mutate?", answer: "Current guides report placed pets and the pet you are riding as the relevant weather-event targets; move a keeper out of inventory before the event." }
  ],
  sourceNotes: ["Pro Game Guides mutations guide, updated 2026-09-19", "AllThingsHow mutation guide, reviewed 2026-09-26", "Published Ride A Pet Index reporting"],
  lastReviewed: reviewedAt
}));

const update2 = enrich("ride-a-pet-update-2", (page) => ({
  ...page,
  title: "Ride A Pet Update 2: WHO'S THAT PET? Event Guide",
  description: "WHO'S THAT PET? is live in Ride A Pet. See the official Sep 26–Oct 3 event window, advertised x2 Cash Boost, and what to check in game.",
  hero: { ...page.hero, lead: "WHO'S THAT PET? is live on the official Ride A Pet event page. Roblox lists the event from September 26 at 21:00 to October 3 at 21:00 China Standard Time and advertises ‘x2 Cash Boost + More.’ The event page is active; the boost's exact in-game scope and any new pet or egg still need a published mechanic or a live in-game check." },
  sections: [
    { id: "status", heading: "Ride A Pet Update 2 — Live Event Status", intro: "The official Roblox experience page displayed a WHO'S THAT PET? card with a Join Event action after the advertised start. The linked official event page identified the event as new content and displayed its full date range. This was checked on September 26, 2026 at 21:05 China Standard Time.", table: { caption: "Official WHO'S THAT PET? event status", columns: ["Event", "Status", "Start", "End", "Official description", "Last checked"], rows: [
      ["WHO'S THAT PET?", "Live: Join Event shown on Roblox", "Sep 26, 2026, 21:00 CST", "Oct 3, 2026, 21:00 CST", "x2 Cash Boost + More", "Sep 26, 2026, 21:05 CST"]
    ] }, paragraphs: ["The event's title and week-long window are displayed by Roblox itself. The public description names a double-cash promotion but does not state which income sources it affects or how long the boost remains active within the event window. Treat the event window and the boost duration as different questions."] },
    { id: "official", heading: "What the Official Roblox Pages Confirm", paragraphs: [
      "Roblox now shows WHO'S THAT PET? on the Ride A Pet experience page with Join Event, and the event details page displays the September 26 to October 3 window. Its only public description is ‘x2 Cash Boost + More.’ That is enough to confirm the event is open and that a double-cash promotion is advertised; it is not a full changelog.",
      "The experience page itself still describes the core loop as finding eggs, hatching rarer and faster pets, and mutating pets to go faster. The public event description does not name a new pet, egg, mutation, rebirth tier, or event reward. Those details should be read from the live event panel or an official update note before they are treated as confirmed changes."
    ] },
    { id: "live", heading: "What Is Live in Ride A Pet Update 2", table: { caption: "Confirmed live Update 2 information", columns: ["Item", "What is confirmed", "Player action"], rows: [
      ["WHO'S THAT PET?", "Official event card is active and offers Join Event.", "Open the event from the Ride A Pet experience page."],
      ["Event window", "Sep 26, 21:00 to Oct 3, 21:00 CST appears on the official event page.", "Use this as the published event window, not a promise that every perk lasts the full week."],
      ["x2 Cash Boost", "The official description advertises x2 Cash Boost + More.", "Read the in-game boost display for eligible earnings and its actual timer."],
      ["New content", "The official event page labels this event new content but gives no itemised patch notes.", "Check the live activity prompt and Index for named additions."]
    ] }, paragraphs: ["The useful immediate action is to join the event and read its in-game objective. If you are saving for Rebirth 2, compare your current cash-per-second display before and after any visible boost, then decide whether the event helps you reach Fox plus $50M. An advertised x2 line alone does not establish which income source doubled in your server."] },
    { id: "cash-boost", heading: "How to Use the Advertised x2 Cash Boost", paragraphs: [
      "If your session displays the x2 boost, check the timer and the cash source it modifies before changing your play plan. Players working on the Horse-and-$1M first rebirth or the Fox-and-$50M second rebirth have a clear reason to look at their current income rate. Keep the pet requirement protected while earning the cash; a boost does not replace the named pet.",
      "The official event description does not say whether the promotion applies to ranch earnings, selling, pickups, purchases, or every cash source. It also does not say that the boost runs for the entire event window. Use the amount shown in your own game session to decide whether to collect cash, stay on your ranch, or continue an egg route."
    ], links: [{ label: "Rebirth requirements", slug: "ride-a-pet-rebirth-guide", description: "See the pet and cash target for each tier." }, { label: "Fox for Rebirth 2", slug: "ride-a-pet-fox", description: "Keep the required pet while building $50M." }] },
    { id: "event-plan", heading: "A Practical First Session in the Event", steps: [
      { heading: "Open the official event card.", description: "Use Join Event from the Ride A Pet Roblox page and enter the current experience." },
      { heading: "Read the objective and active modifiers.", description: "Look for the WHO'S THAT PET? prompt, reward text, and any x2 cash timer before spending resources." },
      { heading: "Check Track and Index.", description: "If the update adds a named egg, pet, or mutation, its current label belongs in your route and collection plan." },
      { heading: "Choose one goal.", description: "For an egg hunt, prepare a fast mount and empty nest; for cash, keep the next rebirth pet and watch the displayed income." },
      { heading: "Recheck before the event ends.", description: "The official window ends October 3 at 21:00 CST, while individual boosts may have their own timers." }
    ], links: [{ label: "Egg Locations", slug: "ride-a-pet-egg-locations", description: "Use the six-zone search route if the event sends you across the map." }, { label: "Mutations", slug: "ride-a-pet-mutations", description: "Compare hatch and weather mutation effects on a new pet." }] },
    { id: "progression", heading: "What Update 2 Changes for Progression", paragraphs: [
      "The official event listing gives one concrete progression hook: an advertised x2 Cash Boost. Cash matters to every rebirth tier, from Horse plus $1M through Dragon plus $50Qa. The value of the promotion depends on the live boost's scope and timer, so compare your own cash display rather than assuming a permanent account-wide multiplier.",
      "No new rebirth requirement has been published in the event description. The seven-tier requirement guide therefore remains the practical reference while the event is running. If the in-game Rebirth panel changes a pet or cash target during Update 2, use that panel as the current rule and update your plan before spending or selling a pet."
    ] },
    { id: "faq", heading: "Frequently Asked Questions", paragraphs: ["The official event card confirms the schedule and promotional description. The current game interface supplies any more detailed objective or reward conditions."] }
  ],
  faq: [
    { question: "Is WHO'S THAT PET? live in Ride A Pet?", answer: "Yes. The official Roblox experience page displayed Join Event for WHO'S THAT PET? after 21:00 CST on September 26, 2026." },
    { question: "When does the official Update 2 event end?", answer: "The official event page lists October 3, 2026 at 21:00 China Standard Time as the end of the event window." },
    { question: "Is x2 Cash Boost confirmed?", answer: "The official event description advertises ‘x2 Cash Boost + More.’ Its exact in-game scope and timer are not specified on the public event page." },
    { question: "What new pet or egg is in WHO'S THAT PET??", answer: "The official public event description does not name a new pet or egg. Read the live activity prompt and Index for the current named content." }
  ],
  sourceNotes: ["Official Roblox Ride A Pet experience and WHO'S THAT PET? event pages, checked 2026-09-26 21:05 CST"],
  lastReviewed: reviewedAt
}));

export const finalLaunchCorePages: SeoPageDefinition[] = basePages.map((page) => ({
  "ride-a-pet-egg-locations": eggLocations,
  "ride-a-pet-black-hole-egg": blackHoleEgg,
  "ride-a-pet-locations": locations,
  "ride-a-pet-rebirth-guide": rebirth,
  "ride-a-pet-fox": fox,
  "ride-a-pet-mutations": mutations,
  "ride-a-pet-update-2": update2,
}[page.slug] ?? page));

export const finalLaunchHome: HomePageDefinition = {
  ...baseHome,
  sections: addSections(baseHome.sections, {
    id: "progression-at-a-glance",
    heading: "Ride A Pet Progression at a Glance",
    intro: "Use this table to move from a broad question to the page that gives you the next concrete action. The goal is to spend less time scanning a generic guide and more time following the route, requirement, or status check that matches your session.",
    table: { caption: "Choose a Ride A Pet guide by goal", columns: ["Goal", "Best guide", "What to check first"], rows: [
      ["Find rare eggs", "Egg Locations", "Track or the current target, then the six-zone route."],
      ["Find Black Hole Egg", "Black Hole Egg", "Confirm the live target, then start at Giant Tree."],
      ["Learn the map", "Locations", "Sell, Track, Giant Tree, Waterfall Cave, and the Pyramid."],
      ["Prepare Rebirth 1", "Rebirth Guide", "Horse and $1M cash."],
      ["Prepare Rebirth 2", "Fox Guide", "Keep Fox and build $50M cash."],
      ["Improve a pet", "Mutations", "The pet’s current mutation, cash field, and movement field."],
      ["Check today’s event", "Update 2", "The official Roblox event card and live in-game panel."]
    ] },
    paragraphs: [
      "Ride A Pet progression is easiest when you protect the item that blocks the next tier. A Horse is useful because it unlocks the first rebirth; a Fox is worth protecting because Rebirth 2 needs Fox and $50M. Mutations improve the pets you already have, while map knowledge shortens every future egg run.",
      "The guides are deliberately connected rather than interchangeable. Start with Locations if you cannot name the landmarks. Move to Egg Locations when you can run the route. Open Black Hole Egg only when that is your target. Use Rebirth, Fox, and Mutations for permanent progression decisions instead of trying to solve every question from one page."
    ]
  }, {
    id: "smart-session-plan",
    heading: "Build a Better Ride A Pet Session",
    paragraphs: [
      "A good session has one main objective. For an egg hunt, check Track, take a fast mount, clear the named zones in order, and keep an empty nest ready for the return. For a rebirth, protect the required pet first, then save the matching cash target. For a mutation event, place the pet you actually want to improve and compare its final card rather than keeping a label you will never use.",
      "The early map route and the long-term rebirth route support each other. Faster pets make the Giant Tree-to-maze loop less stressful; higher income makes the next pet and cash requirement easier to hold. Once you know why each guide exists, you can decide whether the next productive action is a run, a hatch, an event check, or a reset."
    ],
    links: [{ label: "Start with Ride A Pet egg locations", slug: "ride-a-pet-egg-locations", description: "Learn the full six-zone loop." }, { label: "Plan your next rebirth", slug: "ride-a-pet-rebirth-guide", description: "See every required pet and cash amount." }, { label: "Read the mutations list", slug: "ride-a-pet-mutations", description: "Compare weather and hatch outcomes." }]
  }),
  faq: [
    ...baseHome.faq.filter((item) => item.question !== "Does this guide list Ride A Pet codes?"),
    { question: "What do I need for Ride A Pet Rebirth 1?", answer: "Rebirth 1 requires Horse and $1M cash. The reviewed panel evidence shows a 2× money multiplier, an extra pet slot, and Gold Base after the reset." },
    { question: "What do I need for Ride A Pet Rebirth 2?", answer: "Rebirth 2 requires Fox and $50M cash, so keep Fox in inventory instead of selling it after a hatch." },
    { question: "What are the main Ride A Pet mutations?", answer: "The weather mutation ladder is Shocked 2×, Volted 3×, Rage 4×, Void 10×, and Eternal 100×. Use the mutations guide for the live field details." },
    { question: "What is WHO'S THAT PET?", answer: "WHO'S THAT PET? is the official Ride A Pet event title shown on the Roblox experience page. Use the Update 2 guide and live event panel for its current status." }
  ],
  lastReviewed: reviewedAt
};
