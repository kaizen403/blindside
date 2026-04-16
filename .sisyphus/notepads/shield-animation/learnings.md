## 2026-04-15 Codebase Exploration

### Project Structure
- Next.js 16 app with separate `video/` dir for Remotion compositions
- Remotion v4 already installed in `video/package.json`
- Compositions registered in `video/src/Root.tsx` via `<Composition>` elements
- Entry point: `video/src/index.ts` calls `registerRoot(RemotionRoot)`

### Existing Patterns (from SolutionVideo.tsx and SimultaneousBreach.tsx)
- **Fonts**: Use `@remotion/google-fonts` for Inter and JetBrains Mono
  - `loadInter("normal", { weights: ["400", "500"], subsets: ["latin"] })`
  - `loadMono("normal", { weights: ["400"], subsets: ["latin"] })`
  - Returns `{ fontFamily: sansFont }` destructured
- **Colors**: `BG = "#09090b"`, `RED = "#dc2626"`, `GREEN = "#34d399"`, `FG = "#fafafa"`, `MUTED = "#a1a1aa"`
  - Card borders: `rgba(255,255,255,0.06)`, Card bg: `rgba(255,255,255,0.04)`
- **Layout**: `<AbsoluteFill style={{ backgroundColor: BG }}>` as root
- **SVG**: Full-size SVG overlay for circles, lines, paths
- **Animation**: `useCurrentFrame()`, `interpolate()` for timing, `spring()` for physics
- **Global opacity envelope**: fade in at start, fade out at end with interpolate
- **Constants**: All frame timings defined as named constants at top of file

### Render Scripts
- Pattern: `"render-xxx": "remotion render CompositionId out/filename.mp4 --codec=h264"`
- SimultaneousBreach: 1920x1080, 240 frames (8s), 30fps
- SolutionVideo: 1080x720, 360 frames (12s), 30fps

## 2026-04-15 TheShield Implementation

### Animation Architecture
- 180 frames (6s at 30fps), 1920×1080, BG #09090b
- Global opacity: `interpolate(frame, [0, 8, 165, 180], [0, 1, 1, 0])`
- No `Sequence` / `Series` — all phases driven by frame-range interpolation

### Phase breakdown
- Phase 1 (0–45): Scanner orbit using `interpolate(frame, [0, 45], [0, Math.PI * 2])`
- Phase 2 (45–105): Threats drift from radius 280 → 160 over 30 frames each
- Phase 3 (105–150): Report card bars fill with `Easing.out(Easing.quad)`, staggered 6f
- Phase 4 (150–165): Status text fades in at 15% white opacity
- Phase 5 (165–180): Global fade handles exit

### Perimeter illumination trick
- `behindAngle = ((scanAngleDeg - dotDeg + 360) % 360)` gives the "trailing" angle
- Values in [0, 20] → illumination = `1 - behindAngle / 20` (trailing fade-off)
- Sentinel `21` used when scan is done to force `scanIllum = 0`

### Spring inversion for dot pulse
- `dotSpring` goes 0 → 1 (spring settles)
- `nearestDotPulseAmp = Math.max(0, 1 - dotSpring)` → bright at impact, decays
- Config `{ damping: 8, stiffness: 120, mass: 0.5 }` gives ~12-15 frame flash

### Colors used
- GREEN = "#27c93f" (protection), scanner fill "rgba(39,201,63,0.5)"
- RED = "#dc2626" (threats), threat dot fill at 70% × dotOpacity
- YELLOW = "#ffbd2e" (warning bar)
- Perimeter dots: white at 4%, green 4%–15% when illuminated, green up to 40% on impact
