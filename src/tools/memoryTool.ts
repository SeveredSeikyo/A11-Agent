import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { readMemory } from "../utils/readMemory.util";
import { writeMemory } from "../utils/writeMemory.util";

export const memoryTool = tool(
  async ({ action, key, value }) => {
    try {
      const memory = (await readMemory()) || {};

      if (action === "read") {
        return {
          success: true,
          memory: key ? memory[key] : memory,
        };
      }

      if (action === "write") {
        memory[key] = value;
        await writeMemory(memory);
        return { success: true };
      }
    } catch (e) {
      console.error("Memory tool error:", e);
      return { success: false };
    }
  },
  {
    name: "persistentMemory",

    description:
      "Read or write persistent JSON memory shared across agent runs. " +
      "Before calling external tools, check memory first. " +
      "For time-sensitive data (weather, news), reuse memory only if the date is today and the timestamp is recent. " +
      "For stable data (architecture, ports), always reuse memory unless explicitly updated. " +
      "After fetching fresh data, write it back with metadata.",

    schema: z.object({
      action: z.enum(["read", "write"]),
      key: z
        .string()
        .describe("Memory namespace (e.g. 'weather', 'ports', 'architecture')"),
      value: z
        .any()
        .optional()
        .describe(
          "Structured JSON data to store. Time-sensitive data must include date and timestamp."
        ),
    }),
  }
);
