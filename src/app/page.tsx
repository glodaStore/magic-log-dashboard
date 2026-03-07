"use client";

import { useTheftOccurrences } from "@/hooks/useTheftOccurrences";
import { AlertTriangle, PackageCheck, ScanBarcode, UserX } from "lucide-react";
import { useMemo } from "react";
import { ActivityLog } from "./components/ActivityLog";
import { StatsCard } from "./components/StatsCard";

const THEFT_OCCURRENCES_PARAMS = { page: 1, limit: 50 };

export default function Home() {
  const theftParams = useMemo(() => THEFT_OCCURRENCES_PARAMS, []);
  const { total: furtosTotal, occurrences: theftOccurrences } =
    useTheftOccurrences(theftParams);
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
          <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Produtos lidos"
              value={0}
              icon={ScanBarcode}
              color="green"
              delay={0.1}
            />
            <StatsCard
              title="Furtos"
              value={furtosTotal}
              icon={AlertTriangle}
              color="red"
              delay={0.15}
            />
            <StatsCard
              title="Não identificados"
              value={0}
              icon={UserX}
              color="purple"
              delay={0.2}
            />
            <StatsCard
              title="Recuperados"
              value={0}
              icon={PackageCheck}
              color="amber"
              delay={0.25}
            />
          </div>

          <div className="min-h-0 flex-1">
            <ActivityLog theftOccurrences={theftOccurrences} />
          </div>
        </div>
      </div>
    </div>
  );
}

