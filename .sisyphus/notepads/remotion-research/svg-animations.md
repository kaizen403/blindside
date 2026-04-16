# SVG Animations in Remotion

## 1. SVG Rendering in Remotion

### Basic SVG Container

```tsx
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export const SvgAnimation = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <svg width="400" height="400" viewBox="0 0 400 400">
        <circle cx="200" cy="200" r="100" fill="blue" />
      </svg>
    </AbsoluteFill>
  );
};
```

### SVG with Transform Origin

For rotating SVG elements around their center:

```tsx
export const RotatingShape = () => {
  const frame = useCurrentFrame();
  const rotation = (frame / 300) * 360; // Full rotation in 300 frames
  
  return (
    <AbsoluteFill style={{
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1a1a1a',
    }}>
      <svg
        width="400"
        height="400"
        viewBox="0 0 400 400"
        style={{
          transformOrigin: 'center center',
          transformBox: 'fill-box',
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <g>
          {/* SVG content */}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
```

**Key CSS Properties:**
- `transformOrigin: 'center center'` - rotate around center
- `transformBox: 'fill-box'` - use element's bounding box as reference

---

## 2. Orbital/Circular Animations

### Orbital Motion Pattern

```tsx
import { useCurrentFrame, interpolate, useVideoConfig, AbsoluteFill } from 'remotion';

export const OrbitalAnimation = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Linear rotation over full duration
  const rotation = interpolate(frame, [0, 300], [0, 360], {
    extrapolateRight: 'wrap', // Loops rotation
  });
  
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
      }}
    >
      <svg width="600" height="600" viewBox="0 0 600 600">
        {/* Outer orbit circle */}
        <circle cx="300" cy="300" r="200" fill="none" stroke="white" strokeWidth="1" opacity={0.3} />
        
        {/* Rotating group with orbiting element */}
        <g style={{
          transformOrigin: '300px 300px',
          transform: `rotate(${rotation}deg)`,
        }}>
          {/* Planet at orbit radius */}
          <circle cx="500" cy="300" r="20" fill="blue" />
        </g>
        
        {/* Center star */}
        <circle cx="300" cy="300" r="30" fill="yellow" />
      </svg>
    </AbsoluteFill>
  );
};
```

### Multi-Orbit System

```tsx
export const MultiOrbit = () => {
  const frame = useCurrentFrame();
  
  const fastRotation = interpolate(frame, [0, 200], [0, 720]); // 2 rotations
  const slowRotation = interpolate(frame, [0, 300], [0, 360]); // 1 rotation
  
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
      <svg width="600" height="600" viewBox="0 0 600 600">
        {/* Inner orbit */}
        <circle cx="300" cy="300" r="100" fill="none" stroke="white" opacity={0.2} />
        <g style={{ transformOrigin: '300px 300px', transform: `rotate(${fastRotation}deg)` }}>
          <circle cx="400" cy="300" r="15" fill="red" />
        </g>
        
        {/* Outer orbit */}
        <circle cx="300" cy="300" r="200" fill="none" stroke="white" opacity={0.2} />
        <g style={{ transformOrigin: '300px 300px', transform: `rotate(${slowRotation}deg)` }}>
          <circle cx="500" cy="300" r="20" fill="blue" />
        </g>
        
        {/* Center */}
        <circle cx="300" cy="300" r="25" fill="yellow" />
      </svg>
    </AbsoluteFill>
  );
};
```

---

## 3. Radar/Scan Sweep Effects

### Radar Sweep Animation

```tsx
import { useCurrentFrame, interpolate } from 'remotion';

export const RadarScan = () => {
  const frame = useCurrentFrame();
  
  // Continuously sweep from 0 to 360
  const sweep = interpolate(frame, [0, 300], [0, 360], {
    extrapolateRight: 'wrap',
  });
  
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0a0a0a',
      }}
    >
      <svg width="500" height="500" viewBox="0 0 500 500">
        {/* Radar circles */}
        {[50, 100, 150, 200].map((r) => (
          <circle
            key={r}
            cx="250"
            cy="250"
            r={r}
            fill="none"
            stroke="#00ff00"
            strokeWidth="1"
            opacity={0.2}
          />
        ))}
        
        {/* Sweep line */}
        <g style={{
          transformOrigin: '250px 250px',
          transform: `rotate(${sweep}deg)`,
        }}>
          <line x1="250" y1="250" x2="250" y2="50" stroke="#00ff00" strokeWidth="2" />
          {/* Fade effect at end of sweep */}
          <line
            x1="250"
            y1="250"
            x2="250"
            y2="100"
            stroke="#00ff00"
            strokeWidth="3"
            opacity={0.5}
          />
        </g>
        
        {/* Center dot */}
        <circle cx="250" cy="250" r="8" fill="#00ff00" />
      </svg>
    </AbsoluteFill>
  );
};
```

### Pulse/Sonar Sweep

```tsx
export const SonarPulse = () => {
  const frame = useCurrentFrame();
  
  // Expanding pulse from center
  const pulseRadius = interpolate(frame, [0, 100], [0, 200], {
    extrapolateRight: 'clamp',
  });
  
  const pulseOpacity = interpolate(frame, [0, 100], [1, 0], {
    extrapolateRight: 'clamp',
  });
  
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000033',
      }}
    >
      <svg width="500" height="500" viewBox="0 0 500 500">
        {/* Background grid */}
        {/* ... */}
        
        {/* Expanding pulse */}
        <circle
          cx="250"
          cy="250"
          r={pulseRadius}
          fill="none"
          stroke="#00ffff"
          strokeWidth="3"
          opacity={pulseOpacity}
        />
        
        {/* Repeating pulse (every 100 frames) */}
        {[0, 100, 200].map((offset) => {
          const r = interpolate(frame - offset, [0, 100], [0, 200], {
            extrapolateRight: 'clamp',
          });
          const op = interpolate(frame - offset, [0, 100], [1, 0], {
            extrapolateRight: 'clamp',
          });
          return (
            <circle
              key={offset}
              cx="250"
              cy="250"
              r={r}
              fill="none"
              stroke="#00ffff"
              strokeWidth="2"
              opacity={Math.max(0, op)}
            />
          );
        })}
        
        {/* Center */}
        <circle cx="250" cy="250" r="5" fill="#00ffff" />
      </svg>
    </AbsoluteFill>
  );
};
```

---

## 4. SVG Path Animations

### Animated SVG Path

```tsx
export const PathAnimation = () => {
  const frame = useCurrentFrame();
  
  // Animate path offset for dash effect
  const offset = interpolate(frame, [0, 120], [0, 500], {
    extrapolateRight: 'wrap',
  });
  
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}
    >
      <svg width="400" height="400" viewBox="0 0 400 400">
        <path
          d="M 50 50 L 350 50 L 350 350 L 50 350 Z"
          fill="none"
          stroke="black"
          strokeWidth="3"
          strokeDasharray="500"
          strokeDashoffset={offset}
        />
      </svg>
    </AbsoluteFill>
  );
};
```

### Animated Stroke Width with SVG

```tsx
export const GrowingStroke = () => {
  const frame = useCurrentFrame();
  
  const strokeWidth = interpolate(frame, [0, 100], [1, 5], {
    extrapolateRight: 'clamp',
  });
  
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <svg width="400" height="400" viewBox="0 0 400 400">
        <circle
          cx="200"
          cy="200"
          r="100"
          fill="none"
          stroke="blue"
          strokeWidth={strokeWidth}
        />
      </svg>
    </AbsoluteFill>
  );
};
```

---

## 5. Using @remotion/shapes

Pre-built SVG shape components:

```tsx
import { Circle, Rect, Line } from '@remotion/shapes';
import { AbsoluteFill } from 'remotion';

export const ShapesExample = () => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}
    >
      <Circle radius={100} fill="blue" stroke="red" strokeWidth={2} />
    </AbsoluteFill>
  );
};
```

