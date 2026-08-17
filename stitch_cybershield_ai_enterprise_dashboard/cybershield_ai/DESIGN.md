---
name: CyberShield AI
colors:
  surface: '#0e1417'
  surface-dim: '#0e1417'
  surface-bright: '#333a3d'
  surface-container-lowest: '#090f12'
  surface-container-low: '#161d1f'
  surface-container: '#1a2123'
  surface-container-high: '#242b2e'
  surface-container-highest: '#2f3639'
  on-surface: '#dde3e7'
  on-surface-variant: '#bbc9cf'
  inverse-surface: '#dde3e7'
  inverse-on-surface: '#2b3134'
  outline: '#859399'
  outline-variant: '#3c494e'
  surface-tint: '#4cd6ff'
  primary: '#a4e6ff'
  on-primary: '#003543'
  primary-container: '#00d1ff'
  on-primary-container: '#00566a'
  inverse-primary: '#00677f'
  secondary: '#bcc7de'
  on-secondary: '#263143'
  secondary-container: '#3e495d'
  on-secondary-container: '#aeb9d0'
  tertiary: '#ffd59c'
  on-tertiary: '#442b00'
  tertiary-container: '#feb127'
  on-tertiary-container: '#6b4700'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#b7eaff'
  primary-fixed-dim: '#4cd6ff'
  on-primary-fixed: '#001f28'
  on-primary-fixed-variant: '#004e60'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#ffddb1'
  tertiary-fixed-dim: '#ffba49'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#624000'
  background: '#0e1417'
  on-background: '#dde3e7'
  surface-variant: '#2f3639'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-data:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin: 24px
---

## Brand & Style
The design system is engineered for high-stakes enterprise cybersecurity environments. The brand personality is authoritative, vigilant, and analytical, prioritizing rapid information processing over decorative flair. 

The aesthetic follows a **Corporate / Modern** approach with a focus on data density and clarity. It avoids "hacker" tropes in favor of a refined, professional Security Operations Center (SOC) interface. The visual language uses deep charcoal surfaces, precision-engineered spacing, and a strict color hierarchy to ensure that critical security threats are immediately visible against a calm, controlled background.

## Colors
The palette is built on a "Dark Mode First" philosophy to reduce eye strain during long monitoring shifts.

- **Primary Canvas:** The deepest tone (#0A0E14) is used for the application background, while the surface color (#121820) identifies elevated containers and cards.
- **Accents:** Cyan (#00D1FF) is reserved exclusively for primary interactive elements and active states. 
- **Semantic Colors:** Emerald, Amber, and Red are strictly mapped to system health and threat levels. These must maintain high contrast against the dark background.
- **Borders:** A consistent, low-contrast slate (#1E293B) is used to define boundaries without adding visual noise.

## Typography
This design system utilizes **Inter** for its exceptional legibility in data-heavy interfaces. A secondary monospace font, **JetBrains Mono**, is introduced specifically for log files, IP addresses, and hash values to ensure character distinction.

- **Scale:** Headlines are kept compact to maximize vertical space for data. 
- **Weights:** Use Medium (500) for UI labels and Semi-Bold (600) for section headers.
- **Readability:** Body text uses a slightly increased line height (1.4-1.5x) to ensure long strings of technical data remain scannable.

## Layout & Spacing
The layout employs a **Structured Grid System** designed for complex dashboards.

- **Grid Model:** Use a 12-column fluid grid for main content areas.
- **Sidebar:** A fixed-width (240px) collapsible sidebar resides on the left. When collapsed, it reduces to 64px, showing only icons.
- **Density:** The system defaults to "High Density." Use 8px (sm) for internal component spacing and 16px (md) for spacing between layout modules.
- **Responsive:** On tablet devices, the sidebar remains collapsed by default. On mobile, the grid collapses to a single column, and complex tables transition to stacked card views.

## Elevation & Depth
In this design system, depth is communicated through **Tonal Layers** and **Flat Outlines** rather than traditional shadows.

- **Level 0 (Base):** Deepest background (#0A0E14). Used for the main app shell.
- **Level 1 (Surface):** Secondary background (#121820). Used for cards, tables, and the sidebar.
- **Borders:** All Level 1 elements must have a 1px solid border (#1E293B). 
- **Hover States:** Elements should lift visually by slightly lightening their background fill or changing the border color to a lighter slate, rather than using heavy shadows.

## Shapes
The shape language is professional and contained. 

- **Containers:** Cards and primary UI panels use a `rounded-lg` (16px) or `rounded-md` (8px) radius to soften the technical interface without appearing "playful."
- **Small Elements:** Buttons and input fields use a consistent 8px radius.
- **Status Pills:** Badges for risk levels (Low, Medium, High) use a full pill-shape (999px) to distinguish them from interactive buttons.

## Components
This design system's components are optimized for speed of thought and clarity of action.

- **Sidebar:** Uses a semi-transparent hover state. Active links are indicated by a cyan vertical bar on the left edge and a subtle cyan tint on the icon.
- **Cards:** Standardized containers with a mandatory header row. Headers include a title (Left) and optional actions or timestamps (Right).
- **Tables:** Stripped-back design. No vertical dividers; use subtle horizontal lines (#1E293B). The header row uses `label-md` typography with a darker background.
- **Status Badges:** Use a "Soft Fill" style—low-opacity background of the semantic color with a high-opacity text color (e.g., Critical uses 10% Red fill with 100% Red text).
- **Buttons:**
    - **Primary:** Solid Cyan (#00D1FF) with black text.
    - **Ghost:** Transparent fill with 1px Slate border and White text.
    - **Destructive:** Solid Red for "Isolate Host" or "Delete" actions.
- **Input Fields:** Dark background (#0A0E14) with a 1px border. Focus state triggers a 1px Cyan border glow.