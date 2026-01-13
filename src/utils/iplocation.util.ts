// iplocation.util.ts

import tzLookup from "tz-lookup"

type IpLocationResult =
  | {
      success: true
      ip: string
      city: string
      region: string
      country: string
      timezone: string
    }
  | {
      success: false
      reason: "LOCAL_IP" | "PRIVATE_IP" | "LOOKUP_FAILED"
    }

const isLoopbackIp = (ip: string) =>
  ip === "127.0.0.1" ||
  ip === "::1" ||
  ip === "::ffff:127.0.0.1"

const isPrivateIpv4 = (ip: string) => {
  const normalized = ip.replace("::ffff:", "")
  return (
    normalized.startsWith("10.") ||
    normalized.startsWith("192.168.") ||
    normalized.startsWith("172.16.") ||
    normalized.startsWith("172.17.") ||
    normalized.startsWith("172.18.") ||
    normalized.startsWith("172.19.") ||
    normalized.startsWith("172.2")
  )
}

export const ipLocation = async (ip: string): Promise<IpLocationResult> => {
  if (!ip) {
    return { success: false, reason: "LOOKUP_FAILED" }
  }

  if (isLoopbackIp(ip)) {
    return { success: false, reason: "LOCAL_IP" }
  }

  if (isPrivateIpv4(ip)) {
    return { success: false, reason: "PRIVATE_IP" }
  }

  try {
    const response = await fetch(
      `https://free.freeipapi.com/api/json/${ip}`
    )

    if (!response.ok) {
      throw new Error("IP API request failed")
    }

    const data: any = await response.json()

    let timezone = "UTC"

    if (
      typeof data.latitude === "number" &&
      typeof data.longitude === "number"
    ) {
      try {
        timezone = tzLookup(data.latitude, data.longitude)
      } catch {}
    }

    return {
      success: true,
      ip: data.ipAddress,
      city: data.cityName,
      region: data.regionName,
      country: data.countryName,
      timezone,
    }
  } catch (error) {
    console.error("Geolocation error:", error)
    return { success: false, reason: "LOOKUP_FAILED" }
  }
}
