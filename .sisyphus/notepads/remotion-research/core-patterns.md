# Remotion Core Patterns & Code Examples

## 1. Composition Setup

### Basic Composition Registration

```tsx
// src/Root.tsx
import { Composition } from 'remotion';
import { MyComposition } from './MyComposition';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MyComposition"
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      component={MyComposition}
    />
  );
};
```

**Key Props:**
- `id`: Unique identifier for the composition
- `durationInFrames`: Total number of frames (duration = durationInFrames / fps)
- `fps`: Frames per second (30, 60 common)
- `width` & `height`: Canvas dimensions in pixels
- `component`: React component to render

### Multiple Compositions with Folder Organization

```tsx
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Animations">
        <Composition
          id="OrbitalAnimation"
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
          component={OrbitalAnimation}
        />
        <Composition
          id="RadarScan"
          durationInFrames={200}
          fps={30}
          width={1920}
          height={1080}
          component={RadarScan}
        />
      </Folder>
      <Folder name="Transitions">
        {/* More compositions */}
      </Folder>
    </>
  );
};
```

---

## 2. useCurrentFrame() Hook

Every animation must be driven by `useCurrentFrame()` - NEVER use CSS animations.

```tsx
import { useCurrentFrame, AbsoluteFill } from 'remotion';

export const BasicAnimation = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill style={{ backgroundColor: 'white' }}>
      <div>Current frame: {frame}</div>
    </AbsoluteFill>
  );
};
```

**Why?**
- Ensures consistent, deterministic rendering
- Required for server-side rendering
- Prevents flickering during video export

---

## 3. Video Config Hook

Get video metadata (fps, duration, dimensions):

```tsx
import { useVideoConfig } from 'remotion';

export const MyComposition = () => {
  const { fps, durationInFrames, width, height } = useVideoConfig();
  
  return (
    <div style={{ width, height, fontSize: 60 }}>
      This {width}x{height}px video is {durationInFrames / fps} seconds long
      at {fps} fps.
    </div>
  );
};
```

---

## 4. AbsoluteFill Component

Creates a full-screen container with absolute positioning:

```tsx
import { AbsoluteFill } from 'remotion';

export const FullScreen = () => {
  return (
    <AbsoluteFill style={{
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1a1a1a',
    }}>
      <div>Centered content</div>
    </AbsoluteFill>
  );
};
```

**Equivalent CSS:**
```css
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
width: 100%;
height: 100%;
display: flex;
flex-direction: column;
```

Used for layering - later renders appear on top.

---

## 5. Simple Fade-In Pattern

```tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export const FadeIn = () => {
  const frame = useCurrentFrame();
  
  // Fade in over first 60 frames (2 seconds at 30fps)
  const opacity = interpolate(frame, [0, 60], [0, 1], {
    extrapolateRight: 'clamp',
  });
  
  return (
    <AbsoluteFill style={{ 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: 'white',
    }}>
      <div style={{ opacity, fontSize: 80 }}>
        Hello World!
      </div>
    </AbsoluteFill>
  );
};
```

**Pattern:**
- `interpolate(currentValue, [inputStart, inputEnd], [outputStart, outputEnd], options)`
- `extrapolateRight: 'clamp'` - prevents values from going beyond output range

