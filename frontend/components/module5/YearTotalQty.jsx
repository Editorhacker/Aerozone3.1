import React, { useMemo } from "react";

const parseDate = (value) => {
  if (!value) return null;

  // Firestore timestamp support
  if (typeof value === "object" && value.seconds) {
    return new Date(value.seconds * 1000);
  }

  // Format: 24-Jul-2025
  if (typeof value === "string" && /^\d{1,2}-[A-Za-z]{3}-\d{4}$/.test(value)) {
    const [day, mon, year] = value.split("-");

    const months = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };

    return new Date(Number(year), months[mon], Number(day));
  }

  // fallback ISO formats
  const d = new Date(value);
  return isNaN(d) ? null : d;
};

const YearTotalQty = ({ rows = [] }) => {

  const yearTotals = useMemo(() => {
    const totals = {};

    rows.forEach(row => {
      const parsed = parseDate(row.Date);
      if (!parsed) return;

      const year = parsed.getFullYear();
      const qty = Number(row.OrderedLineQuantity) || 0;

      totals[year] = (totals[year] || 0) + qty;
    });

    return Object.entries(totals)
      .sort((a, b) => Number(b[0]) - Number(a[0])); // newest first
  }, [rows]);

  const format = (n) =>
    new Intl.NumberFormat("en-IN").format(n);

  if (!yearTotals.length) {
    return (
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 text-gray-400 text-sm">
        No yearly quantity data
      </div>
    );
  }

  const latestYear = yearTotals[0][0];
  const oldestYear = yearTotals[yearTotals.length - 1][0];

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 w-full">

      {/* Header */}
      <div className="text-sm font-semibold mb-1 text-[var(--foreground)]">
        TOTAL QTY
      </div>

      <div className="text-[10px] text-gray-500 mb-3">
        Range: {oldestYear} → {latestYear}
      </div>

      {/* Year rows */}
      <div className="space-y-2">
        {yearTotals.map(([year, qty]) => (
          <div
            key={year}
            className="flex justify-between items-center bg-black/20 px-3 py-2 rounded-md"
          >
            <div className="text-xs text-gray-300 font-medium">
              {year}
            </div>

            <div className="text-sm font-bold text-purple-400">
              {format(qty)}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default YearTotalQty;
