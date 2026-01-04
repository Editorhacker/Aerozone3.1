import React, { useMemo } from "react";

const AmountTable = ({ rows = [] }) => {

    // ✅ Group & sum data by SupplierName
    const aggregatedData = useMemo(() => {
        const map = {};

        rows.forEach(row => {
            const supplier = row.SupplierName;
            if (!supplier) return;

            if (!map[supplier]) {
                map[supplier] = {
                    SupplierName: supplier,
                    TotalQuantity: 0,
                    UOM: row.UOM || "-",
                    TotalValue: 0,
                    Currency: row.Currency || "-"
                };
            }

            map[supplier].TotalQuantity += Number(row.OrderedLineQuantity) || 0;
            map[supplier].TotalValue += Number(row.OrderLineValue) || 0;
        });

        return Object.values(map);
    }, [rows]);

    return (
        <div className="bg-gray-900 text-xs rounded-lg p-2 shadow-lg h-fit  border border-purple-700/30">
            <h3 className="text-sm font-semibold text-center text-purple-400 mb-1 ">
                Supplier Amount Summary
                <span className="text-purple-300 text-xs ml-2">
                    ({aggregatedData.length})
                </span>
            </h3>

            {aggregatedData.length === 0 ? (
                <div className="text-purple-500 ">No data found</div>
            ) : (
                <div className="overflow-y-auto max-h-45 scrollbar-hide  rounded-md border border-purple-700/30">
                    <table className="min-w-fit  border border-purple-700/40  ">

                        <thead className="sticky top-0 z-10 bg-purple-900 text-purple-300">
                            <tr>
                                <th className="px-3 py-2 text-[10px] text-left">SUPPLIER</th>
                                <th className="px-2 py-2 text-[10px] text-right">Total Qty</th>
                                <th className="px-2 py-2 text-[10px] text-center">UOM</th>
                                <th className="px-2 py-2 text-[10px] text-right">Total Value</th>
                                <th className="px-2 py-2 text-[10px] text-center">Currency</th>
                            </tr>
                        </thead>

                        <tbody>
                            {aggregatedData.map((row, idx) => (
                                <tr
                                    key={idx}
                                    className="border-t border-purple-700/20 hover:bg-purple-900/20 transition  "
                                >
                                    <td className="px-2 py-2 text-[10px]  text-purple-200">{row.SupplierName}</td>
                                    <td className="px-2 py-2 text-[10px]  text-right text-white">
                                        {row.TotalQuantity.toFixed(2)}
                                    </td>
                                    <td className="px-2 py-2 text-[10px]  text-center text-purple-300">{row.UOM}</td>
                                    <td className="px-2 py-2 text-[10px]  text-right text-white">
                                        {row.TotalValue.toLocaleString()}
                                    </td>
                                    <td className="px-2 py-2 text-[10px]  text-center text-purple-300">
                                        {row.Currency}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>

            )}
        </div>
    );
};

export default AmountTable;
