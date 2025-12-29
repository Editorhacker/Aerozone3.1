import React, { useMemo } from "react";

export default function ReferenceBList({ rows, selectedRef, onSelectRef, className }) {
    // Extract unique ReferenceB values from current filtered rows
    const referenceBValues = useMemo(() => {
        const unique = new Set();
        rows.forEach((r) => {
            const ref = String(r.ReferenceB || "").trim();
            if (ref && ref !== "N/A" && ref !== "NA" && ref !== "0") {
                unique.add(ref);
            }
        });
        return [...unique];
    }, [rows]);

    if (referenceBValues.length === 0) {
        return (
            <div className="relative w-fit drop-shadow-lg">
                <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-[1px] clip-angled">
                    <div className="bg-gray-900 clip-angled p-4 text-sm text-purple-500 italic">
                        No ReferenceB values found.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative  group transition-all duration-300 drop-shadow-lg hover:drop-shadow-xl ${className}`}>
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-[1px] clip-angled h-full w-40">
                <div className="bg-gray-900 clip-angled p-4 h-full ">
                    <h3 className="text-[13px] font-semibold mb-3 text-purple-400 text-center">
                        ReferenceB
                        <span className="text-purple-300 text-xs ml-2">
                            ({referenceBValues.length})
                        </span>
                    </h3>

                    {/* Scrollable List Container */}
                    <div className={`max-h-45 text-center overflow-y-auto scrollbar-hide pr-1 `}>
                        <ul className="space-y-1  text-sm flex flex-col gap-2">
                            {/* ALL BUTTON */}
                            <li
                                onClick={() => onSelectRef(null)}
                                className={`px-6 py-1  clip-angled cursor-pointer transition-all duration-200 ${selectedRef === null
                                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/30"
                                    : "bg-gray-800 hover:bg-purple-900/30 text-purple-300 hover:text-purple-200 border border-purple-700/50"
                                    }`}
                            >
                                All
                            </li>

                            {/* Dynamic ReferenceB Values */}
                            {referenceBValues.map((ref, i) => {
                                const isActive = selectedRef === ref;
                                return (
                                    <li
                                        key={i}
                                        onClick={() => onSelectRef(isActive ? null : ref)}
                                        className={`px-6 py-1 clip-angled cursor-pointer transition-all duration-200 ${isActive
                                            ? "bg-purple-600 text-white shadow-md shadow-purple-500/30"
                                            : "bg-gray-800 hover:bg-purple-900/30 text-purple-300 hover:text-purple-200 border border-purple-700/50 h-fit"
                                            }`}
                                    >
                                        {ref}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}