# Design System Specification: The Nocturnal Interface

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Curator."** 

Moving away from the standard "utility-first" dark mode, this system treats the interface as a premium, curated gallery space. It avoids the cluttered, rigid grids of traditional login screens in favor of intentional negative space and high-contrast editorial hierarchy. We break the "template" look by utilizing deep tonal layering and subtle glassmorphism, ensuring that the interface feels like a bespoke digital object rather than a generic web form. The goal is to provide a sense of atmospheric depth where the user isn't just "logging in," but entering a secure, high-end environment.

---

## 2. Colors & Surface Philosophy
The palette is built on a foundation of deep, ink-like tones contrasted against electric, vibrant purples.

### The Color Palette
*   **Background:** `#0c0d18` (The primary void)
*   **Primary:** `#afa2ff` (Vibrant accent for CTA and focus)
*   **Secondary/Surface Container:** `#171926` to `#232534` (The interactive layers)
*   **On-Surface/Text:** `#eeecfc` (High-contrast readability)

### The "No-Line" Rule
To maintain a high-end feel, **do not use 1px solid borders for sectioning.** Traditional lines create visual noise. Instead, define boundaries through background color shifts. For example, a login card should not have a stroke; it should be defined by its transition from `surface` (`#0c0d18`) to `surface-container-high` (`#1d1f2d`).

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
*   **Level 0 (Foundation):** `surface` (`#0c0d18`)
*   **Level 1 (Card/Container):** `surface-container` (`#171926`)
*   **Level 2 (Inputs/In-card elements):** `surface-container-highest` (`#232534`)

### The "Glass & Gradient" Rule
For main login containers, use **Glassmorphism**. Apply a background blur (12px–20px) to a semi-transparent `surface-variant` to allow the background's depth to bleed through. For primary buttons, utilize a subtle linear gradient from `primary` (`#afa2ff`) to `primary-dim` (`#7459f7`) at a 135-degree angle to provide a "liquid" premium feel.

---

## 3. Typography
We utilize **Inter** as our primary typeface, chosen for its architectural precision and legibility in dark environments.

*   **Display (Display-LG/MD):** Use for large, atmospheric brand statements. High tracking (letter-spacing: -0.02em) for a modern, compressed feel.
*   **Headlines (Headline-SM):** Set in `on-surface`. This is your primary "Welcome" text.
*   **Body (Body-MD/LG):** Set in `on-surface-variant` for secondary info to create hierarchy through color rather than just size.
*   **Labels (Label-MD):** Bold and uppercase for input titles, using `primary` to guide the eye toward interaction points.

The hierarchy is designed to be **Editorial**: Use large size differences between headlines and body text to create a clear "Entry Point" for the user's eyes.

---

## 4. Elevation & Depth
In this design system, depth is a product of light and opacity, not just shadows.

*   **The Layering Principle:** Achieve lift by stacking. Place a `surface-container-highest` button inside a `surface-container` card. The natural shift in luminosity creates 3D depth without clutter.
*   **Ambient Shadows:** If a card must float, use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4)`. The shadow must never be "pure black" but rather a deeper tint of the background color.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use the `outline-variant` (`#464753`) at **15% opacity**. It should be felt, not seen.
*   **Interaction Glow:** When an input is focused, instead of a heavy border, use a subtle outer glow (2px blur) using the `primary` color to simulate an emitting light source.

---

## 5. Components

### Buttons
*   **Primary:** Gradient of `primary` to `primary-dim`. Corner radius: `md` (0.75rem). No border. Text color: `on-primary` (`#2c0097`).
*   **Secondary:** Ghost style. No background fill. `Ghost Border` (15% opacity) and `on-surface` text.

### Input Fields
*   **Background:** `surface-container-highest` (`#232534`).
*   **Shape:** `sm` (0.25rem) for a more technical, professional feel compared to the softer card corners.
*   **States:** On focus, the background should shift to `surface-bright` (`#292b3c`) with a `primary` 1px ghost border.

### Cards & Lists
*   **Constraint:** Forbid divider lines.
*   **Separation:** Use **Vertical White Space** (24px–32px) to separate the login form from the "Forgot Password" or "Social Sign-in" sections.
*   **The "Vignette" Effect:** The login card should have a very subtle inner glow (inset shadow) to make the edges feel soft and integrated with the glassmorphism.

### Chips & Tags
*   Use for "Remember Me" or status indicators. Styled with `surface-container-low` and `label-sm` typography to keep them subordinate to the primary action.

---

## 6. Do's and Don'ts

### Do
*   **DO** use varying shades of purple (from `secondary` to `tertiary`) to differentiate between primary actions and supporting links.
*   **DO** lean into "Breathing Room." A login screen should feel calm. Ensure at least 48px of padding inside the main card.
*   **DO** ensure a 4.5:1 contrast ratio for all body text against the dark surfaces.

### Don't
*   **DON'T** use 100% white (#FFFFFF) for text. Use `on-surface` (#eeecfc) to prevent "halo" effects and eye strain on dark backgrounds.
*   **DON'T** use sharp 90-degree corners. Everything must have a minimum radius of `sm` to maintain the "friendly but professional" mandate.
*   **DON'T** use standard grey shadows. Shadows must be "warm" or "cool" depending on the surface color (tinted shadows).
*   **DON'T** clutter the screen with dividers. If you feel the need for a line, use a 12px gap of empty space instead.