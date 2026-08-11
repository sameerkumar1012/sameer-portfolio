import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: true });

/**
 * Renders model-generated markdown to HTML that is safe to inject.
 *
 * The answer text comes from an LLM, so it must be treated as untrusted even
 * though our own backend produced it. Two defences:
 *
 *  1. `<` is escaped before parsing, so no raw HTML tag can survive into the
 *     output. Markdown itself never needs a literal `<`, so headings, lists,
 *     emphasis, code fences and links all still work.
 *  2. Link and image URLs using anything other than http/https/mailto are
 *     replaced, which blocks `javascript:` and `data:` payloads.
 */
export function renderMarkdown(text: string): string {
  const escaped = text.replace(/</g, "&lt;");
  const html = marked.parse(escaped, { async: false });
  return stripUnsafeUrls(html);
}

const SAFE_PROTOCOL = /^(https?:|mailto:|#|\/)/i;

/**
 * Drops spaces and control characters, which are the usual way of hiding a
 * dangerous scheme from a naive prefix check (`java\tscript:alert(1)`).
 */
function stripBlanks(url: string): string {
  let out = "";
  for (const char of url) {
    if (char.charCodeAt(0) > 32) out += char;
  }
  return out;
}

function stripUnsafeUrls(html: string): string {
  return html.replace(
    /\b(href|src)\s*=\s*"([^"]*)"/gi,
    (match, attribute: string, url: string) => {
      return SAFE_PROTOCOL.test(stripBlanks(url)) ? match : `${attribute}="#"`;
    },
  );
}
