---
name: planifying-ui
description: Framework for strategizing UI work with Atomic Design inside the SCREAMING architecture.
version: 1.0.0
license: MIT
---

# Planifying UI with SCREAMING + Atomic Design

## Mission
SCREAMING architecture keeps every feature (route, flow, module) at the center of the workspace, while Atomic Design keeps the UI systematic and testable. Map each route under `src/app/` to a feature lane, then build the atoms beneath `src/components/` and `src/theme/` before composing molecules, organisms, templates, and pages for that feature.

## Directory Alignment
- `app/` (route roots) is the feature map. Each route, stack, or shell defines the screen that needs organisms/templates. Keep route-specific logic inside `app/` and refer back to atoms/molecules via scoped imports (use path aliases if configured).
- `components/` contains the Atomic components. Atoms live as isolated files (Button, Text, Avatar, etc.), molecules combine them (e.g., `ListItem` + `Badge`), and any organisms sit here too once they serve multiple templates.
- `theme/` and `styles/` hold tokens (`colors`, `spacing`, `fonts`, `border`, `shadow`, `opcacity`). Update tokens before styling components so every atom inherits system values.
- `hooks/`, `services/`, `stores/`, and `constants/` provide the data glue for organisms/templates; document how each UI block consumes them.

## Plan Steps
1. **Atomic Creation (Start Here):**
   - **Check for existing Atoms:** Before creating anything new, search `src/components/` for existing atoms that match or can be refactored to support the new requirement. Prioritize reuse over duplication.
   - Audit required atoms by tracing each route in `app/`. List every typography variant, icon weight, input state, badge, chip, or spinner that appears in mocks.
   - Update `theme/` tokens first so atoms have consistent colors, spacing, and border radii.
   - Build (or refactor) the smallest components under `src/components/` (e.g., `Button`, `Text`, `Badge`, `Icon`). Add stories/tests per existing conventions and note props/state in documentation.

2. **Molecule Blueprinting:**
   - Combine atoms into reusable molecules like form rows, search chips, or an avatar-with-badge marker. Document expected props, keyboard/focus behavior, and disabled/loading states.
   - Place molecules adjacent to atoms inside `src/components/` and reference them in route-level planning sheets so templates know what to consume.

3. **Organism Composition:**
   - Group molecules into organisms that represent larger sections (e.g., card lists, headers, feed items). Sketch data inputs (`services/http.ts`) and triggers (`stores`, `hooks/useUpdates`).
   - Annotate responsive behaviors (gap systems from `theme/spacing`, fallback states if data is missing) and mention any animations considered.

4. **Template & Page Assembly:**
   - For each route in `app/`, slot organisms into templates. Define layout rules (ScrollView usage, gap/padding) and capture placeholder/error/empty states.
   - Confirm navigation context (stack, tabs) matches the `app/_layout.tsx` hierarchy and keep modal/sheet presentations aligned with route options.

5. **Validation & Feedback:**
   - After each slice, prototype the flow in storybook (if available) or in-screen snapshots. Share with stakeholders for visual/interaction sign-off.
   - Keep a checklist per page that includes content accuracy, accessibility (selectable text, semantic groups), and localization readiness.

## Output Expectations
- Document the mapping between each feature (app route) and the atoms/molecules/organisms it consumes.
- Maintain a component registry inside `components/` that lists the purpose, props, and downstream consumers.
- Track unresolved dependencies (fonts, data) so UI work can start without blocking API completion.
- Capture tests/stories for every atom and molecule so regressions are caught early.

## Follow-up
Revisit the plan when routes evolve or new features are added. SCREAMING keeps features isolated, so adjusting one lane should not ripple through unrelated atoms—update the atomic inventory and documentation as you go.