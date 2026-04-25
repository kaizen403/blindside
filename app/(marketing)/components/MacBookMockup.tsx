"use client";

function FolderIcon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="0" y="6" width="36" height="26" rx="3" fill="#eab308" opacity="0.85" />
      <rect x="0" y="2" width="20" height="10" rx="2" fill="#ca8a04" opacity="0.9" />
      <text x="18" y="42" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="system-ui">
        files
      </text>
    </g>
  );
}

function RansomwareDialog() {
  return (
    <g transform="translate(175, 100)">
      <defs>
        <filter id="dialogShadow" x="-20" y="-20" width="290" height="240">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.45" />
        </filter>
        <linearGradient id="dialogBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2a2e" />
          <stop offset="100%" stopColor="#1c1c1e" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="250" height="170" rx="10" fill="url(#dialogBg)" filter="url(#dialogShadow)" />
      <rect x="0" y="0" width="250" height="3" rx="10" fill="#dc2626" />
      <rect x="0" y="0" width="250" height="3" rx="1.5" fill="#dc2626" clipPath="inset(0 0 0 0 round 10 10 0 0)" />

      <circle cx="125" cy="32" r="14" fill="#dc2626" opacity="0.15" />
      <circle cx="125" cy="32" r="12" fill="none" stroke="#dc2626" strokeWidth="1.5" />
      <text x="125" y="37" textAnchor="middle" fill="#dc2626" fontSize="16" fontWeight="700" fontFamily="system-ui">
        !
      </text>

      <text x="125" y="62" textAnchor="middle" fill="#fafafa" fontSize="11" fontWeight="600" fontFamily="system-ui">
        CRITICAL SECURITY ALERT
      </text>

      <text x="125" y="82" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="8" fontFamily="system-ui">
        Your personal files have been encrypted.
      </text>
      <text x="125" y="94" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="8" fontFamily="system-ui">
        Pay 0.5 BTC within 48 hours to recover.
      </text>

      <rect x="55" y="115" width="140" height="28" rx="6" fill="#dc2626" opacity="0.9" />
      <text x="125" y="133" textAnchor="middle" fill="#fafafa" fontSize="9" fontWeight="600" fontFamily="system-ui">
        Decrypt Files
      </text>

      <text x="125" y="155" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="7" fontFamily="ui-monospace, monospace">
        47:59:12 remaining
      </text>
    </g>
  );
}

export default function MacBookMockup() {
  return (
    <div
      className="w-full"
      style={{
        transform: "perspective(1400px) rotateX(10deg) rotateY(-8deg)",
        transformStyle: "preserve-3d",
      }}
    >
      <svg
        viewBox="0 0 620 430"
        className="w-full h-auto"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="deckGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a0a0a0" />
            <stop offset="15%" stopColor="#c0c0c0" />
            <stop offset="50%" stopColor="#d4d4d4" />
            <stop offset="85%" stopColor="#c0c0c0" />
            <stop offset="100%" stopColor="#909090" />
          </linearGradient>

          <linearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8e8e8" />
            <stop offset="30%" stopColor="#d0d0d0" />
            <stop offset="70%" stopColor="#c8c8c8" />
            <stop offset="100%" stopColor="#b0b0b0" />
          </linearGradient>

          <linearGradient id="wallpaperGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="35%" stopColor="#1e1b4b" />
            <stop offset="70%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>

          <linearGradient id="wallpaperShape1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="wallpaperShape2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0891b2" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.05" />
          </linearGradient>

          <linearGradient id="screenGlare" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.06" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="keyboardGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </linearGradient>

          <linearGradient id="trackpadGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a3a3a" />
            <stop offset="50%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </linearGradient>

          <filter id="dropShadow" x="-30" y="-10" width="680" height="500">
            <feDropShadow dx="0" dy="25" stdDeviation="20" floodColor="#000000" floodOpacity="0.55" />
          </filter>

          <filter id="keyShadow">
            <feDropShadow dx="0" dy="1" stdDeviation="0.5" floodColor="#000" floodOpacity="0.5" />
          </filter>

          <clipPath id="screenClip">
            <rect x="65" y="28" width="490" height="306" rx="8" />
          </clipPath>
        </defs>

        {/* Floor shadow */}
        <ellipse cx="310" cy="405" rx="260" ry="18" fill="#000" opacity="0.45" filter="blur(16px)" />
        <ellipse cx="310" cy="402" rx="220" ry="10" fill="#000" opacity="0.3" filter="blur(8px)" />

        {/* Bottom deck (base) */}
        <path
          d="M 70 340 L 550 340 Q 560 340 565 345 L 570 350 L 575 375 Q 577 385 570 390 L 565 392 L 55 392 Q 48 392 45 385 L 50 350 L 55 345 Q 60 340 70 340 Z"
          fill="url(#deckGrad)"
          filter="url(#dropShadow)"
        />

        {/* Deck front edge highlight */}
        <path
          d="M 50 350 L 570 350 L 570 352 L 50 352 Z"
          fill="#e0e0e0"
          opacity="0.4"
        />

        {/* Deck bottom edge shadow */}
        <path
          d="M 45 385 L 575 385 L 570 390 L 55 390 Z"
          fill="#707070"
          opacity="0.5"
        />

        {/* Thumb indent / notch */}
        <path
          d="M 260 340 Q 310 348 360 340 L 360 338 Q 310 346 260 338 Z"
          fill="#909090"
          opacity="0.3"
        />

        {/* Top lid outer shell */}
        <path
          d="M 60 28 L 560 28 Q 570 28 570 38 L 570 340 L 60 340 Q 50 340 50 330 L 50 38 Q 50 28 60 28 Z"
          fill="url(#lidGrad)"
        />

        {/* Lid edge highlight */}
        <path
          d="M 60 28 L 560 28"
          stroke="#ffffff"
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* Lid side edges for 3D depth */}
        <path d="M 50 38 L 50 330" stroke="#b0b0b0" strokeWidth="1" opacity="0.6" />
        <path d="M 570 38 L 570 340" stroke="#a0a0a0" strokeWidth="1" opacity="0.6" />

        {/* Screen bezel */}
        <rect x="55" y="24" width="510" height="314" rx="10" fill="#0a0a0a" />
        <rect x="56" y="25" width="508" height="312" rx="9" fill="#111" />

        {/* Camera / notch area */}
        <rect x="280" y="25" width="60" height="14" rx="7" fill="#0a0a0a" />
        <circle cx="310" cy="32" r="3" fill="#1a1a1a" />
        <circle cx="310" cy="32" r="1.5" fill="#0a3" opacity="0.3" />

        {/* Screen content (clipped) */}
        <g clipPath="url(#screenClip)">
          {/* Wallpaper background */}
          <rect x="65" y="28" width="490" height="306" fill="url(#wallpaperGrad)" />

          {/* Abstract wallpaper shapes */}
          <ellipse cx="180" cy="150" rx="200" ry="160" fill="url(#wallpaperShape1)" opacity="0.7" />
          <ellipse cx="450" cy="220" rx="180" ry="140" fill="url(#wallpaperShape2)" opacity="0.6" />
          <circle cx="350" cy="80" r="120" fill="#4f46e5" opacity="0.08" />
          <circle cx="120" cy="250" r="100" fill="#0891b2" opacity="0.06" />

          {/* Menu bar */}
          <rect x="65" y="28" width="490" height="22" fill="rgba(0,0,0,0.35)" />
          <rect x="65" y="28" width="490" height="1" fill="rgba(255,255,255,0.08)" />

          {/* Apple logo on menu bar */}
          <text x="78" y="42" fill="rgba(255,255,255,0.7)" fontSize="10" fontFamily="system-ui">
            &#63743;
          </text>
          <text x="95" y="42" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="system-ui">
            Finder
          </text>
          <text x="135" y="42" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="system-ui">
            File
          </text>
          <text x="165" y="42" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="system-ui">
            Edit
          </text>
          <text x="195" y="42" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="system-ui">
            View
          </text>

          {/* Menu bar right icons */}
          <text x="500" y="42" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="system-ui">
            12:42 PM
          </text>
          <rect x="480" y="35" width="12" height="7" rx="1" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          <rect x="481" y="38" width="6" height="3" rx="0.5" fill="rgba(255,255,255,0.4)" />
          <circle cx="470" cy="39" r="3" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          <path d="M 468 40 L 470 37 L 472 40" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          <path d="M 454 37 L 460 37 L 457 41 Z" fill="rgba(255,255,255,0.4)" />
          <rect x="450" y="36" width="1.5" height="5" rx="0.5" fill="rgba(255,255,255,0.3)" />

          {/* Desktop folder icons */}
          <FolderIcon x={85} y={70} />
          <FolderIcon x={85} y={120} />
          <FolderIcon x={85} y={170} />
          <FolderIcon x={505} y={70} />
          <FolderIcon x={505} y={120} />

          {/* Ransomware dialog */}
          <RansomwareDialog />
        </g>

        {/* Screen glass reflection / glare */}
        <rect x="65" y="28" width="490" height="306" rx="8" fill="url(#screenGlare)" pointerEvents="none" />
        <rect x="65" y="28" width="490" height="306" rx="8" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

        {/* Hinge line */}
        <rect x="50" y="338" width="520" height="3" rx="1.5" fill="#808080" opacity="0.5" />
        <rect x="50" y="338.5" width="520" height="1" fill="#c0c0c0" opacity="0.3" />

        {/* Keyboard area */}
        <rect x="90" y="348" width="440" height="34" rx="3" fill="url(#keyboardGrad)" />

        {/* Individual keys - row 1 */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => (
            <rect
              key={`k1-${i}`}
              x={95 + i * 29}
              y="350"
              width="26"
              height="13"
              rx="1.5"
              fill="#3a3a3a"
              filter="url(#keyShadow)"
            />
          ))}

        {/* Individual keys - row 2 */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((i) => (
            <rect
              key={`k2-${i}`}
              x={108 + i * 29}
              y="365"
              width="26"
              height="13"
              rx="1.5"
              fill="#3a3a3a"
              filter="url(#keyShadow)"
            />
          ))}

        {/* Trackpad */}
        <rect x="210" y="355" width="200" height="120" rx="8" fill="url(#trackpadGrad)" />
        <rect x="210" y="355" width="200" height="120" rx="8" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

        {/* Trackpad subtle inner border */}
        <rect x="212" y="357" width="196" height="116" rx="6" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />

        {/* Speaker grilles (dots pattern on sides of keyboard) */}
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 6 }).map((_, col) => (
            <circle
              key={`sg-${row}-${col}`}
              cx={72 + col * 2.5}
              cy={352 + row * 3.5}
              r="0.6"
              fill="#555"
              opacity="0.4"
            />
          ))
        )}
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 6 }).map((_, col) => (
            <circle
              key={`sg2-${row}-${col}`}
              cx={538 + col * 2.5}
              cy={352 + row * 3.5}
              r="0.6"
              fill="#555"
              opacity="0.4"
            />
          ))
        )}

        {/* MacBook branding */}
        <text x="310" y="345" textAnchor="middle" fill="rgba(0,0,0,0.15)" fontSize="5" fontFamily="system-ui" letterSpacing="1.5">
          MacBook Pro
        </text>
      </svg>
    </div>
  );
}
