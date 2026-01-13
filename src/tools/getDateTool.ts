import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const getDateTool = tool(
  async ({ timezone }: { timezone?: string }) => {
    console.log("🗓️ Date tool calling...");

    // Default to Asia/Kolkata
    let tz = timezone || "Asia/Kolkata";
    if (tz == "Asia/Hyderabad") {
      tz = "Asia/Kolkata"
    }
    const now = new Date();

    const formatter = new Intl.DateTimeFormat("en-IN", {
      timeZone: tz,
      dateStyle: "full",
      timeStyle: "long",
    });

    const parts = formatter.formatToParts(now);

    const date = parts
      .filter(p => p.type !== "literal")
      .reduce((acc, p) => {
        acc[p.type] = p.value;
        return acc;
      }, {} as Record<string, string>);

    const result = {
      iso: new Date(
        now.toLocaleString("en-US", { timeZone: tz })
      ).toISOString(),
      date: formatter.format(now),
      timezone: tz,
      timestamp: now.getTime(),
    };

    console.log(`⏰ Fetched Date & Time for ${tz}`);
    return result;
  },
  {
    name: "getCurrentDateTime",
    description:
      "Get the current date and time for a given timezone. Defaults to Asia/Kolkata if no timezone is provided. Supports IANA timezone names like 'Asia/Kolkata', 'America/New_York', 'Europe/London'.",
    schema: z.object({
      timezone: z
        .string()
        .optional()
        .describe(
          "IANA timezone name (e.g. 'Asia/Kolkata', 'America/New_York', 'Europe/London'). Defaults to Asia/Kolkata."
        ),
    }),
  }
);
