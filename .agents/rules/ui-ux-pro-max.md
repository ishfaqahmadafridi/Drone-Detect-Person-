# UI/UX Pro Max Architecture Rules

## Core Principles
1. **Visual Excellence & Wow Factor**: Interfaces must be visually stunning, using curated HSL color schemes, dark-mode-first styling, frosted glass (glassmorphism), and subtle elevation shadows.
2. **Fluid Typography & Spacing**: Use `clamp()`-based fluid typography and 8pt/4pt grid systems. Avoid fixed pixel font sizes for headers and body text.
3. **Micro-Interactions**: Hover, active, focus, and state transitions must have cubic-bezier spring physics (`--ease-out-spring`) and seamless micro-animations.
4. **Atomic Component Structure**: Divide frontend code into Atoms, Molecules, Organisms, Templates, and Pages.
5. **Accessibility (WCAG 2.2 AAA)**: Maintain strict contrast ratios (>= 4.5:1 AA, >= 7:1 AAA), visible keyboard focus rings (`:focus-visible`), and ARIA live regions for streaming drone detection status.
