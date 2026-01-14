function resolvePath(obj: any, path: string) {
  return path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .reduce((acc, key) => acc?.[key], obj)
}

function resolveValue(value: any, context: Record<string, any>): any {
  // Case 1: Pure placeholder → return actual value (typed)
  if (
    typeof value === "string" &&
    /^\{\{[\w\d_]+(?:\.[\w\d_\[\]]+)?\}\}$/.test(value)
  ) {
    const [, stepId, path] =
      value.match(/^\{\{([\w\d_]+)(?:\.([\w\d_\[\]]+))?\}\}$/) || []

    if (!stepId) return null
    const base = context[stepId]
    if (!base) return null

    return path ? resolvePath(base, path) : base
  }

  // Case 2: String with embedded placeholders → interpolate as string
  if (typeof value === "string") {
    return value.replace(
      /\{\{([\w\d_]+)(?:\.([\w\d_\[\]]+))?\}\}/g,
      (_, stepId, path) => {
        const base = context[stepId]
        if (!base) return ""

        const resolved = path ? resolvePath(base, path) : base
        return resolved != null ? String(resolved) : ""
      }
    )
  }

  // Case 3: Array → recurse
  if (Array.isArray(value)) {
    return value.map((v) => resolveValue(v, context))
  }

  // Case 4: Object → recurse
  if (typeof value === "object" && value !== null) {
    const out: Record<string, any> = {}
    for (const key of Object.keys(value)) {
      out[key] = resolveValue(value[key], context)
    }
    return out
  }

  // Case 5: Primitive → return as-is
  return value
}

export function resolveArgs(
  args: Record<string, any>,
  context: Record<string, any>
) {
  return resolveValue(args, context)
}
