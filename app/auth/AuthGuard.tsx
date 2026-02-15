"use client";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const publicRoutes = ["/auth/login", "/auth/register"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && !publicRoutes.includes(pathname)) {
        router.replace("/auth/login");
      }

      if (user && publicRoutes.includes(pathname)) {
        router.replace("/");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  if (loading) return null;

  return <>{children}</>;
}