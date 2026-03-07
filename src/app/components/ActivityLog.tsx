import type { TheftOccurrence } from "@/services/magic_api/security";
import {
  AlertTriangle,
  Clock,
  PackageCheck,
  Radio,
  ScanBarcode,
  UserX,
  Users
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";

type ActivityType =
  | "produtos_lidos"
  | "furtos"
  | "nao_identificados"
  | "recuperados";

interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: Date;
  antenna: number;
  epc: string;
  locationName?: string;
}

const formatDateTime = (date: Date) =>
  date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

const activityConfig: Record<
  ActivityType,
  { icon: LucideIcon; bg: string; iconColor: string; border: string }
> = {
  produtos_lidos: {
    icon: ScanBarcode,
    bg: "bg-green-50",
    iconColor: "text-green-600",
    border: "border-green-200"
  },
  furtos: {
    icon: AlertTriangle,
    bg: "bg-red-50",
    iconColor: "text-red-600",
    border: "border-red-200"
  },
  nao_identificados: {
    icon: UserX,
    bg: "bg-purple-50",
    iconColor: "text-purple-600",
    border: "border-purple-200"
  },
  recuperados: {
    icon: PackageCheck,
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
    border: "border-amber-200"
  }
};

function mapTheftToActivity(o: TheftOccurrence): Activity {
  const firstProduct = o.relatedProducts?.[0];
  const description =
    firstProduct?.name != null
      ? `Furto - ${o.location.name}: ${firstProduct.name}`
      : `Furto - ${o.location.name}`;
  return {
    id: o.occurrenceId,
    type: "furtos",
    description,
    timestamp: new Date(o.occurredAt),
    antenna: 0,
    epc: firstProduct?.epc ?? "—",
    locationName: o.location.name
  };
}

interface ActivityLogProps {
  theftOccurrences?: TheftOccurrence[];
}

export function ActivityLog({ theftOccurrences = [] }: ActivityLogProps) {
  const activities = useMemo(() => {
    return theftOccurrences
      .map(mapTheftToActivity)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [theftOccurrences]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl shadow-sm flex h-full flex-col overflow-hidden"
    >
      <div className="bg-linear-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-slate-700 p-2 rounded-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Registro de Atividades</h3>
            <p className="text-sm text-slate-500">
              Eventos detectados pelas antenas RFID em tempo real
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 p-4">
        <div className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto overflow-x-hidden">
        {activities.map((activity, index) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`shrink-0 ${config.bg} border ${config.border} rounded-xl p-3 transition-shadow hover:shadow-md`}
            >
              <div className="flex gap-3">
                <div className="shrink-0">
                  <div className="rounded-lg bg-white p-2 shadow-sm">
                    <Icon className={`w-5 h-5 ${config.iconColor}`} />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-slate-700">
                      {activity.description}
                    </p>
                    <span className="flex shrink-0 items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(activity.timestamp)}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                    <span className="font-mono text-slate-600">
                      EPC: {activity.epc}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium text-slate-600">
                      <Radio className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      {activity.locationName != null
                        ? `Local: ${activity.locationName}`
                        : `Antena ${activity.antenna}`}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        </div>
      </div>
    </motion.div>
  );
}

