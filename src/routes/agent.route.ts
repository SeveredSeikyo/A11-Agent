import { Elysia } from "elysia"
import { ip } from "elysia-ip"
import { model } from "../agent/agent"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { systemPrompt, conclusionPrompt } from "../executor/systemPrompt"
import { executeSteps } from "../executor/executor"
import { getLocation } from "../tools/geoLocationTool"
import { getClientIP, isPrivateIP, normalizePlannerOutput, sanitizeJSON } from "../executor/utils/agentUtils"
import { memoryTool } from "../tools/memoryTool"


export const agentRouter = new Elysia()
  .use(ip())
  .post("/agent", async (ctx) => {
    const userMessage = (ctx.body as { message: string })?.message
    if (!userMessage) {
      return new Response("Message is required", { status: 400 })
    }

    const clientIp = getClientIP(ctx)
    const agentMemory = await memoryTool.invoke({ action: "read", key: "" }) || ""
    let memoryLocation = ""
    let memoryArchitecture = ""
    if (agentMemory) {
      memoryLocation = agentMemory.memory?.location?.trim() || ""
      memoryArchitecture = agentMemory.memory?.architecture
        ? `${agentMemory.memory.architecture.arch} - ${agentMemory.memory.architecture.platform}`
        : ""
    }

    // IP lookup ONLY if memory location missing
    let ipLocation = ""
    let ipTimezone = ""

    if (!memoryLocation && clientIp !== "unknown" && !isPrivateIP(clientIp)) {
      try {
        const ipResponse = await getLocation.invoke({ ip: clientIp })
        if (ipResponse?.success) {
          ipLocation = `${ipResponse.city}, ${ipResponse.country}`
          ipTimezone = ipResponse.timezone
        }
      } catch {}
    }

    // FINAL resolved location (authoritative)
    const resolvedLocation = memoryLocation || ipLocation


    const enrichedMessage = `
    User Message:
    ${userMessage}

    System Context (AUTHORITATIVE — DO NOT OVERRIDE):
    ${resolvedLocation ? `Resolved Location: ${resolvedLocation}` : "Location: Unknown"}

    Additional Context (LOW PRIORITY):
    ${ipLocation && !memoryLocation ? `IP Location: ${ipLocation}` : ""}
    ${memoryArchitecture ? `Architecture: ${memoryArchitecture}` : ""}

    Rules:
    - Use Resolved Location verbatim for all tools
    - Never override memory-backed values
    - IP data is fallback only
    `.trim()


    console.log(enrichedMessage)

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

      console.log(JSON.stringify(plannerParsed))

      if (!plannerParsed.tools_required) {
        const normalResponse = await model.invoke([
          new HumanMessage(enrichedMessage),
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
