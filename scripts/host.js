// scripts/host.js
import os from "os";
import net from "net";
import qrcode from "qrcode-terminal";
import { execFileSync } from "child_process";

function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "127.0.0.1";
}

function getWindowsIP() {
  try {
    // Ambil IP dari interface Wi-Fi di Windows
    const output = execFileSync(
      "powershell.exe",
      [
        "-Command",
        "(Get-NetIPAddress -AddressFamily IPv4 " +
          "| Where-Object { $_.InterfaceAlias -match 'Wi-Fi' -and $_.IPAddress -match '^192\\.|^10\\.|^172\\.' } " +
          "| Select-Object -First 1 -ExpandProperty IPAddress)"
      ],
      { encoding: "utf8" }
    );

    const ip = output.split(/\r?\n/).find(Boolean);
    return ip?.trim() || null;
  } catch {
    return null;
  }
}


function findAvailablePort(startPort) {
  return new Promise((resolve) => {
    function check(port) {
      const server = net.createServer();
      server.once("error", () => check(port + 1));
      server.once("listening", () => {
        server.close(() => resolve(port));
      });
      server.listen(port);
    }
    check(startPort);
  });
}

const startPort = parseInt(process.env.PORT || "3000");
const port = await findAvailablePort(startPort);

// Ambil IP Windows, fallback ke IP WSL kalau gagal
const ip = getWindowsIP() || getLocalIP();

const localUrl = `http://localhost:${port}`;
const networkUrl = `http://${ip}:${port}`;

console.log("IP Windows", getWindowsIP());

console.log("✅ Next.js Dev Server bisa diakses di:");
console.log(`   👉 ${localUrl} (dari PC/WSL2)`);
console.log(`   👉 ${networkUrl} (dari HP / device lain)\n`);

console.log("📱 Scan QR Code ini untuk buka di HP / Tablet:");
qrcode.generate(networkUrl, { small: true });

console.log("\nℹ️ Live reload / Fast Refresh tetap jalan di HP / Tablet 👍");

process.env.PORT = port; // biar Next.js pakai port ini