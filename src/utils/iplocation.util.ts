// iplocation.util.ts

type IpLocationResult =
    | {
          success: true;
          ip: string;
          city: string;
          region: string;
          country: string;
          timezone: string;
      }
    | {
          success: false;
          reason: "LOCAL_IP" | "PRIVATE_IP" | "LOOKUP_FAILED";
      };

const isLoopbackIp = (ip: string) =>
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip === "::ffff:127.0.0.1";

const isPrivateIpv4 = (ip: string) => {
    const normalized = ip.replace("::ffff:", "");
    return (
        normalized.startsWith("10.") ||
        normalized.startsWith("192.168.") ||
        normalized.startsWith("172.16.") ||
        normalized.startsWith("172.17.") ||
        normalized.startsWith("172.18.") ||
        normalized.startsWith("172.19.") ||
        normalized.startsWith("172.2") // covers 172.20–172.31
    );
};

export const ipLocation = async (ip: string): Promise<IpLocationResult> => {
    if (!ip) {
        return { success: false, reason: "LOOKUP_FAILED" };
    }

    if (isLoopbackIp(ip)) {
        return { success: false, reason: "LOCAL_IP" };
    }

    if (isPrivateIpv4(ip)) {
        return { success: false, reason: "PRIVATE_IP" };
    }

    try {
        const response = await fetch(
            `https://free.freeipapi.com/api/json/${ip}`
        );

        if (!response.ok) {
            throw new Error("IP API request failed");
        }

        const data: any = await response.json();

        return {
            success: true,
            ip: data.ipAddress,
            city: data.cityName,
            region: data.regionName,
            country: data.countryName,
            timezone: data.timeZone,
        };
    } catch (error) {
        console.error("Geolocation error:", error);
        return { success: false, reason: "LOOKUP_FAILED" };
    }
};
