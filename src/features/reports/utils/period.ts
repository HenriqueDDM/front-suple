import type { ReportPeriod } from "@/types/api";

export type ReportPeriodPreset = "today" | "7d" | "30d" | "month" | "custom";

function toDateInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function buildReportPeriod(preset: ReportPeriodPreset, custom?: ReportPeriod): ReportPeriod {
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  if (preset === "custom" && custom?.from && custom?.to) {
    return custom;
  }

  if (preset === "today") {
    const key = toDateInputValue(today);
    return { from: key, to: key };
  }

  if (preset === "7d") {
    const from = new Date(today);
    from.setDate(from.getDate() - 6);
    return { from: toDateInputValue(from), to: toDateInputValue(today) };
  }

  if (preset === "month") {
    const from = new Date(today.getFullYear(), today.getMonth(), 1);
    return { from: toDateInputValue(from), to: toDateInputValue(today) };
  }

  // 30d default (same as petshop-ish month window when starting mid-month)
  const from = new Date(today);
  from.setDate(from.getDate() - 29);
  return { from: toDateInputValue(from), to: toDateInputValue(today) };
}

export function formatPeriodLabel(period: ReportPeriod): string {
  const from = new Date(`${period.from}T12:00:00`).toLocaleDateString("pt-BR");
  const to = new Date(`${period.to}T12:00:00`).toLocaleDateString("pt-BR");
  if (period.from === period.to) return from;
  return `${from} — ${to}`;
}

export const REPORT_PERIOD_PRESETS: Array<{ id: ReportPeriodPreset; label: string }> = [
  { id: "today", label: "Hoje" },
  { id: "7d", label: "7 dias" },
  { id: "30d", label: "30 dias" },
  { id: "month", label: "Mês atual" },
  { id: "custom", label: "Personalizado" },
];
