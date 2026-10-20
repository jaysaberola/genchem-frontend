const http = require("http");
const { html: beautifyHtml } = require("js-beautify");

function shouldPrettyHtml() {
  const flag = (process.env.PRETTY_HTML || "").trim().toLowerCase();
  if (flag === "0" || flag === "false") return false;
  return true;
}

function shouldSkipPrettyUrl(url) {
  const pathname = (url || "").split("?")[0] || "";
  if (!pathname || pathname.startsWith("/_next") || pathname.startsWith("/cms-api")) {
    return true;
  }
  if (pathname.startsWith("/api/")) return true;
  return /\.[a-zA-Z0-9]+$/.test(pathname);
}

function prettifyNextDataScript(html) {
  return html.replace(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
    (_match, json) => {
      try {
        const parsed = JSON.parse(json.trim());
        return `<script id="__NEXT_DATA__" type="application/json">\n${JSON.stringify(parsed, null, 2)}\n</script>`;
      } catch {
        return _match;
      }
    },
  );
}

function beautifyResponseHtml(body) {
  const output = beautifyHtml(body, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: true,
    max_preserve_newlines: 5,
    indent_inner_html: true,
    indent_scripts: "keep",
    end_with_newline: true,
  });
  return prettifyNextDataScript(output);
}

function installPrettyHtmlResponseHook() {
  if (!shouldPrettyHtml() || http.ServerResponse.__genchemPrettyHtmlHook) return;
  http.ServerResponse.__genchemPrettyHtmlHook = true;

  const originalWrite = http.ServerResponse.prototype.write;
  const originalEnd = http.ServerResponse.prototype.end;

  http.ServerResponse.prototype.write = function patchedWrite(chunk, encoding, callback) {
    if (chunk && !shouldSkipPrettyUrl(this.req?.url)) {
      if (!this.__genchemHtmlChunks) this.__genchemHtmlChunks = [];
      this.__genchemHtmlChunks.push(
        Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk), typeof encoding === "string" ? encoding : "utf8"),
      );
      if (typeof encoding === "function") encoding();
      else if (typeof callback === "function") callback();
      return true;
    }
    return originalWrite.call(this, chunk, encoding, callback);
  };

  http.ServerResponse.prototype.end = function patchedEnd(chunk, encoding, callback) {
    const url = this.req?.url;
    const buffered = this.__genchemHtmlChunks || [];
    this.__genchemHtmlChunks = null;

    if (shouldSkipPrettyUrl(url)) {
      return originalEnd.call(this, chunk, encoding, callback);
    }

    if (chunk) {
      buffered.push(
        Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk), typeof encoding === "string" ? encoding : "utf8"),
      );
    }

    const body = buffered.length ? Buffer.concat(buffered).toString("utf8") : "";
    if (body.includes("<html") && body.includes("</body>") && body.length > 0 && body.length < 8_000_000) {
      try {
        const pretty = beautifyResponseHtml(body);
        this.removeHeader("Content-Length");
        return originalEnd.call(this, pretty, "utf8", typeof encoding === "function" ? encoding : callback);
      } catch {
        // fall through
      }
    }

    if (buffered.length) {
      for (const part of buffered) originalWrite.call(this, part);
    }
    return originalEnd.call(this, chunk, encoding, callback);
  };
}

module.exports = { installPrettyHtmlResponseHook, shouldPrettyHtml };
