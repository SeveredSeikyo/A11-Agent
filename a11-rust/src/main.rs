use clap::{Parser, Subcommand};
use anyhow::Result;

mod arch;
mod ports;

#[derive(Parser)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    GetArch,
    ReservePort {
        kind: String, 
    },
}


fn main() -> Result<()> {
    let cli = Cli::parse();

    match cli.command {
        Commands::GetArch => {
            arch::run()?;
        }
        Commands::ReservePort { kind } => {
            ports::run(kind)?;
        }
    }

    Ok(())
}