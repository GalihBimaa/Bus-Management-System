"use client";

import React, { createContext, useContext, useState, useMemo } from "react";

export type BusClassType = "Eksekutif" | "Suite Class" | "Sleeper Class";
export type SeasonPricingMode = "normal" | "weekend" | "peak_holiday";
export type AppUserRole = "pengguna" | "admin" | "owner";

export interface SeatData {
  id: string;
  number: string;
  deck: "lower" | "upper";
  row: number;
  col: number; // 1-based column index; 0 indicates aisle spacer in rendering
  status: "available" | "occupied";
  passengerName?: string;
  passengerGender?: "Pria" | "Wanita";
  passengerPhone?: string;
  isSoloTraveler?: boolean;
  ticketCode?: string;
  boardingPoint?: string;
  dropPoint?: string;
  boarded?: boolean;
  boardedAt?: string;
  pricePaid?: number;
}

export interface CheckpointData {
  id: string;
  order: number;
  name: string;
  city: string;
  category: "Terminal" | "Agen" | "Rumah Makan" | "Pelabuhan" | "Rest Area";
  scheduledTime: string;
  durationMinutes: number;
  status: "completed" | "current" | "upcoming";
  notes: string;
  lat: number;
  lng: number;
  progressPercent: number;
}

export interface BaggageItem {
  id: string;
  baggageCode: string;
  ticketCode: string;
  scheduleId: string;
  seatNumber: string;
  passengerName: string;
  description: string;
  weightKg: number;
  compartment:
    | "Kompartemen A (Lambung Kiri Depan)"
    | "Kompartemen B (Lambung Kanan Tengah)"
    | "Kompartemen C (Bagasi Belakang Besar)";
  status:
    | "Terdaftar di Loket Agen"
    | "Aman di Dalam Kompartemen"
    | "Transit Penyeberangan"
    | "Siap Diambil di Tujuan"
    | "Sudah Diambil Penumpang";
  boardingPoint: string;
  lastUpdated: string;
  handlerName: string;
}

export interface ScheduleData {
  id: string;
  code: string;
  origin: string;
  destination: string;
  routeTitle: string;
  departureTime: string;
  arrivalTime: string;
  busId: string;
  busName: string;
  plateNumber: string;
  busClass: BusClassType;
  basePrice: number;
  facilities: string[];
  seatConfigLabel: string;
  pickupPoints: string[];
  dropPoints: string[];
  seats: SeatData[];
  checkpoints: CheckpointData[];
}

export interface ActiveBusGps {
  busId: string;
  scheduleId: string;
  plateNumber: string;
  busName: string;
  busClass: BusClassType;
  routeTitle: string;
  driverPrimary: string;
  driverSecondary: string;
  conductorName: string;
  driverPin: string;
  lat: number;
  lng: number;
  speedKmh: number;
  currentLocationName: string;
  nextStopName: string;
  etaNextStop: string;
  routeProgressPercent: number;
  operationalStatus:
    | "Berjalan Normal"
    | "Berhenti di Rumah Makan"
    | "Boarding Penumpang di Agen"
    | "Menyeberang Kapal Ferry"
    | "Lalu Lintas Padat";
  lastUpdate: string;
  fuelPercent: number;
  cabinTempCelsius: number;
}

export interface BoardingPointHeatmapItem {
  id: string;
  pointName: string;
  region: string;
  type: "Agen Cabang" | "Terminal Utama" | "Titik Transit";
  morningCount: number; // 06:00 - 11:59
  afternoonCount: number; // 12:00 - 15:59
  eveningCount: number; // 16:00 - 18:59
  nightCount: number; // 19:00 - 23:00
  growthPercent: number;
  topDestination: string;
  recommendation: string;
}

export interface FleetUnit {
  id: string;
  plateNumber: string;
  chassisBrand: string;
  bodyBuilder: string;
  busClass: BusClassType;
  totalSeats: number;
  seatLayout: string;
  status: "Operasional Aktif" | "Siaga Garasi" | "Pemeliharaan Berkala";
  baggageCompartments: string[];
  facilities: string[];
  lastServiceDate: string;
}

export interface OrderSeatInput {
  scheduleId: string;
  seatId: string;
  passengerName: string;
  passengerGender: "Pria" | "Wanita";
  passengerPhone: string;
  isSoloTraveler: boolean;
  boardingPoint: string;
  dropPoint: string;
  baggageDescription?: string;
  baggageWeightKg?: number;
  baggageCompartment?: BaggageItem["compartment"];
}

export interface DynamicPriceCalculation {
  basePrice: number;
  finalPrice: number;
  occupancyRate: number;
  occupiedCount: number;
  totalCount: number;
  appliedAdjustments: {
    label: string;
    percentDelta: number;
    amountDelta: number;
  }[];
}

interface BusSystemContextValue {
  userRole: AppUserRole;
  setUserRole: (role: AppUserRole) => void;
  schedules: ScheduleData[];
  selectedScheduleId: string;
  setSelectedScheduleId: (id: string) => void;
  seasonMode: SeasonPricingMode;
  setSeasonMode: (mode: SeasonPricingMode) => void;
  autoOccupancyPricing: boolean;
  setAutoOccupancyPricing: (val: boolean) => void;
  lastMinutePromo: boolean;
  setLastMinutePromo: (val: boolean) => void;
  calculateDynamicPrice: (schedule: ScheduleData) => DynamicPriceCalculation;
  bookSeat: (input: OrderSeatInput) => { ticketCode: string; baggageCode?: string };
  togglePassengerBoarding: (scheduleId: string, seatId: string) => void;
  verifyTicketByCode: (ticketCode: string) => {
    success: boolean;
    message: string;
    passengerName?: string;
    seatNumber?: string;
  };
  baggageList: BaggageItem[];
  addBaggage: (item: Omit<BaggageItem, "id" | "baggageCode" | "lastUpdated">) => string;
  updateBaggageStatus: (
    baggageId: string,
    status: BaggageItem["status"],
    compartment?: BaggageItem["compartment"]
  ) => void;
  activeGpsFleet: ActiveBusGps[];
  updateBusGps: (
    busId: string,
    updates: Partial<
      Pick<
        ActiveBusGps,
        | "lat"
        | "lng"
        | "speedKmh"
        | "currentLocationName"
        | "nextStopName"
        | "etaNextStop"
        | "routeProgressPercent"
        | "operationalStatus"
      >
    >
  ) => void;
  advanceCheckpoint: (scheduleId: string, checkpointId: string) => void;
  addCheckpoint: (
    scheduleId: string,
    checkpoint: Omit<CheckpointData, "id" | "order">
  ) => void;
  heatmapData: BoardingPointHeatmapItem[];
  fleetUnits: FleetUnit[];
  addFleetUnit: (unit: Omit<FleetUnit, "id">) => void;
}

const initialCheckpointsJogjaBali: CheckpointData[] = [
  {
    id: "CP-1",
    order: 1,
    name: "Terminal Tipe A Giwangan",
    city: "Kota Yogyakarta",
    category: "Terminal",
    scheduledTime: "14:00 WIB",
    durationMinutes: 20,
    status: "completed",
    notes: "Keberangkatan awal dan pemeriksaan kelayakan armada.",
    lat: -7.8342,
    lng: 110.3919,
    progressPercent: 0,
  },
  {
    id: "CP-2",
    order: 2,
    name: "Agen Sleman Utara & Denggung",
    city: "Kab. Sleman, DIY",
    category: "Agen",
    scheduledTime: "14:45 WIB",
    durationMinutes: 15,
    status: "completed",
    notes: "Titik naik penumpang tertinggi wilayah DIY bagian utara.",
    lat: -7.7161,
    lng: 110.3558,
    progressPercent: 12,
  },
  {
    id: "CP-3",
    order: 3,
    name: "Agen Prambanan & Klaten Sentral",
    city: "Kab. Klaten",
    category: "Agen",
    scheduledTime: "15:30 WIB",
    durationMinutes: 10,
    status: "completed",
    notes: "Penjemputan penumpang koridor Klaten dan Prambanan.",
    lat: -7.7058,
    lng: 110.6022,
    progressPercent: 22,
  },
  {
    id: "CP-4",
    order: 4,
    name: "Terminal Tirtonadi",
    city: "Kota Surakarta (Solo)",
    category: "Terminal",
    scheduledTime: "16:30 WIB",
    durationMinutes: 15,
    status: "completed",
    notes: "Penjemputan penumpang Solo sebelum masuk Tol Trans Jawa.",
    lat: -7.5514,
    lng: 110.8186,
    progressPercent: 32,
  },
  {
    id: "CP-5",
    order: 5,
    name: "RM Taman Sari Tol Ngawi",
    city: "Kab. Ngawi, Jawa Timur",
    category: "Rumah Makan",
    scheduledTime: "18:30 WIB",
    durationMinutes: 45,
    status: "current",
    notes: "Servis makan prasmanan gratis (kupon tiket) dan istirahat ibadah.",
    lat: -7.4289,
    lng: 111.4461,
    progressPercent: 48,
  },
  {
    id: "CP-6",
    order: 6,
    name: "Rest Area KM 726B Mojokerto",
    city: "Kab. Mojokerto",
    category: "Rest Area",
    scheduledTime: "21:00 WIB",
    durationMinutes: 15,
    status: "upcoming",
    notes: "Pergantian sopir 1 ke sopir 2 dan pengecekan tekanan ban.",
    lat: -7.4521,
    lng: 112.4339,
    progressPercent: 64,
  },
  {
    id: "CP-7",
    order: 7,
    name: "RM Utama Raya Situbondo",
    city: "Kab. Situbondo",
    category: "Rumah Makan",
    scheduledTime: "01:15 WIB",
    durationMinutes: 30,
    status: "upcoming",
    notes: "Pembagian kudapan malam dan istirahat toilet penumpang.",
    lat: -7.7219,
    lng: 113.6812,
    progressPercent: 78,
  },
  {
    id: "CP-8",
    order: 8,
    name: "Pelabuhan Ketapang - Gilimanuk",
    city: "Banyuwangi - Jembrana",
    category: "Pelabuhan",
    scheduledTime: "03:30 WIB / 04:30 WITA",
    durationMinutes: 60,
    status: "upcoming",
    notes: "Penyeberangan kapal ferry melintasi Selat Bali.",
    lat: -8.1446,
    lng: 114.4032,
    progressPercent: 88,
  },
  {
    id: "CP-9",
    order: 9,
    name: "Terminal Tipe A Mengwi",
    city: "Kab. Badung, Bali (Denpasar)",
    category: "Terminal",
    scheduledTime: "07:30 WITA",
    durationMinutes: 0,
    status: "upcoming",
    notes: "Pemberhentian akhir dan pengambilan bagasi kompartemen A/B/C.",
    lat: -8.5403,
    lng: 115.1714,
    progressPercent: 100,
  },
];

function buildSleeperSeats(): SeatData[] {
  // Sleeper Class: 1-1 configuration on Lower Deck (rows 1-5 -> 10 cabins) and Upper Deck (rows 1-5 -> 10 cabins) = 20 sleeper cabins
  const seats: SeatData[] = [];
  const decks: ("lower" | "upper")[] = ["lower", "upper"];

  decks.forEach((deck) => {
    const prefix = deck === "lower" ? "L" : "U";
    for (let row = 1; row <= 5; row++) {
      for (let col = 1; col <= 2; col++) {
        const side = col === 1 ? "A" : "B";
        const num = `${prefix}${row}${side}`;
        const id = `SLP-${num}`;
        seats.push({
          id,
          number: num,
          deck,
          row,
          col,
          status: "available",
        });
      }
    }
  });

  // Pre-populate realistic bookings including Solo Traveler Female examples
  const occupiedPreset: Record<
    string,
    Omit<SeatData, "id" | "number" | "deck" | "row" | "col" | "status">
  > = {
    L1A: {
      passengerName: "Nadia Putri Rahmawati",
      passengerGender: "Wanita",
      passengerPhone: "0812-3401-8821",
      isSoloTraveler: true,
      ticketCode: "TKT-JG-901",
      boardingPoint: "Agen Sleman Utara",
      dropPoint: "Terminal Mengwi Bali",
      boarded: true,
      boardedAt: "14:42 WIB",
      pricePaid: 650000,
    },
    L2A: {
      passengerName: "Aulia Maharani",
      passengerGender: "Wanita",
      passengerPhone: "0813-9902-1142",
      isSoloTraveler: true,
      ticketCode: "TKT-JG-902",
      boardingPoint: "Agen Sleman Utara",
      dropPoint: "Terminal Mengwi Bali",
      boarded: true,
      boardedAt: "14:44 WIB",
      pricePaid: 650000,
    },
    L2B: {
      passengerName: "Siti Nurhaliza",
      passengerGender: "Wanita",
      passengerPhone: "0811-2831-0091",
      isSoloTraveler: true,
      ticketCode: "TKT-JG-903",
      boardingPoint: "Terminal Giwangan",
      dropPoint: "Terminal Mengwi Bali",
      boarded: true,
      boardedAt: "13:52 WIB",
      pricePaid: 650000,
    },
    L3B: {
      passengerName: "Hendra Wijaya",
      passengerGender: "Pria",
      passengerPhone: "0812-7721-5400",
      isSoloTraveler: false,
      ticketCode: "TKT-JG-904",
      boardingPoint: "Terminal Giwangan",
      dropPoint: "Terminal Mengwi Bali",
      boarded: true,
      boardedAt: "13:55 WIB",
      pricePaid: 650000,
    },
    L4A: {
      passengerName: "Bagus Prasetyo",
      passengerGender: "Pria",
      passengerPhone: "0857-4312-9090",
      isSoloTraveler: false,
      ticketCode: "TKT-JG-905",
      boardingPoint: "Agen Klaten Sentral",
      dropPoint: "Pelabuhan Gilimanuk",
      boarded: true,
      boardedAt: "15:28 WIB",
      pricePaid: 650000,
    },
    U1A: {
      passengerName: "Raras Sekar Arum",
      passengerGender: "Wanita",
      passengerPhone: "0819-0421-3311",
      isSoloTraveler: true,
      ticketCode: "TKT-JG-906",
      boardingPoint: "Agen Sleman Utara",
      dropPoint: "Terminal Mengwi Bali",
      boarded: true,
      boardedAt: "14:46 WIB",
      pricePaid: 650000,
    },
    U2A: {
      passengerName: "Dimas Aditya",
      passengerGender: "Pria",
      passengerPhone: "0812-8812-4501",
      isSoloTraveler: false,
      ticketCode: "TKT-JG-907",
      boardingPoint: "Terminal Tirtonadi Solo",
      dropPoint: "Terminal Mengwi Bali",
      boarded: false,
      pricePaid: 650000,
    },
    U2B: {
      passengerName: "Fajar Nugroho",
      passengerGender: "Pria",
      passengerPhone: "0813-5521-7788",
      isSoloTraveler: false,
      ticketCode: "TKT-JG-908",
      boardingPoint: "Terminal Tirtonadi Solo",
      dropPoint: "Terminal Mengwi Bali",
      boarded: false,
      pricePaid: 650000,
    },
    U3A: {
      passengerName: "Dewi Lestari",
      passengerGender: "Wanita",
      passengerPhone: "0812-6610-3321",
      isSoloTraveler: true,
      ticketCode: "TKT-JG-909",
      boardingPoint: "Agen Sleman Utara",
      dropPoint: "Terminal Mengwi Bali",
      boarded: true,
      boardedAt: "14:48 WIB",
      pricePaid: 650000,
    },
  };

  return seats.map((s) => {
    const preset = occupiedPreset[s.number];
    if (preset) {
      return {
        ...s,
        status: "occupied",
        ...preset,
      };
    }
    return s;
  });
}

function buildSuiteClassSeats(): SeatData[] {
  // Suite Class Combi 2-1: 7 rows x 3 cols (A & B on left, C single cabin on right) = 21 seats
  const seats: SeatData[] = [];
  const cols = ["A", "B", "C"];
  for (let row = 1; row <= 7; row++) {
    for (let c = 0; c < 3; c++) {
      const num = `${row}${cols[c]}`;
      seats.push({
        id: `SUI-${num}`,
        number: num,
        deck: "lower",
        row,
        col: c + 1,
        status: "available",
      });
    }
  }

  const occupiedPreset: Record<
    string,
    Omit<SeatData, "id" | "number" | "deck" | "row" | "col" | "status">
  > = {
    "1A": {
      passengerName: "Kartika Sari",
      passengerGender: "Wanita",
      passengerPhone: "0812-2301-1190",
      isSoloTraveler: true,
      ticketCode: "TKT-SC-401",
      boardingPoint: "Agen Sleman Utara",
      dropPoint: "Terminal Mengwi Bali",
      boarded: true,
      boardedAt: "15:50 WIB",
      pricePaid: 520000,
    },
    "2A": {
      passengerName: "Reza Pahlevi",
      passengerGender: "Pria",
      passengerPhone: "0811-9082-3312",
      isSoloTraveler: false,
      ticketCode: "TKT-SC-402",
      boardingPoint: "Terminal Giwangan",
      dropPoint: "Terminal Mengwi Bali",
      boarded: true,
      boardedAt: "15:40 WIB",
      pricePaid: 520000,
    },
    "2B": {
      passengerName: "Maya Indriani",
      passengerGender: "Wanita",
      passengerPhone: "0811-9082-3313",
      isSoloTraveler: false,
      ticketCode: "TKT-SC-403",
      boardingPoint: "Terminal Giwangan",
      dropPoint: "Terminal Mengwi Bali",
      boarded: true,
      boardedAt: "15:40 WIB",
      pricePaid: 520000,
    },
    "1C": {
      passengerName: "Intan Permata",
      passengerGender: "Wanita",
      passengerPhone: "0813-4409-2190",
      isSoloTraveler: true,
      ticketCode: "TKT-SC-404",
      boardingPoint: "Agen Sleman Utara",
      dropPoint: "Terminal Mengwi Bali",
      boarded: false,
      pricePaid: 520000,
    },
    "3A": {
      passengerName: "Anisa Fitriani",
      passengerGender: "Wanita",
      passengerPhone: "0817-9921-1029",
      isSoloTraveler: true,
      ticketCode: "TKT-SC-405",
      boardingPoint: "Agen Klaten Sentral",
      dropPoint: "Terminal Mengwi Bali",
      boarded: false,
      pricePaid: 520000,
    },
    "4A": {
      passengerName: "Bima Sakti",
      passengerGender: "Pria",
      passengerPhone: "0812-1010-2020",
      isSoloTraveler: false,
      ticketCode: "TKT-SC-406",
      boardingPoint: "Terminal Giwangan",
      dropPoint: "Terminal Mengwi Bali",
      boarded: true,
      boardedAt: "15:45 WIB",
      pricePaid: 520000,
    },
    "4B": {
      passengerName: "Riko Pratama",
      passengerGender: "Pria",
      passengerPhone: "0812-3030-4040",
      isSoloTraveler: false,
      ticketCode: "TKT-SC-407",
      boardingPoint: "Terminal Giwangan",
      dropPoint: "Terminal Mengwi Bali",
      boarded: true,
      boardedAt: "15:46 WIB",
      pricePaid: 520000,
    },
  };

  return seats.map((s) => {
    const preset = occupiedPreset[s.number];
    return preset ? { ...s, status: "occupied", ...preset } : s;
  });
}

function buildExecutiveSeats(): SeatData[] {
  // Eksekutif 2-2 configuration: 7 rows x 4 cols (A, B left; C, D right) = 28 spacious executive seats
  const seats: SeatData[] = [];
  const cols = ["A", "B", "C", "D"];
  for (let row = 1; row <= 7; row++) {
    for (let c = 0; c < 4; c++) {
      const num = `${row}${cols[c]}`;
      seats.push({
        id: `EKS-${num}`,
        number: num,
        deck: "lower",
        row,
        col: c + 1,
        status: "available",
      });
    }
  }

  // Populate 22 out of 28 seats (> 75% occupancy) so the user immediately sees High-Demand Dynamic Pricing (+15%) in action
  const femaleSoloSeats = ["1A", "2C", "3A", "5C"];
  const occupiedNumbers = [
    "1A",
    "1C",
    "1D",
    "2A",
    "2B",
    "2C",
    "3A",
    "3C",
    "3D",
    "4A",
    "4B",
    "4C",
    "4D",
    "5A",
    "5B",
    "5C",
    "6A",
    "6B",
    "6C",
    "6D",
    "7A",
    "7B",
  ];

  const sampleNames = [
    "Clarissa Putri",
    "Arif Budiman",
    "Dian Sastro",
    "Rendy Pandugo",
    "Ratna Galih",
    "Farah Quinn",
    "Larasati Ningsih",
    "Bayu Skak",
    "Eko Patrio",
    "Wahyu Hidayat",
    "Taufik Hidayat",
    "Surya Saputra",
    "Gading Marten",
    "Andika Pratama",
    "Lukman Sardi",
    "Nabila Syakieb",
    "Agus Kuncoro",
    "Rio Dewanto",
    "Chicco Jerikho",
    "Vino Bastian",
    "Tora Sudiro",
    "Desta Mahendra",
  ];

  const boardingList = [
    "Agen Sleman Utara",
    "Terminal Giwangan",
    "Agen Klaten Sentral",
    "Terminal Tirtonadi Solo",
  ];

  return seats.map((s) => {
    const idx = occupiedNumbers.indexOf(s.number);
    if (idx !== -1) {
      const isFemaleSolo = femaleSoloSeats.includes(s.number);
      const isFemale = isFemaleSolo || idx % 3 === 0;
      return {
        ...s,
        status: "occupied",
        passengerName: sampleNames[idx],
        passengerGender: isFemale ? "Wanita" : "Pria",
        passengerPhone: `0812-5500-${1100 + idx}`,
        isSoloTraveler: isFemaleSolo,
        ticketCode: `TKT-EK-${701 + idx}`,
        boardingPoint: boardingList[idx % boardingList.length],
        dropPoint: "Terminal Mengwi Bali",
        boarded: idx < 17,
        boardedAt: idx < 17 ? "18:40 WIB" : undefined,
        pricePaid: 380000,
      };
    }
    return s;
  });
}

const initialSchedules: ScheduleData[] = [
  {
    id: "JDW-001",
    code: "NHT-JG-BL-01",
    origin: "Yogyakarta",
    destination: "Bali (Denpasar)",
    routeTitle: "Yogyakarta - Bali (Denpasar)",
    departureTime: "14:00 WIB",
    arrivalTime: "07:30 WITA",
    busId: "B-001",
    busName: "Scania K410iB Royal Sleeper",
    plateNumber: "AB 7701 NH",
    busClass: "Sleeper Class",
    basePrice: 650000,
    facilities: [
      "Kabin Tidur 180 Derajat (Upper & Lower Deck)",
      "Pintu Geser Privasi & Sabuk Pengaman",
      "Smart TV 14 Inci & Earphone",
      "Servis Makan Prasmanan RM Taman Sari",
      "Bantal, Selimut Hotel & Amenity Kit",
      "Toilet Bersih & Dispenser Air Panas",
    ],
    seatConfigLabel: "Konfigurasi 1-1 Bertingkat (20 Kabin Tidur)",
    pickupPoints: [
      "Terminal Giwangan",
      "Agen Sleman Utara",
      "Agen Klaten Sentral",
      "Terminal Tirtonadi Solo",
    ],
    dropPoints: [
      "Pelabuhan Gilimanuk",
      "Terminal Negara Jembrana",
      "Terminal Mengwi Bali",
    ],
    seats: buildSleeperSeats(),
    checkpoints: initialCheckpointsJogjaBali,
  },
  {
    id: "JDW-002",
    code: "NHT-JG-BL-02",
    origin: "Yogyakarta",
    destination: "Bali (Denpasar)",
    routeTitle: "Yogyakarta - Bali (Denpasar)",
    departureTime: "16:00 WIB",
    arrivalTime: "09:30 WITA",
    busId: "B-002",
    busName: "Volvo B11R Suite Combi",
    plateNumber: "AB 7702 NH",
    busClass: "Suite Class",
    basePrice: 520000,
    facilities: [
      "Kursi Semi-Kabin 2-1 dengan Tirai Privasi",
      "Electric Legrest & Reclining 150 Derajat",
      "Layar Hiburan AVOD & Port USB Type-C",
      "Servis Makan Prasmanan VIP & Snack Malam",
      "Toilet & Ruang Merokok Terpisah",
    ],
    seatConfigLabel: "Konfigurasi 2-1 Semi-Kabin (21 Kursi Suite)",
    pickupPoints: [
      "Terminal Giwangan",
      "Agen Sleman Utara",
      "Agen Klaten Sentral",
      "Terminal Tirtonadi Solo",
    ],
    dropPoints: [
      "Pelabuhan Gilimanuk",
      "Terminal Mengwi Bali",
    ],
    seats: buildSuiteClassSeats(),
    checkpoints: initialCheckpointsJogjaBali.map((cp) => ({
      ...cp,
      status: cp.order <= 2 ? "completed" : cp.order === 3 ? "current" : "upcoming",
    })),
  },
  {
    id: "JDW-003",
    code: "NHT-JG-BL-03",
    origin: "Yogyakarta",
    destination: "Bali (Denpasar)",
    routeTitle: "Yogyakarta - Bali (Denpasar)",
    departureTime: "19:00 WIB",
    arrivalTime: "12:00 WITA",
    busId: "B-003",
    busName: "Mercedes-Benz OH 1626 Air Suspension",
    plateNumber: "AB 7703 NH",
    busClass: "Eksekutif",
    basePrice: 380000,
    facilities: [
      "Kursi Ergonomis 2-2 dengan Jumbo Legrest",
      "Air Suspension Lembut & Kabin Kedap Suara",
      "Servis Makan Prasmanan RM Taman Sari",
      "Bantal, Selimut & USB Charger Tiap Kursi",
      "Toilet Tengah",
    ],
    seatConfigLabel: "Konfigurasi 2-2 Legrest (28 Kursi Eksekutif)",
    pickupPoints: [
      "Terminal Giwangan",
      "Agen Sleman Utara",
      "Agen Klaten Sentral",
      "Terminal Tirtonadi Solo",
    ],
    dropPoints: [
      "Pelabuhan Gilimanuk",
      "Terminal Mengwi Bali",
    ],
    seats: buildExecutiveSeats(),
    checkpoints: initialCheckpointsJogjaBali.map((cp) => ({
      ...cp,
      status: cp.order === 1 ? "current" : "upcoming",
    })),
  },
];

const initialBaggageList: BaggageItem[] = [
  {
    id: "BG-1",
    baggageCode: "BAG-JG-101A",
    ticketCode: "TKT-JG-901",
    scheduleId: "JDW-001",
    seatNumber: "L1A",
    passengerName: "Nadia Putri Rahmawati",
    description: "Koper Hardcase Hijau Emerald 24 Inci",
    weightKg: 14,
    compartment: "Kompartemen A (Lambung Kiri Depan)",
    status: "Aman di Dalam Kompartemen",
    boardingPoint: "Agen Sleman Utara",
    lastUpdated: "14:43 WIB",
    handlerName: "Kernet Rahmat",
  },
  {
    id: "BG-2",
    baggageCode: "BAG-JG-102A",
    ticketCode: "TKT-JG-902",
    scheduleId: "JDW-001",
    seatNumber: "L2A",
    passengerName: "Aulia Maharani",
    description: "Tas Ransel Carrier 45L & Box Oleh-oleh Bakpia",
    weightKg: 11,
    compartment: "Kompartemen A (Lambung Kiri Depan)",
    status: "Aman di Dalam Kompartemen",
    boardingPoint: "Agen Sleman Utara",
    lastUpdated: "14:45 WIB",
    handlerName: "Kernet Rahmat",
  },
  {
    id: "BG-3",
    baggageCode: "BAG-JG-103B",
    ticketCode: "TKT-JG-904",
    scheduleId: "JDW-001",
    seatNumber: "L3B",
    passengerName: "Hendra Wijaya",
    description: "Koper Kabin Hitam & Tas Kamera Tripod",
    weightKg: 16,
    compartment: "Kompartemen B (Lambung Kanan Tengah)",
    status: "Aman di Dalam Kompartemen",
    boardingPoint: "Terminal Giwangan",
    lastUpdated: "13:56 WIB",
    handlerName: "Kernet Rahmat",
  },
  {
    id: "BG-4",
    baggageCode: "BAG-JG-104C",
    ticketCode: "TKT-JG-905",
    scheduleId: "JDW-001",
    seatNumber: "L4A",
    passengerName: "Bagus Prasetyo",
    description: "Sepeda Lipat Trifold dalam Koper Khusus",
    weightKg: 21,
    compartment: "Kompartemen C (Bagasi Belakang Besar)",
    status: "Aman di Dalam Kompartemen",
    boardingPoint: "Agen Klaten Sentral",
    lastUpdated: "15:29 WIB",
    handlerName: "Kernet Rahmat",
  },
  {
    id: "BG-5",
    baggageCode: "BAG-SC-201A",
    ticketCode: "TKT-SC-401",
    scheduleId: "JDW-002",
    seatNumber: "1A",
    passengerName: "Kartika Sari",
    description: "Koper Putih Polikarbonat 20 Inci",
    weightKg: 9,
    compartment: "Kompartemen A (Lambung Kiri Depan)",
    status: "Aman di Dalam Kompartemen",
    boardingPoint: "Agen Sleman Utara",
    lastUpdated: "15:52 WIB",
    handlerName: "Kernet Wahyudi",
  },
  {
    id: "BG-6",
    baggageCode: "BAG-EK-301B",
    ticketCode: "TKT-EK-701",
    scheduleId: "JDW-003",
    seatNumber: "1A",
    passengerName: "Clarissa Putri",
    description: "Koper Navy 22 Inci & Kardus Kerajinan Perak",
    weightKg: 13,
    compartment: "Kompartemen B (Lambung Kanan Tengah)",
    status: "Terdaftar di Loket Agen",
    boardingPoint: "Agen Sleman Utara",
    lastUpdated: "18:30 WIB",
    handlerName: "Kernet Santoso",
  },
];

const initialActiveGpsFleet: ActiveBusGps[] = [
  {
    busId: "B-001",
    scheduleId: "JDW-001",
    plateNumber: "AB 7701 NH",
    busName: "Scania K410iB Royal Sleeper",
    busClass: "Sleeper Class",
    routeTitle: "Yogyakarta - Bali (Denpasar)",
    driverPrimary: "Bapak Suryono (SIM B2 Umum)",
    driverSecondary: "Bapak Gunawan",
    conductorName: "Rahmat Hidayat",
    driverPin: "7701",
    lat: -7.4289,
    lng: 111.4461,
    speedKmh: 0,
    currentLocationName: "RM Taman Sari Tol Ngawi (Jawa Timur)",
    nextStopName: "Rest Area KM 726B Mojokerto",
    etaNextStop: "21:00 WIB",
    routeProgressPercent: 48,
    operationalStatus: "Berhenti di Rumah Makan",
    lastUpdate: "Baru saja",
    fuelPercent: 82,
    cabinTempCelsius: 21,
  },
  {
    busId: "B-002",
    scheduleId: "JDW-002",
    plateNumber: "AB 7702 NH",
    busName: "Volvo B11R Suite Combi",
    busClass: "Suite Class",
    routeTitle: "Yogyakarta - Bali (Denpasar)",
    driverPrimary: "Bapak Mulyadi (SIM B2 Umum)",
    driverSecondary: "Bapak Heru Susanto",
    conductorName: "Wahyudi",
    driverPin: "7702",
    lat: -7.7058,
    lng: 110.6022,
    speedKmh: 76,
    currentLocationName: "Tol Solo - Klaten KM 14",
    nextStopName: "Terminal Tirtonadi Solo",
    etaNextStop: "16:30 WIB",
    routeProgressPercent: 25,
    operationalStatus: "Berjalan Normal",
    lastUpdate: "12 detik lalu",
    fuelPercent: 91,
    cabinTempCelsius: 20,
  },
  {
    busId: "B-003",
    scheduleId: "JDW-003",
    plateNumber: "AB 7703 NH",
    busName: "Mercedes-Benz OH 1626 Air Suspension",
    busClass: "Eksekutif",
    routeTitle: "Yogyakarta - Bali (Denpasar)",
    driverPrimary: "Bapak Bambang Pamungkas",
    driverSecondary: "Bapak Joko Anwar",
    conductorName: "Santoso",
    driverPin: "7703",
    lat: -7.8342,
    lng: 110.3919,
    speedKmh: 0,
    currentLocationName: "Terminal Tipe A Giwangan (Yogyakarta)",
    nextStopName: "Agen Sleman Utara & Denggung",
    etaNextStop: "19:35 WIB",
    routeProgressPercent: 5,
    operationalStatus: "Boarding Penumpang di Agen",
    lastUpdate: "20 detik lalu",
    fuelPercent: 98,
    cabinTempCelsius: 22,
  },
];

const initialHeatmapData: BoardingPointHeatmapItem[] = [
  {
    id: "HM-1",
    pointName: "Agen Sleman Utara & Denggung",
    region: "Kab. Sleman, DIY",
    type: "Agen Cabang",
    morningCount: 210,
    afternoonCount: 485,
    eveningCount: 540,
    nightCount: 390,
    growthPercent: 28.4,
    topDestination: "Bali (Denpasar) & Surabaya",
    recommendation:
      "Titik naik tertinggi (melebihi terminal utama). Disarankan membuka ruang tunggu VIP tambahan dan menambah kuota alokasi Sleeper Class di Sleman.",
  },
  {
    id: "HM-2",
    pointName: "Terminal Tipe A Giwangan",
    region: "Kota Yogyakarta",
    type: "Terminal Utama",
    morningCount: 180,
    afternoonCount: 320,
    eveningCount: 360,
    nightCount: 290,
    growthPercent: 9.2,
    topDestination: "Bali (Denpasar) & Jakarta",
    recommendation:
      "Volume penumpang stabil. Pertahankan sebagai titik keberangkatan awal dan pengecekan armada.",
  },
  {
    id: "HM-3",
    pointName: "Agen Klaten Sentral & Prambanan",
    region: "Kab. Klaten, Jawa Tengah",
    type: "Agen Cabang",
    morningCount: 95,
    afternoonCount: 210,
    eveningCount: 275,
    nightCount: 185,
    growthPercent: 19.6,
    topDestination: "Bali (Denpasar) & Banyuwangi",
    recommendation:
      "Permintaan sore-malam meningkat pesat. Potensial untuk membuka agen satelit baru di sekitar Exit Tol Klaten.",
  },
  {
    id: "HM-4",
    pointName: "Terminal Tirtonadi Solo",
    region: "Kota Surakarta",
    type: "Titik Transit",
    morningCount: 110,
    afternoonCount: 240,
    eveningCount: 310,
    nightCount: 260,
    growthPercent: 14.1,
    topDestination: "Bali (Denpasar) & Malang",
    recommendation:
      "Titik transit terakhir yang strategis sebelum masuk jalur penuh Tol Trans Jawa.",
  },
  {
    id: "HM-5",
    pointName: "Agen Gamping & Ringroad Barat",
    region: "Kab. Sleman Barat, DIY",
    type: "Agen Cabang",
    morningCount: 140,
    afternoonCount: 260,
    eveningCount: 330,
    nightCount: 215,
    growthPercent: 22.8,
    topDestination: "Jakarta & Bandung",
    recommendation:
      "Sangat ramai dari kalangan mahasiswa dan pekerja. Rekomendasi membuka layanan feeder shuttle dari Gamping menuju Agen Sleman Utara untuk rute Bali.",
  },
];

const initialFleetUnits: FleetUnit[] = [
  {
    id: "B-001",
    plateNumber: "AB 7701 NH",
    chassisBrand: "Scania K410iB Opticruise",
    bodyBuilder: "Adiputro Jetbus 5 Dream Coach",
    busClass: "Sleeper Class",
    totalSeats: 20,
    seatLayout: "1-1 Bertingkat (Upper & Lower Deck)",
    status: "Operasional Aktif",
    baggageCompartments: [
      "Kompartemen A (Lambung Kiri Depan)",
      "Kompartemen B (Lambung Kanan Tengah)",
      "Kompartemen C (Bagasi Belakang Besar - Muat Sepeda)",
    ],
    facilities: [
      "Full Flat Bed 180 Derajat",
      "Smart TV 14 Inci Tiap Kabin",
      "Toilet & Pantry Stewardess",
      "GPS Telemetry Real-Time",
    ],
    lastServiceDate: "10 Nov 2026",
  },
  {
    id: "B-002",
    plateNumber: "AB 7702 NH",
    chassisBrand: "Volvo B11R 450 HP",
    bodyBuilder: "Laksana Legacy SR3 Suite Combi",
    busClass: "Suite Class",
    totalSeats: 21,
    seatLayout: "2-1 Semi-Kabin Privasi",
    status: "Operasional Aktif",
    baggageCompartments: [
      "Kompartemen A (Lambung Kiri Depan)",
      "Kompartemen B (Lambung Kanan Tengah)",
      "Kompartemen C (Bagasi Belakang Besar)",
    ],
    facilities: [
      "Kursi Captain Seat 150 Derajat",
      "Tirai Privasi & AVOD",
      "Toilet & Smoking Room",
      "GPS Telemetry Real-Time",
    ],
    lastServiceDate: "14 Nov 2026",
  },
  {
    id: "B-003",
    plateNumber: "AB 7703 NH",
    chassisBrand: "Mercedes-Benz OH 1626L Euro 4",
    bodyBuilder: "Adiputro Jetbus 5 MHD",
    busClass: "Eksekutif",
    totalSeats: 28,
    seatLayout: "2-2 Executive Legrest",
    status: "Operasional Aktif",
    baggageCompartments: [
      "Kompartemen A (Lambung Kiri Depan)",
      "Kompartemen B (Lambung Kanan Tengah)",
      "Kompartemen C (Bagasi Belakang Besar - Space Luas MHD)",
    ],
    facilities: [
      "Reclining Seat & Jumbo Legrest",
      "USB Fast Charger",
      "Toilet Tengah",
      "GPS Telemetry Real-Time",
    ],
    lastServiceDate: "16 Nov 2026",
  },
  {
    id: "B-004",
    plateNumber: "AB 7704 NH",
    chassisBrand: "Hino RM 280 ABS Wide Air Suspension",
    bodyBuilder: "Tentrem Avante H8",
    busClass: "Eksekutif",
    totalSeats: 28,
    seatLayout: "2-2 Executive Legrest",
    status: "Siaga Garasi",
    baggageCompartments: [
      "Kompartemen A (Lambung Kiri Depan)",
      "Kompartemen B (Lambung Kanan Tengah)",
      "Kompartemen C (Bagasi Belakang Besar)",
    ],
    facilities: [
      "Reclining Seat & Legrest",
      "Dispenser Kopi & Teh",
      "Toilet Tengah",
      "GPS Telemetry Real-Time",
    ],
    lastServiceDate: "18 Nov 2026",
  },
];

export function checkSoloFemaleRestriction(
  seats: SeatData[],
  targetSeat: SeatData
): {
  isRestrictedToFemale: boolean;
  reason?: string;
  neighborSeatNumber?: string;
  neighborName?: string;
} {
  // Find adjacent seat in the same deck and same row
  // For 1-1 Sleeper: cabins are separated by aisle and sliding doors, so every cabin is private (ideal for Solo Traveler!),
  // OR if a neighbor across the same row is female solo, we highlight it as recommended.
  // For 2-1 Suite Class: cols 1 & 2 (A & B) are adjacent; col 3 (C) is single private seat.
  // For 2-2 Eksekutif: cols 1 & 2 (A & B) are adjacent pair; cols 3 & 4 (C & D) are adjacent pair.
  const sameRowDeck = seats.filter(
    (s) => s.deck === targetSeat.deck && s.row === targetSeat.row && s.id !== targetSeat.id
  );

  // Determine paired column
  let pairedCol: number | null = null;
  const maxColInRow = Math.max(...seats.filter((s) => s.row === targetSeat.row).map((s) => s.col));

  if (maxColInRow === 4) {
    // 2-2 layout: (1,2) and (3,4)
    if (targetSeat.col === 1) pairedCol = 2;
    else if (targetSeat.col === 2) pairedCol = 1;
    else if (targetSeat.col === 3) pairedCol = 4;
    else if (targetSeat.col === 4) pairedCol = 3;
  } else if (maxColInRow === 3) {
    // 2-1 layout: (1,2) are paired, 3 is single
    if (targetSeat.col === 1) pairedCol = 2;
    else if (targetSeat.col === 2) pairedCol = 1;
  } else if (maxColInRow === 2) {
    // 1-1 sleeper layout: cabins 1 & 2 are on the same level/row
    pairedCol = targetSeat.col === 1 ? 2 : 1;
  }

  if (pairedCol !== null) {
    const neighbor = sameRowDeck.find((s) => s.col === pairedCol);
    if (
      neighbor &&
      neighbor.status === "occupied" &&
      neighbor.passengerGender === "Wanita" &&
      neighbor.isSoloTraveler
    ) {
      return {
        isRestrictedToFemale: true,
        neighborSeatNumber: neighbor.number,
        neighborName: neighbor.passengerName,
        reason: `Kursi sebelah (${neighbor.number} - ${neighbor.passengerName}) mengaktifkan proteksi Solo Traveler Wanita. Kursi ini dikhususkan bagi penumpang Wanita.`,
      };
    }
  }

  return { isRestrictedToFemale: false };
}

const BusSystemContext = createContext<BusSystemContextValue | undefined>(undefined);

export function BusSystemProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRoleState] = useState<AppUserRole>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = sessionStorage.getItem("nh_auth_session");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (
            parsed?.role === "pengguna" ||
            parsed?.role === "admin" ||
            parsed?.role === "owner"
          ) {
            return parsed.role;
          }
        }
      } catch {
        // ignore
      }
    }
    return "pengguna";
  });

  const setUserRole = (nextRole: AppUserRole) => {
    setUserRoleState(nextRole);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "nh_auth_session",
        JSON.stringify({
          role: nextRole,
          loggedInAt: new Date().toISOString(),
        })
      );
    }
  };

  const [schedules, setSchedules] = useState<ScheduleData[]>(initialSchedules);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("JDW-001");
  const [seasonMode, setSeasonMode] = useState<SeasonPricingMode>("normal");
  const [autoOccupancyPricing, setAutoOccupancyPricing] = useState<boolean>(true);
  const [lastMinutePromo, setLastMinutePromo] = useState<boolean>(false);
  const [baggageList, setBaggageList] = useState<BaggageItem[]>(initialBaggageList);
  const [activeGpsFleet, setActiveGpsFleet] = useState<ActiveBusGps[]>(initialActiveGpsFleet);
  const [heatmapData] = useState<BoardingPointHeatmapItem[]>(initialHeatmapData);
  const [fleetUnits, setFleetUnits] = useState<FleetUnit[]>(initialFleetUnits);

  const calculateDynamicPrice = useMemo(() => {
    return (schedule: ScheduleData): DynamicPriceCalculation => {
      const totalCount = schedule.seats.length;
      const occupiedCount = schedule.seats.filter((s) => s.status === "occupied").length;
      const occupancyRate = totalCount > 0 ? Math.round((occupiedCount / totalCount) * 100) : 0;

      const appliedAdjustments: DynamicPriceCalculation["appliedAdjustments"] = [];
      let totalPercentDelta = 0;

      if (autoOccupancyPricing) {
        if (occupancyRate >= 75) {
          appliedAdjustments.push({
            label: "Okupansi Tinggi (>= 75% Kursi Terisi)",
            percentDelta: 15,
            amountDelta: Math.round(schedule.basePrice * 0.15),
          });
          totalPercentDelta += 15;
        } else if (occupancyRate >= 50) {
          appliedAdjustments.push({
            label: "Permintaan Menguat (50% - 74% Kursi Terisi)",
            percentDelta: 8,
            amountDelta: Math.round(schedule.basePrice * 0.08),
          });
          totalPercentDelta += 8;
        } else if (occupancyRate <= 40 && lastMinutePromo) {
          appliedAdjustments.push({
            label: "Promo Last-Minute (Okupansi < 40%)",
            percentDelta: -12,
            amountDelta: -Math.round(schedule.basePrice * 0.12),
          });
          totalPercentDelta -= 12;
        }
      }

      if (seasonMode === "weekend") {
        appliedAdjustments.push({
          label: "Tarif Akhir Pekan (Jumat - Minggu)",
          percentDelta: 10,
          amountDelta: Math.round(schedule.basePrice * 0.1),
        });
        totalPercentDelta += 10;
      } else if (seasonMode === "peak_holiday") {
        appliedAdjustments.push({
          label: "Musim Libur Panjang / Peak Season",
          percentDelta: 15,
          amountDelta: Math.round(schedule.basePrice * 0.15),
        });
        totalPercentDelta += 15;
      }

      const rawFinal = schedule.basePrice * (1 + totalPercentDelta / 100);
      // Round to nearest 5,000 Rupiah for clean ticketing
      const finalPrice = Math.round(rawFinal / 5000) * 5000;

      return {
        basePrice: schedule.basePrice,
        finalPrice,
        occupancyRate,
        occupiedCount,
        totalCount,
        appliedAdjustments,
      };
    };
  }, [autoOccupancyPricing, lastMinutePromo, seasonMode]);

  const bookSeat = (input: OrderSeatInput) => {
    const schedule = schedules.find((s) => s.id === input.scheduleId);
    const dynamicInfo = schedule ? calculateDynamicPrice(schedule) : null;
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const ticketCode = `TKT-JG-${randomSuffix}`;
    let generatedBaggageCode: string | undefined;

    let bookedSeatNumber = "";

    setSchedules((prev) =>
      prev.map((sch) => {
        if (sch.id !== input.scheduleId) return sch;
        return {
          ...sch,
          seats: sch.seats.map((seat) => {
            if (seat.id !== input.seatId) return seat;
            bookedSeatNumber = seat.number;
            return {
              ...seat,
              status: "occupied",
              passengerName: input.passengerName,
              passengerGender: input.passengerGender,
              passengerPhone: input.passengerPhone,
              isSoloTraveler: input.isSoloTraveler,
              ticketCode,
              boardingPoint: input.boardingPoint,
              dropPoint: input.dropPoint,
              boarded: false,
              pricePaid: dynamicInfo ? dynamicInfo.finalPrice : sch.basePrice,
            };
          }),
        };
      })
    );

    if (input.baggageDescription && input.baggageDescription.trim().length > 0) {
      const compLetter = input.baggageCompartment?.includes("Kompartemen B")
        ? "B"
        : input.baggageCompartment?.includes("Kompartemen C")
        ? "C"
        : "A";
      generatedBaggageCode = `BAG-JG-${randomSuffix}${compLetter}`;
      const newBag: BaggageItem = {
        id: `BG-${Date.now()}`,
        baggageCode: generatedBaggageCode,
        ticketCode,
        scheduleId: input.scheduleId,
        seatNumber: bookedSeatNumber || input.seatId.split("-")[1] || "1A",
        passengerName: input.passengerName,
        description: input.baggageDescription.trim(),
        weightKg: input.baggageWeightKg || 10,
        compartment:
          input.baggageCompartment || "Kompartemen A (Lambung Kiri Depan)",
        status: "Aman di Dalam Kompartemen",
        boardingPoint: input.boardingPoint,
        lastUpdated: "Baru saja",
        handlerName: "Petugas Boarding",
      };
      setBaggageList((prev) => [newBag, ...prev]);
    }

    return { ticketCode, baggageCode: generatedBaggageCode };
  };

  const togglePassengerBoarding = (scheduleId: string, seatId: string) => {
    const nowStr = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB";

    setSchedules((prev) =>
      prev.map((sch) => {
        if (sch.id !== scheduleId) return sch;
        return {
          ...sch,
          seats: sch.seats.map((seat) => {
            if (seat.id !== seatId) return seat;
            const nextBoarded = !seat.boarded;
            return {
              ...seat,
              boarded: nextBoarded,
              boardedAt: nextBoarded ? nowStr : undefined,
            };
          }),
        };
      })
    );
  };

  const verifyTicketByCode = (ticketCode: string) => {
    const normalized = ticketCode.trim().toUpperCase();
    if (!normalized) {
      return { success: false, message: "Masukkan kode tiket terlebih dahulu." };
    }

    let foundPassenger: string | undefined;
    let foundSeat: string | undefined;
    let foundScheduleId: string | undefined;
    let foundSeatId: string | undefined;
    let alreadyBoarded = false;

    for (const sch of schedules) {
      for (const seat of sch.seats) {
        if (seat.status === "occupied" && seat.ticketCode?.toUpperCase() === normalized) {
          foundPassenger = seat.passengerName;
          foundSeat = seat.number;
          foundScheduleId = sch.id;
          foundSeatId = seat.id;
          alreadyBoarded = Boolean(seat.boarded);
          break;
        }
      }
      if (foundSeatId) break;
    }

    if (!foundScheduleId || !foundSeatId) {
      return {
        success: false,
        message: `Kode tiket ${normalized} tidak ditemukan dalam manifest keberangkatan.`,
      };
    }

    if (alreadyBoarded) {
      return {
        success: true,
        message: `Penumpang ${foundPassenger} (Kursi ${foundSeat}) sudah tercatat naik sebelumnya.`,
        passengerName: foundPassenger,
        seatNumber: foundSeat,
      };
    }

    const nowStr =
      new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB";

    setSchedules((prev) =>
      prev.map((sch) => {
        if (sch.id !== foundScheduleId) return sch;
        return {
          ...sch,
          seats: sch.seats.map((s) =>
            s.id === foundSeatId ? { ...s, boarded: true, boardedAt: nowStr } : s
          ),
        };
      })
    );

    return {
      success: true,
      message: `Verifikasi berhasil: ${foundPassenger} (Kursi ${foundSeat}) tercatat SUDAH NAIK pada ${nowStr}.`,
      passengerName: foundPassenger,
      seatNumber: foundSeat,
    };
  };

  const addBaggage = (
    item: Omit<BaggageItem, "id" | "baggageCode" | "lastUpdated">
  ) => {
    const suffix = Math.floor(100 + Math.random() * 900);
    const compLetter = item.compartment.includes("Kompartemen B")
      ? "B"
      : item.compartment.includes("Kompartemen C")
      ? "C"
      : "A";
    const baggageCode = `BAG-JG-${suffix}${compLetter}`;
    const newItem: BaggageItem = {
      ...item,
      id: `BG-${Date.now()}`,
      baggageCode,
      lastUpdated: "Baru saja",
    };
    setBaggageList((prev) => [newItem, ...prev]);
    return baggageCode;
  };

  const updateBaggageStatus = (
    baggageId: string,
    status: BaggageItem["status"],
    compartment?: BaggageItem["compartment"]
  ) => {
    const nowStr =
      new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB";

    setBaggageList((prev) =>
      prev.map((b) =>
        b.id === baggageId
          ? {
              ...b,
              status,
              compartment: compartment || b.compartment,
              lastUpdated: nowStr,
            }
          : b
      )
    );
  };

  const updateBusGps = (
    busId: string,
    updates: Partial<
      Pick<
        ActiveBusGps,
        | "lat"
        | "lng"
        | "speedKmh"
        | "currentLocationName"
        | "nextStopName"
        | "etaNextStop"
        | "routeProgressPercent"
        | "operationalStatus"
      >
    >
  ) => {
    const nowStr =
      new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }) + " WIB";

    setActiveGpsFleet((prev) =>
      prev.map((bus) =>
        bus.busId === busId
          ? {
              ...bus,
              ...updates,
              lastUpdate: nowStr,
            }
          : bus
      )
    );
  };

  const advanceCheckpoint = (scheduleId: string, checkpointId: string) => {
    let targetCheckpoint: CheckpointData | undefined;
    let nextCheckpoint: CheckpointData | undefined;
    let targetBusId: string | undefined;

    setSchedules((prev) =>
      prev.map((sch) => {
        if (sch.id !== scheduleId) return sch;
        targetBusId = sch.busId;
        const target = sch.checkpoints.find((c) => c.id === checkpointId);
        if (!target) return sch;
        targetCheckpoint = target;
        nextCheckpoint = sch.checkpoints.find((c) => c.order === target.order + 1);

        return {
          ...sch,
          checkpoints: sch.checkpoints.map((cp) => {
            if (cp.order < target.order) {
              return { ...cp, status: "completed" };
            }
            if (cp.order === target.order) {
              return { ...cp, status: "current" };
            }
            return { ...cp, status: "upcoming" };
          }),
        };
      })
    );

    if (targetBusId && targetCheckpoint) {
      updateBusGps(targetBusId, {
        lat: targetCheckpoint.lat,
        lng: targetCheckpoint.lng,
        currentLocationName: `${targetCheckpoint.name} (${targetCheckpoint.city})`,
        nextStopName: nextCheckpoint ? nextCheckpoint.name : "Tujuan Akhir Tercapai",
        etaNextStop: nextCheckpoint ? nextCheckpoint.scheduledTime : "Tiba",
        routeProgressPercent: targetCheckpoint.progressPercent,
        operationalStatus:
          targetCheckpoint.category === "Rumah Makan"
            ? "Berhenti di Rumah Makan"
            : targetCheckpoint.category === "Pelabuhan"
            ? "Menyeberang Kapal Ferry"
            : "Berjalan Normal",
        speedKmh:
          targetCheckpoint.category === "Rumah Makan" ||
          targetCheckpoint.category === "Terminal"
            ? 0
            : 78,
      });
    }
  };

  const addCheckpoint = (
    scheduleId: string,
    checkpoint: Omit<CheckpointData, "id" | "order">
  ) => {
    setSchedules((prev) =>
      prev.map((sch) => {
        if (sch.id !== scheduleId) return sch;
        const nextOrder = sch.checkpoints.length + 1;
        return {
          ...sch,
          checkpoints: [
            ...sch.checkpoints,
            {
              ...checkpoint,
              id: `CP-${Date.now()}`,
              order: nextOrder,
            },
          ],
        };
      })
    );
  };

  const addFleetUnit = (unit: Omit<FleetUnit, "id">) => {
    setFleetUnits((prev) => [
      ...prev,
      {
        ...unit,
        id: `B-00${prev.length + 1}`,
      },
    ]);
  };

  return (
    <BusSystemContext.Provider
      value={{
        userRole,
        setUserRole,
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
        verifyTicketByCode,
        baggageList,
        addBaggage,
        updateBaggageStatus,
        activeGpsFleet,
        updateBusGps,
        advanceCheckpoint,
        addCheckpoint,
        heatmapData,
        fleetUnits,
        addFleetUnit,
      }}
    >
      {children}
    </BusSystemContext.Provider>
  );
}

export function useBusSystem() {
  const ctx = useContext(BusSystemContext);
  if (!ctx) {
    throw new Error("useBusSystem harus digunakan di dalam BusSystemProvider");
  }
  return ctx;
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}
