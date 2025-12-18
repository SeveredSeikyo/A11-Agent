// slackTool.ts
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { postToSlack } from "../utils/slack.util";

export const sendSlackMessage = tool(
  async ({ message }: { message: string }) => {
    console.log("Slack Tool Calling...");

    const result = await postToSlack(message);

    console.log("Slack Message Sent");

    return {
      success: true,
      providerResponse: result,
      messageSent: message,
    };
  },
  {
    name: "sendSlackMessage",
    description:
      "Post a plain text message to Slack using a preconfigured webhook. Use this tool when the user asks to send, post, notify, alert, or share a message in Slack or a team channel.",
    schema: z.object({
      message: z
        .string()
        .min(1)
        .describe(
          "The plain text message to send to Slack (e.g. 'Deployment completed', 'Server is down', 'Daily standup in 10 minutes')"
        ),
    }),
  }
);
