import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const SupplierPieChart = ({ rows = [] }) => {

  /* ---- Aggregate Supplier Data ---- */
  const supplierData = useMemo(() => {
    const map = {};

    rows.forEach(r => {
      const supplier = r.SupplierName || "Unknown";

      if (!map[supplier]) {
        map[supplier] = { qty: 0, value: 0 };
      }

      map[supplier].qty += Number(r.OrderedLineQuantity) || 0;
      map[supplier].value += Number(r.OrderLineValue) || 0;
    });

    return map;
  }, [rows]);

  /* ---- Prepare Chart Data ---- */
  const labels = Object.keys(supplierData);
  const quantities = labels.map(l => supplierData[l].qty);

  const data = {
    labels,
    datasets: [
      {
        data: quantities,
        backgroundColor: [
          "#60a5fa","#4ade80","#f87171","#facc15","#a78bfa",
          "#fb923c","#22d3ee","#2dd4bf","#f472b6","#34d399"
        ],
        borderWidth: 1,
      },
    ],
  };

  /* ---- Tooltip Customization ---- */
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },

      tooltip: {
        callbacks: {
          label: function(context) {
            const supplier = context.label;
            const d = supplierData[supplier];

            if (!d) return "";

            const rate = d.qty > 0 ? d.value / d.qty : 0;

            const formatQty = new Intl.NumberFormat("en-US").format(d.qty);
            const formatValue = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 2
            }).format(d.value);

            const formatRate = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 2
            }).format(rate);

            return [
              `Supplier: ${supplier}`,
              `Qty: ${formatQty}`,
              `Value: ${formatValue}`,
              `Rate: ${formatRate}`
            ];
          }
        }
      }
    }
  };

  if (!labels.length) {
    return (
      <div className="text-gray-400 text-sm p-4">
        No supplier data available
      </div>
    );
  }

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-3 h-[260px]">
      <div className="text-sm font-semibold mb-2 text-[var(--foreground)]">
        SUPPLIER DISTRIBUTION
      </div>

      <div className="relative h-[200px]">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default SupplierPieChart;
