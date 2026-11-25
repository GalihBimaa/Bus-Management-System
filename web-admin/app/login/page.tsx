"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BusRoadLoader } from "@/components/bus-loading";
import { AppUserRole } from "@/lib/bus-system-context";

const roleDetails: Record<
  AppUserRole,
  {
    title: string;
    email: string;
    accessList: string[];
    restrictedText: string;
  }
> = {
  pengguna: {
    title: "Pengguna (Penumpang)",
    email: "penumpang@nusantarahijau.id",
    accessList: [
      "Pilih kursi kosong & pesan tiket (termasuk opsi Solo Traveler Wanita)",
      "Lihat katalog kelas armada, rute Yogyakarta - Bali & posisi bus",
      "Cek status koper pribadi dengan kode QR Bagasi",
    ],
    restrictedText:
      "Tidak dapat mengubah harga, mengubah jadwal/armada, atau melihat data penumpang lain.",
  },
  admin: {
    title: "Admin (Operasional & Kru)",
    email: "admin@nusantarahijau.id",
    accessList: [
      "Scan QR tiket manifest penumpang naik & kelola kompartemen bagasi A/B/C",
      "Update titik pemberhentian rute & kirim lokasi GPS sopir",
      "Tambah unit armada baru & lihat detail seluruh kursi penumpang",
    ],
    restrictedText:
      "Tidak dapat mengubah kebijakan Dynamic Pricing atau membuka laporan finansial & Heatmap Owner.",
  },
  owner: {
    title: "Owner (Pemilik PO Bus)",
    email: "owner@nusantarahijau.id",
    accessList: [
      "Lihat laporan pendapatan finansial & Heatmap Analitik Agen (Sleman vs Terminal)",
      "Atur kebijakan harga Dynamic Pricing (Akhir Pekan, Libur Panjang, Promo)",
      "Pantau posisi Live GPS seluruh armada & tingkat keterisian kursi",
    ],
    restrictedText:
      "Khusus pemantauan eksekutif & kebijakan tarif (operasional teknis dijalankan oleh Admin).",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<AppUserRole>("pengguna");
  const [email, setEmail] = useState(roleDetails.pengguna.email);
  const [password, setPassword] = useState("12345678");
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectRole = (nextRole: AppUserRole) => {
    setRole(nextRole);
    setEmail(roleDetails[nextRole].email);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "nh_auth_session",
        JSON.stringify({
          role,
          email,
          loggedInAt: new Date().toISOString(),
        })
      );
    }

    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  if (isLoading) {
    return (
      <BusRoadLoader
        title="MENYIAPKAN PORTAL..."
        subtitle={`Masuk sebagai ${roleDetails[role].title}`}
      />
    );
  }

  const currentInfo = roleDetails[role];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Kiri: Gambar Bus Ikonik */}
        <div className="lg:col-span-5 bg-slate-100 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200">
          <div>
            <img
              src="/buses/logo-silhouette.svg"
              alt="Logo Nusantara Hijau"
              className="h-11 w-auto object-contain -mb-1"
            />
            <div className="inline-block border-y-2 border-emerald-950 py-0.5 px-1">
              <span className="text-lg font-extrabold text-emerald-950 italic">
                NUSANTARA
              </span>
              <span className="text-lg font-light text-emerald-600 italic">
                HIJAU
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Sistem Keberangkatan Bus Yogyakarta — Bali
            </p>
          </div>

          <div className="py-6">
            <img
              src="/buses/hero-coach.svg"
              alt="Bus Nusantara Hijau"
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="text-xs font-semibold text-emerald-800">
            Sleeper Class • Suite Class • Eksekutif
          </div>
        </div>

        {/* Kanan: Pilih Role & Login */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-5">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Masuk ke Sistem
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Pilih hak akses untuk melihat perbedaan fitur tiap peran
            </p>
          </div>

          {/* 3 Tombol Role: Pengguna, Admin, Owner */}
          <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-xl">
            {(["pengguna", "admin", "owner"] as AppUserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleSelectRole(r)}
                className={`py-2.5 px-2 rounded-lg text-xs sm:text-sm font-bold capitalize transition ${
                  role === r
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {r === "pengguna"
                  ? "Pengguna"
                  : r === "admin"
                  ? "Admin"
                  : "Owner"}
              </button>
            ))}
          </div>

          {/* Kotak Ringkasan Hak Akses Role Terpilih */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              Hak Akses {currentInfo.title}:
            </div>
            <ul className="space-y-1 text-xs text-slate-700">
              {currentInfo.accessList.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
            <p className="text-[11px] text-slate-500 pt-1 border-t border-emerald-200/70">
              <strong>Batasan:</strong> {currentInfo.restrictedText}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Email Akun
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold transition"
            >
              Masuk Sebagai {currentInfo.title}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
