"use client";

import { useAgent } from "@copilotkit/react-core/v2";
import { TodoList } from "./todo-list";

export function Canvas() {
  const { agent } = useAgent();

  return (
    <div className="h-full p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <TodoList
        // read state from agent
        todos={agent.state?.todos || []} 
        // update state in agent
        onUpdate={(updatedTodos) => agent.setState({ todos: updatedTodos })}
      />
    </div>
  );
}
