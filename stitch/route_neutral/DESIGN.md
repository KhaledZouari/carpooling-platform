# Design System Document: The Utilitarian Precision Framework

## 1. Overview & Creative North Star
### The Creative North Star: "The Architectural Blueprint"
This design system moves beyond the generic "SaaS" look by embracing a philosophy of **Architectural Blueprinting**. It treats the carpooling experience as a high-stakes logistics platform where clarity is the ultimate luxury. Instead of relying on decorative flourishes, we use spatial precision, rhythmic alignment, and tonal shifts to create a sense of trust and reliability.

We break the "template" look through **Intentional Asymmetry** and **Tonal Depth**. By avoiding traditional borders and using a strict "No-Line" rule, the interface feels less like a series of boxes and more like a singular, cohesive workspace. It is a system designed for a mobile-first world where the thumb-flow and cognitive load are prioritized over visual noise.

---

## 2. Colors
Our palette is rooted in a "cool-neutral" spectrum, designed to feel clinical yet approachable. The accent blue is used surgically to guide the eye toward action.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using `1px solid` borders for sectioning or grouping. Boundaries must be defined solely through background color shifts. 
*   **Example:** A `surface-container-low` section sitting on a `surface` background.
*   **Rationale:** Lines create visual "stutter." Tonal shifts create "flow."

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the `surface-container` tiers to define hierarchy:
*   **Base Layer:** `surface` (#f7f9fb)
*   **Sub-Section:** `surface-container-low` (#f0f4f7)
*   **Primary Card:** `surface-container-lowest` (#ffffff)
*   **Interactive Modal/Float:** `surface-container-highest` (#d9e4ea)

### Glass & Gradient (The Premium Polish)
To ensure the "Utilitarian" vibe doesn't feel "Cheap," we use **Glassmorphism** for floating elements (like bottom navigation bars or sticky headers).
*   **Token Usage:** `surface` color at 80% opacity + `backdrop-blur-md`.
*   **Signature Textures:** For the main CTA (e.g., "Book a Ride"), use a subtle vertical gradient from `primary` (#005ac2) to `primary_dim` (#004fab). This creates a "machined" feel rather than a flat, digital one.

---

## 3. Typography
We utilize **Inter** across all scales to maintain a utilitarian, Swiss-inspired aesthetic. The secret to our editorial look is the "Tight-Wide" contrast: Headlines use tight letter-spacing, while Labels use slightly wider tracking for readability.

*   **Display/Headline:** Use `headline-md` (#2a3439) for destination headers. The high contrast against the neutral background conveys authority.
*   **Body:** `body-md` is the workhorse. Always use `on_surface_variant` (#566166) for secondary info (like car models) to keep the visual hierarchy clear.
*   **Labels:** `label-md` in uppercase is reserved for status indicators (e.g., "CONFIRMED").

---

## 4. Elevation & Depth
In this system, depth is a function of light and layering, not "drop shadows."

*   **The Layering Principle:** Depth is achieved by "stacking." Place a `surface-container-lowest` card on top of a `surface-container-low` background. This creates a natural "lift" that feels tactile.
*   **Ambient Shadows:** If an element must float (e.g., a "New Trip" FAB), use a shadow tinted with the `on_surface` color: `shadow-[0px_8px_24px_rgba(42,52,57,0.06)]`. It should feel like a soft glow of light, not a dark smudge.
*   **The "Ghost Border" Fallback:** If accessibility requires a border (e.g., input fields), use `outline_variant` (#a9b4b9) at **20% opacity**. Never use 100% opacity borders.
*   **Glassmorphism:** Use `bg-surface/80 backdrop-blur-xl` for overlays to allow the underlying ride-card data to softly bleed through, maintaining the user's context.

---

## 5. Components

### Buttons
*   **Primary:** `bg-primary` text-`on_primary`. Rounded `md` (0.375rem). No shadow.
*   **Secondary:** `bg-secondary_container` text-`on_secondary_container`. Use for "Message Driver."
*   **Tertiary:** Transparent background, `primary` text. Used for "View Details."

### Cards & Lists (The Core of Covoiturage)
*   **The Rule:** No divider lines between list items. Use `mb-4` (1rem) spacing and alternating `surface-container-low` backgrounds to separate ride search results.
*   **Layout:** Use asymmetrical padding—more horizontal padding (`px-6`) than vertical (`py-4`) to create an expansive, high-end editorial feel.

### Input Fields
*   **Style:** Minimalist. No background. Only a bottom "Ghost Border" (`outline_variant` at 20%). On focus, the border transitions to `primary` (#005ac2) with a height increase to 2px.

### Specialized Component: The "Trip Micro-Map"
A small, non-interactive map preview container using `surface-dim` (#cfdce3) as a placeholder, with `primary` and `secondary` color tokens used for the route line and markers. This component should always use `rounded-xl` to stand out from the `rounded-md` standard components.

---

## 6. Do's and Don'ts

### Do
*   **Do** use `surface-container-highest` for "Active" states in navigation.
*   **Do** prioritize vertical white space over lines. If in doubt, add more `gap-y-4`.
*   **Do** use `error` (#9f403d) sparingly for critical alerts (e.g., "Ride Cancelled").

### Don't
*   **Don't** use `black` (#000000) for text. Use `on_surface` (#2a3439) to maintain a premium, soft-contrast look.
*   **Don't** use standard Tailwind shadows (`shadow-md`). They are too "heavy" for this utilitarian system.
*   **Don't** use cards with 100% white backgrounds on a 100% white page. Always ensure a 1-tier tonal shift between the background and the container.

---

## 7. Implementation (Tailwind React Snippet)