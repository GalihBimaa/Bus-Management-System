"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useBusSystem,
  BusClassType,
} from "@/lib/bus-system-context";

const classBusImage: Record<BusClassType, string> = {
  "Sleeper Class": "/buses/card-sleeper.svg",
  "Suite Class": "/buses/card-suite.svg",
  Eksekutif: "/buses/card-executive.svg",
};

export default function ArmadaDanKelasPage() {
  const router = useRouter();
  const {
    userRole,
    fleetUnits,
    addFleetUnit,
    schedules,
    setSelectedScheduleId,
  } = useBusSystem();

  const [showAddForm, setShowAddForm] = useState(false);
  const [plate, setPlate] = useState("");
  const [chassis, setChassis] = useState("");
  const [busClass, setBusClass] = useState<BusClassType>("Sleeper Class");
  const [totalSeats, setTotalSeats] = useState("20");

  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole !== "admin") return;
    if (!plate.trim() || !chassis.trim()) return;

    const layoutMap: Record<BusClassType, string> = {
      "Sleeper Class": "1-1 Bertingkat (Upper & Lower Deck)",
      "Suite Class": "2-1 Semi-Kabin Privasi",
      Eksekutif: "2-2 Executive Legrest",
    };

    addFleetUnit({
      plateNumber: plate.trim().toUpperCase(),
      chassisBrand: chassis.trim(),
      bodyBuilder: "Adiputro Jetbus 5",
      busClass,
      totalSeats: Number(totalSeats) || 24,
      seatLayout: layoutMap[busClass],
      status: "Operasional Aktif",
      baggageCompartments: ["Kompartemen A", "Kompartemen B", "Kompartemen C"],
      facilities: ["AC", "USB Charger", "Toilet", "GPS Aktif"],
      lastServiceDate: "25 Nov 2026",
    });

    setPlate("");
    setChassis("");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Armada & Paket Kelas Bus
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Pilihan unit Sleeper Class, Suite Class, dan Eksekutif
          </p>
        </div>

        {/* HANYA ADMIN yang bisa menambah unit armada baru */}
        {userRole === "admin" && (
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider w-fit transition"
          >
            {showAddForm ? "Tutup Form" : "+ Tambah Armada (Admin)"}
          </button>
        )}
      </div>

      {userRole === "admin" && showAddForm && (
        <form
          onSubmit={handleAddUnit}
          className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3"
        >
          <div className="text-sm font-bold text-slate-900">
            Tambah Unit Armada Baru
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              required
              placeholder="Plat Nomor (AB 7705 NH)"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              className="h-10 px-3 rounded-lg border border-slate-300 text-sm"
            />
            <input
              required
              placeholder="Sasis (Scania K410iB)"
              value={chassis}
              onChange={(e) => setChassis(e.target.value)}
              className="h-10 px-3 rounded-lg border border-slate-300 text-sm"
            />
            <select
              value={busClass}
              onChange={(e) => setBusClass(e.target.value as BusClassType)}
              className="h-10 px-3 rounded-lg border border-slate-300 bg-white text-sm"
            >
              <option value="Sleeper Class">Sleeper Class</option>
              <option value="Suite Class">Suite Class</option>
              <option value="Eksekutif">Eksekutif</option>
            </select>
            <input
              type="number"
              placeholder="Jumlah Kursi"
              value={totalSeats}
              onChange={(e) => setTotalSeats(e.target.value)}
              className="h-10 px-3 rounded-lg border border-slate-300 text-sm"
            />
          </div>
          <button
            type="submit"
            className="h-10 px-5 rounded-lg bg-emerald-700 text-white text-xs font-bold uppercase"
          >
            Simpan Armada
          </button>
        </form>
      )}

      {/* Grid Kartu Armada dengan Gambar Bus Ikonik */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fleetUnits.map((bus) => {
          const linkedSchedule = schedules.find((s) => s.busId === bus.id);
          return (
            <div
              key={bus.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <img
                  src={classBusImage[bus.busClass]}
                  alt={bus.chassisBrand}
                  className="w-full h-44 object-cover border-b border-slate-200"
                />
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-800 text-white text-xs font-bold">
                      {bus.busClass}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700">
                      {bus.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {bus.plateNumber} — {bus.chassisBrand}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {bus.totalSeats} Kursi • {bus.seatLayout}
                  </p>
                </div>
              </div>

              {linkedSchedule && (
                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedScheduleId(linkedSchedule.id);
                      router.push("/dashboard/denah-kursi");
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider transition"
                  >
                    Pilih Kursi Bus Ini
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
