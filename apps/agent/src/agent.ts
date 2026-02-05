/**
 * This is the main entry point for the agent.
 * It defines the workflow graph, state, tools, nodes and edges.
 * Converted from Python: main.py
 */

import { createAgent } from "langchain";
// @ts-ignore
import { copilotkitMiddleware } from "@copilotkit/sdk-js/langgraph";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { MemorySaver } from "@langchain/langgraph";

import { AgentStateAnnotation, todoTools } from "./todos.js";
import { queryData } from "./query.js";
import { addA2ui } from "./prompt-builder.js";

// System prompt with A2UI protocol
const SYSTEM_PROMPT = addA2ui(`
You are a helpful assistant that helps users understand CopilotKit.

When asked about generative UI:
1. Ground yourself in relevant information from the CopilotKit documentation.
2. Use one of the relevant tools to demonstrate that piece of generative UI.
3. Explain the concept to the user with a brief summary + minimal code snippet.
`);

// Initialize MCP client for CopilotKit tools
const client = new MultiServerMCPClient({
    copilotkit: {
        transport: "http",
        url: "https://mcp.copilotkit.ai",
    },
});

// Get MCP tools asynchronously
const mcpTools = await client.getTools();

const checkpointer = new MemorySaver();

const agent = createAgent({
    model: "gpt-5.2",
    tools: [queryData, ...todoTools, ...mcpTools] as any,
    middleware: [copilotkitMiddleware],
    stateSchema: AgentStateAnnotation,
    systemPrompt: SYSTEM_PROMPT,
    checkpointer
});

export const graph = agent;