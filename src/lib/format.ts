// Display formatting for values stored in content files.

/** `2026-03` → `2026.03` */
export const formatYearMonth = (yearMonth: string): string => yearMonth.replace('-', '.');

/** `2026-03-06` → `2026.03.06` */
export const formatDate = (date: string): string => date.replace(/-/g, '.');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** `2026-03` → `Mar 2026` */
export const formatMonthYear = (yearMonth: string): string => {
  const [year, month] = yearMonth.split('-');
  return `${MONTHS[Number(month) - 1]} ${year}`;
};

/** Whether a `2026-03` month is after the month the site is being built in. */
export const isFutureMonth = (yearMonth: string): boolean => yearMonth > new Date().toISOString().slice(0, 7);

/** month 1-12 and a year → `Jun 2026` */
export const formatMonthName = (month: number, year: number): string => `${MONTHS[month - 1]} ${year}`;

/** `2026-03`, `2029-02` → `2026.03 – 2029.02` */
export const formatPeriod = (start: string, end: string): string => `${formatYearMonth(start)} – ${formatYearMonth(end)}`;
