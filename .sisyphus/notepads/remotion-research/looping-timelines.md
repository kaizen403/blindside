# Looping Animations & Multi-Phase Timelines

## 1. Simple Looping Patterns

### Linear Loop

```tsx
import { useCurrentFrame, interpolate } from 'remotion';

export const LoopingRotation = () => {
  const frame = useCurrentFrame();
  
  // Wraps rotation: at frame 300, goes back to 0 degrees
  const rotation = interpolate(frame, [0, 300], [0, 360], {
    extrapolateRight: 'wrap',
  });
  
  return (
    <div style={{ transform: `rotate(${rotation}deg)` }}>
      ↻
    </div>
  );
};
```

### Loop Component

Use Remotion's `<Loop>` component for simple repetition:

```tsx
import { Loop } from 'remotion';

export const MyVideo = () => {
  return (
    <Loop durationInFrames={100}>
      <AnimatedSquare />
    </Loop>
  );
};

// Repeats AnimatedSquare every 100 frames indefinitely
```

### Finite Loops

```tsx
export const MyVideo = () => {
  return (
    <Loop durationInFrames={100} times={3}>
      <AnimatedSquare />
    </Loop>
  );
};
// Repeats exactly 3 times (300 total frames)
```

---

## 2. Multi-Phase Timeline

### Basic Phase System

```tsx
export const MultiPhase = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  
  // Define phase ranges (each 100 frames)
  const PHASE_1_START = 0;
  const PHASE_1_END = 100;
  const PHASE_2_START = 100;
  const PHASE_2_END = 200;
  const PHASE_3_START = 200;
  const PHASE_3_END = 300;
  
  // Phase 1: Scale up
  const phase1Scale = frame < PHASE_1_END
    ? interpolate(frame, [PHASE_1_START, PHASE_1_END], [0.5, 1])
    : 1;
  
  // Phase 2: Rotate
  const phase2Rotation = frame >= PHASE_2_START && frame < PHASE_2_END
    ? interpolate(frame - PHASE_2_START, [0, 100], [0, 360])
    : 0;
  
  // Phase 3: Fade out
  const phase3Opacity = frame >= PHASE_3_START
    ? interpolate(frame - PHASE_3_START, [0, 100], [1, 0], { extrapolateRight: 'clamp' })
    : 1;
  
  return (
    <div style={{
      transform: `scale(${phase1Scale}) rotate(${phase2Rotation}deg)`,
      opacity: phase3Opacity,
    }}>
      Multi-Phase Element
    </div>
  );
};
```

### Cleaner Phase Abstraction

```tsx
type Phase = 'idle' | 'enter' | 'active' | 'exit';

const getPhase = (frame: number, ranges: Record<Phase, [number, number]>): Phase => {
  if (frame < ranges.idle[1]) return 'idle';
  if (frame < ranges.enter[1]) return 'enter';
  if (frame < ranges.active[1]) return 'active';
  return 'exit';
};

export const CleanPhases = () => {
  const frame = useCurrentFrame();
  
  const ranges: Record<Phase, [number, number]> = {
    idle: [0, 20],
    enter: [20, 80],
    active: [80, 200],
    exit: [200, 250],
  };
  
  const phase = getPhase(frame, ranges);
  
  let transform = 'scale(1)';
  let opacity = 1;
  
  switch (phase) {
    case 'idle':
      break;
    case 'enter':
      transform = `scale(${interpolate(frame - 20, [0, 60], [0, 1])})`;
      break;
    case 'active':
      transform = 'scale(1)';
      break;
    case 'exit':
      opacity = interpolate(frame - 200, [0, 50], [1, 0]);
      break;
  }
  
  return <div style={{ transform, opacity }}>Content</div>;
};
```

---

## 3. Orchestrating Multiple Elements

### Staggered Entrance

```tsx
export const StaggeredEntrance = () => {
  const frame = useCurrentFrame();
  
  const elements = ['A', 'B', 'C', 'D'];
  const STAGGER_DELAY = 20; // frames between each element
  
  return (
    <div style={{ display: 'flex', gap: 20 }}>
      {elements.map((label, i) => {
        const delay = i * STAGGER_DELAY;
        const opacity = interpolate(frame - delay, [0, 30], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        
        const translateY = interpolate(frame - delay, [0, 30], [50, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        
        return (
          <div
            key={label}
            style={{
              opacity,
              transform: `translateY(${translateY}px)`,
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};
```

### Sequential Animations

```tsx
export const Sequential = () => {
  const frame = useCurrentFrame();
  
  // Element 1: Frames 0-100
  const el1Opacity = interpolate(frame, [0, 50, 100, 150], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  // Element 2: Frames 100-200
  const el2Opacity = interpolate(frame, [100, 150, 200, 250], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  // Element 3: Frames 200-300
  const el3Opacity = interpolate(frame, [200, 250, 300, 350], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  return (
    <>
      <div style={{ opacity: el1Opacity }}>Scene 1</div>
      <div style={{ opacity: el2Opacity }}>Scene 2</div>
      <div style={{ opacity: el3Opacity }}>Scene 3</div>
    </>
  );
};
```

---

## 4. Spring-Based Multi-Phase

### Spring Entrance & Exit

```tsx
export const SpringPhases = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  
  // Entrance: spring in first 60 frames
  const entrance = spring({
    frame,
    fps,
    durationInFrames: 60,
  });
  
  // Exit: spring out last 60 frames
  const exit = spring({
    frame,
    fps,
    durationInFrames: 60,
    delay: durationInFrames - 60,
    reverse: true,
  });
  
  // Combined effect: scales in, stays visible, scales out
  const scale = entrance - exit;
  
  return (
    <div style={{ transform: `scale(${Math.max(0, scale)})` }}>
      Spring In/Out Element
    </div>
  );
};
```

### Chained Springs

```tsx
export const ChainedSprings = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // First spring: 0-40 frames
  const spring1 = spring({
    frame,
    fps,
    durationInFrames: 40,
  });
  
  // Second spring: 40-80 frames
  const spring2 = spring({
    frame,
    fps,
    durationInFrames: 40,
    delay: 40,
  });
  
  // Third spring: 80-120 frames
  const spring3 = spring({
    frame,
    fps,
    durationInFrames: 40,
    delay: 80,
  });
  
  const rotation = 
    interpolate(spring1, [0, 1], [0, 120]) +
    interpolate(spring2, [0, 1], [0, 120]) +
    interpolate(spring3, [0, 1], [0, 120]);
  
  return (
    <div style={{ transform: `rotate(${rotation}deg)` }}>
      ↻
    </div>
  );
};
```

---

## 5. Practical Example: Loading Spinner

```tsx
export const LoadingSpinner = () => {
  const frame = useCurrentFrame();
  
  // Continuously rotating spinner
  const rotation = interpolate(frame, [0, 120], [0, 360], {
    extrapolateRight: 'wrap',
  });
  
  // Pulsing opacity
  const pulse = Math.sin((frame / 30) * Math.PI) * 0.5 + 0.5; // 0-1 oscillation
  
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}
    >
      <div
        style={{
          transform: `rotate(${rotation}deg)`,
          opacity: pulse,
          fontSize: 100,
        }}
      >
        ◐
      </div>
    </AbsoluteFill>
  );
};
```

---

## 6. Complex Timeline Orchestration

```tsx
export const ComplexTimeline = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  
  // Define timeline segments
  const timeline = {
    intro: { start: 0, duration: 60 },
    main: { start: 60, duration: 200 },
    transition: { start: 260, duration: 40 },
  };
  
  const isInSegment = (segment: keyof typeof timeline) => {
    const s = timeline[segment];
    return frame >= s.start && frame < s.start + s.duration;
  };
  
  const getSegmentProgress = (segment: keyof typeof timeline) => {
    const s = timeline[segment];
    return Math.max(0, Math.min(1, (frame - s.start) / s.duration));
  };
  
  // Build effects based on timeline
  let effects = { opacity: 1, scale: 1, rotation: 0 };
  
  if (isInSegment('intro')) {
    const progress = getSegmentProgress('intro');
    effects.opacity = progress;
    effects.scale = interpolate(progress, [0, 1], [0.5, 1]);
  }
  
  if (isInSegment('main')) {
    const progress = getSegmentProgress('main');
    effects.rotation = progress * 360;
  }
  
  if (isInSegment('transition')) {
    const progress = getSegmentProgress('transition');
    effects.opacity = 1 - progress;
    effects.scale = interpolate(progress, [0, 1], [1, 2]);
  }
  
  return (
    <div
      style={{
        transform: `scale(${effects.scale}) rotate(${effects.rotation}deg)`,
        opacity: effects.opacity,
      }}
    >
      Complex Timeline Element
    </div>
  );
};
```

