import os from "os";

function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      // ambil IPv4 non-internal (bukan 127.0.0.1)
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "127.0.0.1";
}

const ip = getLocalIP();
const port = process.env.PORT || 3000;

console.log(`✅ Next.js Dev Server akan bisa diakses di:`);
console.log(`   👉 http://${ip}:${port}`);
