import { join } from "node:path";

export async function getRustArchInfo() { 
    const rustProjectDir = join(import.meta.dir, "..", "..", "a11-rust");
    const proc = Bun.spawn(["cargo", "run", "--quiet"], { cwd: rustProjectDir, stdout: "pipe", stderr: "inherit", });
    const output = await new Response(proc.stdout).json(); 
    return output.platform; 
}