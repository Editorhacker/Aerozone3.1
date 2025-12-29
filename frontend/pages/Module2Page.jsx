import React, { useState, useMemo } from "react";
import BarLineChart from "../components/module2/BarLineChart";

const Module2Page = () => {
  const [filters, setFilters] = useState({
    startMonth: "",
    endMonth: "",
    minValue: "",
    maxValue: "",
    chartView: "both", // "bar", "line", "both"
    year: "",
    itemCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFilters({
      startMonth: "",
      endMonth: "",
      minValue: "",
      maxValue: "",
      chartView: "both",
      year: "",
      itemCode: "",
    });
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center p-6 pt-20 transition-colors duration-300 text-foreground">
      <div className="w-full max-w-8xl bg-card rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-6">
          Order Value vs Quantity
        </h1>

        {/* 🔹 Filters Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Time Period */}
          <div>
            <label className="text-foreground block mb-1">Start Month-Year</label>
            <input
              type="month"
              name="startMonth"
              value={filters.startMonth}
              onChange={handleChange}
              className="w-full p-2 rounded bg-input text-foreground border border-border focus:ring-2 focus:ring-ring focus:outline-none"
            />
          </div>
          <div>
            <label className="text-foreground block mb-1">End Month-Year</label>
            <input
              type="month"
              name="endMonth"
              value={filters.endMonth}
              onChange={handleChange}
              className="w-full p-2 rounded bg-input text-foreground border border-border focus:ring-2 focus:ring-ring focus:outline-none"
            />
          </div>

          {/* Value Range */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-foreground block mb-1">Min Value (Rs)</label>
              <input
                type="number"
                name="minValue"
                value={filters.minValue}
                onChange={handleChange}
                className="w-full p-2 rounded bg-input text-foreground border border-border focus:ring-2 focus:ring-ring focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="text-foreground block mb-1">Max Value (Rs)</label>
              <input
                type="number"
                name="maxValue"
                value={filters.maxValue}
                onChange={handleChange}
                className="w-full p-2 rounded bg-input text-foreground border border-border focus:ring-2 focus:ring-ring focus:outline-none"
              />
            </div>
          </div>

          {/* Chart View */}
          <div>
            <label className="text-foreground block mb-1">Chart View</label>
            <select
              name="chartView"
              value={filters.chartView}
              onChange={handleChange}
              className="w-full p-2 rounded bg-input text-foreground border border-border focus:ring-2 focus:ring-ring focus:outline-none"
            >
              <option value="both">Bar + Line</option>
              <option value="bar">Bar Only</option>
              <option value="line">Line Only</option>
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="text-foreground block mb-1">Year</label>
            <input
              type="number"
              name="year"
              value={filters.year}
              onChange={handleChange}
              className="w-full p-2 rounded bg-input text-foreground border border-border focus:ring-2 focus:ring-ring focus:outline-none"
              placeholder="e.g., 2025"
            />
          </div>

          {/* Item Code Filter */}
          <div>
            <label className="text-foreground block mb-1">Item Code</label>
            <input
              type="text"
              name="itemCode"
              value={filters.itemCode}
              onChange={handleChange}
              className="w-full p-2 rounded bg-input text-foreground border border-border focus:ring-2 focus:ring-ring focus:outline-none"
              placeholder="Search Item"
            />
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={handleClear}
              className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 p-2 rounded transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* 🔹 Chart */}
        <div className="w-full h-[500px] flex justify-center">
          <BarLineChart filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default Module2Page;
