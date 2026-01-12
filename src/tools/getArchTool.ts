import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { getSystemInfo } from "../utils/getArch.util";
import { memoryTool } from "./memoryTool";

export const getArchTool = tool(
  async () => {
    console.log("Arch Tool calling...");
    const memory = await memoryTool.invoke({
      action: "read",
      key: "architecture",
    });

    if (memory?.memory) {
      return {
        success: true,
        architecture: memory.memory,
        source: "memory",
      };
    }

    const archData = await getSystemInfo(["get-arch"]);

    await memoryTool.invoke({
      action: "write",
      key: "architecture",
      value: {
        ...(archData as Record<string, unknown>),
        timestamp: Date.now(),
      },
    });

    console.log("Arch Tool called.");

    return {
      success: true,
      architecture: archData,
      source: "system",
    };
  },
  {
    name: "getArch",
    description:
      "Retrieves system architecture. Reuses persistent memory if available; otherwise queries the system and stores the result.",
    schema: z.object({}),
  }
);
