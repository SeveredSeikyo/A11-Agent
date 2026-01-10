import { AIMessage } from "@langchain/core/messages";

export async function invokeSequential(agent:unknown, input:unknown) {
  let state = await agent.invoke(input, { maxConcurrency: 1 });

  while (true) {
    const last = state.messages.at(-1);

    // No more tools → final answer
    if (
      !(last instanceof AIMessage) ||
      !Array.isArray(last.tool_calls) ||
      last.tool_calls.length === 0
    ) {
      return state;
    }

    // ❌ Model tried parallel tools → force retry
    if (last.tool_calls.length > 1) {
      state = await agent.invoke({
        messages: [
          ...state.messages,
          {
            role: "user",
            content:
              "You must call EXACTLY ONE tool at a time. Continue step by step.",
          },
        ],
      });
      continue;
    }

    // ✅ Exactly one tool → continue normally
    state = await agent.invoke(
      { messages: state.messages },
      { maxConcurrency: 1 }
    );
  }
}
