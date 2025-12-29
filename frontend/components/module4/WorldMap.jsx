import React, { useMemo } from "react";
import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import worldMap from "@highcharts/map-collection/custom/world.geo.json";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

/* ---------------------------------------
   Calculate Country + City Percentage
--------------------------------------- */
const calculateCountryCityPercentage = (rows) => {
  const countryTotals = {};
  const countryCityTotals = {};
  let grandTotal = 0;

  rows.forEach((row) => {
    const qty = Number(row.OrderedLineQuantity) || 0;
    const country = row.Country;
    const city = row.City;

    if (!country || !city) return;

    // Country total
    countryTotals[country] = (countryTotals[country] || 0) + qty;

    // City total inside country
    if (!countryCityTotals[country]) {
      countryCityTotals[country] = {};
    }

    countryCityTotals[country][city] =
      (countryCityTotals[country][city] || 0) + qty;

    grandTotal += qty;
  });

  return Object.keys(countryTotals).map((country) => {
    const countryQty = countryTotals[country];

    return {
      country,
      value: Math.round((countryQty / grandTotal) * 100),
      cities: Object.entries(countryCityTotals[country]).map(
        ([city, qty]) => ({
          city,
          percentage: Math.round((qty / grandTotal) * 100),
        })
      ),
    };
  });
};

/* ---------------------------------------
   World Map Component
--------------------------------------- */
const WorldMap = ({ rows = [] }) => {
  const mapData = useMemo(() => {
    const processed = calculateCountryCityPercentage(rows);

    return processed
      .map((item) => {
        const iso2 = countries.getAlpha2Code(item.country, "en");
        if (!iso2) return null;

        return {
          "hc-key": iso2.toLowerCase(),
          value: item.value,
          country: item.country,
          cities: item.cities,
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
        click: function () {
          // 🧹 Click on empty space closes tooltip
          this.tooltip.hide();
          this.selectedPoint = null;
        },
      },
    },

    title: { text: "" },

    mapNavigation: {
      enabled: true,
      enableMouseWheelZoom: true,
      enableButtons: true,
    },

    legend: {
      enabled: false,
    },

    tooltip: {
      useHTML: true,
      outside: true,
      followPointer: false,
      hideDelay: 0,
      shared: false,

      style: {
        fontSize: "12px",
        pointerEvents: "auto",
      },

      formatter: function () {
        if (!this.point.cities || !this.point.cities.length) return "";

        const cityLines = this.point.cities
          .map(
            (c) => `
            <div style="display:flex;justify-content:space-between;gap:10px">
              <span>${c.city}</span>
              <b>${c.percentage}%</b>
            </div>
          `
          )
          .join("");

        return `
        <div style="
          min-width:200Px;
          max-height:220px;
          overflow-y:auto;
        ">
          <div style="font-weight:bold;margin-bottom:4px">
            ${this.point.country}
          </div>
          <hr style="margin:4px 0"/>
          ${cityLines}
        </div>
      `;
      },
    },

    series: [
      {
        name: "Global Share %",
        data: mapData,
        joinBy: "hc-key",

        color: "#9333ea", // purple-600
        nullColor: "#374151", // gray-700 (dark land)

        borderColor: "#4b5563",
        borderWidth: 0.5,

        enableMouseTracking: true,

        point: {
          events: {
            click: function () {
              const chart = this.series.chart;

              // 🔁 If same country clicked → toggle off
              if (chart.selectedPoint === this) {
                chart.tooltip.hide();
                chart.selectedPoint = null;
                return;
              }

              // 🔓 Open tooltip & lock it
              chart.tooltip.refresh(this);
              chart.selectedPoint = this;
            },
          },
        },

        states: {
          hover: {
            color: "#7e22ce", // purple-700
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
