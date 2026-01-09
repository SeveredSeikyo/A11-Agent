import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { getRustArchInfo } from "../utils/getArch.util";

export const getArchTool = tool(
    async () => {
        try{
            const archData = await getRustArchInfo();

            return {
                success: true,
                architecture: archData
            }

        }catch(e){
            console.log(`error: `,e);
        }
    }, 
    {
        name: "getArch",
        description: "Retrieves detailed system architecture and platform information by executing the internal Rust-based diagnostic binary. Use this whenever you need to know the hardware architecture (x86_64, arm, etc.) or OS details of the host machine.",
        schema: z.object({}),
    }

)