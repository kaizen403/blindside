# Integrating Remotion with Next.js & React Apps

## 1. Project Structure

### Option A: Separate Remotion Project (Recommended for scalability)

```
my-app/
├── apps/
│   ├── web/              # Next.js frontend
│   │   ├── app/
│   │   ├── components/
│   │   └── package.json
│   └── videos/           # Remotion video app
│       ├── src/
│       │   ├── Root.tsx  # Remotion compositions
│       │   └── compositions/
│       ├── remotion.config.ts
│       └── package.json
└── package.json (monorepo root)
```

### Option B: Remotion Inside Next.js App Dir

```
my-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/
│       └── render/       # API route for rendering
├── remotion/            # Video compositions
│   ├── Root.tsx
│   └── compositions/
├── public/
└── package.json
```

---

## 2. Setup with create-video CLI

### Quickest Start

```bash
# Create Next.js + Remotion project
npx create-video@latest --next

# Or with TailwindCSS
npx create-video@latest --next-tailwind
```

### Manual Setup

```bash
npm install remotion @remotion/cli @remotion/player
npm install -D @types/react @types/node typescript
```

---

## 3. Using Remotion Player in Next.js

Display Remotion videos in your React app without full Remotion Studio:

```tsx
// app/components/VideoPlayer.tsx
'use client';

import { Player } from '@remotion/player';
import { MyComposition } from '@/remotion/compositions/MyComposition';

export const VideoPlayer = () => {
  return (
    <Player
      component={MyComposition}
      durationInFrames={300}
      compositionWidth={1920}
      compositionHeight={1080}
      fps={30}
      style={{ width: '100%', height: 'auto' }}
      controls
      autoPlay
      loop
    />
  );
};
```

**Player Props:**
- `component` - Remotion composition
- `durationInFrames` - Total frames
- `compositionWidth/Height` - Dimensions
- `fps` - Framerate
- `controls` - Show playback controls
- `autoPlay` - Start playing automatically
- `loop` - Loop playback
- `inFrame/outFrame` - Play specific frame range

---

## 4. Server-Side Rendering

### Using @remotion/renderer in API Route

```tsx
// app/api/render/route.ts
import { render } from '@remotion/renderer';
import { MyComposition } from '@/remotion/compositions/MyComposition';

export const POST = async (request: Request) => {
  const outputLocation = '/tmp/video.mp4';

  try {
    await render({
      composition: MyComposition,
      fps: 30,
      height: 1080,
      width: 1920,
      outputLocation,
      durationInFrames: 300,
    });

    return new Response(
      JSON.stringify({ status: 'success', outputLocation }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500 }
    );
  }
};
```

### Next.js Config for @remotion/renderer

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['@remotion/renderer'],
};

module.exports = nextConfig;
```

---

## 5. Passing Props to Compositions

### Define Schema and Types

```tsx
// remotion/compositions/MyComposition.tsx
import { z } from 'zod';

const myCompositionSchema = z.object({
  title: z.string(),
  color: z.string(),
  duration: z.number().min(1).max(600),
});

type MyCompositionProps = z.infer<typeof myCompositionSchema>;

export const MyComposition: React.FC<MyCompositionProps> = ({
  title,
  color,
  duration,
}) => {
  // ... component
};

export const myCompositionDefaultProps: MyCompositionProps = {
  title: 'Hello World',
  color: '#ffffff',
  duration: 60,
};
```

### Register with Schema

```tsx
// remotion/Root.tsx
<Composition
  id="MyComposition"
  component={MyComposition}
  defaultProps={myCompositionDefaultProps}
  schema={myCompositionSchema}
  durationInFrames={300}
  fps={30}
  width={1920}
  height={1080}
/>
```

### Pass Props from Next.js

```tsx
// app/components/VideoGenerator.tsx
'use client';

import { Player } from '@remotion/player';
import { MyComposition } from '@/remotion/compositions/MyComposition';
import { useState } from 'react';

export const VideoGenerator = () => {
  const [props, setProps] = useState({
    title: 'Custom Title',
    color: '#ff0000',
    duration: 120,
  });

  return (
    <>
      <input
        value={props.title}
        onChange={(e) => setProps({ ...props, title: e.target.value })}
        placeholder="Enter title"
      />
      
      <Player
        component={MyComposition}
        inputProps={props}
        durationInFrames={300}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={30}
      />
    </>
  );
};
```

---

## 6. Development Workflow

### Running Both Simultaneously

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:web\" \"npm run dev:remotion\"",
    "dev:web": "next dev",
    "dev:remotion": "remotion preview",
    "build:remotion": "remotion render",
    "render": "remotion render src/Root.tsx"
  }
}
```

### Directory Layout for Shared Code

```
my-app/
├── lib/
│   ├── animations/      # Shared animation utilities
│   ├── utils/          # Shared utilities
│   └── types.ts        # Shared types
├── app/                # Next.js app
├── remotion/
│   ├── Root.tsx
│   └── compositions/
└── package.json
```

---

## 7. Lambda Rendering (Scale Rendering)

### Setup Remotion Lambda

```bash
npx remotion lambda regions
npx remotion lambda sites create
npx remotion lambda functions deploy
```

### Render Videos on Lambda from API

```tsx
// app/api/render-video/route.ts
import { renderMediaOnLambda } from '@remotion/lambda';

export const POST = async (request: Request) => {
  const { title, duration } = await request.json();

  const { renderId } = await renderMediaOnLambda({
    region: 'us-east-1',
    functionName: 'remotion-render',
    composition: 'MyComposition',
    inputProps: {
      title,
      duration,
    },
    codec: 'h264',
    crf: 18,
    downloadBehavior: {
      type: 'download',
    },
  });

  return Response.json({ renderId });
};
```

---

## 8. Best Practices

### Composition Code Structure

```tsx
// ✅ GOOD: Composition in separate file
// src/remotion/compositions/MyVideo.tsx
export const MyVideo: React.FC<MyVideoProps> = (props) => {
  // composition logic
};

// Use via: <Composition component={MyVideo} ... />

// ❌ AVOID: Complex logic in Root.tsx
// Don't put all logic in src/Root.tsx
```

### Keep Compositions Pure

```tsx
// ✅ GOOD: Pure component, driven by frame
export const MyComp = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  return <div style={{ opacity }}>Text</div>;
};

// ❌ AVOID: State-based animations
// Don't use useState for animation drivers
export const BadComp = () => {
  const [opacity, setOpacity] = useState(0); // ❌ NO
  return <div style={{ opacity }}>Text</div>;
};
```

### Use staticFile() for Assets

```tsx
import { staticFile, AbsoluteFill } from 'remotion';

export const Video = () => {
  return (
    <AbsoluteFill>
      <img src={staticFile('my-image.png')} />
      <audio src={staticFile('audio.mp3')} />
    </AbsoluteFill>
  );
};

// Place files in public/ folder
// my-project/public/my-image.png
```

