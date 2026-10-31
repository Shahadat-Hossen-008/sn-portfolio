# Color system

The site uses a warm limestone and deep forest palette. The default page theme
is light; forest sections opt into the inverted semantic tokens.

## Palette

| Token | Value | Intended role |
| --- | --- | --- |
| `limestone` | `#E2DBC9` | Primary light background and text on forest |
| `forest` | `#052F21` | Primary dark background and text on limestone |
| `soft-limestone` | `#EBE6D8` | Secondary light surface |
| `soft-forest` | `#0B3D2E` | Secondary dark surface |
| `muted-forest` | `#315143` | Secondary text on limestone surfaces |
| `muted-sage` | `#B6B9A7` | Secondary text on forest surfaces |
| `limestone-border` | `#5D7464` | Borders on light surfaces |
| `forest-border` | `#748575` | Borders on dark surfaces |
| `mint` | `#5EEAA8` | Restrained accents on dark surfaces |
| `lime` | `#B6F09C` | Optional secondary accent on dark surfaces |

## Semantic tokens

`background`, `foreground`, `surface`, `surface-foreground`, `muted`,
`muted-foreground`, `border`, `primary`, `primary-foreground`, `accent`,
`accent-foreground`, and `focus-ring` describe the default light theme. The
`data-surface="forest"` scope redefines these same tokens for forest surfaces.
Use muted forest on limestone and muted sage on forest surfaces.

On light surfaces, `primary` resolves to forest. In forest scopes, `primary`
resolves to mint and `accent` to lime. Reserve mint and lime for forest surfaces
or decorative backgrounds behind forest text.

## Contrast notes

Verified text pairs from the palette:

| Foreground on background | Contrast |
| --- | ---: |
| Forest on limestone | 10.60:1 |
| Muted forest on limestone | 6.37:1 |
| Muted forest on soft limestone | 7.05:1 |
| Muted sage on forest | 7.31:1 |
| Muted sage on soft forest | 6.09:1 |
| Mint on forest | 9.62:1 |
| Lime on forest | 11.10:1 |

These pairs exceed WCAG AA normal-text contrast. The figures apply to the solid
colors listed; opacity modifiers, gradients, images, overlays, font size, and
the final rendered context can change contrast. Check controls, borders, and
focus indicators separately. Palette calculations alone do not establish full
accessibility compliance.

## Hero foundation

- Display type uses Fraunces, UI and body type use Urbanist, and code uses
  JetBrains Mono.
- Use at most one italic phrase in a heading.
- Mint and lime belong on forest surfaces, or in decorative backgrounds behind
  forest text such as the highlight swipe.
- Keep mint glow at or below 12%; do not place muted text where glow exceeds
  12%.
- Gradients are decoration only; do not use gradient text.

## Hero foundation

- Display type uses Fraunces, UI and body type use Urbanist, and code uses
  JetBrains Mono.
- Use at most one italic phrase in a heading.
- Mint and lime belong on forest surfaces. They may also appear as a decorative
  background behind forest text, such as a highlight swipe.
- Keep mint glow at or below 12%. Do not place muted text where a glow exceeds
  12%.
- Gradients are decorative; do not use gradient text.
