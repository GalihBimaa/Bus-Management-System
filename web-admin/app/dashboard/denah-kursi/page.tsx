"use client";

import React, { useState, useMemo } from "react";
import {
  useBusSystem,
  formatRupiah,
  checkSoloFemaleRestriction,
  SeatData,
  BaggageItem,
  SeasonPricingMode,
} from "@/lib/bus-system-context";

export default function DenahKursiOrderPage() {
  const {
    userRole,
    schedules,
    selectedScheduleId,
    setSelectedScheduleId,
    seasonMode,
    setSeasonMode,
    autoOccupancyPricing,
    setAutoOccupancyPricing,
    lastMinutePromo,
    setLastMinutePromo,
    calculateDynamicPrice,
    bookSeat,
    togglePassengerBoarding,
  } = useBusSystem();

  const currentSchedule = useMemo(
    () =>
      schedules.find((s) => s.id === selectedScheduleId) || schedules[0],
    [schedules, selectedScheduleId]
  );

  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const [soloFemaleMode, setSoloFemaleMode] = useState<boolean>(true);
  const [activeDeck, setActiveDeck] = useState<"lower" | "upper">("lower");

  // State Form Order
  const [passengerName, setPassengerName] = useState("");
  const [passengerGender, setPassengerGender] = useState<"Wanita" | "Pria">(
    "Wanita"
  );
  const [passengerPhone, setPassengerPhone] = useState("");
  const [isSoloTraveler, setIsSoloTraveler] = useState(true);
  const [boardingPoint, setBoardingPoint] = useState("Agen Sleman Utara");
  const [dropPoint, setDropPoint] = useState("Terminal Mengwi Bali");
  const [includeBaggage, setIncludeBaggage] = useState(false);
  const [baggageDesc, setBaggageDesc] = useState("");
  const [baggageCompartment, setBaggageCompartment] = useState<
    BaggageItem["compartment"]
  >("Kompartemen A (Lambung Kiri Depan)");

  const [orderSuccess, setOrderSuccess] = useState<{
    ticketCode: string;
    baggageCode?: string;
    seatNumber: string;
  } | null>(null);

  const dynamicPrice = useMemo(
    () => calculateDynamicPrice(currentSchedule),
    [calculateDynamicPrice, currentSchedule]
  );

  const selectedSeat: SeatData | undefined = useMemo(
    () => currentSchedule.seats.find((s) => s.id === selectedSeatId),
    [currentSchedule, selectedSeatId]
  );

  const seatRestriction = useMemo(() => {
    if (!selectedSeat || selectedSeat.status === "occupied") {
      return { isRestrictedToFemale: false };
    }
    return checkSoloFemaleRestriction(currentSchedule.seats, selectedSeat);
  }, [currentSchedule.seats, selectedSeat]);

  const handleSelectSeat = (seat: SeatData) => {
    setSelectedSeatId(seat.id);
    setOrderSuccess(null);
    if (seat.status === "available") {
      const restriction = checkSoloFemaleRestriction(
        currentSchedule.seats,
        seat
      );
      if (restriction.isRestrictedToFemale) {
        setPassengerGender("Wanita");
        setIsSoloTraveler(true);
      }
    }
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeat || selectedSeat.status === "occupied") return;
    if (seatRestriction.isRestrictedToFemale && passengerGender === "Pria") {
      return;
    }

    const result = bookSeat({
      scheduleId: currentSchedule.id,
      seatId: selectedSeat.id,
      passengerName: passengerName.trim(),
      passengerGender,
      passengerPhone: passengerPhone.trim() || "0812-0000-0000",
      isSoloTraveler: passengerGender === "Wanita" ? isSoloTraveler : false,
      boardingPoint,
      dropPoint,
      baggageDescription: includeBaggage
        ? baggageDesc.trim() || "Koper Penumpang"
        : undefined,
      baggageWeightKg: includeBaggage ? 12 : undefined,
      baggageCompartment: includeBaggage ? baggageCompartment : undefined,
    });

    setOrderSuccess({
      ticketCode: result.ticketCode,
      baggageCode: result.baggageCode,
      seatNumber: selectedSeat.number,
    });
    setPassengerName("");
    setPassengerPhone("");
    setBaggageDesc("");
  };

  const deckSeats = useMemo(() => {
    const targetDeck =
      currentSchedule.busClass === "Sleeper Class" ? activeDeck : "lower";
    return currentSchedule.seats.filter((s) => s.deck === targetDeck);
  }, [activeDeck, currentSchedule]);

  const maxRow = Math.max(...deckSeats.map((s) => s.row), 0);
  const maxCol = Math.max(...deckSeats.map((s) => s.col), 0);
  const rows = Array.from({ length: maxRow }, (_, i) => i + 1);

  const renderSeatBox = (seat: SeatData) => {
    const isSelected = seat.id === selectedSeatId;
    const restriction =
      seat.status === "available"
        ? checkSoloFemaleRestriction(currentSchedule.seats, seat)
        : { isRestrictedToFemale: false };

    let boxStyle =
      "bg-white border-slate-300 text-slate-800 hover:border-emerald-600";
    let labelText = "Kosong";

    if (seat.status === "occupied") {
      if (seat.passengerGender === "Wanita") {
        boxStyle = "bg-emerald-100 border-emerald-400 text-emerald-950";
        labelText = seat.isSoloTraveler ? "Wanita (Solo)" : "Wanita";
      } else {
        boxStyle = "bg-slate-200 border-slate-300 text-slate-700";
        labelText = "Pria";
      }
    } else if (soloFemaleMode && restriction.isRestrictedToFemale) {
      boxStyle = "bg-emerald-50 border-2 border-emerald-600 text-emerald-900";
      labelText = "Khusus W";
    }

    if (isSelected) {
      boxStyle = "bg-emerald-700 border-emerald-800 text-white shadow-xs";
    }

    return (
      <button
        type="button"
        onClick={() => handleSelectSeat(seat)}
        className={`w-full h-14 rounded-xl border p-2 flex flex-col items-center justify-center transition ${boxStyle}`}
      >
        <span className="text-sm font-bold leading-none">{seat.number}</span>
        <span className="text-[11px] mt-1 opacity-85">{labelText}</span>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Pilih Kelas Bus */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Denah Kursi & Pemesanan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Rute {currentSchedule.routeTitle} • Harga Tiket:{" "}
            <strong className="text-emerald-700">
              {formatRupiah(dynamicPrice.finalPrice)}
            </strong>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-1.5 bg-white p-1.5 rounded-xl border border-slate-200">
          {schedules.map((sch) => {
            const active = sch.id === currentSchedule.id;
            return (
              <button
                key={sch.id}
                type="button"
                onClick={() => {
                  setSelectedScheduleId(sch.id);
                  setSelectedSeatId(null);
                  setOrderSuccess(null);
                  setActiveDeck("lower");
                }}
                className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  active
                    ? "bg-emerald-700 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {sch.busClass}
              </button>
            );
          })}
        </div>
      </div>

      {/* PANEL KHUSUS OWNER: Kontrol Kebijakan Dynamic Pricing */}
      {userRole === "owner" && (
        <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase text-emerald-800 block">
              Pengaturan Tarif Dynamic Pricing (Khusus Owner)
            </span>
            <span className="text-xs text-slate-600">
              Harga Dasar: {formatRupiah(dynamicPrice.basePrice)} → Berlaku:{" "}
              <strong>{formatRupiah(dynamicPrice.finalPrice)}</strong> (
              {dynamicPrice.occupancyRate}% Kursi Terisi)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={seasonMode}
              onChange={(e) =>
                setSeasonMode(e.target.value as SeasonPricingMode)
              }
              className="h-9 rounded-lg border border-emerald-300 bg-white px-2.5 text-xs font-semibold text-slate-800"
            >
              <option value="normal">Hari Normal</option>
              <option value="weekend">Akhir Pekan (+10%)</option>
              <option value="peak_holiday">Libur Panjang (+15%)</option>
            </select>

            <button
              type="button"
              onClick={() => setAutoOccupancyPricing(!autoOccupancyPricing)}
              className={`h-9 px-3 rounded-lg text-xs font-semibold border ${
                autoOccupancyPricing
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "bg-white text-slate-700 border-slate-300"
              }`}
            >
              {autoOccupancyPricing ? "Okupansi Otomatis: ON" : "Okupansi: OFF"}
            </button>

            <button
              type="button"
              onClick={() => setLastMinutePromo(!lastMinutePromo)}
              className={`h-9 px-3 rounded-lg text-xs font-semibold border ${
                lastMinutePromo
                  ? "bg-emerald-900 text-white border-emerald-900"
                  : "bg-white text-slate-700 border-slate-300"
              }`}
            >
              Promo -12%
            </button>
          </div>
        </div>
      )}

      {/* Grid Utama: Kiri Denah Kursi, Kanan Form Order */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kiri: Denah Tempat Duduk */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {currentSchedule.busName}
              </h2>
              <p className="text-xs text-slate-500">
                Berangkat {currentSchedule.departureTime} •{" "}
                {dynamicPrice.totalCount - dynamicPrice.occupiedCount} Kursi
                Kosong
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSoloFemaleMode(!soloFemaleMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                soloFemaleMode
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
            >
              {soloFemaleMode ? "Filter Solo Wanita: ON" : "Filter Solo: OFF"}
            </button>
          </div>

          {currentSchedule.busClass === "Sleeper Class" && (
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveDeck("lower")}
                className={`py-2 rounded-lg text-xs sm:text-sm font-semibold ${
                  activeDeck === "lower"
                    ? "bg-white text-emerald-700 shadow-2xs"
                    : "text-slate-600"
                }`}
              >
                Dek Bawah (Lower)
              </button>
              <button
                type="button"
                onClick={() => setActiveDeck("upper")}
                className={`py-2 rounded-lg text-xs sm:text-sm font-semibold ${
                  activeDeck === "upper"
                    ? "bg-white text-emerald-700 shadow-2xs"
                    : "text-slate-600"
                }`}
              >
                Dek Atas (Upper)
              </button>
            </div>
          )}

          {/* Keterangan Warna */}
          <div className="flex flex-wrap gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border border-slate-300 bg-white inline-block" />
              Kosong
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border-2 border-emerald-600 bg-emerald-50 inline-block" />
              Khusus Wanita
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-400 inline-block" />
              Terisi Wanita
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-200 border border-slate-300 inline-block" />
              Terisi Pria
            </span>
          </div>

          {/* Grid Kabin */}
          <div className="max-w-md mx-auto bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2.5">
            <div className="flex justify-between text-xs text-slate-400 pb-2 border-b border-slate-200">
              <span>Pintu Depan</span>
              <span className="font-semibold text-slate-600">Kemudi Sopir</span>
            </div>

            {rows.map((rowNum) => {
              const rowSeats = deckSeats
                .filter((s) => s.row === rowNum)
                .sort((a, b) => a.col - b.col);

              return (
                <div
                  key={rowNum}
                  className="grid grid-cols-5 gap-2 items-center"
                >
                  {maxCol === 2 && (
                    <>
                      <div className="col-span-2">
                        {rowSeats[0] && renderSeatBox(rowSeats[0])}
                      </div>
                      <div className="col-span-1 text-center text-xs text-slate-400">
                        {rowNum}
                      </div>
                      <div className="col-span-2">
                        {rowSeats[1] && renderSeatBox(rowSeats[1])}
                      </div>
                    </>
                  )}
                  {maxCol === 3 && (
                    <>
                      <div className="col-span-1">
                        {rowSeats[0] && renderSeatBox(rowSeats[0])}
                      </div>
                      <div className="col-span-1">
                        {rowSeats[1] && renderSeatBox(rowSeats[1])}
                      </div>
                      <div className="col-span-1 text-center text-xs text-slate-400">
                        {rowNum}
                      </div>
                      <div className="col-span-2">
                        {rowSeats[2] && renderSeatBox(rowSeats[2])}
                      </div>
                    </>
                  )}
                  {maxCol === 4 && (
                    <>
                      <div className="col-span-1">
                        {rowSeats[0] && renderSeatBox(rowSeats[0])}
                      </div>
                      <div className="col-span-1">
                        {rowSeats[1] && renderSeatBox(rowSeats[1])}
                      </div>
                      <div className="col-span-1 text-center text-xs text-slate-400">
                        {rowNum}
                      </div>
                      <div className="col-span-1">
                        {rowSeats[2] && renderSeatBox(rowSeats[2])}
                      </div>
                      <div className="col-span-1">
                        {rowSeats[3] && renderSeatBox(rowSeats[3])}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Kanan: Panel Order / Detail Kursi Sesuai Hak Akses */}
        <div className="lg:col-span-5 space-y-4">
          {orderSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 space-y-1.5 text-xs">
              <div className="text-sm font-bold text-emerald-950">
                Kursi {orderSuccess.seatNumber} Berhasil Dipesan!
              </div>
              <div>
                Kode Tiket QR: <strong>{orderSuccess.ticketCode}</strong>
              </div>
              {orderSuccess.baggageCode && (
                <div>
                  Kode QR Bagasi: <strong>{orderSuccess.baggageCode}</strong>
                </div>
              )}
            </div>
          )}

          {!selectedSeat ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-1">
              <div className="text-base font-bold text-slate-900">
                Pilih Kursi pada Denah
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Klik salah satu nomor kursi di sebelah kiri.
              </p>
            </div>
          ) : selectedSeat.status === "available" ? (
            <form
              onSubmit={handleOrderSubmit}
              className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  Order Kursi {selectedSeat.number}
                </h3>
                <span className="text-base font-bold text-emerald-700">
                  {formatRupiah(dynamicPrice.finalPrice)}
                </span>
              </div>

              {seatRestriction.isRestrictedToFemale && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                  Kursi sebelah ditempati <strong>Solo Traveler Wanita</strong>.
                  Kursi ini khusus untuk penumpang Wanita.
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Nama Penumpang
                </label>
                <input
                  required
                  placeholder="Masukkan nama lengkap"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Gender
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPassengerGender("Wanita")}
                      className={`h-10 rounded-lg text-xs font-bold border ${
                        passengerGender === "Wanita"
                          ? "bg-emerald-700 text-white border-emerald-700"
                          : "bg-white text-slate-700 border-slate-300"
                      }`}
                    >
                      Wanita
                    </button>
                    <button
                      type="button"
                      disabled={seatRestriction.isRestrictedToFemale}
                      onClick={() => {
                        setPassengerGender("Pria");
                        setIsSoloTraveler(false);
                      }}
                      className={`h-10 rounded-lg text-xs font-bold border ${
                        seatRestriction.isRestrictedToFemale
                          ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                          : passengerGender === "Pria"
                          ? "bg-slate-800 text-white border-slate-800"
                          : "bg-white text-slate-700 border-slate-300"
                      }`}
                    >
                      Pria
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    No. WhatsApp
                  </label>
                  <input
                    placeholder="0812..."
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              {passengerGender === "Wanita" && (
                <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 cursor-pointer text-xs font-medium text-emerald-950">
                  <input
                    type="checkbox"
                    checked={isSoloTraveler}
                    onChange={(e) => setIsSoloTraveler(e.target.checked)}
                    className="accent-emerald-700"
                  />
                  <span>Solo Traveler Wanita (Kunci kursi sebelah)</span>
                </label>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Titik Naik
                  </label>
                  <select
                    value={boardingPoint}
                    onChange={(e) => setBoardingPoint(e.target.value)}
                    className="w-full h-10 px-2.5 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm"
                  >
                    {currentSchedule.pickupPoints.map((pt) => (
                      <option key={pt} value={pt}>
                        {pt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Titik Turun
                  </label>
                  <select
                    value={dropPoint}
                    onChange={(e) => setDropPoint(e.target.value)}
                    className="w-full h-10 px-2.5 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm"
                  >
                    {currentSchedule.dropPoints.map((pt) => (
                      <option key={pt} value={pt}>
                        {pt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Titip Bagasi */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-slate-700">
                  <span>Titip Koper di Bagasi Bawah (QR)</span>
                  <input
                    type="checkbox"
                    checked={includeBaggage}
                    onChange={(e) => setIncludeBaggage(e.target.checked)}
                    className="accent-emerald-700"
                  />
                </label>

                {includeBaggage && (
                  <div className="space-y-2 pt-1">
                    <input
                      placeholder="Nama barang (Misal: Koper Hitam)"
                      value={baggageDesc}
                      onChange={(e) => setBaggageDesc(e.target.value)}
                      className="w-full h-9 px-3 rounded border border-slate-300 bg-white text-xs"
                    />
                    <select
                      value={baggageCompartment}
                      onChange={(e) =>
                        setBaggageCompartment(
                          e.target.value as BaggageItem["compartment"]
                        )
                      }
                      className="w-full h-9 px-2.5 rounded border border-slate-300 bg-white text-xs"
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
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold transition"
              >
                Pesan Kursi Sekarang
              </button>
            </form>
          ) : userRole === "pengguna" ? (
            /* BATASAN PENGGUNA: Tidak boleh melihat data pribadi penumpang lain */
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
              <div className="text-base font-bold text-slate-900">
                Kursi {selectedSeat.number} Sudah Terisi
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Kursi ini telah dipesan oleh penumpang{" "}
                <strong>{selectedSeat.passengerGender}</strong>. Demi privasi,
                identitas penumpang hanya dapat dilihat oleh Admin.
              </p>
              <p className="text-xs text-emerald-700 font-semibold pt-1">
                Silakan pilih kursi lain yang berstatus Kosong.
              </p>
            </div>
          ) : (
            /* AKSES ADMIN & OWNER: Melihat detail penumpang di kursi terisi */
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs text-slate-400">
                    Kursi {selectedSeat.number} • {selectedSeat.ticketCode}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedSeat.passengerName}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 text-xs font-bold">
                  {selectedSeat.passengerGender}{" "}
                  {selectedSeat.isSoloTraveler ? "(Solo)" : ""}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block">Titik Naik</span>
                  <strong className="text-slate-800">
                    {selectedSeat.boardingPoint}
                  </strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block">Status Manifest</span>
                  <strong className="text-emerald-700">
                    {selectedSeat.boarded ? "Sudah Naik" : "Belum Naik"}
                  </strong>
                </div>
              </div>

              {userRole === "admin" && (
                <button
                  type="button"
                  onClick={() =>
                    togglePassengerBoarding(currentSchedule.id, selectedSeat.id)
                  }
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition ${
                    selectedSeat.boarded
                      ? "bg-slate-200 text-slate-700"
                      : "bg-emerald-700 text-white"
                  }`}
                >
                  {selectedSeat.boarded
                    ? "Batalkan Status Naik"
                    : "Verifikasi Penumpang Naik (Admin)"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
