import { useConfigureSuggestions } from "@copilotkit/react-core/v2";

export const useExampleSuggestions = () => {
  useConfigureSuggestions({
    suggestions: [
      { title: "Static Generative UI", message: "Please briefly explain and then demonstrate static generative UI to me with your tools." },
      { title: "MCP Apps", message: "Please briefly explain and then demonstrate MCP Apps with a 3D outlined cube." },
      { title: "A2UI", message: "Please briefly explain and then demonstrate A2UI to me." },
      { title: "Frontend Tools", message: "Please briefly explain and then demonstrate frontend tools to me." },
      { title: "Human In The Loop", message: "Please briefly explain and then demonstrate frontend-based human-in-the-loop to me" },
      { title: "Canvas Mode", message: "Please open the canvas and add some todos to it about learning about CopilotKit." },
    ],
    available: "always", // Optional: when to show suggestions
  });
}