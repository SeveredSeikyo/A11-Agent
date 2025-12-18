import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { postToDiscord } from "../utils/discord.util";

export const sendDiscordMessage = tool(
  async ({ message }: { message: string }) => {
    console.log("💬 Discord Tool calling...");

    const result = await postToDiscord({ message });

    console.log("✅ Discord message sent");

    return {
      success: true,
      message,
      providerResponse: result,
    };
  },
  {
    name: "sendDiscordMessage",
    description:
      "Send a message to a Discord channel using a webhook. Use this tool when the user asks to post, send, notify, or announce something on Discord.",
    schema: z.object({
      message: z
        .string()
        .min(1)
        .describe(
          "The message content to post to the Discord channel. Can include plain text, emojis, links, or formatted markdown."
        ),
    }),
  }
);
