import dotenv from "dotenv";
import { Elysia } from "elysia";
import { agent } from "./src/agent";
import { HumanMessage } from "@langchain/core/messages";

dotenv.config();

const app = new Elysia();
const PORT = process.env.PORT || 3000;

app.post("/agent", async (ctx) => {
    const userMessage = (ctx.body as { message: string })?.message;

    if (!userMessage) {
        return new Response("Message is required", { status: 400 });
    }

    try {
        const result = await agent.invoke({
            messages: [new HumanMessage(userMessage)],
        });

        const finalMessage = result.messages
            .slice()
            .reverse()
            .find((m) => m._getType() === "ai");

        return new Response(
            typeof finalMessage?.content === "string"
                ? finalMessage.content
                : JSON.stringify(finalMessage?.content ?? ""),
            {
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                },
            }
        );
    } catch (err) {
        console.error("Agent error:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
});

app.listen(PORT, (server) => {
    console.log(`🚀 Server listening on ${server.hostname}:${server.port}`);
});
