"use client";

// This is a Client Component because it needs to run
// isUserAuthenticated() in the browser where cookies are accessible.

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isUserAuthenticated } from "@/lib/auth";

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    useEffect(() => {
        // Redirect unauthenticated users away from protected pages.
        if (!isUserAuthenticated()) {
            router.push("/login");
        }
    }, [router]);

    // Render nothing while the auth check runs to prevent a flash
    // of protected content before the redirect fires.
    if (!isUserAuthenticated()) return null;

    return <>{children}</>;
}