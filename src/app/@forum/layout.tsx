import React from "react";

export default function ForumLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <main className="min-h-screen w-full bg-[#f0f2f5]">{children}</main>;
}
