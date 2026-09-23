// Display formatting for values stored in content files.

/** `2026-03` → `2026.03` */
export const formatYearMonth = (yearMonth: string): string => yearMonth.replace('-', '.');

/** `2026-03-06` → `2026.03.06` */
export const formatDate = (date: string): string => date.replace(/-/g, '.');

/** `2026-03`, `2029-02` → `2026.03 – 2029.02` */
export const formatPeriod = (start: string, end: string): string => `${formatYearMonth(start)} – ${formatYearMonth(end)}`;
