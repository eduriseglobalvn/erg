"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function GoogleAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const returnTo = searchParams.get("returnTo");

    const resolveReturnTo = () => {
      if (typeof window === "undefined") {
        return "/";
      }

      if (!returnTo) {
        return "/";
      }

      try {
        const target = new URL(returnTo, window.location.origin);
        const currentHost = window.location.hostname;
        const isAllowedHost =
          target.hostname === currentHost ||
          target.hostname === "erg.edu.local" ||
          target.hostname.endsWith(".erg.edu.local");

        if (!isAllowedHost) {
          return "/";
        }

        return target.toString();
      } catch {
        return "/";
      }
    };

    const redirectTarget = resolveReturnTo();

    const finalizeGoogleLogin = async () => {
      try {
        const response = await fetch("/api/auth/google/bridge", {
          method: "POST",
          credentials: "include",
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload.message || "Không thể hoàn tất đăng nhập Google");
        }

        queryClient.invalidateQueries({ queryKey: ["auth"] });

        if (!cancelled) {
          if (typeof window !== "undefined") {
            const targetUrl = new URL(redirectTarget, window.location.origin);

            if (targetUrl.origin !== window.location.origin) {
              window.location.replace(targetUrl.toString());
              return;
            }

            router.replace(`${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`);
            return;
          }

          router.replace("/");
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Đăng nhập Google thất bại";
          setError(message);
          window.setTimeout(() => {
            router.replace("/auth/login");
          }, 1800);
        }
      }
    };

    void finalizeGoogleLogin();

    return () => {
      cancelled = true;
    };
  }, [queryClient, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
        {error ? (
          <>
            <h1 className="text-lg font-semibold text-gray-900">Đăng nhập Google chưa hoàn tất</h1>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
          </>
        ) : (
          <>
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-b-2 border-black" />
            <h1 className="mt-4 text-lg font-semibold text-gray-900">Đang hoàn tất đăng nhập Google</h1>
            <p className="mt-2 text-sm text-gray-600">
              Hệ thống đang đồng bộ phiên Google sang tài khoản `erg`.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
