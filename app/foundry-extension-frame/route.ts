import { EXTENSION_FRAME_HTML } from "@/lib/foundry-extensions";

export function GET() {
  return new Response(EXTENSION_FRAME_HTML, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "content-security-policy": "default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; frame-ancestors 'self'",
      "x-content-type-options": "nosniff",
      "cache-control": "no-store",
      "referrer-policy": "no-referrer",
    },
  });
}
