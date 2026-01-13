// src/routes/agent.route.ts

import { Elysia } from "elysia"
import { ip } from "elysia-ip"
import { model } from "../agent/agent"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import {
  systemPrompt,
  validatorPrompt,
  conclusionPrompt,
} from "../executor/systemPrompt"
import { executeSteps } from "../executor/executor"

function sanitizeJSON(text: string) {
  return text
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .trim()
}

export const agentRouter = new Elysia()
  .use(ip())
  .post("/agent", async (ctx) => {
    const userMessage = (ctx.body as { message: string })?.message
    if (!userMessage) {
      return new Response("Message is required", { status: 400 })
    }

    const clientIp = ctx.ip ?? "unknown"

    const enrichedMessage = `
    User Message:
    ${userMessage}
    `.trim()

    try {
      /** 1️⃣ PLANNER */
      const plannerResponse = await model.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(enrichedMessage),
      ])

      const plannerRaw = plannerResponse.content.toString()
      const plannerParsed = JSON.parse(sanitizeJSON(plannerRaw))

      /** 2️⃣ NO TOOLS REQUIRED → NORMAL LLM RESPONSE */
      if (!plannerParsed.tools_required) {
        const normalResponse = await model.invoke([
          new HumanMessage(userMessage),
        ])

        return {
          AI_message: normalResponse.content.toString(),
        }
      }

      /** 3️⃣ VALIDATOR */
      const validatorResponse = await model.invoke([
        new SystemMessage(validatorPrompt),
        new HumanMessage(plannerRaw),
      ])

      const validated = JSON.parse(
        sanitizeJSON(validatorResponse.content.toString())
      )

      /** 4️⃣ EXECUTOR */
      const toolResults = await executeSteps(validated.steps)

      /** 5️⃣ CONCLUSION */
      const finalPrompt = `
      User Message:
      ${userMessage}

      Tool Results:
      ${JSON.stringify(toolResults, null, 2)}
      `.trim()

      const finalResponse = await model.invoke([
        new SystemMessage(conclusionPrompt),
        new HumanMessage(finalPrompt),
      ])

      return {
        AI_message: finalResponse.content.toString(),
      }
    } catch (err) {
      console.error("Agent error:", err)
      return new Response("Internal Server Error", { status: 500 })
    }
})
