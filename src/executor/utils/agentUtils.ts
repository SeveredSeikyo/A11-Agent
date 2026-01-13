export function sanitizeJSON(text: string) {
  return text
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .trim()
}

export function isPrivateIP(ip: string) {
  return (
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("172.17.") ||
    ip.startsWith("172.18.") ||
    ip.startsWith("172.19.") ||
    ip.startsWith("172.2")
  )
}

export function getClientIP(ctx: any): string {
  return (
    ctx.request.headers.get("cf-connecting-ip") ||
    ctx.request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    ctx.ip ||
    "unknown"
  )
}

/** 🔒 Normalizes broken planner output (Ollama-safe) */
export function normalizePlannerOutput(parsed: any) {
  if (parsed?.tool && parsed?.args && parsed?.id) {
    return { tools_required: true, steps: [parsed] }
  }

  const strayTool = Object.values(parsed || {}).find(
    (v: any) => v?.tool && v?.args && v?.id
  )

  if (strayTool) {
    return { tools_required: true, steps: [strayTool] }
  }

  return parsed
}