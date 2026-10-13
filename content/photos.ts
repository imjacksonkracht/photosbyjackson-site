// Editorial data for each published photograph, keyed by its public name.
// Pixel data (size, blur, exposure, file path) is generated into
// photos.generated.json by scripts/process-photos.mjs.
//
// `focus` is a CSS object-position used only when a layout crops the image
// for presentation; it keeps the subject in frame. Files are never cropped.
// Alt text describes what is visible. It never names private individuals.

import generated from "./photos.generated.json";

type Generated = {
  id: string;
  path: string;
  group: string;
  width: number;
  height: number;
  color: string;
  blur: string;
  exposure: string | null;
  lens: string | null;
  sourceHash: string;
};

type Editorial = { alt: string; focus?: string };

const editorial: Record<string, Editorial> = {
  // HCGG × Petty Theft
  "petty-theft-guitarist-silhouette-01": {
    alt: "A guitarist in full silhouette against a bright orange and blue stage screen, microphone stand in the foreground.",
    focus: "58% 45%",
  },
  "petty-theft-lead-vocalist-01": {
    alt: "Petty Theft's vocalist in a Florida Gators jersey shouting into the microphone in front of a psychedelic video wall.",
    focus: "55% 35%",
  },
  "petty-theft-lead-vocalist-02": {
    alt: "The vocalist grinning mid-song under dark stage light, gripping the microphone stand.",
    focus: "50% 30%",
  },
  "petty-theft-lead-vocalist-03": {
    alt: "Low-angle view of the vocalist singing under red stage lights with the Petty Theft logo on the screen behind.",
    focus: "48% 40%",
  },
  "petty-theft-lead-vocalist-04": {
    alt: "Profile of the vocalist singing with eyes shut, lit in blue against a black background.",
    focus: "55% 35%",
  },
  "petty-theft-lead-vocalist-05": {
    alt: "The vocalist mid-lyric under deep blue light, turned toward the crowd.",
    focus: "48% 35%",
  },
  "petty-theft-lead-vocalist-06": {
    alt: "Black and white profile of the vocalist singing into the microphone in a Gators jersey.",
    focus: "50% 35%",
  },
  "petty-theft-bassist-01": {
    alt: "The bassist looks across the stage under warm spotlights, the band's name glowing on the screen behind.",
    focus: "45% 40%",
  },
  "petty-theft-keyboardist-01": {
    alt: "The keyboardist at a Roland keyboard, looking off stage, with the orange and blue screen behind.",
    focus: "55% 40%",
  },
  "petty-theft-singer-01": {
    alt: "Black and white close-up of a singer straining into the microphone.",
    focus: "55% 40%",
  },

  // Swamp Fest
  "swamp-fest-co2-cannons-01": {
    alt: "CO2 cannons fire white plumes across the Swamp Fest stage as the crowd raises their hands at night.",
    focus: "72% 45%",
  },
  "swamp-fest-crowd-01": {
    alt: "A packed festival crowd lit red, hands and phones raised, under tall stadium lights.",
    focus: "50% 60%",
  },
  "swamp-fest-crowd-02": {
    alt: "Close view into the crowd bathed in red light, arms up.",
  },
  "swamp-fest-crowd-03": {
    alt: "Three people in silhouette against a fence, the stage glowing red behind them.",
    focus: "45% 55%",
  },
  "swamp-fest-dj-set-01": {
    alt: "A DJ in red light points over the decks while a wall of fire plays on the screen below.",
    focus: "60% 35%",
  },
  "swamp-fest-dj-set-02": {
    alt: "Two DJs on a distant purple-lit stage, one with both arms raised.",
    focus: "50% 70%",
  },
  "swamp-fest-stage-performance-01": {
    alt: "Black and white, a performer in a cap stands on the stage edge in front of a bright screen.",
    focus: "50% 40%",
  },
  "swamp-fest-stage-performance-02": {
    alt: "Black and white, a performer at the stage edge beside a brick pillar points toward the crowd.",
  },
  "swamp-fest-stage-performance-03": {
    alt: "Black and white, a performer at the stage edge above a crowd holding up their phones.",
    focus: "50% 30%",
  },
  "swamp-fest-main-stage-01": {
    alt: "The main stage under white beams and haze, DJs at the decks and the crowd in the foreground.",
  },
  "swamp-fest-main-stage-02": {
    alt: "Wide view of the stage under strings of orange lights, the crowd silhouetted in front.",
  },
  "swamp-fest-festivalgoers-01": {
    alt: "Two friends with festival wristbands pose arm in arm on the field at golden hour.",
    focus: "50% 40%",
  },

  // Live From the Lawn
  "live-from-the-lawn-trombonist-01": {
    alt: "A trombonist in sunglasses and a floral shirt playing against a clear blue sky.",
    focus: "60% 50%",
  },
  "live-from-the-lawn-acoustic-guitarist-01": {
    alt: "A long-haired guitarist playing an acoustic sunburst guitar at the microphone at golden hour.",
    focus: "40% 30%",
  },
  "live-from-the-lawn-acoustic-guitarist-02": {
    alt: "Black and white, low-angle shot of a guitarist singing at the microphone with an acoustic guitar.",
    focus: "45% 30%",
  },
  "live-from-the-lawn-guitarist-01": {
    alt: "A singer in a black suit and sunglasses playing a white electric guitar at the microphone.",
    focus: "45% 30%",
  },
  "live-from-the-lawn-guitarist-02": {
    alt: "Black and white, a guitarist leans into the guitar beside the drum kit on a dark stage.",
    focus: "50% 40%",
  },
  "live-from-the-lawn-guitarist-03": {
    alt: "A curly-haired guitarist in a plaid shirt looking down at the guitar under an afternoon sky.",
    focus: "30% 35%",
  },
  "live-from-the-lawn-bassist-01": {
    alt: "A bassist in a cap and red shirt, shot from below and tilted against a pale sky.",
    focus: "45% 35%",
  },
  "live-from-the-lawn-bassist-02": {
    alt: "Black and white portrait of a bassist in sunglasses with a sticker-covered bass.",
    focus: "45% 25%",
  },
  "live-from-the-lawn-guitar-detail-01": {
    alt: "Close crop of hands on a cream electric guitar in warm late-afternoon light.",
  },
  "live-from-the-lawn-guitar-detail-02": {
    alt: "Detail of a hand strumming a white Telecaster.",
  },
  "live-from-the-lawn-table-setup-01": {
    alt: "A table set for Live From the Lawn: a green retro radio, a blue and orange vinyl record, a globe, and a flip calendar showing September 23.",
  },

  // It's All a Blur Tour
  "its-all-a-blur-tour-arena-stage-01": {
    alt: "Black and white, a performer stands in stage smoke under arena lights, phone lights scattered like stars in the dark.",
    focus: "50% 40%",
  },
  "its-all-a-blur-tour-arena-stage-02": {
    alt: "Black and white, two performers embrace in a single spotlight on an arena stage.",
    focus: "50% 70%",
  },

  // Gator Jam
  "gator-jam-band-01": {
    alt: "Black and white, a singer and a guitarist perform side by side under the stage truss and lights.",
    focus: "50% 50%",
  },
  "gator-jam-keyboardist-01": {
    alt: "A keyboardist in a graphic tee looks down at the keys beneath a curved lighting truss.",
    focus: "50% 35%",
  },
  "gator-jam-guitarist-01": {
    alt: "A guitarist plays a red electric guitar under blue and gold stage light.",
    focus: "45% 45%",
  },
  "gator-jam-stage-01": {
    alt: "A guitarist in a cap plays facing away from the camera, the band and crowd lit red beyond the truss.",
    focus: "55% 55%",
  },

  // Gator Grill Club
  "gator-grill-club-cookout-01": {
    alt: "A student in a 'Grill Master' Gator Grill Club shirt serves food as the line moves along the table.",
    focus: "60% 40%",
  },
  "gator-grill-club-cookout-02": {
    alt: "Wide view of the cookout: an orange tent, smokers, and a crowd of students on the grass.",
  },
  "gator-grill-club-cookout-03": {
    alt: "Students crowd around the serving tables beside the orange tent as smoke drifts from the grills.",
  },
  "gator-grill-club-cookout-04": {
    alt: "A long line of students waits on the lawn for food.",
  },
  "gator-grill-club-cookout-05": {
    alt: "Club members cook and plate food under the orange tent.",
  },
  "gator-grill-club-live-grilling-sign-01": {
    alt: "A Gator Grill Club 'Live Grilling' sign on a fence in front of the tent and crowd.",
  },
  "gator-grill-club-grill-01": {
    alt: "Ears of corn charring on a ceramic grill next to an energy drink on the side shelf.",
  },
  "gator-grill-club-grill-02": {
    alt: "Pineapple rings and meat cooking on an open green ceramic grill.",
    focus: "50% 60%",
  },
  "gator-grill-club-food-01": {
    alt: "Gloved hands slice grilled steak on a cutting board beside a tray of sausages.",
  },
  "gator-grill-club-food-02": {
    alt: "Overhead view of rows of hot dogs on blue-and-white paper plates.",
  },
  "gator-grill-club-food-03": {
    alt: "A plate with a hot dog and grilled corn is handed across the serving table.",
  },

  // Gator Gallop
  "gator-gallop-runner-01": {
    alt: "A runner painted half blue and half orange points ahead while sprinting down the road.",
    focus: "55% 35%",
  },
  "gator-gallop-start-line-01": {
    alt: "Runners pack the start line beneath the inflatable Gator Gallop arch under oak trees.",
  },
  "gator-gallop-check-in-01": {
    alt: "Two runners in green gator costumes do the Gator Chomp under the Gator Gallop check-in banner.",
    focus: "50% 45%",
  },
  "gator-gallop-runner-02": {
    alt: "A smiling runner reaches out for a fist bump from a volunteer along the course.",
    focus: "70% 40%",
  },
  "gator-gallop-runners-01": {
    alt: "Four friends in orange and blue cheer with arms raised as they run together.",
    focus: "50% 40%",
  },
  "gator-gallop-runners-02": {
    alt: "Two runners laugh together mid-race, one holding a phone.",
    focus: "50% 40%",
  },
  "gator-gallop-runners-03": {
    alt: "Two runners cheer toward the camera, one pushing a stroller.",
    focus: "50% 40%",
  },
  "gator-gallop-runners-04": {
    alt: "A group of runners cheers and waves as they head down the course.",
    focus: "50% 35%",
  },
  "gator-gallop-high-five-01": {
    alt: "A runner high-fives a spectator in a banana costume along the course.",
    focus: "55% 45%",
  },
  "gator-gallop-finishers-01": {
    alt: "Two finishers in blue and orange body paint pose with their medals in front of balloons.",
    focus: "50% 40%",
  },
  "gator-gallop-dog-01": {
    alt: "A woman kneels on the grass to greet a gray dog wearing an orange and blue bandana.",
    focus: "45% 55%",
  },

  // Homecoming Parade
  "homecoming-parade-cheerleaders-01": {
    alt: "Three Florida cheerleaders shout and wave from atop a parade float.",
  },
  "homecoming-parade-mascots-01": {
    alt: "Albert and Alberta, the Florida Gators mascots, waving from a parade vehicle.",
  },
  "homecoming-parade-float-01": {
    alt: "A woman with a sash laughs and waves from a float beside an American flag.",
    focus: "52% 40%",
  },
  "homecoming-parade-float-02": {
    alt: "A woman in a blue halter top waves to the crowd from the parade.",
    focus: "45% 35%",
  },
  "homecoming-parade-float-03": {
    alt: "Two men in blue polos point at the camera from an open car roof.",
  },
  "homecoming-parade-float-04": {
    alt: "Students on a pickup truck hold up a 'Learn to Grill' sign and a spatula beside a smoker.",
  },
  "homecoming-parade-marching-band-01": {
    alt: "A marching band flutist in a cap plays as the band moves down the street.",
    focus: "50% 40%",
  },
  "homecoming-parade-spectators-01": {
    alt: "Two students carry a Gator Growl 2026 poster past spectators on the curb.",
    focus: "55% 45%",
  },
  "homecoming-parade-police-escort-01": {
    alt: "A police motorcycle officer leads the parade as crowds line the street.",
  },

  // Campus organizations
  "campus-organization-group-portrait-01": {
    alt: "A student organization in navy blazers poses in front of Ben Hill Griffin Stadium.",
  },
  "campus-organization-group-portrait-02": {
    alt: "The organization holds one member horizontally across the group in front of Ben Hill Griffin Stadium.",
    focus: "50% 55%",
  },
  "campus-organization-gator-chomp-01": {
    alt: "Three students do the Gator Chomp outside the J. Wayne Reitz Union.",
    focus: "50% 50%",
  },

  // Florida Cicerones — General Body Headshots
  "cicerones-general-body-headshot-01": {
    alt: "Headshot of a young woman in a black blazer under a vaulted stone archway.",
    focus: "50% 35%",
  },
  "cicerones-general-body-headshot-02": {
    alt: "Headshot of a young man in a navy blazer and gold tie under a stone archway.",
    focus: "50% 30%",
  },
  "cicerones-general-body-headshot-03": {
    alt: "Wider headshot of a young man in a navy blazer and gold tie in a stone corridor.",
  },
  "cicerones-general-body-headshot-04": {
    alt: "Headshot of a young woman in a black blazer framed by a pointed stone arch.",
  },
  "cicerones-general-body-headshot-05": {
    alt: "Headshot of a young man in a navy suit and red tie beneath a hanging lantern.",
    focus: "50% 30%",
  },
  "cicerones-general-body-headshot-06": {
    alt: "Headshot of a young woman with glasses in a black blazer under a stone archway.",
    focus: "50% 30%",
  },
  "cicerones-general-body-headshot-07": {
    alt: "Headshot of a young woman in a navy blazer smiling under a stone archway.",
    focus: "50% 30%",
  },
  "cicerones-general-body-headshot-08": {
    alt: "Headshot of a young woman in a black blazer and maroon top under a lantern.",
    focus: "50% 35%",
  },
  "cicerones-general-body-headshot-09": {
    alt: "Headshot of a young man in a navy suit and orange-and-blue striped tie.",
    focus: "50% 30%",
  },
  "cicerones-general-body-headshot-10": {
    alt: "Wide headshot of a young woman in a dark top laughing in a stone corridor.",
  },
  "cicerones-general-body-headshot-11": {
    alt: "Wide headshot of a young woman with glasses in a navy blazer in a stone corridor.",
  },
  "cicerones-general-body-candid-01": {
    alt: "Candid moment: one member pins a badge to another's blazer before a headshot.",
    focus: "55% 40%",
  },
  "cicerones-general-body-duo-portrait-01": {
    alt: "Two members in navy blazers hold a plush gator under a stone archway.",
  },
  "cicerones-general-body-mascot-01": {
    alt: "A plush gator in an orange jersey, holding a gift bag, is handed toward the camera.",
    focus: "50% 45%",
  },

  // Florida Cicerones — Recruitment Portraits
  "florida-cicerones-recruitment-group-portrait-01": {
    alt: "Three Florida Cicerones members in matching 'Chase Your Horizons' shirts under a stone archway.",
  },
  "florida-cicerones-recruitment-group-portrait-02": {
    alt: "Three Cicerones members hold hands and walk toward the camera in a brick courtyard.",
    focus: "50% 50%",
  },
  "florida-cicerones-recruitment-group-portrait-03": {
    alt: "Three Cicerones members stand together under a lantern in a stone corridor.",
    focus: "50% 45%",
  },
  "florida-cicerones-recruitment-group-portrait-04": {
    alt: "Three Florida Cicerones members smile in a vaulted stone corridor.",
  },
  "florida-cicerones-recruitment-group-portrait-05": {
    alt: "Three Cicerones members lean in and laugh under a stone archway.",
  },

  // About
  "jackson-behind-the-scenes": {
    alt: "Jackson Kracht raises a camera beside a friend on the floor in front of the Homecoming and Gator Growl stage.",
    focus: "45% 80%",
  },
};

export type Photo = Generated & Editorial & {
  aspect: number;
  orientation: "landscape" | "portrait" | "square";
};

const data = generated as Record<string, Generated>;

export function hasPhoto(id: string) {
  return id in data && id in editorial;
}

export function photo(id: string): Photo {
  const g = data[id];
  const e = editorial[id];
  if (!g) throw new Error(`Photo "${id}" is missing from photos.generated.json. Run npm run photos.`);
  if (!e) throw new Error(`Photo "${id}" has no alt text in content/photos.ts.`);
  const aspect = g.width / g.height;
  return {
    ...g,
    ...e,
    aspect,
    orientation: aspect > 1.05 ? "landscape" : aspect < 0.95 ? "portrait" : "square",
  };
}

export const WIDTHS = [640, 1280, 2048] as const;

export function srcSet(p: Photo) {
  return WIDTHS.map((w) => `${p.path}-${w}.avif ${Math.min(w, p.width)}w`).join(", ");
}

/** WebP fallback (1600px wide) for browsers without AVIF. */
export function fallbackSrc(p: Photo) {
  return `${p.path}.webp`;
}

/** 1200×630 JPEG share image for a project. */
export function shareImage(slug: string) {
  return `/og/${slug}.jpg`;
}

/** Ids with alt text, for validation. */
export const editorialIds = Object.keys(editorial);
