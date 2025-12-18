import { tavily, type TavilySearchOptions } from "@tavily/core";;

export const search = async(
    { question }:
    { question: string}
) => {
    const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

    const tavilySearchOptions: TavilySearchOptions = {
        includeAnswer: true,
    };

    const response = await tvly.search(question, tavilySearchOptions);

    return response.answer;
}