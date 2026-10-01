import { NextResponse } from "next/server";

function missing() {
  return NextResponse.json({ error: "That address is not in this class." }, { status: 404 });
}

export const GET = missing;
export const POST = missing;
export const PUT = missing;
export const PATCH = missing;
export const DELETE = missing;
