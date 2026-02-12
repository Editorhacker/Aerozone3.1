import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ProjectBar = ({ project, qty, value, maxQty }) => {
  const percent = maxQty > 0 ? (qty / maxQty) * 100 : 0;

  return (
    <div className="flex items-center gap-2 py-2">

      {/* Project Name */}
      <div className="w-20 text-xs font-semibold text-[var(--foreground)] truncate">
        {project}
      </div>

      {/* Bar Area */}
      <div className="flex-1 relative h-4 bg-gray-700/40 rounded overflow-hidden">

        {/* Filled Bar */}
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded transition-all duration-700"
          style={{ width: `${percent}%` }}
        />

        {/* Quantity Text centered inside bar */}
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white pointer-events-none">
          {qty}
        </div>

      </div>

      {/* Value */}
      <div className="w-20 text-right text-xs font-bold text-[var(--foreground)]">
        {value}
      </div>
    </div>
  );
};


/* ---------------- Main Component ---------------- */

export default function PieCharts({ rows = [], singleChart = false }) {

  /* ---- Group By Project ---- */
  const projectMetrics = {};
  rows.forEach((row) => {
    const project = row.ProjectCode || "Unknown";

    if (!projectMetrics[project]) {
      projectMetrics[project] = { qty: 0, value: 0 };
    }

    projectMetrics[project].qty += Number(row.OrderedLineQuantity) || 0;
    projectMetrics[project].value += Number(row.OrderLineValue) || 0;
  });

  /* ---- Chart Data ---- */
  const projectOrderQty = {};
  Object.entries(projectMetrics).forEach(([project, data]) => {
    projectOrderQty[project] = data.qty;
  });

  const buildChartData = (dataObj, label) => ({
    labels: Object.keys(dataObj),
    datasets: [
      {
        label,
        data: Object.values(dataObj),
        backgroundColor: [
          "#4ade80", "#60a5fa", "#f87171", "#facc15",
          "#a78bfa", "#fb923c", "#22d3ee", "#2dd4bf",
        ],
        borderWidth: 1,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  /* ---- Formatters ---- */
  const formatNumber = (num) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(num);

  const formatCurrency = (num) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(num);

  /* ---- Single Chart Mode ---- */
  if (singleChart) {
    return (
      <div className="relative h-full flex justify-center items-center">
        <Pie
          data={buildChartData(projectOrderQty, "Order Qty")}
          options={chartOptions}
        />
      </div>
    );
  }

  /* ---- Full Layout ---- */
  return (
    <div className="w-full h-full flex gap-3 px-2">


      {/* PIE CHART CARD */}
      <div className="bg-[var(--card)] w-[20%] rounded-lg border border-[var(--border)] p-2 hover:shadow-md transition-all duration-200">
        <div className="flex items-center mb-3">
          <div className="h-5 w-1 bg-[var(--primary)] mr-2 rounded-sm"></div>
          <h2 className="text-sm md:text-[13px] font-semibold text-[var(--foreground)]">
            PROJECT DISTRIBUTION
          </h2>
        </div>

        <div className="relative h-[120px] flex justify-center items-center">
          <Pie
            data={buildChartData(projectOrderQty, "Order Qty")}
            options={chartOptions}
          />
        </div>
      </div>

      {/* PROJECT SCROLLABLE BAR PANEL */}
      <div className="bg-[var(--card)] w-[400px] border border-[var(--border)] rounded-lg p-2 h-[260px] overflow-y-auto scrollbar-hide">


        <div className="text-xs -py-3  z-9 h-6 items-center sticky top-0 bg-black font-semibold text-[var(--foreground)] mb-2">
         PROJECT BREAKDOWN
        </div>
        <div className="p-2 -top-2">
           {(() => {
         const values = Object.values(projectMetrics);
const maxQty = values.length ? Math.max(...values.map(p => p.qty)) : 0;


          return Object.entries(projectMetrics)
            .sort((a, b) => b[1].qty - a[1].qty) // highest first
            .map(([project, data]) => (
              <ProjectBar
                key={project}
                project={project}
                qty={data.qty}
                value={formatCurrency(data.value)}
                maxQty={maxQty}
              />
            ));
        })()}
        </div>
       
      </div>


    </div>
  );
}
