import { ChatLlamaCpp } from "@langchain/community/chat_models/llama_cpp";

const llamaCppPath = "../../../llama.cpp/models/Phi3/Phi-3.gguf"

export const llamaModel = await ChatLlamaCpp.initialize({
    modelPath: llamaCppPath,
    gpuLayers: 15,
    contextSize: 4096,
})