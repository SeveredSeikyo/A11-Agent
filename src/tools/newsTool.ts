// newsTool.ts
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { fetchTodayNews } from "../utils/news.util";


export const getNews = tool(
  async ({ topic, range }) => {
    console.log("📰 Fetching news...");

    const articles = await fetchTodayNews({ topic, range });

    console.log("📰 News fetched");

    if (articles.length) {

      let article_summary = ""

      for (let i = 0; i < articles.length; i++) {
        
        const { title, description } = articles[i]

        article_summary += `Title ${i+1}: ${title} \n`
      }

      return {
        success: articles.length > 0,
        topic,
        range,
        articles: article_summary,
      };
    }

    return {
      success: articles.length > 0,
      topic,
      range,
      articles: "",
    };
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
