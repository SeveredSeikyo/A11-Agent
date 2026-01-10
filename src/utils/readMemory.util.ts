import { readFile } from "fs/promises";
import { join } from "path";

const memoryPath = join(process.cwd(), "db", "a11-memory.json");

export async function readMemory() {
    try {
        const data = await readFile(memoryPath, "utf-8");
        return JSON.parse(data);
    } catch {
        return {};
    }
}
