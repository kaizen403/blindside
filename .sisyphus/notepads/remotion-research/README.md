# Remotion Animation Research & Code Patterns

Complete reference for building Remotion animation components with production-ready code examples.

## 📚 Documentation Files

### [QUICK-REFERENCE.md](./QUICK-REFERENCE.md)
**Start here** - Essential imports, hooks, functions, and patterns. 1-page cheat sheet.

**Covers:**
- Core imports and hooks
- interpolate() and spring() reference
- Common animation patterns
- Easing functions & extrapolation
- Frame duration calculations

### [core-patterns.md](./core-patterns.md)
Fundamental Remotion concepts and setup.

**Covers:**
- Composition registration
- useCurrentFrame() hook (frame-driven animations)
- useVideoConfig() for video metadata
- AbsoluteFill component for layering
- Simple fade-in pattern

### [interpolate-spring.md](./interpolate-spring.md)
Advanced animation control with interpolate() and spring().

**Covers:**
- Basic linear interpolation
- Multi-point interpolation for complex curves
- Extrapolation options (clamp, wrap, extend)
- Easing functions with interpolate()
- Spring physics parameters (mass, damping, stiffness)
- Spring configuration presets
- Combining spring() with interpolate()
- Multi-phase animation timing

### [svg-animations.md](./svg-animations.md)
SVG rendering and animation patterns specific to Remotion.

**Covers:**
- SVG container setup in Remotion
- Transform origin and transformBox for rotation
- **Orbital/circular animations** - planets, multi-orbit systems
- **Radar sweep effects** - continuously rotating sweep lines
- **Sonar pulse animations** - expanding circles with fade
- SVG path animations (dash effects, stroke width)
- @remotion/shapes component library

### [looping-timelines.md](./looping-timelines.md)
Multi-phase animations and timeline orchestration.

**Covers:**
- Simple looping with interpolate(wrap)
- Loop component usage
- Phase-based animation systems
- Staggered entrance effects
- Sequential animations across elements
- Spring-based entrance/exit
- Chained springs with delays
- Complex timeline orchestration with segment tracking
- Practical examples (loading spinner, etc)

### [nextjs-integration.md](./nextjs-integration.md)
Integrating Remotion into Next.js and React applications.

**Covers:**
- Project structure options
- create-video CLI setup
- Remotion Player component
- Server-side rendering with @remotion/renderer
- Passing props to compositions with Zod schemas
- Development workflow
- Lambda rendering for scalable video generation
- Best practices and code organization

---

## 🚀 Quick Start

### 1. Basic Animation Component
```tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export const FadeInAnimation = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      <div>Hello Remotion!</div>
    </AbsoluteFill>
  );
};
```

### 2. Orbital Animation
```tsx
import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';

export const OrbitalMotion = () => {
  const frame = useCurrentFrame();
  const rotation = interpolate(frame, [0, 300], [0, 360], {
    extrapolateRight: 'wrap',
  });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <svg width="600" height="600" viewBox="0 0 600 600">
        <circle cx="300" cy="300" r="200" fill="none" stroke="white" opacity={0.3} />
        <g style={{ transformOrigin: '300px 300px', transform: `rotate(${rotation}deg)` }}>
          <circle cx="500" cy="300" r="20" fill="blue" />
        </g>
        <circle cx="300" cy="300" r="30" fill="yellow" />
      </svg>
    </AbsoluteFill>
  );
};
```

### 3. Spring Animation
```tsx
import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const SpringBounce = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ transform: `scale(${scale})`, fontSize: 100 }}>🎬</div>
    </AbsoluteFill>
  );
};
```

---

## 🎯 Key Concepts

### Frame-Driven Animation (CRITICAL)
- **All animations must be driven by `useCurrentFrame()`**
- Never use CSS animations, useState, or setInterval
- Ensures deterministic rendering for server-side video generation

### Composition Structure
```
Animation = Component + Metadata
- Component: React component with frame-based logic
- Metadata: Duration, dimensions, fps, defaultProps
```

### Timeline Thinking
- Videos are sequences of frames
- 30fps = 30 frames per second
- 300 frames at 30fps = 10-second video
- Always reference current frame for state

### Interpolation Pattern
```
interpolate(currentValue, [inputMin, inputMax], [outputMin, outputMax], options)
```

---

## 📊 Common Animation Durations (30fps)

| Duration | Frames | Use Case |
|----------|--------|----------|
| 0.5 sec | 15 | Quick pulse |
| 1 sec | 30 | Fade in/out |
| 2 sec | 60 | Smooth transition |
| 3 sec | 90 | Element entrance |
| 5 sec | 150 | Main animation |
| 10 sec | 300 | Full sequence |

---

## 🔧 Development Workflow

### Create Project
```bash
npx create-video@latest --next
```

### Run Studio (Development)
```bash
npm run remotion
```

### Preview in Browser
```tsx
import { Player } from '@remotion/player';

<Player
  component={MyAnimation}
  durationInFrames={300}
  compositionWidth={1920}
  compositionHeight={1080}
  fps={30}
/>
```

### Render to Video
```bash
npx remotion render src/Root.tsx MyAnimation output.mp4
```

---

## 💡 Pro Tips

1. **Use `extrapolateRight: 'clamp'`** on interpolations to prevent unexpected values
2. **Use `extrapolateRight: 'wrap'`** for looping animations
3. **Combine spring() + interpolate()** for physics-based motion with custom ranges
4. **Use `useMemo()`** for expensive calculations to avoid recalculation each frame
5. **Structure compositions in separate files** for better reusability
6. **Test with Player component** before rendering to video
7. **Use Remotion Studio's timing editor** to visualize animation curves
8. **Profile performance** - complex SVGs/DOM can slow rendering

---

## 📖 Example Patterns by Type

### Movement
- See [svg-animations.md](./svg-animations.md) → Orbital Motion
- See [core-patterns.md](./core-patterns.md) → Fade patterns

### Entrance/Exit
- See [interpolate-spring.md](./interpolate-spring.md) → Multi-Phase Animations
- See [looping-timelines.md](./looping-timelines.md) → Spring Entrance & Exit

### Loops
- See [looping-timelines.md](./looping-timelines.md) → Looping Patterns
- See [svg-animations.md](./svg-animations.md) → Radar Sweep

### Complex Sequences
- See [looping-timelines.md](./looping-timelines.md) → Multi-Phase Timeline
- See [looping-timelines.md](./looping-timelines.md) → Complex Timeline Orchestration

---

## 🔗 Official Resources

- **Documentation**: https://www.remotion.dev/docs
- **API Reference**: https://www.remotion.dev/docs/api
- **Timing Editor**: https://www.remotion.dev/timing-editor (visualize easing curves)
- **GitHub**: https://github.com/remotion-dev/remotion
- **Examples**: https://github.com/remotion-dev/remotion/tree/main/packages/examples
- **Templates**: https://www.remotion.dev/templates

---

## 📝 Notes

- All examples use TypeScript/TSX
- Examples tested against Remotion 4.0+
- Prefer functional components with hooks
- Use `Zod` for schema validation on props
- Keep compositions pure (no side effects)
- Static assets go in `public/` folder, referenced via `staticFile()`

---

Last Updated: April 2026
