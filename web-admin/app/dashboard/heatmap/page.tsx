"use client";

import React from "react";
import Link from "next/link";
import { useBusSystem, formatRupiah } from "@/lib/bus-system-context";

export default function HeatmapPenumpangPage() {
  const { userRole, heatmapData, schedules } = useBusSystem();

  // BATASAN AKSES: Hanya Owner yang boleh membuka halaman Analitik Heatmap & Pendapatan
  if (userRole !== "owner") {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3 my-8">
        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase">
          Akses Terbatas
        </span>
        <h1 className="text-lg font-bold text-slate-900">
          Halaman Khusus Owner PO Bus
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Laporan pendapatan finansial dan analitik Heatmap ekspansi agen hanya
          dapat diakses oleh peran <strong>Owner</strong>.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-block px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold uppercase"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const totalRevenue = schedules.reduce(
    (acc, s) =>
      acc +
      s.seats
        .filter((st) => st.status === "occupied")
        .reduce((sum, st) => sum + (st.pricePaid || s.basePrice), 0),
    0
  );

  const totalPassengers = heatmapData.reduce(
    (sum, item) =>
      sum +
      item.morningCount +
      item.afternoonCount +
      item.eveningCount +
      item.nightCount,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Analitik Pendapatan & Heatmap Agen (Khusus Owner)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Evaluasi titik keberangkatan terpadat untuk pembukaan agen baru
          </p>
        </div>
        <div className="bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold">
          Pendapatan Hari Ini: {formatRupiah(totalRevenue)}
        </div>
      </div>

      {/* Daftar Ringkas Heatmap per Titik Agen */}
      <div className="space-y-3">
        {heatmapData.map((item, idx) => {
          const itemTotal =
            item.morningCount +
            item.afternoonCount +
            item.eveningCount +
            item.nightCount;
          const sharePercent = Math.round((itemTotal / totalPassengers) * 100);

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-emerald-700">
                    #{idx + 1}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {item.pointName}
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-semibold">
                    {item.type}
                  </span>
                </div>

                <div className="text-sm font-bold text-slate-900">
                  {itemTotal.toLocaleString("id-ID")} Penumpang ({sharePercent}%)
                  <span className="ml-2 text-xs text-emerald-700">
                    +{item.growthPercent}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block">Pagi</span>
                  <strong className="text-slate-800">
                    {item.morningCount} org
                  </strong>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50">
                  <span className="text-emerald-700 block">Siang</span>
                  <strong className="text-emerald-950">
                    {item.afternoonCount} org
                  </strong>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-700 text-white">
                  <span className="text-emerald-100 block">Sore (Puncak)</span>
                  <strong>{item.eveningCount} org</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50">
                  <span className="text-emerald-700 block">Malam</span>
                  <strong className="text-emerald-950">
                    {item.nightCount} org
                  </strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
