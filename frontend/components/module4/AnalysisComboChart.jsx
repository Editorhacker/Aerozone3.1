import { useMemo } from "react";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function AnalysisComboChart({ data = [] }) {

  const chartData = useMemo(() => {
    const yearMap = new Map();

    data.forEach((row) => {
      if (!row.PlannedReceiptDate) return;

      const year = new Date(row.PlannedReceiptDate).getFullYear();
      const qty = Number(row.OrderedLineQuantity) || 0;
      const value = Number(row.OrderLineValue) || 0;

      if (!yearMap.has(year)) {
        yearMap.set(year, {
          year,
          totalQuantity: 0,
          totalValue: 0,
        });
      }

      const entry = yearMap.get(year);
      entry.totalQuantity += qty;
      entry.totalValue += value;
    });

    return Array.from(yearMap.values()).sort((a, b) => a.year - b.year);
  }, [data]);

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl ">
      
      {/* Header */}
      <div className="flex items-center mb-2">
        <span className="h-4 w-1 bg-zinc-500 mr-2"></span>
        <h3 className="text-sm font-semibold text-zinc-100 tracking-wide">
          ORDER VALUE VS QUANTITY (YEAR)
        </h3>
      </div>

      <div className="h-[220px] w-[90%] mx-auto flex justify-center">

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>

            {/* Grid */}
            <CartesianGrid
              stroke="#52525b"
              strokeDasharray="3 3"
              vertical={false}
            />

            {/* X Axis */}
            <XAxis
              dataKey="year"
              tick={{ fill: "#d4d4d8", fontSize: 11 }}
              axisLine={{ stroke: "#3f3f46" }}
              tickLine={{ stroke: "#3f3f46" }}
            />

            {/* VALUE Axis */}
           <YAxis
  yAxisId="left"
  tick={{ fill: "#d4d4d8", fontSize: 11 }}
  tickMargin={2}                 // space between numbers & axis
  axisLine={{ stroke: "#3f3f46" }}
  tickLine={{ stroke: "#3f3f46" }}
  label={{
    value: "Order Value",
    angle: -90,
    position: "insideLeft",       // ✅ valid
    offset: -2,                   // ✅ positive spacing
    style: { fill: "#a1a1aa", fontSize: 11 },
  }}
/>


            {/* QUANTITY Axis */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#d4d4d8", fontSize: 11 }}
              tickMargin={2}
              axisLine={{ stroke: "#3f3f46" }}
              tickLine={{ stroke: "#3f3f46" }}
              label={{
                value: "Order Quantity",
                angle: 90,
                 offset: -2,
                position: "insideRight",
                style: { fill: "#a1a1aa", fontSize: 11 },
              }}
            />

            {/* Tooltip */}
            <Tooltip
              cursor={false}
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "6px",
                color: "#fafafa",
                fontSize: "11px",
              }}
              labelStyle={{ color: "#a1a1aa" }}
            />

            <Legend
              wrapperStyle={{
                color: "#e4e4e7",
                fontSize: "11px",
                paddingTop: "6px",
              }}
            />

            {/* BAR */}
            <Bar
              yAxisId="right"
              dataKey="totalQuantity"
              name="Order Quantity"
              barSize={26}
              fill="#a1a1aa"
              radius={[4, 4, 0, 0]}
            />

            {/* LINE */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="totalValue"
              name="Order Value"
              stroke="#fafafa"
              strokeWidth={2}
              dot={{ r: 3, fill: "#fafafa" }}
              activeDot={{ r: 5 }}
            />

          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
