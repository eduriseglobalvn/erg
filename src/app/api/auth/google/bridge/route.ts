import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { appendAuthCookies } from "@/lib/auth-cookies";
import { fetchWithBackendFallback } from "@/lib/backend-url";
import { nextAuthOptions } from "@/lib/next-auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(nextAuthOptions);
  const googleSub = typeof session?.googleSub === "string" ? session.googleSub : "";
  const email = typeof session?.user?.email === "string" ? session.user.email : "";

  if (!session?.user || !googleSub || !email) {
    return NextResponse.json(
      { message: "Google session is missing or expired" },
      { status: 401 }
    );
  }

  try {
    const response = await fetchWithBackendFallback("/api/auth/google/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Bridge-Secret": process.env.AUTH_BRIDGE_SECRET || "",
        "User-Agent": request.headers.get("user-agent") || "erg-nextauth-bridge",
      },
      body: JSON.stringify({
        email,
        fullName: session.user.name || "",
        avatarUrl: session.user.image || "",
        googleSub,
        emailVerified: Boolean(session.emailVerified),
      }),
    });

    const responseHeaders = new Headers();
    const contentType = response.headers.get("content-type");
    if (contentType) {
      responseHeaders.set("Content-Type", contentType);
    }

    let responseBody = await response.text();

    if (response.ok) {
      try {
        const data = JSON.parse(responseBody);
        const refreshToken = data.refreshToken || data.data?.refreshToken;
        const accessToken = data.accessToken || data.data?.accessToken;
        const user = data.user || data.data?.user;

        appendAuthCookies(responseHeaders, {
          accessToken,
          refreshToken,
          userId: user?.id,
          provider: user?.provider,
          accountType: user?.accountType,
        });

        if (data.refreshToken) delete data.refreshToken;
        if (data.data?.refreshToken) delete data.data.refreshToken;
        if (data.accessToken) delete data.accessToken;
        if (data.data?.accessToken) delete data.data.accessToken;

        responseBody = JSON.stringify(data);
      } catch {
        // Keep original body when backend does not return JSON.
      }
    }

    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Google bridge failed";
    return NextResponse.json({ message }, { status: 503 });
  }
}
