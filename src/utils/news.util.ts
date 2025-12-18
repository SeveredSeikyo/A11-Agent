// news.util.ts
import NewsAPI from "newsapi";

const newsapi = new NewsAPI(process.env.NEWS_API || "") as any;

type NewsRange = "today" | "yesterday" | "last_7_days" | "last_3_days";

const formatDate = (date: Date) =>
  date.toISOString().split("T")[0];

const resolveDateRange = (range?: NewsRange) => {
  const now = new Date();
  const to = new Date(now);
  const from = new Date(now);

  switch (range) {
    case "yesterday":
      from.setDate(now.getDate() - 1);
      to.setDate(now.getDate() - 1);
      break;

    case "last_3_days":
      from.setDate(now.getDate() - 3);
      break;

    case "last_7_days":
      from.setDate(now.getDate() - 7);
      break;

    case "today":
    default:
      // already today
      break;
  }

  return {
    from: formatDate(from),
    to: formatDate(to),
  };
};

export const fetchTodayNews = async ({
  topic,
  range = "today",
}: {
  topic: string;
  range?: NewsRange;
}) => {
  const { from, to } = resolveDateRange(range);

  console.log(`🗓️ News range: ${from} → ${to}`);

  try {
    const response = await newsapi.v2.everything({
      q: topic,
      from,
      to,
      language: "en",
      sortBy: "publishedAt",
      pageSize: 5,
    });

    if (response.status === "ok") {
      return response.articles ?? [];
    }

    throw new Error("NewsAPI returned error status");
  } catch (error: any) {
    console.error("❌ Error fetching news:", error.message || error);
    return [];
  }
};
