# Interpolate & Spring - Advanced Animation Patterns

## 1. Interpolate() Function

Maps input values to output values with precise control.

### Basic Linear Interpolation

```tsx
import { interpolate, useCurrentFrame } from 'remotion';

const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 20], [0, 1]);
```

**At different frames:**
- Frame 0: opacity = 0
- Frame 10: opacity = 0.5
- Frame 20: opacity = 1
- Frame 30: opacity = 1.5 (extends beyond range!)

### Using extrapolate to Clamp Values

```tsx
const opacity = interpolate(frame, [0, 20], [0, 1], {
  extrapolateRight: 'clamp',
  extrapolateLeft: 'clamp',
});
```

**Options:**
- `'clamp'` - stop at output range bounds
- `'extend'` - continue interpolating (default)
- `'wrap'` - loop the value
- `'identity'` - return input value

### Multi-Point Interpolation

Animate through multiple waypoints:

```tsx
const {durationInFrames} = useVideoConfig();
const opacity = interpolate(
  frame,
  [0, 20, durationInFrames - 20, durationInFrames],
  [0, 1,  1,                     0],
);
// Fade in (0-20), stay visible (20-end-20), fade out (end-20-end)
```

### With Easing Functions

```tsx
import { interpolate, Easing } from 'remotion';

const slideIn = interpolate(frame, [0, 30], [200, 0], {
  easing: Easing.out(Easing.exp),
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});

const smoothFade = interpolate(frame, [0, 60], [0, 1], {
  easing: Easing.inOut(Easing.quad),
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
```

**Common Easing Functions:**
- `Easing.linear()` - constant speed
- `Easing.quad()` - quadratic
- `Easing.cubic()` - cubic
- `Easing.out()` - decelerate
- `Easing.in()` - accelerate
- `Easing.inOut()` - accelerate then decelerate
- `Easing.bezier(0.8, 0.22, 0.96, 0.65)` - custom curve

---

## 2. spring() - Physics-Based Animations

Simulates real physics with mass, damping, and stiffness.

### Basic Spring Animation

```tsx
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const SpringScale = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const scale = spring({
    frame,
    fps,
  });
  
  return (
    <div style={{ transform: `scale(${scale})` }}>
      Bouncy Text!
    </div>
  );
};
```

**Default behavior:**
- Animates from 0 to 1
- Natural bounce/overshoot
- Looks organic

### Spring Configuration

```tsx
// Smooth, no bounce (subtle reveals)
const smooth = spring({
  frame,
  fps,
  config: { damping: 200 },
});

// Snappy with minimal bounce (UI elements)
const snappy = spring({
  frame,
  fps,
  config: { damping: 20, stiffness: 200 },
});

// Heavy, slow, small bounce
const heavy = spring({
  frame,
  fps,
  config: { damping: 15, stiffness: 80, mass: 2 },
});

// Default bouncy
const bouncy = spring({
  frame,
  fps,
  config: { damping: 10, stiffness: 100, mass: 1 },
});
```

**Parameters:**
- `mass` (default: 1) - weight of spring. Lower = faster
- `damping` (default: 10) - deceleration force. Higher = less bounce
- `stiffness` (default: 100) - spring stiffness. Higher = faster
- `overshootClamping` (default: false) - prevent overshooting target

### Measured Spring Duration

Calculate spring duration for predictable timing:

```tsx
import { spring, measureSpring } from 'remotion';

const config = { damping: 200 };
const duration = measureSpring({ fps: 30, config }); // Returns 23 frames
```

### Constrained Spring Duration

Force spring to finish in exact number of frames:

```tsx
const scale = spring({
  frame,
  fps,
  durationInFrames: 40, // Exactly 40 frames
  config: { damping: 20, stiffness: 200 },
});
```

### Delayed Spring

```tsx
const entrance = spring({
  frame: frame - 20, // Delays animation by 20 frames
  fps,
});

// Or using delay parameter:
const entrance2 = spring({
  frame,
  fps,
  delay: 20,
});
```

---

## 3. Combining spring() with interpolate()

Spring returns 0-1. Use interpolate() to map to custom ranges:

```tsx
import { spring, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const OrbitalMotion = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Spring animation (0 to 1)
  const springProgress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  
  // Map spring to rotation (0 to 360 degrees)
  const rotation = interpolate(springProgress, [0, 1], [0, 360]);
  
  // Map spring to translation (-100 to 0 pixels)
  const translateY = interpolate(springProgress, [0, 1], [-100, 0]);
  
  // Map spring to scale (0.5 to 1.5)
  const scale = interpolate(springProgress, [0, 1], [0.5, 1.5]);
  
  return (
    <div style={{
      transform: `rotate(${rotation}deg) translateY(${translateY}px) scale(${scale})`,
    }}>
      Orbiting Element
    </div>
  );
};
```

---

## 4. Multi-Phase Animations

Different animations at different frame ranges:

```tsx
export const MultiPhase = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  
  // Phase 1: Entrance (0-30)
  const inAnimation = spring({
    frame,
    fps,
    durationInFrames: 30,
  });
  
  // Phase 2: Exit (last 30 frames)
  const outAnimation = spring({
    frame,
    fps,
    durationInFrames: 30,
    delay: durationInFrames - 30,
  });
  
  // Combined: fade in, stay visible, fade out
  const scale = inAnimation - outAnimation;
  
  return (
    <div style={{ transform: `scale(${scale})` }}>
      Multi-Phase
    </div>
  );
};
```

