import { MCPAppsMiddleware } from "@ag-ui/mcp-apps-middleware";
import { A2UIMiddleware } from "@ag-ui/a2ui-middleware";

export const aguiMiddleware = [
  new MCPAppsMiddleware({
    mcpServers: [
      {
        type: "http",
        url: "http://localhost:3108/mcp",
        serverId: "example_mcp_app",
      },
    ],
  }),
  new A2UIMiddleware()
];