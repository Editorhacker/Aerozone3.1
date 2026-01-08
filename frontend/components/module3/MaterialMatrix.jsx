import React from "react";

const materials = ["SS", "AL", "IN", "TI", "COBALT", "OTHER"];
const types = ["SHEET", "BAR", "PLATE", "TUBE", "BLOCK", "OTHERS"];

const MaterialTypeMatrix = ({ rows = [] }) => {
  const boiRows = rows.filter(item => item.Category === "BOI");
  const rmRows = rows.filter(item => item.Category !== "BOI");

  const hasMatch = (type, material) => {
    return rmRows.some(item => {
      const tm = (item.Type || item.TypeMaterial || "")
        .replace(/[^a-zA-Z]/g, "")
        .toUpperCase();

      return (
        tm.includes(type.toUpperCase()) &&
        tm.includes(material.toUpperCase())
      );
    });
  };

  const hasBOI = boiRows.length > 0;

  return (
    <div
      className="relative w-full clip-angled bg-gradient-to-br from-orange-600 to-orange-800 p-[1px]"
    >
      <div className="bg-gray-900 clip-angled h-[224px] flex flex-col p-3">

        {/* BOI BAR */}
        <div className="relative h-7 mb-1 border border-orange-500 flex items-center px-3 text-xs font-semibold text-white overflow-hidden">
          BOI
          <div className="absolute left-12 inset-0 bg-orange-500 opacity-80" />
        </div>

        {/* TABLE */}
        <div className="flex-1 overflow-auto  scrollbar-hide">
          <table className="w-full border-collapse text-xs">
            <thead className="sticky top-0 bg-orange-700 text-white z-10">
              <tr>
                <th className=" py-1 p-2 border border-orange-500">MATERIAL TYPE</th>
                {types.map(type => (
                  <th key={type} className=" p-3  border border-orange-500">
                    {type}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {materials.map(material => (
                <tr key={material} className="hover:bg-orange-900/30 transition">
                  <td className="border border-orange-500 text-white text-xs font-semibold text-center">
                    {material}
                  </td>

                  {types.map(type => (
                    <td key={type} className="p-1 border border-orange-500">
                      {hasMatch(type, material) && (
                        <div className="w-full h-[14px] rounded bg-orange-500 shadow-inner transition-all duration-300" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default MaterialTypeMatrix;
