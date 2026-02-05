/**
 * Todo management tools and state
 * Converted from Python: src/todos.py
 */

import { z } from "zod";
import { tool, StructuredToolInterface } from "@langchain/core/tools";
import { ToolMessage } from "@langchain/core/messages";
import { Command } from "@langchain/langgraph";
import { RunnableConfig } from "@langchain/core/runnables";
import { v4 as uuidv4 } from "uuid";
import { Annotation } from "@langchain/langgraph";
// @ts-ignore
import { CopilotKitStateAnnotation } from "@copilotkit/sdk-js/langgraph";

// Todo type definition
export interface Todo {
  id: string;
  title: string;
  description: string;
  emoji: string;
  status: "pending" | "completed";
}

// Define the agent state annotation with todos
export const AgentStateAnnotation = Annotation.Root({
  ...CopilotKitStateAnnotation.spec,
  todos: Annotation<Todo[]>({
    reducer: (_, newTodos) => newTodos,
    default: () => [],
  }),
});

export type AgentState = typeof AgentStateAnnotation.State;

// Schema for a single todo
const TodoSchema = z.object({
  id: z.string().optional().describe("Unique identifier for the todo"),
  title: z.string().describe("Title of the todo"),
  description: z.string().describe("Description of the todo"),
  emoji: z.string().describe("Emoji representing the todo"),
  status: z
    .enum(["pending", "completed"])
    .describe("Status of the todo"),
});

/**
 * Manage the current todos.
 */
export const manageTodos = tool(
  async (
    input: { todos: z.infer<typeof TodoSchema>[] },
    config: RunnableConfig
  ): Promise<Command> => {
    // Ensure all todos have IDs that are unique
    const todosWithIds = input.todos.map((todo) => ({
      ...todo,
      id: todo.id || uuidv4(),
    })) as Todo[];

    // Get the tool call ID from config
    const toolCallId =
      config?.configurable?.tool_call_id || config?.metadata?.tool_call_id || "unknown";

    // Update the state
    return new Command({
      update: {
        todos: todosWithIds,
        messages: [
          new ToolMessage({
            content: "Successfully updated todos",
            tool_call_id: toolCallId,
          }),
        ],
      },
    });
  },
  {
    name: "manage_todos",
    description: "Manage the current todos.",
    schema: z.object({
      todos: z.array(TodoSchema).describe("The list of todos to manage"),
    }),
  }
);

/**
 * Get the current todos.
 */
export const getTodos = tool(
  async (_input: Record<string, never>, config: RunnableConfig): Promise<Todo[]> => {
    // Access todos from the state via config
    const state = config?.configurable?.state as AgentState | undefined;
    return state?.todos || [];
  },
  {
    name: "get_todos",
    description: "Get the current todos.",
    schema: z.object({}),
  }
);

// Export all todo tools
export const todoTools: StructuredToolInterface[] = [manageTodos, getTodos];