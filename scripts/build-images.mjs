/**
 * Derives the site's photography from the client's camera originals.
 *
 * The originals are 6000px JPEGs straight off the camera and are deliberately
 * NOT in git — they are ~6MB each and nothing serves them. This script is the
 * record of how `public/images` was produced from them, so the set can be
 * rebuilt at a different size without guessing which file was which.
 *
 *   node scripts/build-images.mjs            # rebuild every derived photo
 *   node scripts/build-images.mjs --check    # report only, write nothing
 *
 * If the originals folder is absent the script says so and exits 0: a clone
 * without it still builds, because the derived files are committed.
 *
 * Long edge is 3840px to match the largest entry in Next's default
 * `deviceSizes`. Nothing above that is ever requested by the optimizer, so a
 * larger master would cost repository size and serve no pixel.
 */
import sharp from "sharp";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";

const ORIGINALS = "New Picture";
const OUT = "public/images";
const LONG_EDGE = 3840;
const QUALITY = 86;

/**
 * Photographs used as a full-bleed band behind text, where `sizes` is 100vw.
 *
 * These are portrait frames, so capping the LONG edge at 3840 would leave them
 * only 2560px wide — short of the 2880 a 1440px viewport needs at 2x. Width is
 * the axis the optimizer resizes on, so for these it is the one that has to
 * reach 4K.
 */
const FULL_BLEED = new Set([
  "entrance/entrance_backlit-sign-dusk.jpg",
  "no-cavity-club/no-cavity-club_mascot-mural-and-rainbow.jpg",
]);

/**
 * original -> published path.
 *
 * Established by comparing 16x16 normalised greyscale fingerprints of the
 * previous 2000px set against every original: each pairing below scored under
 * 6, and the runner-up in every case scored above 20. Aspect ratios match
 * exactly, so these are straight downscales — no crop is being re-applied.
 */
const MAP = {
  "IMG_4222.JPG.jpeg": "play-gym/play-gym_climbing-wall-and-cargo-net.jpg",
  "IMG_4223.JPG.jpeg": "doctor/doctor_portrait-consultation-room.jpg",
  "IMG_4224.JPG.jpeg": "doctor/doctor_at-desk.jpg",
  "IMG_4225.JPG.jpeg": "no-cavity-club/no-cavity-club_mural-and-reception.jpg",
  "IMG_4226.JPG.jpeg": "no-cavity-club/no-cavity-club_mascot-mural-and-rainbow.jpg",
  "IMG_4227.JPG.jpeg": "rooms/space-room_mural-rocket-and-ufo.jpg",
  "IMG_4228.JPG.jpeg": "rooms/jungle-room_mural-wall-detail.jpg",
  "IMG_4229.JPG.jpeg": "rooms/jungle-room_wide-with-ceiling-mural.jpg",
  "IMG_4230.JPG.jpeg": "rooms/space-room_chair-tv-and-ceiling-mural.jpg",
  "IMG_4231.JPG.jpeg": "rooms/space-room_wide-from-doorway.jpg",
  "IMG_4232.JPG.jpeg": "play-gym/play-gym_tree-shelf-books-detail.jpg",
  "IMG_4233.JPG.jpeg": "play-gym/play-gym_wide-establishing.jpg",
  "IMG_4234.JPG.jpeg": "play-gym/play-gym_tree-shelf-and-cloud-wall.jpg",
  "IMG_4235.JPG.jpeg": "reception/reception_height-chart-and-bunny-desk.jpg",
  "IMG_4236.JPG.jpeg": "entrance/entrance_backlit-sign-dusk.jpg",
  "IMG_4237.JPG.jpeg": "reception/reception_logo-wall-and-desk.jpg",
  "IMG_4238.JPG.jpeg": "rooms/jungle-room_wide-with-glass-partition.jpg",
};

/**
 * Supplied as small screenshots, not camera files. No original exists, so
 * these cannot be rebuilt here and must be re-supplied by the client to reach
 * the resolution the rest of the set now has. Listed so the gap stays visible.
 */
const NO_ORIGINAL = [
  "rooms/jungle-room_ceiling-mural-lit.jpg",
  "rooms/space-room_ceiling-mural-lit.jpg",
  "consultation/consultation-room_desk-and-arched-doorway.jpg",
];

const check = process.argv.includes("--check");

if (!existsSync(ORIGINALS)) {
  console.log(`No "${ORIGINALS}" folder — keeping the committed images as they are.`);
  process.exit(0);
}

const kb = (p) => Math.round(statSync(p).size / 1024);
let totalBefore = 0;
let totalAfter = 0;

for (const [src, dest] of Object.entries(MAP)) {
  const from = join(ORIGINALS, src);
  const to = join(OUT, dest);
  if (!existsSync(from)) {
    console.log(`  missing original, skipped: ${src}`);
    continue;
  }
  const before = existsSync(to) ? kb(to) : 0;
  totalBefore += before;

  if (check) {
    const m = await sharp(to).metadata();
    console.log(`  ${dest} — ${m.width}x${m.height}, ${before}KB`);
    continue;
  }

  mkdirSync(dirname(to), { recursive: true });
  const box = FULL_BLEED.has(dest)
    ? { width: LONG_EDGE, height: null }
    : { width: LONG_EDGE, height: LONG_EDGE };

  await sharp(from)
    .rotate() // honour EXIF orientation before we discard the metadata
    .resize(box.width, box.height, { fit: "inside", withoutEnlargement: true })
    // 4:4:4 keeps the colour detail in the painted murals: thin saturated
    // lines on a pale ground are exactly what 4:2:0 smears.
    .jpeg({ quality: QUALITY, chromaSubsampling: "4:4:4", mozjpeg: true })
    .toFile(to + ".tmp");

  const { renameSync } = await import("node:fs");
  renameSync(to + ".tmp", to);
  const m = await sharp(to).metadata();
  totalAfter += kb(to);
  console.log(`  ${dest} — ${m.width}x${m.height}, ${before}KB -> ${kb(to)}KB`);
}

if (!check) {
  console.log(`\n${Object.keys(MAP).length} photos rebuilt. ${totalBefore}KB -> ${totalAfter}KB.`);
}
console.log(`\nNo original on file (client must re-supply to match):`);
for (const f of NO_ORIGINAL) {
  const p = join(OUT, f);
  if (existsSync(p)) {
    const m = await sharp(p).metadata();
    console.log(`  ${f} — ${m.width}x${m.height}`);
  }
}
