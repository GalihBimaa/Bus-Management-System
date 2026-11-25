"use client";

import React, { useState, useMemo } from "react";
import {
  useBusSystem,
  CheckpointData,
} from "@/lib/bus-system-context";

export default function JadwalRoadmapPage() {
  const {
    userRole,
    schedules,
    selectedScheduleId,
    setSelectedScheduleId,
    advanceCheckpoint,
    addCheckpoint,
  } = useBusSystem();

  const currentSchedule = useMemo(
    () =>
      schedules.find((s) => s.id === selectedScheduleId) || schedules[0],
    [schedules, selectedScheduleId]
  );

  const [showAddStop, setShowAddStop] = useState(false);
  const [cpName, setCpName] = useState("");
  const [cpCity, setCpCity] = useState("");
  const [cpCategory, setCpCategory] =
    useState<CheckpointData["category"]>("Rumah Makan");
  const [cpTime, setCpTime] = useState("20:00 WIB");

  const handleAddCheckpoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole !== "admin") return;
    if (!cpName.trim() || !cpCity.trim()) return;

    addCheckpoint(currentSchedule.id, {
      name: cpName.trim(),
      city: cpCity.trim(),
      category: cpCategory,
      scheduledTime: cpTime.trim() || "20:00 WIB",
      durationMinutes: 30,
      status: "upcoming",
      notes: "Titik pemberhentian terjadwal.",
      lat: -7.55,
      lng: 112.1,
      progressPercent: 70,
    });

    setCpName("");
    setCpCity("");
    setShowAddStop(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Rute Yogyakarta — Bali & Pemberhentian
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Daftar titik terminal, agen penjemputan, rumah makan, dan ferry
          </p>
        </div>

        {/* HANYA ADMIN yang dapat menambah titik pemberhentian baru */}
        {userRole === "admin" && (
          <button
            type="button"
            onClick={() => setShowAddStop(!showAddStop)}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold uppercase w-fit"
          >
            {showAddStop ? "Tutup Form" : "+ Tambah Pemberhentian (Admin)"}
          </button>
        )}
      </div>

      {/* Pilihan 3 Jadwal Kelas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {schedules.map((sch) => {
          const active = sch.id === currentSchedule.id;
          return (
            <button
              key={sch.id}
              type="button"
              onClick={() => setSelectedScheduleId(sch.id)}
              className={`p-4 rounded-xl border text-left transition ${
                active
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "bg-white text-slate-800 border-slate-200 hover:border-emerald-400"
              }`}
            >
              <div className="text-xs font-bold uppercase opacity-80">
                {sch.busClass} • {sch.departureTime}
              </div>
              <div className="text-sm font-bold mt-1">{sch.busName}</div>
            </button>
          );
        })}
      </div>

      {userRole === "admin" && showAddStop && (
        <form
          onSubmit={handleAddCheckpoint}
          className="bg-white rounded-2xl border border-slate-200 p-4 grid grid-cols-1 sm:grid-cols-5 gap-3"
        >
          <input
            required
            placeholder="Nama Lokasi (RM Taman Sari)"
            value={cpName}
            onChange={(e) => setCpName(e.target.value)}
            className="h-10 px-3 rounded-lg border border-slate-300 text-sm"
          />
          <input
            required
            placeholder="Kota (Ngawi)"
            value={cpCity}
            onChange={(e) => setCpCity(e.target.value)}
            className="h-10 px-3 rounded-lg border border-slate-300 text-sm"
          />
          <select
            value={cpCategory}
            onChange={(e) =>
              setCpCategory(e.target.value as CheckpointData["category"])
            }
            className="h-10 px-3 rounded-lg border border-slate-300 bg-white text-sm"
          >
            <option value="Rumah Makan">Rumah Makan</option>
            <option value="Terminal">Terminal</option>
            <option value="Agen">Agen</option>
            <option value="Rest Area">Rest Area</option>
            <option value="Pelabuhan">Pelabuhan Ferry</option>
          </select>
          <input
            placeholder="Jam (20:00 WIB)"
            value={cpTime}
            onChange={(e) => setCpTime(e.target.value)}
            className="h-10 px-3 rounded-lg border border-slate-300 text-sm"
          />
          <button
            type="submit"
            className="h-10 rounded-lg bg-emerald-700 text-white text-xs font-bold uppercase"
          >
            Simpan Titik
          </button>
        </form>
      )}

      {/* Daftar Pemberhentian yang Rapi & Ringkas */}
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
        {currentSchedule.checkpoints.map((cp) => {
          const isCurrent = cp.status === "current";
          const isCompleted = cp.status === "completed";

          return (
            <div
              key={cp.id}
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isCurrent ? "bg-emerald-50/70" : ""
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isCurrent
                      ? "bg-emerald-700 text-white"
                      : isCompleted
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {cp.order}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {cp.name}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-semibold">
                      {cp.category}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded bg-emerald-700 text-white text-[11px] font-bold">
                        Posisi Bus Saat Ini
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">{cp.city}</div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pl-10 sm:pl-0">
                <span className="text-xs sm:text-sm font-bold text-slate-700">
                  {cp.scheduledTime}
                </span>

                {/* HANYA ADMIN yang bisa mengupdate posisi checkpoint bus */}
                {userRole === "admin" && !isCurrent && (
                  <button
                    type="button"
                    onClick={() =>
                      advanceCheckpoint(currentSchedule.id, cp.id)
                    }
                    className="px-3 py-1.5 rounded-lg border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold"
                  >
                    Tandai Bus Tiba
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
