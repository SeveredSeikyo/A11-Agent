// webSearchTool.ts
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { search } from "../utils/tavily.util";

export const webSearch = tool(
  async ({ query }) => {
    console.log("🌐 Web search tool called");

    const result = await search({ question: query });

    return {
      success: true,
      query,
      answer: result,
    };
  },
  {
    name: "webSearch",
    description:
      "Search the web to get a concise, factual answer to a question using real-time web data. Use this tool when the user asks about current information, facts, definitions, explanations, or topics that may require up-to-date or external knowledge.",
    schema: z.object({
      query: z
        .string()
        .min(1)
        .describe(
          "The question or search query to look up on the web (e.g., 'What is Tavily?', 'Latest news about OpenAI', 'Who is the CEO of Tesla?')"
        ),
    }),
  }
);
