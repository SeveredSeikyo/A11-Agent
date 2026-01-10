import { sendDiscordMessage } from "./discordTool"
import { getLocation } from "./geoLocationTool"
import { getArchTool } from "./getArchTool"
import { getDateTool } from "./getDateTool"
import { getPortsTool } from "./getPortsTool"
import { sendEmail } from "./gmailTool"
import { memoryTool } from "./memoryTool"
import { getNews } from "./newsTool"
import { sendSlackMessage } from "./slackTool"
import { getWeatherToday } from "./weatherTool"
import { webSearch } from "./webSearchTool"

export const tools = {
    getWeatherToday,
    getDateTool,
    sendEmail,
    getNews,
    webSearch,
    sendSlackMessage,
    sendDiscordMessage,
    getLocation,
    getArchTool,
    getPortsTool,
    memoryTool,
}