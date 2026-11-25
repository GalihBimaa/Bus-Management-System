"use client";

import React from "react";
import Link from "next/link";
import { useBusSystem, formatRupiah } from "@/lib/bus-system-context";

export default function DashboardPage() {
  const {
    userRole,
    schedules,
    baggageList,
    heatmapData,
  } = useBusSystem();

  const totalSeats = schedules.reduce((acc, s) => acc + s.seats.length, 0);
  const occupiedSeats = schedules.reduce(
    (acc, s) => acc + s.seats.filter((st) => st.status === "occupied").length,
    0
  );
  const boardedSeats = schedules.reduce(
    (acc, s) =>
      acc + s.seats.filter((st) => st.status === "occupied" && st.boarded).length,
    0
  );
  const totalRevenue = schedules.reduce(
    (acc, s) =>
      acc +
      s.seats
        .filter((st) => st.status === "occupied")
        .reduce((sum, st) => sum + (st.pricePaid || s.basePrice), 0),
    0
  );

  // Daftar kartu menu yang rapi (harus diklik dulu untuk masuk ke halamannya, tidak bertumpuk di beranda)
  const menuCards = [
    {
      href: "/dashboard/denah-kursi",
      title: "Denah Kursi & Order",
      subtitle:
        userRole === "pengguna"
          ? "Pilih kursi kosong & opsi Solo Traveler Wanita"
          : userRole === "admin"
          ? "Pemesanan loket & cek data kursi penumpang"
          : "Atur tarif Dynamic Pricing & pantau okupansi kursi",
      image: "/buses/card-suite.svg",
      buttonLabel: "Buka Denah Kursi",
      roles: ["pengguna", "admin", "owner"],
    },
    {
      href: "/dashboard/armada",
      title: "Armada & Kelas Bus",
      subtitle:
        userRole === "admin"
          ? "Kelola unit bus Sleeper, Suite & tambah armada"
          : "Lihat fasilitas Sleeper Class, Suite & Eksekutif",
      image: "/buses/card-sleeper.svg",
      buttonLabel: "Lihat Armada",
      roles: ["pengguna", "admin", "owner"],
    },
    {
      href: "/dashboard/jadwal",
      title: "Rute & Pemberhentian",
      subtitle:
        userRole === "admin"
          ? "Update pos pemberhentian rute Yogyakarta - Bali"
          : "Jadwal & titik singgah terminal, rumah makan & ferry",
      image: "/buses/card-executive.svg",
      buttonLabel: "Buka Rute",
      roles: ["pengguna", "admin", "owner"],
    },
    {
      href: "/dashboard/tracking",
      title: "Live GPS Bus",
      subtitle:
        userRole === "admin"
          ? "Pantau posisi bus & panel update lokasi GPS sopir"
          : "Lacak posisi & kecepatan bus di koridor Jawa - Bali",
      image: "/buses/card-sleeper.svg",
      buttonLabel: "Buka Live GPS",
      roles: ["pengguna", "admin", "owner"],
    },
    {
      href: "/dashboard/manifest-bagasi",
      title:
        userRole === "pengguna"
          ? "Cek QR Bagasi Saya"
          : "Manifest QR & Bagasi",
      subtitle:
        userRole === "pengguna"
          ? "Cek lokasi koper di Kompartemen A, B, atau C"
          : "Scan tiket penumpang naik & kelola kompartemen bagasi",
      image: "/buses/card-baggage.svg",
      buttonLabel:
        userRole === "pengguna" ? "Cek Bagasi" : "Kelola Manifest & Bagasi",
      roles: ["pengguna", "admin"],
    },
    {
      href: "/dashboard/heatmap",
      title: "Analitik & Heatmap Agen",
      subtitle:
        "Laporan pendapatan & perbandingan penumpang Agen Sleman vs Terminal",
      image: "/buses/card-executive.svg",
      buttonLabel: "Buka Analitik Owner",
      roles: ["owner"],
    },
  ].filter((c) => c.roles.includes(userRole));

  return (
    <div className="space-y-8">
      {/* 1. HERO SEDERHANA DENGAN GAMBAR IKONIK BUS (Tanpa Teks Bertumpuk) */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-200/90 via-slate-100 to-slate-200/75 border border-slate-300 p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 space-y-3">
            <span className="inline-block px-2.5 py-1 rounded bg-emerald-800 text-white text-xs font-bold uppercase">
              Mode Akses:{" "}
              {userRole === "pengguna"
                ? "Pengguna (Penumpang)"
                : userRole === "admin"
                ? "Admin Operasional"
                : "Owner PO Bus"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              {userRole === "pengguna"
                ? "Pesan Kursi & Lacak Perjalanan Anda"
                : userRole === "admin"
                ? "Kendali Operasional & Manifest Kru"
                : "Ringkasan Eksekutif & Analitik Armada"}
            </h1>
            <p className="text-sm text-slate-600">
              Pilih salah satu menu di bawah untuk membuka halaman fitur yang
              Anda butuhkan.
            </p>
            <div className="pt-1">
              <Link
                href={
                  userRole === "owner"
                    ? "/dashboard/heatmap"
                    : "/dashboard/denah-kursi"
                }
                className="inline-block px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider transition"
              >
                {userRole === "owner"
                  ? "Buka Laporan & Heatmap"
                  : "Pilih Kursi & Order"}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            <img
              src="/buses/hero-coach.svg"
              alt="Bus Ikonik Nusantara Hijau"
              className="w-full max-w-xl h-auto object-contain drop-shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* 2. RINGKASAN ANGKA SESUAI WEWENANG ROLE */}
      {userRole === "pengguna" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-400">Kursi Tersedia Hari Ini</span>
            <div className="text-xl font-bold text-emerald-700 mt-0.5">
              {totalSeats - occupiedSeats} Kursi Kosong
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-400">Pilihan Kelas Bus</span>
            <div className="text-xl font-bold text-slate-900 mt-0.5">
              Sleeper, Suite & Eksekutif
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-400">Rute Aktif</span>
            <div className="text-xl font-bold text-slate-900 mt-0.5">
              Yogyakarta — Bali
            </div>
          </div>
        </div>
      )}

      {userRole === "admin" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-400">Kursi Terisi</span>
            <div className="text-xl font-bold text-slate-900 mt-0.5">
              {occupiedSeats} / {totalSeats} Kursi
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-400">Sudah Scan Naik</span>
            <div className="text-xl font-bold text-emerald-700 mt-0.5">
              {boardedSeats} Penumpang
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-400">Belum Naik</span>
            <div className="text-xl font-bold text-amber-700 mt-0.5">
              {occupiedSeats - boardedSeats} Penumpang
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-400">Bagasi Kompartemen</span>
            <div className="text-xl font-bold text-slate-900 mt-0.5">
              {baggageList.length} Koper
            </div>
          </div>
        </div>
      )}

      {userRole === "owner" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-400">Total Pendapatan Tiket</span>
            <div className="text-xl font-bold text-emerald-700 mt-0.5">
              {formatRupiah(totalRevenue)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-400">Tingkat Okupansi</span>
            <div className="text-xl font-bold text-slate-900 mt-0.5">
              {Math.round((occupiedSeats / totalSeats) * 100)}% ({occupiedSeats}/
              {totalSeats})
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-400">Agen Terpadat</span>
            <div className="text-base font-bold text-slate-900 mt-1 truncate">
              {heatmapData[0]?.pointName}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-400">Pertumbuhan Agen</span>
            <div className="text-xl font-bold text-emerald-700 mt-0.5">
              +{heatmapData[0]?.growthPercent}%
            </div>
          </div>
        </div>
      )}

      {/* 3. GRID KARTU MENU (Klik dulu baru masuk ke halaman masing-masing agar tidak semrawut) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {menuCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group bg-white rounded-2xl border border-slate-200 hover:border-emerald-600 overflow-hidden shadow-2xs transition flex flex-col justify-between"
          >
            <div>
              <div className="h-36 bg-slate-900 overflow-hidden border-b border-slate-200">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-5 space-y-1.5">
                <h2 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition">
                  {card.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  {card.subtitle}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5">
              <span className="inline-block w-full py-2.5 rounded-lg bg-emerald-50 group-hover:bg-emerald-700 text-emerald-800 group-hover:text-white text-center text-xs font-bold uppercase tracking-wider transition">
                {card.buttonLabel}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
