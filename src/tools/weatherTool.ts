import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { fetchWeather } from "../utils/weather.util";

export const getWeatherToday = tool(
    async(
        { location }:
        { location: string }
    ) => {
        console.log('Weather tool calling..');
        const result = await fetchWeather({location});
        console.log('Fetched Weather');
        return result;
    }, {
        name: "getWeatherToday",
        description: "Get current weather conditions (temperature, humidity, and forecast description) for a specific city or region. Supports international locations and local language descriptions.",
        schema: z.object({
            location: z.string().describe("The city name and country code (e.g., 'London,GB' or 'Hyderabad,IN')")
        })
    }
)