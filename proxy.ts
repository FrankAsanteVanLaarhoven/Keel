import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const nonce = crypto.randomUUID().replace(/-/g, "");
  const isDev = process.env.NODE_ENV === "development";
  const connect = [
    "'self'",
    "https://api.x.ai",
    "wss://api.x.ai",
    isDev ? "ws://127.0.0.1:3960 ws://localhost:3960 http://127.0.0.1:3960 http://localhost:3960" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src ${connect}`,
    "media-src 'self' blob:",
    "worker-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    isDev ? "" : "upgrade-insecure-requests",
  ]
    .filter(Boolean)
    .join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Permissions-Policy", "microphone=(self), camera=(), geolocation=(), payment=()");
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set("Vary", "Cookie, Accept-Language");

  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("Pragma", "no-cache");
  } else {
    response.headers.set("Cache-Control", "private, no-cache");
  }

  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|icon.svg|pcm-worklet.js|sw.js|manifest.webmanifest).*)",
    },
  ],
};
