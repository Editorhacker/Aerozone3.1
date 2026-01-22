import React, { useMemo } from "react";
import "./MaterialCube.css";

const materials = ["SS", "AL", "IN", "TI", "COBALT", "OTHER"];
const types = ["SHEET", "BAR", "PLATE", "TUBE", "BLOCK", "OTHERS"];

const MaterialCube = ({ rows = [] }) => {
  const boiRows = rows.filter(r => r.Category === "BOI");
  const rmRows = rows.filter(r => r.Category !== "BOI");

  const uniqueRMSet = useMemo(() => {
    const set = new Set();

    rmRows.forEach(item => {
      const tm = (item.Type || item.TypeMaterial || "")
        .replace(/[^a-zA-Z]/g, "")
        .toUpperCase();

      materials.forEach(mat => {
        types.forEach(type => {
          if (tm.includes(mat) && tm.includes(type)) {
            set.add(`${mat}-${type}`);
          }
        });
      });
    });

    return set;
  }, [rmRows]);

  const hasMatch = (type, material) =>
    uniqueRMSet.has(`${material}-${type}`);

  return (
    <div className="mc-wrapper">
      {/* BOI BAR */}
      <div className="mc-boi">
        <span>BOI</span>
        {boiRows.length > 0 && <div className="mc-boi-fill " />}
      </div>

      {/* MATRIX */}
      <div className="mc-table-wrapper">
        <table className="mc-table">
          <thead>
            <tr>
              <th>MATERIAL TYPE</th>
              {types.map(t => (
                <th key={t}>{t}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {materials.map(mat => (
              <tr key={mat}>
                <td className="mc-material">{mat}</td>
                {types.map(type => (
                  <td key={type} className="mc-cell">
                    {hasMatch(type, mat) && <div className="mc-fill" />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaterialCube;
