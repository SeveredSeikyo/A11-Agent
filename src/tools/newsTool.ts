// newsTool.ts
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { fetchTodayNews } from "../utils/news.util";
import { model } from "../agent/agent";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { articleSummariserPrompt } from "../prompts/toolPrompt";


export const getNews = tool(
  async ({ topic, range }) => {
    console.log("📰 Fetching news...");

    const articles = await fetchTodayNews({ topic, range });

    // console.log(JSON.stringify(articles))

    console.log("📰 News fetched");

    const summary_response = await model.invoke([
      new SystemMessage(articleSummariserPrompt),
      new HumanMessage(JSON.stringify(articles))
    ])

    const summaryRaw = summary_response.content.toString()
    const article_summary = JSON.parse(summaryRaw)

    console.log(article_summary)

    return {
      success: articles.length > 0,
      topic,
      range,
      articles: ""
    }
  },
  {
    name: "getNews",
    description:
      "Fetch latest news articles for a given topic using a relative time range like today, yesterday, or last 7 days.",
    schema: z.object({
      topic: z
        .string()
        .min(1)
        .describe(
          "The topic to search for (e.g., 'bitcoin', 'AI', 'India politics', 'Apple')"
        ),
      range: z
        .enum([
          "today",
          "yesterday",
          "last_7_days",
          "last_3_days",
        ])
        .optional()
        .describe(
          "Relative time range for the news (default: today)"
        ),
    }),
  }
);
