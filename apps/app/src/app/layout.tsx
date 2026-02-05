"use client";


import { CopilotKit } from "@copilotkit/react-core";
import "./globals.css";
import "@copilotkit/react-ui/v2/styles.css";


import { createA2UIMessageRenderer } from "@copilotkit/a2ui-renderer";
import { theme } from "./theme";

const A2UIMessageRenderer = createA2UIMessageRenderer({ theme });
const activityRenderers = [A2UIMessageRenderer];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <CopilotKit runtimeUrl="/api/copilotkit" showDevConsole={false} renderActivityMessages={activityRenderers}>
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}
