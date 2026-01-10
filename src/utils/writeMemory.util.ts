import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const memoryPath = join(process.cwd(), "db", "a11-memory.json");

export async function writeMemory(data: unknown) {
    try {
        await mkdir(join(process.cwd(), "db"), { recursive: true });
        await writeFile(memoryPath, JSON.stringify(data, null, 2));
        return { success: true };
    } catch (e) {
        console.error("Memory write failed:", e);
        return { success: false };
    }
}
