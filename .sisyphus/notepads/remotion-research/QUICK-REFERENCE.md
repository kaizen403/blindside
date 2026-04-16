# Remotion Quick Reference Guide

## Essential Imports

```tsx
// Core
import { 
  Composition, 
  useCurrentFrame, 
  useVideoConfig, 
  AbsoluteFill, 
  interpolate, 
  spring,
  Easing,
  staticFile,
  registerRoot,
} from 'remotion';

// Player (for Next.js)
import { Player } from '@remotion/player';

// Shapes
import { Circle, Rect, Line } from '@remotion/shapes';

// Rendering
import { render } from '@remotion/renderer';
```

---

## Core Hooks

### useCurrentFrame()
```tsx
const frame = useCurrentFrame(); // 0 to durationInFrames-1
```

### useVideoConfig()
```tsx
const { fps, durationInFrames, width, height } = useVideoConfig();
```

---

## Animation Functions

### interpolate()
```tsx
// Basic: map frame 0-100 to opacity 0-1
interpolate(frame, [0, 100], [0, 1])

// With clamp: prevent values beyond range
interpolate(frame, [0, 100], [0, 1], { 
  extrapolateRight: 'clamp' 
})

// Multi-point: fade in (0-30), stay (30-70), fade out (70-100)
interpolate(frame, [0, 30, 70, 100], [0, 1, 1, 0])

// With easing
interpolate(frame, [0, 100], [0, 1], {
  easing: Easing.out(Easing.quad)
})

// With wrapping (loops)
interpolate(frame, [0, 300], [0, 360], {
  extrapolateRight: 'wrap'
})
```

### spring()
```tsx
// Default bouncy spring
const scale = spring({ frame, fps })

// Smooth spring (no bounce)
const scale = spring({ frame, fps, config: { damping: 200 } })

// Snappy spring
const scale = spring({ frame, fps, config: { damping: 20, stiffness: 200 } })

// Fixed duration
const scale = spring({ frame, fps, durationInFrames: 40 })

// Delayed start
const scale = spring({ frame, fps, delay: 20 })

// Reversed
const scale = spring({ frame, fps, reverse: true })
```

### measureSpring()
```tsx
const duration = measureSpring({ fps: 30, config: { damping: 200 } });
// Returns number of frames until spring settles
```

---

## Common Patterns

### Fade In
```tsx
const opacity = interpolate(frame, [0, 30], [0, 1], { 
  extrapolateRight: 'clamp' 
});
```

### Rotating Element
```tsx
const rotation = interpolate(frame, [0, 300], [0, 360], {
  extrapolateRight: 'wrap'
});
<div style={{ transform: `rotate(${rotation}deg)` }}>
```

### Scale In with Spring
```tsx
const scale = spring({ frame, fps });
<div style={{ transform: `scale(${scale})` }}>
```

### Orbital Motion
```tsx
const rotation = interpolate(frame, [0, 300], [0, 360], {
  extrapolateRight: 'wrap'
});
<svg>
  <g style={{ transformOrigin: '300px 300px', transform: `rotate(${rotation}deg)` }}>
    <circle cx="500" cy="300" r="20" fill="blue" />
  </g>
</svg>
```

---

## SVG Animation Keys

```tsx
// Rotate SVG element around center
style={{
  transformOrigin: 'center center',
  transformBox: 'fill-box',
  transform: `rotate(${degrees}deg)`
}}

// Dash animation
<path
  strokeDasharray={500}
  strokeDashoffset={offset}
/>

// Variable stroke width
<circle strokeWidth={interpolate(frame, [0, 100], [1, 5])} />
```

---

## Composition Setup

```tsx
// Register composition
<Composition
  id="MyVideo"
  component={MyComponent}
  durationInFrames={300}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{ title: 'Hello' }}
/>

// With schema (for visual editing)
<Composition
  id="MyVideo"
  component={MyComponent}
  schema={myCompositionSchema}
  defaultProps={myCompositionDefaultProps}
  durationInFrames={300}
  fps={30}
  width={1920}
  height={1080}
/>
```

---

## Easing Functions

```tsx
Easing.linear()           // Constant speed
Easing.quad()            // Quadratic
Easing.cubic()           // Cubic
Easing.out(easing)       // Decelerate
Easing.in(easing)        // Accelerate
Easing.inOut(easing)     // Accel -> Decel
Easing.bezier(x1, y1, x2, y2)  // Custom curve
```

---

## Extrapolation Options

```tsx
'extend'   // Continue beyond range (default)
'clamp'    // Stop at range bounds
'wrap'     // Loop the value
'identity' // Return input as-is
```

---

## Multi-Phase Animation

```tsx
// Get progress in current phase
const isInPhase = frame >= phaseStart && frame < phaseEnd;
const phaseProgress = (frame - phaseStart) / (phaseEnd - phaseStart);

// Or with timeline object
const timeline = {
  intro: { start: 0, duration: 60 },
  main: { start: 60, duration: 200 },
};

const isInSegment = (key) => {
  const seg = timeline[key];
  return frame >= seg.start && frame < seg.start + seg.duration;
};

const getProgress = (key) => {
  const seg = timeline[key];
  return (frame - seg.start) / seg.duration;
};
```

---

## Next.js Integration

### Player Component
```tsx
<Player
  component={MyComposition}
  durationInFrames={300}
  compositionWidth={1920}
  compositionHeight={1080}
  fps={30}
  controls
  autoPlay
  loop
/>
```

### API Route Rendering
```tsx
const { render } = await import('@remotion/renderer');

await render({
  composition: MyComposition,
  fps: 30,
  height: 1080,
  width: 1920,
  outputLocation: '/tmp/video.mp4',
  durationInFrames: 300,
});
```

---

## Performance Tips

1. **Drive animations with useCurrentFrame()** - never useState
2. **Use extrapolateRight: 'clamp'** - prevents unexpected values
3. **Memoize heavy calculations** - use useMemo
4. **Split SVGs into groups** - easier to transform
5. **Use staticFile()** for assets in public/
6. **Profile with Remotion Studio** - check rendering performance

---

## Common Frame Durations

```
1 second = fps frames
- 30fps: 30 frames = 1 second
- 60fps: 60 frames = 1 second
- 30fps: 300 frames = 10 seconds
- 30fps: 150 frames = 5 seconds
```

---

## Debugging

```tsx
// Log frame info
useEffect(() => {
  console.log('Current frame:', frame);
  console.log('Config:', useVideoConfig());
}, [frame]);

// Check interpolation output
const value = interpolate(frame, [0, 100], [0, 1]);
console.log(`Frame ${frame}: value = ${value}`);
```

---

## Resources

- Docs: https://www.remotion.dev/docs
- API Reference: https://www.remotion.dev/docs/api
- Timing Editor: https://www.remotion.dev/timing-editor
- GitHub: https://github.com/remotion-dev/remotion
- Examples: https://github.com/remotion-dev/remotion/tree/main/packages/examples

