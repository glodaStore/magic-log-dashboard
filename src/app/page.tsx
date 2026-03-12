"use client";

import type { Activity } from "./components/ActivityLog";
import { ActivityLog } from "./components/ActivityLog";
import { StatsCard } from "./components/StatsCard";
import { LogIn, LogOut } from "lucide-react";
import { useMemo } from "react";

const LOCAL_MELISSA = "Melissa CM Taguatinga";

const MOCK_PRODUCT_NAMES = [
  "MELISSA CROSS M LOVER PLATFORM AD",
  "Dual Bag",
  "MELISSA FLOW SANDALIA",
  "BOLSA MELISSA M MINI",
  "MELISSA CROSS M LOVER PLATFORM AD",
  "SANDALIA MELISSA URSINHO",
  "BOLSA MELISSA MINI BACKPACK",
  "MELISSA JUJU SANDAL"
];

const MOCK_ENTRADA_COUNT = 36;

function getMockEntradaActivities(): Activity[] {
  const base = new Date();
  return Array.from({ length: MOCK_ENTRADA_COUNT }, (_, i) => {
    const productName = MOCK_PRODUCT_NAMES[i % MOCK_PRODUCT_NAMES.length];
    const suffix = (i + 1).toString(16).toUpperCase().padStart(2, "0");
    const suffix2 = ((i * 7 + 42) % 100).toString().padStart(2, "0");
    const timestamp = new Date(
      base.getTime() - i * 3 * 60 * 1000
    );
    return {
      id: `mock-${i + 1}`,
      type: "entrada" as const,
      description: `Entrada - ${LOCAL_MELISSA}: ${productName}`,
      timestamp,
      antenna: 0,
      epc: `E28068940000503136742${suffix}${suffix2}`,
      locationName: LOCAL_MELISSA
    };
  });
}

export default function Home() {
  const mockActivities = useMemo(() => getMockEntradaActivities(), []);
  return (
    <div className="h-screen w-full min-w-full overflow-hidden bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto flex h-full w-full max-w-[1800px] flex-col">
        <div className="mb-4 shrink-0">
          <h1 className="mb-1 text-3xl font-bold text-slate-900">MagicLog</h1>
          <p className="text-sm text-slate-600">
            Monitoramento inteligente com detecção de tags em tempo real
          </p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2">
            <StatsCard
              title="Entrada"
              value={mockActivities.length}
              icon={LogIn}
              color="blue"
              delay={0.1}
            />
            <StatsCard
              title="Saída"
              value={0}
              icon={LogOut}
              color="green"
              delay={0.15}
            />
          </div>

          <div className="min-h-0 flex-1">
            <ActivityLog activities={mockActivities} />
          </div>
        </div>
      </div>
    </div>
  );
}

