use serde::Serialize;
use anyhow::{Result, anyhow};
use std::env;

#[derive(Serialize, Debug)]
struct ArchInfo {
    arch: String,
    platform: String,
    os: String,
}

/// Detects architecture using Rust's built-in environment constants.
/// This is cross-platform and doesn't rely on external commands like 'uname'.
fn detect_architecture() -> Result<ArchInfo> {
    // Rust provides these at compile time/runtime via std::env::consts
    let arch = env::consts::ARCH.to_string();
    let os = env::consts::OS.to_string();

    // Map to your desired platform string format
    let platform = match (os.as_str(), arch.as_str()) {
        ("linux", "x86_64") => "linux/amd64",
        ("linux", "aarch64") => "linux/arm64",
        ("windows", "x86_64") => "windows/amd64",
        ("windows", "aarch64") => "windows/arm64",
        ("macos", "x86_64") => "darwin/amd64",
        ("macos", "aarch64") => "darwin/arm64",
        _ => "unknown",
    }.to_string();

    Ok(ArchInfo {
        arch,
        platform,
        os,
    })
}

fn main() -> Result<()> {
    let info = detect_architecture()?;
    
    // Ensure you have: serde = { version = "1.0", features = ["derive"] } in Cargo.toml
    let json = serde_json::to_string_pretty(&info)
        .map_err(|e| anyhow!("Serialization error: {}", e))?;
    
    println!("{}", json);
    Ok(())
}