import React, { useMemo } from "react";
import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import worldMap from "@highcharts/map-collection/custom/world.geo.json";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

/* ---------------------------------------
   Extract Material from Type
--------------------------------------- */
const extractMaterial = (type = "") => {
  const t = type.toUpperCase();
  if (t.includes("SS")) return "SS";
  if (t.includes("NI")) return "NI";
  if (t.includes("TI")) return "TI";
  if (t.includes("AL")) return "AL";
  if (t.includes("COBALT")) return "COBALT";
  return "OTHER";
};

/* ---------------------------------------
   Aggregate Country-Level Data
--------------------------------------- */
const calculateCountryData = (rows) => {
  const map = {};
  let grandTotalValue = 0;

  rows.forEach((row) => {
    const country = row.Country;
    if (!country) return;

    const qty = Number(row.OrderedLineQuantity) || 0;
    const value = Number(row.OrderLineValue) || 0;
    const uom = (row.UOM || "").toUpperCase();
    const type = row.Type || "";
    const material = extractMaterial(type);
    const customer = row.CustomerName;

    if (!map[country]) {
      map[country] = {
        country,
        totalValue: 0,
        totalQtyEA: 0,
        totalQtyKG: 0,
        customers: new Set(),
        materials: {},
        types: {},
      };
    }

    // Totals
    map[country].totalValue += value;
    grandTotalValue += value;

    if (uom === "EA") map[country].totalQtyEA += qty;
    if (uom === "KG") map[country].totalQtyKG += qty;

    // Customers
    if (customer) map[country].customers.add(customer);

    // Materials
    map[country].materials[material] =
      (map[country].materials[material] || 0) + qty;

    // Types
    if (type) {
      map[country].types[type] =
        (map[country].types[type] || 0) + qty;
    }
  });

  return Object.values(map).map((item) => ({
    ...item,
    customers: Array.from(item.customers),
    percentage:
      grandTotalValue === 0
        ? 0
        : Math.round((item.totalValue / grandTotalValue) * 100),
  }));
};

/* ---------------------------------------
   World Map Component
--------------------------------------- */
const WorldMap = ({ rows = [] }) => {
  const mapData = useMemo(() => {
    const processed = calculateCountryData(rows);

    return processed
      .map((item) => {
        const iso2 = countries.getAlpha2Code(item.country, "en");
        if (!iso2) return null;

        return {
          "hc-key": iso2.toLowerCase(),
          value: item.percentage,
          data: item,
        };
      })
      .filter(Boolean);
  }, [rows]);

  const options = {
   chart: {
  map: worldMap,
  height: 190,
  backgroundColor: "transparent",

  events: {
    load: function () {
      this.selectedPoint = null; // ✅ FIX
    },

    click: function () {
      // ✅ Click on empty space closes locked tooltip
      if (this.selectedPoint) {
        this.tooltip.hide();
        this.selectedPoint = null;
      }
    },
  },
},


tooltip: {
  useHTML: true,
  outside: false,
  followPointer: false,
  shadow: false,

  style: {
    fontSize: "11px",
    zIndex: 10,
  },

formatter: function () {
  const chart = this.series.chart;

  // 🔒 If tooltip is locked, ignore hover on other countries
  if (chart.selectedPoint && chart.selectedPoint !== this.point) {
    return "";
  }

  const d = this.point.data;
  if (!d) return "";


    const projects = d.customers.join(", ");
    const materials = Object.keys(d.materials).join(", ");
    const types = Object.keys(d.types).join(", ");

    return `
      <div style="
        width:230px;
        max-height:140px;
        overflow-y:auto;
        background:#111827;
        color:#e5e7eb;
        padding:8px;
        border-radius:6px;
        line-height:1.35;
      ">
        <div style="font-weight:600;font-size:12px;margin-bottom:4px">
          ${d.country}
        </div>

        <div style="border-top:1px solid #374151;margin:4px 0"></div>

       <div style="word-break:break-word;white-space:normal">
  <b>Projects</b> : ${projects || "-"}
</div>

        <div><b>Value</b> : ${d.totalValue.toFixed(2)}</div>
        <div>
          <b>Qty</b> :
          ${d.totalQtyEA} EA
          ${d.totalQtyKG ? ` | ${d.totalQtyKG} KG` : ""}
        </div>
        <div><b>Material</b> : ${materials || "-"}</div>
         <div style="word-break:break-word;white-space:normal"><b>Type</b> : ${types || "-"}</div>
      </div>
    `;
  },
},


    series: [
  {
    name: "Global Distribution",
    data: mapData,
    joinBy: "hc-key",

    color: "#9333ea",
    nullColor: "#374151",
    borderColor: "#4b5563",
    borderWidth: 0.5,

    enableMouseTracking: true,

    point: {
      events: {
        click: function () {
          const chart = this.series.chart;

          // 🔁 Clicking same country toggles tooltip
          if (chart.selectedPoint === this) {
            chart.tooltip.hide();
            chart.selectedPoint = null;
            return;
          }

          // 🔒 Lock tooltip on this country
          chart.tooltip.refresh(this);
          chart.selectedPoint = this;
        },
      },
    },

    states: {
      hover: {
        color: "#7e22ce",
      },
    },
  },
],

  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType="mapChart"
      options={options}
    />
  );
};

export default WorldMap;
