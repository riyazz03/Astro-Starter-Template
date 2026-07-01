import { createServer } from "http";
import { writeFileSync, readFileSync } from "fs";
import { resolve } from "path";

const PORT = 4322;
const root = process.cwd();
const ALLOWED_FILES = new Set(["colors", "typography", "fluid"]);

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4321");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

const server = createServer((req, res) => {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/tokens") {
    const data = {
      colors: JSON.parse(readFileSync(resolve(root, "bettervars/colors.json"), "utf-8")),
      typography: JSON.parse(readFileSync(resolve(root, "bettervars/typography.json"), "utf-8")),
      fluid: JSON.parse(readFileSync(resolve(root, "bettervars/fluid.json"), "utf-8")),
    };
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
    return;
  }

  if (req.method === "POST" && req.url === "/save") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { file, data } = JSON.parse(body);
        if (!ALLOWED_FILES.has(file)) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Unknown token file." }));
          return;
        }
        const filePath = resolve(root, `bettervars/${file}.json`);
        writeFileSync(filePath, JSON.stringify(data, null, 2));
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`BetterVars studio server -> http://localhost:${PORT} (local only)`);
});
