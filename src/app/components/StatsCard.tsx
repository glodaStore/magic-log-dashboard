import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

type StatsCardColor = "amber" | "blue" | "green" | "purple" | "red";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: StatsCardColor;
  delay?: number;
}

const colorClasses: Record<
  StatsCardColor,
  {
    bg: string;
    icon: string;
    text: string;
    border: string;
  }
> = {
  amber: {
    bg: "bg-amber-50",
    icon: "bg-amber-500",
    text: "text-amber-700",
    border: "border-amber-100"
  },
  blue: {
    bg: "bg-blue-50",
    icon: "bg-blue-500",
    text: "text-blue-700",
    border: "border-blue-100"
  },
  green: {
    bg: "bg-green-50",
    icon: "bg-green-500",
    text: "text-green-700",
    border: "border-green-100"
  },
  purple: {
    bg: "bg-purple-50",
    icon: "bg-purple-500",
    text: "text-purple-700",
    border: "border-purple-100"
  },
  red: {
    bg: "bg-red-50",
    icon: "bg-red-500",
    text: "text-red-700",
    border: "border-red-100"
  }
};

export function StatsCard({ title, value, icon: Icon, color, delay = 0 }: StatsCardProps) {
  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`${colors.bg} rounded-xl p-5 border ${colors.border}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`${colors.icon} p-3 rounded-xl`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

