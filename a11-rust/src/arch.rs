use serde::Serialize;
use anyhow::Result;
use std::env;

#[derive(Serialize, Debug)]
struct ArchInfo {
    arch: String,
    platform: String,
    os: String,
}

/// Detects architecture using Rust's built-in environment constants.
/// This is cross-platform and doesn't rely on external commands like 'uname'.
pub fn run() -> Result<()> {
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

    let info = ArchInfo {
        arch,
        platform,
        os,
    };

    println!("{}",serde_json::to_string_pretty(&info)?);

    Ok(())
}

