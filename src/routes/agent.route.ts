import { Elysia } from "elysia";
import { ip } from "elysia-ip";
import { agent } from "../agent/agent";
import { HumanMessage } from "@langchain/core/messages";
import { invokeSequential } from "../agent/invokeSequential.agent";

export const agentRouter = new Elysia()
  .use(ip())
  .post("/agent", async (ctx) => {
    const userMessage = (ctx.body as { message: string })?.message;

    if (!userMessage) {
        return new Response("Message is required", { status: 400 });
    }

    // IP provided by elysia-ip
    const clientIp = ctx.ip ?? "unknown";

    const enrichedMessage = `
    User Message:
    ${userMessage}

    Metadata:
    - IP Address: ${clientIp}

    System Prompt:
    - Ignore IP Address unless anything related to IP such as location comes up.
    `.trim();

    try {
        const result = await invokeSequential(agent,
          {
            messages: [new HumanMessage(enrichedMessage)],
          },
        );

        // The result is the final state. The last message is usually the AI's final answer.
        const lastMessage = result.messages[result.messages.length - 1];

        return new Response(lastMessage?.content.toString(), {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
    } catch (err) {
        console.error("Agent error:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
});