use std::net::{TcpListener, SocketAddr, Ipv6Addr};
use serde::Serialize;
use anyhow::Result;

#[derive(Serialize)]
struct PortInfo {
    host_port: u16,
    range: String,
}

fn port_is_free(port: u16) -> bool {
    let addrs = [
        SocketAddr::from(([127, 0, 0, 1], port)), // IPv4 loopback
        SocketAddr::from(([0, 0, 0, 0], port)),   // IPv4 all
        SocketAddr::from((Ipv6Addr::LOCALHOST, port)),          // IPv6 loopback
    ];

    addrs.iter().all(|addr| TcpListener::bind(addr).is_ok())
}

pub fn run(kind: String) -> Result<()> {
    let (range, label) = match kind.as_str() {
        "frontend" => (3000..3100, "3000-3100"),
        "backend" => (5000..5100, "5000-5100"),
        _ => {
            println!(r#"{{"error":"invalid project kind"}}"#);
            return Ok(());
        }
    };

    for port in range {
        // Optional safety: avoid known running ports
        if port == 3000 || port == 5000 {
            continue;
        }

        if port_is_free(port) {
            let info = PortInfo {
                host_port: port,
                range: label.to_string(),
            };
            println!("{}", serde_json::to_string_pretty(&info)?);
            return Ok(());
        }
    }

    println!(r#"{{"error":"no free ports available"}}"#);
    Ok(())
}
