import type { BaseMessage } from "@langchain/core/messages";

export interface AgentState {
  messages: BaseMessage[];

  // tool outputs live here
  results: Record<string, any>;

  // track which steps ran
  completed: Set<string>;
}
