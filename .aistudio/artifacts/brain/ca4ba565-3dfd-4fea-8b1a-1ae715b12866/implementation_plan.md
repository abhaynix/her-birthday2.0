# Birthday Experience & Parity Clone Specification

A full-fidelity, pixel-accurate clone and enhancement of the interactive birthday website experience (`https://original-bday-website.vercel.app/`). The application replicates the 5-stage snap-scroll narrative—introductory odometer counter, burn-and-release fire simulation, horizontal parallax photo strip, realistic scrapbook turn-page album, and interactive 3D birthday cake with blowable candle flames—paired with an interactive Personalization Studio and a live in-app Audit & Verification Drawer.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following choices were confirmed in Phase 1 and are baked into the architecture:

- **Confirmed Decision 1: Hybrid Replica + Personalization Mode**: The application launches as the exact 1:1 replica of the original website with default text, layout, and scrapbook memories. Users can toggle into **Personalization Studio** to customize the birthday recipient's name, birthdate/age, custom photo gallery, heartfelt letters, and scrapbook stickers.
- **Confirmed Decision 2: Celebration Audio Engine**: Includes celebratory background music with a floating audio toggle (mute/play), plus interactive procedural sound effects (odometer mechanical tick, match strike and fire whoosh, balloon pop, page turn swoosh, and candle blowout chime).
- **Confirmed Decision 3: In-App Parity & Verification Dashboard**: In addition to generating the `./audit/source-manifest.json`, `./audit/coverage.csv`, and `./audit/FINAL.md` verification files, the app features an integrated live **Audit Inspector Drawer** that displays DOM element coverage, SHA-256 asset checksums, computed breakpoint parity, and animation timing comparisons in real time.

---

### 1. Overview & Core Concept

- **What It Does**: A cinematic, multi-stage interactive web experience designed to celebrate a birthday with rich physical metaphors:
  1. **Stage 1 (Intro Odometer & Fire Burn Reveal)**: Starts with rolling numbers on a dark canvas counting up to the target age, zooming through to a subtle watermark numeral. Clicking triggers a canvas-based ignition wave that realistically burns the watermark away with glowing embers, smoke, and flame licks, releasing celebratory floating balloons.
  2. **Stage 2 (Hero Parallax Strip)**: A high-fashion, editorial horizontal photo gallery featuring smooth scroll-linked card transforms, typographic greetings, and date markers.
  3. **Stage 3 (Handwritten Letter & Polaroids)**: An intimate note styled with authentic handwriting typography (`Caveat`), washi tape, and pinned Polaroid snapshots.
  4. **Stage 4 (3D Page-Turn Scrapbook Album)**: A realistic interactive turning book with front cover, stickers, stamps, paper cutouts, and memory photos that flip realistically upon click or drag.
  5. **Stage 5 (3D Interactive Birthday Cake)**: A Three.js procedural 3D cake with flickering candle flames, dynamic ambient lighting, and an interactive "Make a Wish / Blow Out Candle" interaction that extinguishes the flame with smoke physics.
  6. **Interactive Tools**: A floating celebration toolbar providing audio control, personalization controls, and the Parity Audit Drawer.

- **Target Audience / Persona**: Birthday celebrants, friends creating unforgettable digital gifts, and engineers auditing full-fidelity web clones.
- **Key Value**: Delivers emotional joy and tactile delight through realistic visual effects and physics, with zero dependencies on brittle external hosting.

---

### 2. User Experience & Visual Design

#### Section Sequence & Layout Contract

```
┌─────────────────────────────────────────────────────────────────┐
│ Section 1: Intro Counter (Odometer Roll) & Burn-to-Release Hero │
│ - Dark canvas (#000), Archivo Black / Space Mono numerals       │
│ - Canvas fire propagation shader with ash decay & ember sparks  │
│ - Balloons release & live time elapsed odometer (days/hours/s) │
└────────────────────────────────┬────────────────────────────────┘
                                 │ Snap Scroll Down
┌────────────────────────────────▼────────────────────────────────┐
│ Section 2: Parallax Hero Gallery                                │
│ - Minimalist warm canvas (#FAFAF7), Bricolage Grotesque         │
│ - Floating photo cards with gentle rotational offsets           │
│ - Horizontal card track with progress indicator                 │
└────────────────────────────────┬────────────────────────────────┘
                                 │ Snap Scroll Down
┌────────────────────────────────▼────────────────────────────────┐
│ Section 3: The Love Letter & Polaroid Memories                  │
│ - Textured paper aesthetic, Caveat handwritten script           │
│ - Pinned polaroids, love tape accents, and timestamp markers    │
└────────────────────────────────┬────────────────────────────────┘
                                 │ Snap Scroll Down
┌────────────────────────────────▼────────────────────────────────┐
│ Section 4: 3D Turn-Page Scrapbook Album                         │
│ - Dual-page book spread with realistic curl and depth shading   │
│ - Drag / click to flip pages: Front Cover -> Story -> Back Cover│
│ - Embellished with stamps, washi tape, cute cats & floral art   │
└────────────────────────────────┬────────────────────────────────┘
                                 │ Snap Scroll Down
┌────────────────────────────────▼────────────────────────────────┐
│ Section 5: 3D Birthday Cake & Candle Wish Ceremony              │
│ - Procedural WebGL/Three.js multi-tier cake with frosting beads │
│ - Flickering particle candle flame with dynamic point light     │
│ - Click or blow (microphone or tap) to extinguish with smoke   │
└─────────────────────────────────────────────────────────────────┘
```

#### Visual Identity & Typography Tokens

- **Palette**:
  - Deep Obsidian Canvas: `#000000` (Sections 1 & 5)
  - Editorial Cream Canvas: `#FAFAF7` (Sections 2 & 4)
  - Paper Parchment: `#FFFDF9` with subtle paper fiber warmth
  - Fire Glow Palette: `#FFE2A8` (core), `#FF9A3D` (flame), `#FF5A14` (charred ember)
  - Pastel Scrapbook Accents: Soft rose, pistachio, vintage sky blue, kraft paper beige
- **Typography Pairings**:
  - Numbers & Impact Headers: `Archivo Black` & `Bricolage Grotesque`
  - Body & Micro-Metadata: `Space Mono` & `Work Sans`
  - Handwritten Letters & Polaroids: `Caveat` (fluid cursive with natural baseline variations)
- **Zero-Pill Discipline & Anti-AI Restraint**:
  - No generic purple gradients or arbitrary floating stat pills.
  - Metadata rendered as authentic unboxed monospace timestamps with typographic separators (`·`).

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Self-Contained WebGL & Canvas Effects**:
  - *Chosen Approach*: Recreate the custom flame-burn canvas pixel shader and Three.js 3D cake directly within the codebase with pure local math, zero external flaky CDNs, and hardware-accelerated RAF render loops.
  - *Why*: Eliminates CORS failures, network dropouts, and ensures 60 FPS across mobile and desktop.
- **Decision 2: Realistic Page Flip Physics**:
  - *Chosen Approach*: Implement an interactive multi-layered book component with mouse/touch drag tracking, 3D perspective page deformation (`rotateY`, `box-shadow` gradient shadows), and step-by-step page progression.
  - *Why*: Delivers the tactile delight of turning physical scrapbook pages without needing heavy binary WASM dependencies.
- **Decision 3: Web Audio API Synthesizer + Fallback Assets**:
  - *Chosen Approach*: High-quality celebratory ambient soundtrack accompanied by custom Web Audio API procedural sound effects (chimes, match flame, balloon pops, page whoosh).
  - *Why*: Zero missing asset errors, instant playback without waiting for multi-megabyte sound downloads, and full volume/mute controls.
- **Decision 4: In-App Parity Audit Console**:
  - *Chosen Approach*: A collapsible HUD drawer offering live inspection of all 5 phases: DOM hierarchy audit, computed CSS diff, asset SHA-256 registry, animation timeline counters, and video/frame sampling status.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          State & Context Layer                         │
│  ┌──────────────────────┐  ┌─────────────────────┐  ┌────────────────┐ │
│  │ BirthdayStateContext │  │  AudioEngineContext │  │  AuditRegistry │ │
│  │ - Recipient name/age │  │  - Sound effects    │  │  - Manifest    │ │
│  │ - Custom photos      │  │  - Music playback   │  │  - Coverage CSV│ │
│  │ - Letter messages    │  │  - Volume & mute    │  │  - Parity log  │ │
│  └──────────┬───────────┘  └──────────┬──────────┘  └───────┬────────┘ │
└─────────────┼─────────────────────────┼─────────────────────┼──────────┘
              ▼                         ▼                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        View & Presentation Layer                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ SnapContainer (overflow-y-scroll snap-y snap-mandatory)          │  │
│  │  ├─ Stage 1: OdometerIntro & FireBurnHero                        │  │
│  │  ├─ Stage 2: HeroParallaxStrip (Bricolage Grotesque Gallery)     │  │
│  │  ├─ Stage 3: HandwrittenLetterSection (Caveat + Polaroids)       │  │
│  │  ├─ Stage 4: ScrapbookPageFlip (Interactive Turning Book)        │  │
│  │  └─ Stage 5: ThreeCakeSection (3D Interactive Candle Blowout)    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────┐  ┌────────────────────────────────────┐ │
│  │ PersonalizationModal      │  │ ParityAuditDrawer                  │ │
│  │ - Edit name, date, photos │  │ - Live Coverage Matrix (PASS/FAIL) │ │
│  │ - Add polaroid memories   │  │ - SHA-256 Asset Manifest           │ │
│  └───────────────────────────┘  └────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 5. Implementation Phases & Milestones

1. **Phase 1: Full Inventory & Audit Manifest (`./audit/source-manifest.json`)**:
   - Record all 5 stages, DOM structure, computed CSS rules across breakpoints (1920, 1440, 1024, 768, 390), font assets, image SHA-256 hashes, and animation timelines.
2. **Phase 2: Core Clone Implementation**:
   - Stage 1: Odometer count-up animation, watermark flame-ignition canvas engine with ash cooling algorithm, ember sparks, smoke generation, and balloon release.
   - Stage 2: HeroSection horizontal photo gallery with rotation offsets and date markers.
   - Stage 3: Handwritten letter section with washi tape, stamps, and tilt-hover polaroids.
   - Stage 4: Scrapbook 3D turning book with front cover, stickers, multi-page spread, and back cover.
   - Stage 5: Three.js 3D Birthday Cake with candle flame shader and blowout interaction.
3. **Phase 3: Parity Verification & Coverage Matrix (`./audit/coverage.csv`)**:
   - Verify every item in the manifest, asserting PASS status with matching hashes, element counts, and timing.
4. **Phase 4: Personalization Engine & Celebration Audio**:
   - Add Personalization Studio modal to edit recipient name, age, birthday wish, and upload/customize photos.
   - Implement Web Audio synthesizer for ambient acoustic melody and realistic sound effects.
5. **Phase 5: Final Verification Report (`./audit/FINAL.md`)**:
   - Generate the final formal audit report matching all verification specifications.
