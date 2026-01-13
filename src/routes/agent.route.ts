import { Elysia } from "elysia"
import { ip } from "elysia-ip"
import { model } from "../agent/agent"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { systemPrompt, conclusionPrompt } from "../executor/systemPrompt"
import { executeSteps } from "../executor/executor"
import { getLocation } from "../tools/geoLocationTool"
import { getClientIP, isPrivateIP, normalizePlannerOutput, sanitizeJSON } from "../executor/utils/agentUtils"


export const agentRouter = new Elysia()
  .use(ip())
  .post("/agent", async (ctx) => {
    const userMessage = (ctx.body as { message: string })?.message
    if (!userMessage) {
      return new Response("Message is required", { status: 400 })
    }

    const clientIp = getClientIP(ctx)

    let ipLocation = ""
    if (clientIp !== "unknown" && !isPrivateIP(clientIp)) {
      try {
        const ipResponse = await getLocation.invoke({ ip: clientIp })
        if (ipResponse?.success) {
          ipLocation = `User IP: ${ipResponse.ip}, Location: ${ipResponse.region}, ${ipResponse.city}, ${ipResponse.country}, Timezone: ${ipResponse.timezone}`
        }
      } catch {}
    }

    const enrichedMessage = `
    User Message:
    ${userMessage}

    ${ipLocation ? `Metadata: ${ipLocation}` : ""}
    `.trim()

    try {
      /** 1️⃣ PLANNER */
      const plannerResponse = await model.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(enrichedMessage),
      ])

      const plannerRaw = plannerResponse.content.toString()
      const plannerParsed = normalizePlannerOutput(
        JSON.parse(sanitizeJSON(plannerRaw))
      )

      if (!plannerParsed.tools_required) {
        const normalResponse = await model.invoke([
          new HumanMessage(userMessage),
        ])
        return { AI_message: normalResponse.content.toString() }
      }

      if (!Array.isArray(plannerParsed.steps)) {
        throw new Error("Planner output invalid: steps[] missing")
      }

      /** 2️⃣ EXECUTOR */
      const toolResults = await executeSteps(plannerParsed.steps)

      /** 3️⃣ CONCLUSION */
      const finalPrompt = `
      User Message:
      ${userMessage}

      Tool Results:
      ${JSON.stringify(toolResults)}
      `.trim()

      const finalResponse = await model.invoke([
        new SystemMessage(conclusionPrompt),
        new HumanMessage(finalPrompt),
      ])

      return { AI_message: finalResponse.content.toString() }
    } catch (err) {
      console.error("Agent error:", err)
      return new Response("Internal Server Error", { status: 500 })
    }
  })
