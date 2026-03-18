import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { shareClicked } from "./utils/backend";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const match = url.pathname.match(/\/share\/([^/]+)/);
  const id = match ? match[1] : null;

  if (id) {
    try {
      await shareClicked(id);
      console.log("連結被點擊");
    } catch (error) {
      console.error("處理分享錯誤:", error);
    }
  }

  // 重定向到首頁
  return NextResponse.redirect(new URL("/", req.url));
}

export const config = {
  matcher: "/share/:path*",
};
