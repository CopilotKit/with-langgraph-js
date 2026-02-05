# Phase 1: Infrastructure Setup - Research

**Researched:** 2026-02-05
**Domain:** CopilotKit pre-release upgrade, chart visualization libraries, monorepo dependency management
**Confidence:** MEDIUM

## Summary

This phase requires upgrading CopilotKit packages from 1.50.0 to 1.51.4-next.1 (a pre-release version), adding Recharts for chart visualization, and integrating the new A2UI renderer feature. The project is a pnpm workspace monorepo with two apps (web/Next.js and agent/LangGraph.js).

CopilotKit 1.51.x introduces no breaking changes from 1.50.0, but brings important improvements: peer dependencies moved to regular dependencies (simplifying installation), and MCP Apps Middleware support. The A2UI renderer is a new feature requiring a separate package `@copilotkit/a2ui-renderer` that enables agent-driven UI component rendering.

Recharts 2.15.0 is the current stable version with built-in TypeScript support, React 19 compatibility, and a modular composition pattern. It includes heavier dependencies (Redux Toolkit, Immer) but provides a mature, well-tested charting solution.

**Primary recommendation:** Update all CopilotKit packages consistently to 1.51.4-next.1 using exact version specifiers, add the A2UI renderer package, and install Recharts latest stable. Use pnpm workspace commands to update the web app package.json.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @copilotkit/react-core | 1.51.4-next.1 | Core CopilotKit React hooks and state | Foundation for all CopilotKit features |
| @copilotkit/react-ui | 1.51.4-next.1 | UI components for copilot interface | Standard UI layer for CopilotKit |
| @copilotkit/runtime | 1.51.4-next.1 | Runtime API integration | Handles backend communication |
| @copilotkit/a2ui-renderer | 1.51.4-next.1 | Agent-to-UI rendering system | New feature for agent-driven UI components |
| recharts | ^2.15.0 | React chart components | Most popular React charting library, 26k+ GitHub stars |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @copilotkit/sdk-js | 1.51.4-next.1 | Backend SDK for agent integration | Used in apps/agent for LangGraph.js integration |
| react-is | ^19.0.0 | React peer dependency for Recharts | Auto-installed as Recharts peer dependency |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| recharts | visx, nivo, victory | Recharts has simpler API, better TypeScript support, more examples |
| recharts | Chart.js + react-chartjs-2 | Chart.js is canvas-based (not SVG), different API paradigm |
| CopilotKit A2UI | Custom renderer | A2UI provides standardized agent-driven UI pattern, tested integration |

**Installation:**
```bash
# In monorepo root, update web app dependencies
cd apps/web
pnpm add @copilotkit/react-core@1.51.4-next.1 @copilotkit/react-ui@1.51.4-next.1 @copilotkit/runtime@1.51.4-next.1 @copilotkit/a2ui-renderer@1.51.4-next.1 recharts

# Update agent app SDK
cd ../agent
pnpm add @copilotkit/sdk-js@1.51.4-next.1
```

## Architecture Patterns

### Recommended Project Structure
```
apps/web/
├── app/                          # Next.js app directory
│   ├── api/
│   │   └── copilotkit/          # CopilotKit runtime endpoint
│   ├── components/
│   │   ├── charts/              # Recharts wrapper components
│   │   └── copilot/             # CopilotKit integration components
│   └── providers/
│       └── copilot-provider.tsx # CopilotKit setup with A2UI
└── package.json                 # Updated dependencies
```

### Pattern 1: A2UI Renderer Integration
**What:** Configure CopilotKit to use the A2UI message renderer for agent-driven UI components
**When to use:** When agents need to render interactive UI elements in the chat interface
**Example:**
```typescript
// apps/web/app/providers/copilot-provider.tsx
import { CopilotKitProvider } from "@copilotkit/react-core";
import { createA2UIMessageRenderer } from "@copilotkit/a2ui-renderer";

const A2UIRenderer = createA2UIMessageRenderer({
  theme: yourTheme // Optional theme configuration
});

export function CopilotProvider({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKitProvider
      runtimeUrl="/api/copilotkit"
      renderActivityMessages={[A2UIRenderer]}
    >
      {children}
    </CopilotKitProvider>
  );
}
```

### Pattern 2: Recharts Responsive Chart Components
**What:** Wrap Recharts components in ResponsiveContainer for flexible sizing
**When to use:** All chart implementations to ensure proper sizing in any layout
**Example:**
```typescript
// apps/web/app/components/charts/pie-chart.tsx
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export function CustomPieChart({ data }: { data: ChartData[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
```

### Pattern 3: Pre-release Version Management
**What:** Lock pre-release versions with exact specifiers in package.json
**When to use:** When using -next, -alpha, -beta, or -rc versions
**Example:**
```json
{
  "dependencies": {
    "@copilotkit/react-core": "1.51.4-next.1",
    "@copilotkit/react-ui": "1.51.4-next.1",
    "@copilotkit/runtime": "1.51.4-next.1",
    "@copilotkit/a2ui-renderer": "1.51.4-next.1"
  }
}
```

### Anti-Patterns to Avoid
- **Mixing CopilotKit versions:** All @copilotkit/* packages must be on the same version to avoid runtime conflicts
- **Using ^ or ~ with pre-release versions:** Pre-release versions should be exact (no semver ranges) to prevent unexpected updates
- **Direct ResponsiveContainer usage without dimensions:** Always specify width/height or use "100%" with a sized parent container
- **Installing Recharts types separately:** Recharts 2.x has built-in TypeScript types; @types/recharts is outdated

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Chart rendering | Custom SVG/Canvas chart code | Recharts components | Handles responsive sizing, tooltips, legends, accessibility, animations |
| Agent UI rendering | Custom message renderer | @copilotkit/a2ui-renderer | Standardized pattern, theme support, tested with CopilotKit internals |
| Chart color schemes | Manual color arrays | Recharts built-in color schemes or theme integration | Consistent colors, accessibility considerations |
| Chart data formatting | Manual data transformation | Recharts data transformation utilities | Handles edge cases (null values, date formatting, number formatting) |

**Key insight:** Chart libraries and agent frameworks have complex edge cases (responsive sizing, touch events, data validation, theme consistency). Use established solutions rather than building from scratch.

## Common Pitfalls

### Pitfall 1: Version Mismatch in Monorepo
**What goes wrong:** Installing different CopilotKit versions in apps/web vs apps/agent causes runtime errors when they communicate
**Why it happens:** Running `pnpm add` in individual workspace packages without coordinating versions
**How to avoid:**
- Update all CopilotKit packages in all workspaces simultaneously
- Use workspace overrides in root package.json if needed
- Verify versions with `pnpm list @copilotkit/react-core` from root
**Warning signs:**
- Type errors when sharing CopilotKit types between apps
- Runtime errors about incompatible message formats
- "Cannot find module" errors despite package being installed

### Pitfall 2: Pre-release Version Auto-updates
**What goes wrong:** Using `^1.51.4-next.1` causes pnpm to update to 1.51.5-next.0 on next install, breaking the build
**Why it happens:** Semver ranges work differently with pre-release tags
**How to avoid:**
- Always use exact versions (no ^ or ~) for pre-release packages
- Lock versions in package.json: `"@copilotkit/react-core": "1.51.4-next.1"`
- Document in package.json comments why versions are locked
**Warning signs:**
- Different versions in pnpm-lock.yaml after fresh install
- Build works locally but fails in CI
- "Unexpected token" or "Cannot read property" errors after reinstall

### Pitfall 3: Missing ResponsiveContainer
**What goes wrong:** Charts don't render or have 0px height
**Why it happens:** Recharts charts need explicit dimensions, but developers expect auto-sizing
**How to avoid:**
- Always wrap charts in `<ResponsiveContainer width="100%" height={400}>`
- Parent container must have explicit dimensions if using percentage height
- Use fixed pixel height (e.g., 400) for predictable sizing
**Warning signs:**
- Chart appears in React DevTools but not visible on page
- Console warnings about "width/height is 0"
- Chart renders in some viewports but not others

### Pitfall 4: A2UI Renderer Not Registered
**What goes wrong:** Agent-driven UI components don't render, fall back to text
**Why it happens:** Forgot to pass renderer to `renderActivityMessages` prop
**How to avoid:**
- Create renderer with `createA2UIMessageRenderer()` outside component
- Pass as array to `renderActivityMessages={[A2UIRenderer]}`
- Verify in browser DevTools that custom message components render
**Warning signs:**
- Messages render as plain text instead of interactive UI
- No errors in console (silent fallback behavior)
- UI components work in examples but not in your app

### Pitfall 5: Recharts Redux State Conflicts
**What goes wrong:** If your app uses Redux, Recharts' internal Redux state can cause conflicts
**Why it happens:** Recharts 3.x includes Redux Toolkit as a dependency for internal state
**How to avoid:**
- Recharts uses isolated Redux store, no action needed unless you see conflicts
- If conflicts occur, ensure your Redux store doesn't intercept Recharts actions
- Monitor browser console for Redux DevTools conflicts
**Warning signs:**
- Chart state doesn't update on data changes
- Redux DevTools shows unexpected actions from Recharts
- Chart animations glitch or freeze

## Code Examples

Verified patterns from official sources:

### CopilotKit Provider Setup with A2UI
```typescript
// apps/web/app/providers/copilot-provider.tsx
"use client";

import { CopilotKitProvider } from "@copilotkit/react-core";
import { createA2UIMessageRenderer } from "@copilotkit/a2ui-renderer";
import { ReactNode } from "react";

// Create renderer outside component to avoid recreation
const A2UIRenderer = createA2UIMessageRenderer({
  theme: {
    // Optional: customize theme
    primaryColor: "#0066cc",
  }
});

export function CopilotProvider({ children }: { children: ReactNode }) {
  return (
    <CopilotKitProvider
      runtimeUrl="/api/copilotkit"
      renderActivityMessages={[A2UIRenderer]}
    >
      {children}
    </CopilotKitProvider>
  );
}
```

### Recharts PieChart Component
```typescript
// apps/web/app/components/charts/pie-chart.tsx
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PieChartData {
  name: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function CustomPieChart({ data }: { data: PieChartData[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
```

### Recharts BarChart Component
```typescript
// apps/web/app/components/charts/bar-chart.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartData {
  name: string;
  value: number;
}

export function CustomBarChart({ data }: { data: BarChartData[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

### Package.json Update Pattern
```json
{
  "name": "web",
  "dependencies": {
    "@copilotkit/react-core": "1.51.4-next.1",
    "@copilotkit/react-ui": "1.51.4-next.1",
    "@copilotkit/runtime": "1.51.4-next.1",
    "@copilotkit/a2ui-renderer": "1.51.4-next.1",
    "recharts": "^2.15.0",
    "next": "16.0.8",
    "react": "^19.2.1",
    "react-dom": "^19.2.1"
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| CopilotKit peer dependencies | Regular dependencies | v1.51.2 (Dec 2024) | Simpler installation, no manual peer dependency resolution |
| Custom message renderers | @copilotkit/a2ui-renderer | v1.51.x (Dec 2024) | Standardized agent-to-UI rendering pattern |
| Recharts v1.x | Recharts v2.x with built-in types | v2.0.0 (2023) | No need for @types/recharts package |
| Manual chart theming | Recharts theme integration | v2.x series | Consistent styling with design systems |

**Deprecated/outdated:**
- @types/recharts: Recharts 2.x has built-in TypeScript definitions
- CopilotKit peer dependency pattern: Now regular dependencies as of v1.51.2
- Manual renderActivityMessages implementation: Use createA2UIMessageRenderer() instead

## Open Questions

Things that couldn't be fully resolved:

1. **CopilotKit SDK version alignment**
   - What we know: @copilotkit/sdk-js is currently at 1.10.6 in apps/agent
   - What's unclear: Whether sdk-js has a 1.51.4-next.1 version or uses different versioning
   - Recommendation: Attempt `pnpm add @copilotkit/sdk-js@1.51.4-next.1` in apps/agent; if it fails, check npm registry for available versions or keep existing 1.10.6 if compatible

2. **A2UI Theme Configuration**
   - What we know: createA2UIMessageRenderer accepts a theme object
   - What's unclear: Full theme shape/interface definition
   - Recommendation: Start with minimal/no theme config, add customization in later phases if needed

3. **Recharts Tree-shaking**
   - What we know: Recharts has many dependencies (Redux Toolkit, Immer, etc.)
   - What's unclear: Whether Next.js app dir tree-shakes unused Recharts components effectively
   - Recommendation: Import only needed components; monitor bundle size in build output

## Sources

### Primary (HIGH confidence)
- npm registry - recharts@2.15.0 package metadata (peer dependencies, built-in types verified via `npm view recharts`)
- pnpm-lock.yaml - Current project dependencies and monorepo structure
- Package.json files - apps/web and apps/agent current dependency versions

### Secondary (MEDIUM confidence)
- recharts.github.io examples - PieChart and BarChart component patterns (verified via WebFetch)
- User-provided CopilotKit upgrade information - v1.51.x changelog, A2UI renderer API, breaking changes assessment

### Tertiary (LOW confidence)
- CopilotKit sdk-js versioning - Assumption that sdk-js follows same version scheme; needs verification during implementation

## Metadata

**Confidence breakdown:**
- Standard stack: MEDIUM - Recharts verified via npm, CopilotKit info from user/changelog but pre-release version not independently verified
- Architecture: HIGH - Patterns based on official Recharts examples and standard React/Next.js practices
- Pitfalls: MEDIUM - Based on common React charting issues and monorepo dependency management experience, plus pre-release version gotchas

**Research date:** 2026-02-05
**Valid until:** 2026-02-12 (7 days - pre-release versions evolve quickly; stable Recharts info valid 30+ days)
