import { join } from "node:path";

export async function getSystemInfo(command: string[]) { 
    const rustProjectDir = join(import.meta.dir, "..", "..", "a11-rust");
    const isWindows = process.platform === "win32";
    const binaryName = isWindows? "a11-rust.exe" : "a11-rust";
    const destinationPath = join(rustProjectDir, "target", "release", binaryName);
    const proc = Bun.spawn(
        [destinationPath, ...command], 
        { 
            cwd: rustProjectDir, 
            stdout: "pipe", 
            stderr: "inherit", 
        }
    );
    const output = await new Response(proc.stdout).json();
    return output; 
}