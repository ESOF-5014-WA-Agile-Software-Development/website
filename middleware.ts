import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/proxy/coingecko")) {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=cad"
    );
    const data = await response.json();
    return NextResponse.json(data);
  }

  return NextResponse.next();
}