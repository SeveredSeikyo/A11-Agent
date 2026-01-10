import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { getSystemInfo } from "../utils/getArch.util";

export const getPortsTool = tool(
  async ({ project_kind }: { project_kind: "frontend" | "backend" }) => {
    console.log("Ports Tool calling...");
    try {
      /**
       * Reserved Port Ranges:
       * - frontend → 3000–3100
       * - backend  → 5000–5100
       *
       * Rust binary is responsible for:
       * - scanning the range
       * - returning empty ports
       */
      const empty_ports = await getSystemInfo([
        "reserve-port",
        project_kind,
      ]);

      console.log("Ports Tool called.");

      return {
        success: true,
        project_kind,
        reserved_range:
          project_kind === "frontend"
            ? "3000-3100"
            : "5000-5100",
        empty_ports,
      };
    } catch (e) {
      console.error("Error fetching available ports:", e);
      return {
        success: false,
        error: "Failed to fetch available ports",
      };
    }
  },
  {
    name: "getAvailablePorts",
    description:
      "Find available system ports within predefined reserved ranges based on project type. " +
      "Frontend projects use ports 3000–3100, while backend projects use ports 5000–5100. " +
      "Use this tool when starting servers, APIs, web apps, or services that require free ports.",
    schema: z.object({
      project_kind: z
        .enum(["frontend", "backend"])
        .describe(
          "Type of project requesting ports. " +
          "Frontend projects use ports 3000–3100. " +
          "Backend projects use ports 5000–5100."
        ),
    }),
  }
);
