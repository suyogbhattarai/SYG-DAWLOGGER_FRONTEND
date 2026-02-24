"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/utils/lib/redux/store";
import Loader from "@/components/ui/Loader";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { user, initialized, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (initialized && !loading && !user) {
      router.replace("/");
    }
  }, [initialized, loading, user, router]);

  if (!initialized || loading) return <Loader fullScreen />;
  if (!user) return null;

  return children;
}
