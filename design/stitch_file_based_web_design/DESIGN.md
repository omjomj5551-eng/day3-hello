# Design System Strategy: The Ethereal Curator

## 1. Overview & Creative North Star
This design system is built upon the "Creative North Star" of **The Ethereal Curator**. In the world of AI art, the interface must not compete with the machine's imagination; it must provide a silent, prestigious stage for it. 

We break the "template" look by moving away from rigid, boxed grids in favor of **Intentional Asymmetry**. By utilizing expansive white space (or "dark space") and overlapping elements, we create a sense of depth that feels like a physical high-end gallery. This system is designed to feel less like a website and more like a limited-edition digital monograph.

## 2. Colors
Our palette is a study of the midnight sky—deep, infinite, and punctuated by pulses of electric energy.

*   **Primary (`#cabeff` / `primary`):** A soft, luminous violet that acts as a beacon. Use this for high-intent actions and to draw the eye through the "mysterious" void.
*   **Surface Hierarchy & Nesting:** We define space through **Tonal Layering** rather than lines. 
    *   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. To separate content, use background shifts: place a `surface-container-low` (`#1a1c20`) card on top of a `surface-dim` (`#111317`) background.
    *   **Nesting:** Depth is created by stacking tiers. An inner module should always be one step higher or lower in the `surface-container` scale (Lowest to Highest) than its parent to create a "nested" physical presence.
*   **The "Glass & Gradient" Rule:** To avoid a flat, "out-of-the-box" look, floating navigation or modal elements must use **Glassmorphism**. Combine `surface-container` colors at 60-80% opacity with a `20px` backdrop-blur.
*   **Signature Textures:** For primary CTAs, use a subtle linear gradient from `primary` (`#cabeff`) to `primary-container` (`#947dff`) at a 135-degree angle. This adds a "soulful" shimmer that flat color lacks.

## 3. Typography
The typography system pairs the geometric authority of **Manrope** with the clinical precision of **Inter**.

*   **Display & Headlines (Manrope):** These are your "Editorial Voices." Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero statements. The intentional weight of Manrope creates a premium, "Art House" feel.
*   **Titles & Body (Inter):** Inter is the "Functional Voice." It provides maximum readability for art descriptions and pricing.
*   **Hierarchy as Identity:** Use a dramatic scale contrast. Pair a massive `display-md` headline with a tiny, all-caps `label-md` sub-header. This "High-Low" contrast is a hallmark of premium fashion and art direction.

## 4. Elevation & Depth
In this system, light doesn't come from above; it glows from within the art.

*   **The Layering Principle:** Avoid traditional shadows. Instead, use the `surface-container` tokens to "lift" elements. A `surface-container-highest` (`#333539`) element will naturally feel closer to the user than `surface-dim`.
*   **Ambient Shadows:** When a floating effect is non-negotiable (e.g., a "Buy" modal), use an ultra-diffused shadow: `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4)`. The shadow should feel like a soft bloom, not a hard edge.
*   **The "Ghost Border" Fallback:** If accessibility requires a container edge, use the `outline-variant` token at **15% opacity**. This creates a "Ghost Border"—a suggestion of a boundary that doesn't break the visual flow.
*   **Glassmorphism:** Use semi-transparent layers for the header and floating action buttons to allow the colors of the AI artwork to bleed through, making the UI feel integrated with the art.

## 5. Components

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary-container`), `xl` (0.75rem) roundedness. No border. Text is `on-primary-fixed` (deep violet).
*   **Secondary:** Ghost style. No fill, `outline-variant` Ghost Border (20% opacity). Text is `primary`.
*   **Tertiary:** Text only, `label-md` style with a 2px underline that expands on hover.

### Cards (Artwork Display)
*   **Rule:** Forbid all divider lines.
*   **Structure:** Use `surface-container-low` for the card base. The image should be flush to the top. Use `spacing-scale-lg` for padding between the artwork and the title to allow the "art to breathe."
*   **Interaction:** On hover, the `surface-container-low` should transition to `surface-container-high` with a subtle `2%` scale increase.

### Chips (Art Tags/Categories)
*   **Style:** `full` (9999px) roundedness. 
*   **Color:** `surface-container-highest` background with `on-surface-variant` text. This keeps tags secondary to the artwork.

### Input Fields
*   **Style:** Minimalist underline style or a very subtle `surface-container-lowest` fill.
*   **Active State:** The underline transitions from `outline-variant` to a `primary` glow. Helper text uses `body-sm`.

### Special Component: The "Luminous Frame"
For featured AI masterpieces, create a container with a `surface-bright` background and a `primary` outer glow (blur: 60px, opacity: 10%). This makes the artwork appear as if it is emitting light.

## 6. Do's and Don'ts

### Do's
*   **Do** use asymmetrical margins. A layout that is slightly "off-center" feels curated and intentional, not generated.
*   **Do** prioritize the image aspect ratio. Never crop the AI art to fit a standard square; let the container adapt to the art.
*   **Do** use `primary-fixed-dim` for subtle accents in long-form text to maintain brand resonance.

### Don'ts
*   **Don't** use 100% white (#FFFFFF) for body text. Use `on-surface-variant` (`#c9c4d8`) to reduce eye strain and maintain the "mysterious" atmosphere.
*   **Don't** use standard "drop shadows" with grey or black. If a shadow is needed, tint it with a hint of the `primary` hue.
*   **Don't** crowd the interface. If you think there is enough whitespace, add 24px more. Minimalism is our strongest tool for luxury.