"use client";

import { formatDateTime } from "@/lib/formatters.ts";

interface DateCellProps {
  date?: string | Date;
}

export function DateCell({ date }: DateCellProps) {
  if (!date) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }
  return <span className="text-sm">{formatDateTime(date)}</span>;
}
