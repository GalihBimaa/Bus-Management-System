"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BusRoadLoader } from "@/components/bus-loading";
import { useBusSystem, AppUserRole } from "@/lib/bus-system-context";

interface NavItem {
  href: string;
  label: string;
  roles: AppUserRole[];
}

const allNavItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Beranda",
    roles: ["pengguna", "admin", "owner"],
  },
  {
    href: "/dashboard/denah-kursi",
    label: "Kursi & Order",
    roles: ["pengguna", "admin", "owner"],
  },
  {
    href: "/dashboard/armada",
    label: "Armada Bus",
    roles: ["pengguna", "admin", "owner"],
  },
  {
    href: "/dashboard/jadwal",
    label: "Rute & Pemberhentian",
    roles: ["pengguna", "admin", "owner"],
  },
  {
    href: "/dashboard/tracking",
    label: "Live GPS",
    roles: ["pengguna", "admin", "owner"],
  },
  {
    href: "/dashboard/manifest-bagasi",
    label: "Bagasi & Manifest",
    roles: ["pengguna", "admin"],
  },
  {
    href: "/dashboard/heatmap",
    label: "Analitik & Pendapatan",
    roles: ["owner"],
  },
];

const roleLabelMap: Record<AppUserRole, string> = {
  pengguna: "Pengguna",
  admin: "Admin Operasional",
  owner: "Owner PO Bus",
};

export function ClassicHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { userRole, setUserRole } = useBusSystem();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isRouteLoading, setIsRouteLoading] = useState(true);

  useEffect(() => {
    setIsRouteLoading(true);

    if (typeof window !== "undefined") {
      const rawSession = sessionStorage.getItem("nh_auth_session");
      if (!rawSession) {
        router.replace("/login");
        return;
      }
      try {
        const parsed = JSON.parse(rawSession);
        if (
          parsed?.role === "pengguna" ||
          parsed?.role === "admin" ||
          parsed?.role === "owner"
        ) {
          setUserRole(parsed.role);
        }
      } catch {
        // ignore
      }
      setAuthChecked(true);
    }

    const timer = setTimeout(() => {
      setIsRouteLoading(false);
    }, 550);

    return () => clearTimeout(timer);
  }, [pathname, router, setUserRole]);

  const handleLogout = () => {
    setIsRouteLoading(true);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("nh_auth_session");
    }
    router.push("/login");
  };

  const allowedNavItems = allNavItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <>
      {(!authChecked || isRouteLoading) && (
        <BusRoadLoader
          title="BUS SEDANG MELAJU..."
          subtitle={`Memuat halaman untuk akses ${roleLabelMap[userRole]}`}
        />
      )}

      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40">
        {/* Strip Hijau Tua: Indikator Peran & Ganti Peran Cepat */}
        <div className="bg-emerald-950 text-emerald-100 text-xs">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-emerald-300 font-medium">Akses Aktif:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-700 text-white font-bold uppercase text-[11px]">
                {roleLabelMap[userRole]}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Sakelar Ganti Peran Cepat untuk Pengujian */}
              <div className="hidden sm:flex items-center gap-1">
                <span className="text-emerald-300/80 text-[11px] mr-1">
                  Uji Peran:
                </span>
                {(["pengguna", "admin", "owner"] as AppUserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setUserRole(r)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize transition ${
                      userRole === r
                        ? "bg-white text-emerald-950"
                        : "text-emerald-200 hover:bg-emerald-900"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="text-[11px] font-bold uppercase text-emerald-300 hover:text-white underline underline-offset-2"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>

        {/* Bar Utama: Logo Bus Ikonik di Kiri & Menu Sesuai Role di Kanan */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-3 shrink-0">
            <img
              src="/buses/logo-silhouette.svg"
              alt="Siluet Bus Nusantara Hijau"
              className="h-10 sm:h-11 w-auto object-contain"
            />
            <div className="border-y-2 border-emerald-950 py-0.5 px-1">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-emerald-950 italic">
                NUSANTARA
              </span>
              <span className="text-base sm:text-lg font-light tracking-tight text-emerald-600 italic">
                HIJAU
              </span>
            </div>
          </Link>

          {/* Menu Desktop (Hanya menampilkan menu yang diizinkan untuk Role tersebut) */}
          <nav className="hidden lg:flex items-center gap-1">
            {allowedNavItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard" || pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                    isActive
                      ? "bg-emerald-700 text-white"
                      : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold uppercase"
          >
            {mobileOpen ? "Tutup" : "Menu"}
          </button>
        </div>

        {/* Navigasi Geser Horizontal di HP & Tablet */}
        <div className="lg:hidden bg-slate-100 border-t border-slate-200 px-4 py-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {allowedNavItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard" || pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    isActive
                      ? "bg-emerald-700 text-white"
                      : "bg-white text-slate-700 border border-slate-200"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Dropdown Ganti Role di HP */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 p-4 space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase">
              Uji Ganti Peran Akses:
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["pengguna", "admin", "owner"] as AppUserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setUserRole(r);
                    setMobileOpen(false);
                  }}
                  className={`py-2 rounded-lg text-xs font-bold capitalize border ${
                    userRole === r
                      ? "bg-emerald-700 text-white border-emerald-700"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export function ClassicFooter() {
  return (
    <footer className="bg-emerald-950 text-emerald-100/70 py-5 border-t-2 border-emerald-700 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-white">
          PO Nusantara Hijau Trans — Yogyakarta • Bali
        </span>
        <span>Sleeper Class • Suite Class • Eksekutif</span>
      </div>
    </footer>
  );
}
