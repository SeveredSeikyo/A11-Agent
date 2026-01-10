import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ipLocation } from "../utils/iplocation.util";

export const getLocation = tool(
    async ({ ip }: { ip: string }) => {
        const result = await ipLocation(ip);
        return result;
    },
    {
        name: "get_ip_location",
        description:
            "Fetches geographic location details (city, region, country, timezone) for a given IP address. " +
            "Use this when location context is required, such as identifying a user's city, country, or timezone " +
            "based on their IP address.",
        schema: z.object({
            ip: z
                .string()
                .describe(
                    "The IPv4 or IPv6 address to look up (e.g., '8.8.8.8' or '2001:4860:4860::8888'). " +
                    "Localhost values like '127.0.0.1' or '::1' are allowed."
                ),
        }),
    }
);
