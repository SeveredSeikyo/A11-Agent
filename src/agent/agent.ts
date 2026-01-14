//import { ChatLlamaCpp } from "@langchain/community/chat_models/llama_cpp";
import { ChatOllama } from "@langchain/ollama";

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL;
//const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;

export const model = new ChatOllama({
    model: "qwen3:1.7b", 
    temperature: 0,
    // configuration: {
    //     baseURL: `${OLLAMA_BASE_URL}/v1` 
    // },
    // apiKey: OLLAMA_API_KEY,
    baseUrl: `${OLLAMA_BASE_URL}`,
    think: false
    
});

export const thinkModel = new ChatOllama({
    model: "qwen3:1.7b", 
    temperature: 0,
    // configuration: {
    //     baseURL: `${OLLAMA_BASE_URL}/v1` 
    // },
    // apiKey: OLLAMA_API_KEY,
    baseUrl: `${OLLAMA_BASE_URL}`
    
});

// const llamaPath = "../../../llama.cpp/models/Phi3/Phi-3.gguf"

// export const model = await ChatLlamaCpp.initialize({
//   modelPath: llamaPath,
//   contextSize: 4096,
//   gpuLayers: 15,
// })

// const response = await model.invoke([
//   new HumanMessage({
//     content: "Hello my guy"
//   }),
// ]);

// console.log({response})

// const tools = [
//         getWeatherToday,
//         getDateTool,
//         sendEmail,
//         getNews,
//         webSearch,
//         sendSlackMessage,
//         sendDiscordMessage,
//         getLocation,
//         getArchTool,
//         getPortsTool,
//         memoryTool
// ];

// export const agent = createAgent({
//     model: model, 
//     tools: tools, 
// });