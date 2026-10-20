import { css as beautifyCss, html as beautifyHtml } from "js-beautify";

function prettyHtmlEnabled(): boolean {
  const flag = (process.env.PRETTY_HTML || "").trim().toLowerCase();
  return flag !== "0" && flag !== "false";
}

export function formatCmsHtmlForViewSource(html: string): string {
  const input = (html || "").trim();
  if (!input || !prettyHtmlEnabled()) return html;

  try {
    return beautifyHtml(input, {
      indent_size: 2,
      wrap_line_length: 0,
      preserve_newlines: true,
      max_preserve_newlines: 5,
      indent_inner_html: true,
      end_with_newline: false,
    });
  } catch {
    return html;
  }
}

export function formatCmsCssForViewSource(css: string): string {
  const input = (css || "").trim();
  if (!input || !prettyHtmlEnabled()) return css;

  try {
    return beautifyCss(input, {
      indent_size: 2,
      wrap_line_length: 0,
      end_with_newline: false,
    });
  } catch {
    return css;
  }
}
