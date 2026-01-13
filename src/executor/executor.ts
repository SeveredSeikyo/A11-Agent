// src/executor/executor.ts

import { DynamicStructuredTool } from "@langchain/core/tools"
import { tools } from "../tools"
import { resolveArgs } from "./resolveArgs"

type AnyTool = DynamicStructuredTool<any, any, any, any>

/**
 * Internal executor registry
 * (code-facing tool implementations)
 */
const TOOL_EXECUTORS = {
  getWeatherToday: tools.getWeatherToday,
  getDateTool: tools.getDateTool,
  sendEmail: tools.sendEmail,
  getNews: tools.getNews,
  webSearch: tools.webSearch,
  sendSlackMessage: tools.sendSlackMessage,
  sendDiscordMessage: tools.sendDiscordMessage,
  getLocation: tools.getLocation,
  getArchTool: tools.getArchTool,
  getPortsTool: tools.getPortsTool,
  memoryTool: tools.memoryTool,
}

/**
 * Planner → Executor tool name normalization
 * (LLM-facing → implementation-facing)
 */
const TOOL_NAME_MAP: Record<string, keyof typeof TOOL_EXECUTORS> = {
  getWeatherToday: "getWeatherToday",
  getCurrentDateTime: "getDateTool",
  getDateTool: "getDateTool",
  sendEmail: "sendEmail",
  getNews: "getNews",
  webSearch: "webSearch",
  sendSlackMessage: "sendSlackMessage",
  sendDiscordMessage: "sendDiscordMessage",
  getLocation: "getLocation",
  get_ip_location: "getLocation",
  getArch: "getArchTool",
  getArchTool: "getArchTool",
  getAvailablePorts: "getPortsTool",
  getPortsTool: "getPortsTool",
  persistentMemory: "memoryTool",
  memoryTool: "memoryTool",
}

export interface Step {
  id: string
  tool: string
  args?: Record<string, any>
}

/**
 * Executes planner steps sequentially
 */
export async function executeSteps(steps: Step[]) {
  const results: Record<string, any> = {}

  for (const step of steps) {
    const normalizedTool = TOOL_NAME_MAP[step.tool]

    if (!normalizedTool) {
      throw new Error(`Unknown tool: ${step.tool}`)
    }

    const executor: AnyTool = TOOL_EXECUTORS[normalizedTool]

    const resolvedArgs = resolveArgs(step.args ?? {}, results)

    const output = await executor.invoke(resolvedArgs)

    results[step.id] = output
  }

  return results
}
