import { NextResponse } from "next/server";

export async function GET() {
  const hasClientId = Boolean(process.env.GOOGLE_CLIENT_ID?.trim());
  const hasClientSecret = Boolean(process.env.GOOGLE_CLIENT_SECRET?.trim());
  const enabled = hasClientId && hasClientSecret;

  return NextResponse.json({
    enabled,
    message: enabled
      ? "Google OAuth is configured"
      : "Google OAuth chưa được cấu hình đầy đủ. Cần thêm GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET.",
  });
}
