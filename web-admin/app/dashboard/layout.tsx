"use client";

import React from "react";
import { BusSystemProvider } from "@/lib/bus-system-context";
import { ClassicHeader, ClassicFooter } from "@/components/classic-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BusSystemProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        <ClassicHeader />

        <main className="flex-1 py-8 px-4 sm:px-6 max-w-6xl w-full mx-auto">
          {children}
        </main>

        <ClassicFooter />
      </div>
    </BusSystemProvider>
  );
}
