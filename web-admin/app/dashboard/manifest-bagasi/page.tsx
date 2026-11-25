"use client";

import React, { useState, useMemo } from "react";
import { useBusSystem, BaggageItem } from "@/lib/bus-system-context";

export default function ManifestDanBagasiPage() {
  const {
    userRole,
    schedules,
    selectedScheduleId,
    setSelectedScheduleId,
    togglePassengerBoarding,
    verifyTicketByCode,
    baggageList,
    updateBaggageStatus,
  } = useBusSystem();

  const [activeTab, setActiveTab] = useState<"bagasi" | "manifest">(
    userRole === "admin" ? "manifest" : "bagasi"
  );
  const [baggageQuery, setBaggageQuery] = useState("BAG-JG-101A");
  const [scanTicketInput, setScanTicketInput] = useState("");
  const [scanNotice, setScanNotice] = useState<string | null>(null);

  const currentSchedule = useMemo(
    () =>
      schedules.find((s) => s.id === selectedScheduleId) || schedules[0],
    [schedules, selectedScheduleId]
  );

  const occupiedSeats = useMemo(
    () => currentSchedule.seats.filter((s) => s.status === "occupied"),
    [currentSchedule]
  );

  const matchedBaggage = useMemo(() => {
    const q = baggageQuery.trim().toUpperCase();
    if (!q) return userRole === "pengguna" ? [] : baggageList;
    return baggageList.filter(
      (b) =>
        b.baggageCode.toUpperCase().includes(q) ||
        b.ticketCode.toUpperCase().includes(q)
    );
  }, [baggageList, baggageQuery, userRole]);

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = verifyTicketByCode(scanTicketInput);
    setScanNotice(res.message);
  };

  // TAMPILAN KHUSUS PENGGUNA: Hanya bisa mengecek status QR Bagasi miliknya sendiri
  if (userRole === "pengguna") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Cek Status Bagasi Saya (Smart Baggage QR)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Masukkan kode QR Bagasi atau Kode Tiket Anda untuk melihat lokasi
            kompartemen koper Anda
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex gap-2">
            <input
              value={baggageQuery}
              onChange={(e) => setBaggageQuery(e.target.value)}
              placeholder="Masukkan Kode Bagasi (Contoh: BAG-JG-101A)"
              className="flex-1 h-11 px-3.5 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          {matchedBaggage.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 text-xs text-slate-500">
              Kode bagasi tidak ditemukan. Contoh kode aktif:{" "}
              <button
                type="button"
                onClick={() => setBaggageQuery("BAG-JG-101A")}
                className="font-bold text-emerald-700 underline"
              >
                BAG-JG-101A
              </button>
            </div>
          ) : (
            matchedBaggage.map((bag) => (
              <div
                key={bag.id}
                className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span>QR: {bag.baggageCode}</span>
                  <span>Kursi {bag.seatNumber}</span>
                </div>
                <div className="text-base font-bold text-slate-900">
                  {bag.description}
                </div>
                <p className="text-xs sm:text-sm text-emerald-900">
                  Status: <strong>{bag.status}</strong> di dalam{" "}
                  <strong>{bag.compartment}</strong>.
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // TAMPILAN KHUSUS ADMIN: Bisa Scan Manifest Penumpang Naik & Ubah Kompartemen Bagasi
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Manifest QR & Kompartemen Bagasi (Admin)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Verifikasi penumpang naik dan atur penempatan bagasi bawah
          </p>
        </div>

        <div className="grid grid-cols-2 gap-1.5 bg-white p-1.5 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab("manifest")}
            className={`py-2 px-4 rounded-lg text-xs font-bold ${
              activeTab === "manifest"
                ? "bg-emerald-700 text-white"
                : "text-slate-600"
            }`}
          >
            Absensi Manifest
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bagasi")}
            className={`py-2 px-4 rounded-lg text-xs font-bold ${
              activeTab === "bagasi"
                ? "bg-emerald-700 text-white"
                : "text-slate-600"
            }`}
          >
            Kompartemen Bagasi
          </button>
        </div>
      </div>

      {activeTab === "manifest" ? (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex gap-2">
              {schedules.map((sch) => (
                <button
                  key={sch.id}
                  type="button"
                  onClick={() => setSelectedScheduleId(sch.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    sch.id === currentSchedule.id
                      ? "bg-emerald-700 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {sch.busClass}
                </button>
              ))}
            </div>

            <form onSubmit={handleScanSubmit} className="flex gap-2 w-full sm:w-auto">
              <input
                placeholder="Kode QR Tiket (TKT-JG-907)"
                value={scanTicketInput}
                onChange={(e) => setScanTicketInput(e.target.value)}
                className="h-9 px-3 rounded-lg border border-slate-300 text-xs"
              />
              <button
                type="submit"
                className="h-9 px-4 rounded-lg bg-emerald-700 text-white text-xs font-bold"
              >
                Scan Naik
              </button>
            </form>
          </div>

          {scanNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900">
              {scanNotice}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {occupiedSeats.map((seat) => (
              <div
                key={seat.id}
                className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-emerald-800">
                    Kursi {seat.number} • {seat.ticketCode}
                  </span>
                  <div className="text-sm font-bold text-slate-900">
                    {seat.passengerName}
                  </div>
                  <div className="text-xs text-slate-500">
                    Naik: {seat.boardingPoint}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    togglePassengerBoarding(currentSchedule.id, seat.id)
                  }
                  className={`px-3 py-2 rounded-lg text-xs font-bold ${
                    seat.boarded
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-emerald-700 text-white"
                  }`}
                >
                  {seat.boarded ? "Sudah Naik" : "Verifikasi Naik"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {baggageList.map((bag) => (
            <div
              key={bag.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3"
            >
              <div className="flex justify-between text-xs font-bold text-emerald-800">
                <span>{bag.baggageCode}</span>
                <span>Kursi {bag.seatNumber}</span>
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {bag.description}
                </div>
                <div className="text-xs text-slate-500">
                  Pemilik: {bag.passengerName}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  value={bag.compartment}
                  onChange={(e) =>
                    updateBaggageStatus(
                      bag.id,
                      bag.status,
                      e.target.value as BaggageItem["compartment"]
                    )
                  }
                  className="h-9 px-2.5 rounded-lg border border-slate-300 bg-slate-50 text-xs font-semibold"
                >
                  <option value="Kompartemen A (Lambung Kiri Depan)">
                    Kompartemen A (Kiri Depan)
                  </option>
                  <option value="Kompartemen B (Lambung Kanan Tengah)">
                    Kompartemen B (Kanan Tengah)
                  </option>
                  <option value="Kompartemen C (Bagasi Belakang Besar)">
                    Kompartemen C (Belakang Besar)
                  </option>
                </select>

                <select
                  value={bag.status}
                  onChange={(e) =>
                    updateBaggageStatus(
                      bag.id,
                      e.target.value as BaggageItem["status"]
                    )
                  }
                  className="h-9 px-2.5 rounded-lg border border-slate-300 bg-slate-50 text-xs font-semibold"
                >
                  <option value="Terdaftar di Loket Agen">
                    Terdaftar di Loket Agen
                  </option>
                  <option value="Aman di Dalam Kompartemen">
                    Aman di Dalam Kompartemen
                  </option>
                  <option value="Siap Diambil di Tujuan">
                    Siap Diambil di Tujuan
                  </option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
