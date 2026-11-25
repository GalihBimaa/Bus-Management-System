"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BusRoadLoader } from "@/components/bus-loading";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const session = sessionStorage.getItem("nh_auth_session");
      if (!session) {
        router.replace("/login");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [router]);

  return <BusRoadLoader title="MENYIAPKAN HALAMAN..." />;
}
