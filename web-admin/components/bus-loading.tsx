"use client";

import React from "react";

interface BusRoadLoaderProps {
  title?: string;
  subtitle?: string;
  fullScreen?: boolean;
}

export function BusRoadLoader({
  title = "MEMUAT PERJALANAN...",
  subtitle = "Menyiapkan data keberangkatan & denah kursi Nusantara Hijau",
  fullScreen = true,
}: BusRoadLoaderProps) {
  return (
    <div
      className={`${
        fullScreen
          ? "fixed inset-0 z-50 bg-white/95 backdrop-blur-xs"
          : "w-full py-16 bg-white"
      } flex flex-col items-center justify-center p-6 select-none`}
    >
      <div className="w-full max-w-md text-center space-y-5">
        {/* Brand Kecil di Atas */}
        <div className="inline-block border-y-2 border-emerald-950 py-0.5 px-2">
          <span className="text-sm font-extrabold tracking-tight text-emerald-950 italic">
            NUSANTARA
          </span>
          <span className="text-sm font-light tracking-tight text-emerald-600 italic">
            HIJAU
          </span>
        </div>

        {/* Kanvas Animasi Bus Berjalan di Jalanan */}
        <div className="relative w-full bg-slate-100 rounded-xl border border-slate-200 pt-6 pb-4 px-4 overflow-hidden shadow-xs">
          {/* Siluet Perbukitan Halus di Latar Belakang */}
          <svg
            viewBox="0 0 360 110"
            className="w-full h-28 mx-auto overflow-visible"
            fill="none"
          >
            {/* Awan / Garis Langit */}
            <line
              x1="20"
              y1="18"
              x2="85"
              y2="18"
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="240"
              y1="14"
              x2="310"
              y2="14"
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Grup Bus yang Melaju (Suspensi + Gerak Maju-Mundur Halus) */}
            <g className="animate-bus-cruise">
              <g className="animate-bus-suspension">
                {/* Sorot Lampu Depan Bus */}
                <polygon
                  points="296,62 348,52 348,76"
                  fill="#10b981"
                  fillOpacity="0.18"
                />

                {/* Bayangan Bawah Bus */}
                <ellipse
                  cx="185"
                  cy="83"
                  rx="115"
                  ry="4"
                  fill="#0f172a"
                  fillOpacity="0.22"
                />

                {/* Bodi Utama Bus (Putih & Hijau Emerald) */}
                <path
                  d="M72 34 C72 28 77 24 84 24 L268 24 C282 24 291 31 295 44 L297 72 C297 75 295 77 291 77 L76 77 C73 77 72 75 72 71 Z"
                  fill="#ffffff"
                  stroke="#064e3b"
                  strokeWidth="2"
                />

                {/* Topi Atap Bus Hijau Tua */}
                <path
                  d="M78 24 L268 24 C277 24 284 27 288 32 L73 32 C74 27 76 24 78 24 Z"
                  fill="#064e3b"
                />

                {/* Kaca Jendela Panoramik Samping & Depan */}
                <path
                  d="M80 32 L262 32 L262 50 L80 50 Z"
                  fill="#0f172a"
                />
                {/* Pilar Kaca */}
                <line
                  x1="115"
                  y1="32"
                  x2="115"
                  y2="50"
                  stroke="#334155"
                  strokeWidth="2"
                />
                <line
                  x1="152"
                  y1="32"
                  x2="152"
                  y2="50"
                  stroke="#334155"
                  strokeWidth="2"
                />
                <line
                  x1="189"
                  y1="32"
                  x2="189"
                  y2="50"
                  stroke="#334155"
                  strokeWidth="2"
                />
                <line
                  x1="226"
                  y1="32"
                  x2="226"
                  y2="50"
                  stroke="#334155"
                  strokeWidth="2"
                />

                {/* Kaca Depan & Pintu */}
                <path
                  d="M267 32 L288 32 C292 37 294 44 295 52 L267 52 Z"
                  fill="#0f172a"
                />

                {/* Livery Garis Hijau Emerald Khas Nusantara Hijau */}
                <path
                  d="M72 54 L235 54 L252 48 L295 48 L296 63 L72 63 Z"
                  fill="#059669"
                />
                <path
                  d="M72 63 L296 63 L296 75 L72 75 Z"
                  fill="#064e3b"
                />

                {/* Garis Pintu Bagasi Kompartemen A, B, C */}
                <line
                  x1="145"
                  y1="55"
                  x2="145"
                  y2="75"
                  stroke="#022c22"
                  strokeWidth="1.5"
                />
                <line
                  x1="185"
                  y1="55"
                  x2="185"
                  y2="75"
                  stroke="#022c22"
                  strokeWidth="1.5"
                />
                <line
                  x1="225"
                  y1="55"
                  x2="225"
                  y2="75"
                  stroke="#022c22"
                  strokeWidth="1.5"
                />

                {/* Lampu Depan & Belakang */}
                <rect
                  x="291"
                  y="64"
                  width="6"
                  height="5"
                  rx="1.5"
                  fill="#fef08a"
                />
                <rect
                  x="72"
                  y="64"
                  width="4"
                  height="6"
                  rx="1"
                  fill="#ef4444"
                />

                {/* Roda Belakang Ganda (Berputar) */}
                <g className="animate-wheel-spin">
                  <circle cx="105" cy="77" r="10" fill="#0f172a" />
                  <circle cx="105" cy="77" r="5" fill="#e2e8f0" />
                  <line
                    x1="105"
                    y1="69"
                    x2="105"
                    y2="85"
                    stroke="#064e3b"
                    strokeWidth="2"
                  />
                  <line
                    x1="97"
                    y1="77"
                    x2="113"
                    y2="77"
                    stroke="#064e3b"
                    strokeWidth="2"
                  />
                </g>

                <g className="animate-wheel-spin">
                  <circle cx="128" cy="77" r="10" fill="#0f172a" />
                  <circle cx="128" cy="77" r="5" fill="#e2e8f0" />
                  <line
                    x1="128"
                    y1="69"
                    x2="128"
                    y2="85"
                    stroke="#064e3b"
                    strokeWidth="2"
                  />
                  <line
                    x1="120"
                    y1="77"
                    x2="136"
                    y2="77"
                    stroke="#064e3b"
                    strokeWidth="2"
                  />
                </g>

                {/* Roda Depan (Berputar) */}
                <g className="animate-wheel-spin">
                  <circle cx="256" cy="77" r="10" fill="#0f172a" />
                  <circle cx="256" cy="77" r="5" fill="#e2e8f0" />
                  <line
                    x1="256"
                    y1="69"
                    x2="256"
                    y2="85"
                    stroke="#064e3b"
                    strokeWidth="2"
                  />
                  <line
                    x1="248"
                    y1="77"
                    x2="264"
                    y2="77"
                    stroke="#064e3b"
                    strokeWidth="2"
                  />
                </g>
              </g>
            </g>

            {/* Permukaan Aspal Jalan Raya */}
            <rect x="0" y="87" width="360" height="16" rx="3" fill="#1e293b" />
            {/* Marka Jalan Putus-putus yang Bergerak */}
            <line
              x1="0"
              y1="95"
              x2="360"
              y2="95"
              stroke="#34d399"
              strokeWidth="2.5"
              strokeDasharray="14 10"
              className="animate-road-stripes"
            />
          </svg>

          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-emerald-800 px-2 pt-1">
            <span>YOGYAKARTA</span>
            <span className="text-slate-400">• • • TRANS JAWA • • •</span>
            <span>BALI (DENPASAR)</span>
          </div>
        </div>

        {/* Teks Status Loading */}
        <div className="space-y-1">
          <div className="text-sm font-bold tracking-wider uppercase text-emerald-950">
            {title}
          </div>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
