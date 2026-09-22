# Image slots — shot list

All interior photography is the client's own, taken in the finished hospital.
It is **real photography, not stock**, and must never be replaced with stock
imagery. No child appears in any frame — see the hard rule at the bottom.

A second batch of seventeen photographs (September 2026) replaced the original
seven and filled the most important gaps: the Space room, which previously had
no photograph at all, the doctor, and the consultation room.

## How these files are produced

Everything in here except the three noted below is derived from the camera
originals by `npm run images:build` (`scripts/build-images.mjs`), which holds
the original-to-published mapping. The originals are 6000px JPEGs of about
6MB each in `New Picture/`, deliberately **not** in git: nothing serves them
and they would dominate the repository.

Masters are 3840px on the long edge, matching the largest entry in Next's
default `deviceSizes` — the optimizer never requests more than that, so a
larger master would cost repository size and serve no pixel. The two
photographs used as full-bleed bands behind text are 3840px **wide** instead,
because width is the axis the optimizer resizes on and capping their long edge
would have left these portrait frames only 2560px wide.

They were 2000px until September 2026. At that size the Our Space gallery's
wide tiles, and the two full-bleed openers, were being asked for more pixels
than the files held. `npm run images` is the check that catches this.

## In use

| File | Shows | Used on |
|---|---|---|
| `rooms/space-room_chair-tv-and-ceiling-mural.jpg` | Navy chair, ceiling TV, backlit ceiling mural, "Space for Healthy Smiles!" mural | Home, Our Space, social story |
| `rooms/space-room_wide-from-doorway.jpg` | Space room from the door — chair, tray, UFO and planet mural | Our Space gallery |
| `rooms/space-room_mural-rocket-and-ufo.jpg` | Rocket, UFO and planets over the cloudscape, counter and sink | Our Space gallery |
| `rooms/jungle-room_wide-with-ceiling-mural.jpg` | Camel chair beneath "Jungle Smiles, Super Bright!", laughing gas unit and UV chamber visible | Home, Our Space, social story |
| `rooms/jungle-room_wide-with-glass-partition.jpg` | Jungle room with the etched jungle-glass partition | Our Space gallery |
| `rooms/jungle-room_mural-wall-detail.jpg` | Watercolour jungle — sloth, monkey, tiger, elephant, giraffe, zebra, lion | Our Space gallery |
| `play-gym/play-gym_wide-establishing.jpg` | Whole gym: cloud wall, tree shelf, bench, climbing frame | Our Space gallery |
| `play-gym/play-gym_climbing-wall-and-cargo-net.jpg` | Climbing frame, cargo net, soft animals, road-map mat (portrait) | Home, social story |
| `play-gym/play-gym_tree-shelf-and-cloud-wall.jpg` | Cloud wall, tree shelf, bench, climbing frame beyond | Home |
| `play-gym/play-gym_tree-shelf-books-detail.jpg` | Tree shelf close up — Gujarati and English picture books, crochet toys | Our Space gallery |
| `reception/reception_height-chart-and-bunny-desk.jpg` | Logo wall, jungle-animal height chart, desk | Our Space, social story |
| `reception/reception_logo-wall-and-desk.jpg` | Logo wall from the door side, teal desk | unused — spare angle |
| `entrance/entrance_backlit-sign-dusk.jpg` | Dimensional edge-lit sign, straight on | Our Space opener |
| `no-cavity-club/no-cavity-club_mascot-mural-and-rainbow.jpg` | Superhero tooth mural, "Super Smile Savers!", rainbow (portrait) | Home, No Cavity Club, social story |
| `no-cavity-club/no-cavity-club_mural-and-reception.jpg` | Same mural in context, with the logo wall and desk | Our Space gallery |
| `doctor/doctor_portrait-consultation-room.jpg` | Dr. Roshni Chauhan at her desk, facing camera | Meet the Doctor |
| `doctor/doctor_at-desk.jpg` | Dr. Chauhan working at the laptop, side on | Our Space, home |
| `consultation/consultation-room_desk-and-arched-doorway.jpg` | Wood desk, botanical wallpaper, framed qualifications, arched doorway into the jungle room | Our Space, Meet the Doctor, social story |
| `rooms/space-room_ceiling-mural-lit.jpg` | The space room's backlit ceiling mural, lit | Our Space |
| `rooms/jungle-room_ceiling-mural-lit.jpg` | The jungle room's backlit ceiling mural, lit | Our Space, social story |
| `brand/logo.png` | The brand mark | header, footer |
| `brand/logo_reference.png` | Original supplied artwork | reference only |

## Still needed

Two shots. Nothing on the site waits on them: no placeholder tile renders
anywhere, the page simply has less until they arrive.

| Slot | Where | Shot direction |
|---|---|---|
| Sterilisation area | Our Space | Instruments and process visible. The UV chamber appears in the jungle-room shots; a dedicated photograph is a trust-building image for parents and worth taking properly. |
| Star projector in a dark room | Comfort & Sedation | The astronaut projector is on the space-room counter in daylight; the shot that matters is the room dark with the stars on. |

### Three files the client still needs to re-supply

The third batch (September 2026) arrived as screenshots rather than camera
files, so there is no original to rebuild them from and they were left at
their supplied size. Upscaling them would make them softer, not sharper.

| File | Master | Needed |
|---|---|---|
| `rooms/space-room_ceiling-mural-lit.jpg` | 764px | 1440px |
| `rooms/jungle-room_ceiling-mural-lit.jpg` | 764px | 1440px |
| `consultation/consultation-room_desk-and-arched-doorway.jpg` | 1360px | 1368px |

The consultation room is 8px short and in practice fine. The two ceiling
murals fill a 720px box on a 2x screen and are the only genuinely soft
photographs left on the site. Ask the client for the camera originals — they
were almost certainly taken on the same phone as the rest — and drop them into
`New Picture/` with an entry in `scripts/build-images.mjs`. `npm run images`
reports them until they are replaced.

## Hard rule

No child's face, name, or before/after image anywhere on this site — see
`DECISIONS.md`. Photography of the space itself is fine; anything involving a
child must be hands, back-of-head or wide-context only, and only once signed
parental consent is in place. The doctor is an adult and her portrait raises no
such issue.
