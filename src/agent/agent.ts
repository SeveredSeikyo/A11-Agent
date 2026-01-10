import { createAgent } from "langchain"; 
import { ChatOpenAI } from "@langchain/openai";
import { getWeatherToday } from "../tools/weatherTool";
import { getDateTool } from "../tools/getDateTool";
import { sendEmail } from "../tools/gmailTool";
import { getNews } from "../tools/newsTool";
import { webSearch } from "../tools/webSearchTool";
import { sendSlackMessage } from "../tools/slackTool";
import { sendDiscordMessage } from "../tools/discordTool";
import { getLocation } from "../tools/geoLocationTool";
import { getArchTool } from "../tools/getArchTool";
import { getPortsTool } from "../tools/getPortsTool";
import { memoryTool } from "../tools/memoryTool";

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL;
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;

const model = new ChatOpenAI({
    model: "qwen3:1.7b", 
    configuration: {
        baseURL: `${OLLAMA_BASE_URL}/v1` 
    },
    apiKey: OLLAMA_API_KEY
});

export const agent = createAgent({
    model: model, 
    tools: [
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
        memoryTool
    ], 
});


