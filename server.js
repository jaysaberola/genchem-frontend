process.env.PRETTY_HTML = process.env.PRETTY_HTML || "true";

const { installPrettyHtmlResponseHook } = require("./lib/prettyHtmlHook.js");
installPrettyHtmlResponseHook();

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const path = require("path");
const { shouldPrettyHtml } = require("./lib/prettyHtmlHook.js");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "127.0.0.1";
const port = parseInt(process.env.PORT || "3002", 10);

const documentJs = path.join(__dirname, ".next", "server", "pages", "_document.js");
if (!dev && !fs.existsSync(documentJs)) {
  console.error("\nMissing .next build. Run: npm run build && npm start\n");
  process.exit(1);
}

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res, parse(req.url || "", true));
  }).listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port} (pretty HTML: ${shouldPrettyHtml()})`);
  });
});
