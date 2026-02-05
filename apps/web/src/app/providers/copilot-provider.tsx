"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { createA2UIMessageRenderer } from "@copilotkit/a2ui-renderer";
import { ReactNode } from "react";

// Create renderer outside component to avoid recreation on each render
// Using empty theme object - will inherit default theme
const A2UIRenderer = createA2UIMessageRenderer({
  theme: {} as any,
});

export function CopilotProvider({ children }: { children: ReactNode }) {
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      agent="starterAgent"
      renderActivityMessages={[A2UIRenderer]}
    >
      {children}
    </CopilotKit>
  );
}
