"use client";

import React, { useState } from "react";
import { useBusSystem, ActiveBusGps } from "@/lib/bus-system-context";

const quickStops = [
  {
    name: "Terminal Giwangan (Yogyakarta)",
    next: "Agen Sleman Utara",
    eta: "14:45 WIB",
    lat: -7.8342,
    lng: 110.3919,
    progress: 5,
  },
  {
    name: "Agen Sleman Utara (DIY)",
    next: "Terminal Tirtonadi Solo",
    eta: "16:30 WIB",
    lat: -7.7161,
    lng: 110.3558,
    progress: 18,
  },
  {
    name: "Terminal Tirtonadi (Solo)",
    next: "RM Taman Sari Ngawi",
    eta: "18:30 WIB",
    lat: -7.5514,
    lng: 110.8186,
    progress: 35,
  },
  {
    name: "RM Taman Sari Ngawi",
    next: "Rest Area Mojokerto",
    eta: "21:00 WIB",
    lat: -7.4289,
    lng: 111.4461,
    progress: 50,
  },
  {
    name: "Pelabuhan Ketapang - Gilimanuk",
    next: "Terminal Mengwi Bali",
    eta: "07:30 WITA",
    lat: -8.1446,
    lng: 114.4032,
    progress: 88,
  },
  {
    name: "Terminal Mengwi (Denpasar - Bali)",
    next: "Tiba di Tujuan",
    eta: "Selesai",
    lat: -8.5403,
    lng: 115.1714,
    progress: 100,
  },
];

export default function LiveGpsTrackingPage() {
  const { userRole, activeGpsFleet, updateBusGps } = useBusSystem();

  const [selectedBusId, setSelectedBusId] = useState<string>(
    activeGpsFleet[0]?.busId || "B-001"
  );
  const [showDriverControl, setShowDriverControl] = useState(false);

  const selectedBus =
    activeGpsFleet.find((b) => b.busId === selectedBusId) || activeGpsFleet[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Live GPS Posisi Armada
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Pemantauan posisi bus sepanjang koridor Yogyakarta — Bali
          </p>
        </div>

        {/* HANYA ADMIN / KRU yang memiliki akses kirim/update lokasi GPS Sopir */}
        {userRole === "admin" && (
          <button
            type="button"
            onClick={() => setShowDriverControl(!showDriverControl)}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold uppercase w-fit"
          >
            {showDriverControl
              ? "Tutup Panel GPS Sopir"
              : "Update GPS Sopir (Khusus Admin/Kru)"}
          </button>
        )}
      </div>

      {/* Bar Progres Perjalanan */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-base font-bold text-slate-900">
            {selectedBus.plateNumber} — {selectedBus.busName} (
            {selectedBus.busClass})
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold w-fit">
            {selectedBus.operationalStatus} • {selectedBus.speedKmh} km/jam
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>Yogyakarta</span>
            <span className="text-emerald-700">
              {selectedBus.currentLocationName} (
              {selectedBus.routeProgressPercent}%)
            </span>
            <span>Bali (Denpasar)</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${selectedBus.routeProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Panel Update Lokasi Sopir (Hanya muncul untuk Admin/Kru) */}
      {userRole === "admin" && showDriverControl && (
        <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200 p-5 space-y-4">
          <div className="text-sm font-bold text-emerald-950">
            Panel Transmisi Lokasi Sopir — {selectedBus.plateNumber} (Sopir:{" "}
            {selectedBus.driverPrimary})
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {quickStops.map((stop, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  updateBusGps(selectedBus.busId, {
                    lat: stop.lat,
                    lng: stop.lng,
                    currentLocationName: stop.name,
                    nextStopName: stop.next,
                    etaNextStop: stop.eta,
                    routeProgressPercent: stop.progress,
                    speedKmh: stop.progress === 100 ? 0 : 78,
                  })
                }
                className="p-2.5 rounded-xl bg-white border border-emerald-200 hover:border-emerald-600 text-left text-xs"
              >
                <div className="font-bold text-slate-900">{stop.name}</div>
                <div className="text-emerald-700 font-semibold">
                  Progres {stop.progress}%
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                "Berjalan Normal",
                "Boarding Penumpang di Agen",
                "Berhenti di Rumah Makan",
                "Menyeberang Kapal Ferry",
              ] as ActiveBusGps["operationalStatus"][]
            ).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() =>
                  updateBusGps(selectedBus.busId, {
                    operationalStatus: st,
                    speedKmh: st === "Berjalan Normal" ? 80 : 0,
                  })
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                  selectedBus.operationalStatus === st
                    ? "bg-emerald-700 text-white border-emerald-700"
                    : "bg-white text-slate-700 border-slate-300"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3 Kartu Posisi Bus */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {activeGpsFleet.map((bus) => {
          const isSelected = bus.busId === selectedBus.busId;
          return (
            <div
              key={bus.busId}
              onClick={() => setSelectedBusId(bus.busId)}
              className={`cursor-pointer bg-white rounded-2xl border p-5 space-y-3 transition ${
                isSelected
                  ? "border-2 border-emerald-600"
                  : "border-slate-200 hover:border-emerald-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-emerald-800 text-white text-xs font-bold">
                  {bus.busClass}
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  {bus.speedKmh} km/jam
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {bus.plateNumber}
                </h3>
                <p className="text-xs text-slate-500">{bus.busName}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 text-xs space-y-1">
                <div>
                  <span className="text-slate-400 block">Lokasi Saat Ini</span>
                  <strong className="text-slate-800">
                    {bus.currentLocationName}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Sopir Bertugas</span>
                  <strong className="text-slate-700">{bus.driverPrimary}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
