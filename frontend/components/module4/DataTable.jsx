import React, { useState, useEffect, useMemo } from "react";



export default function DataTable2({ 
  rows, 
  fullView = false, 
  prioritizedRows: externalPrioritizedRows = new Map(),
  onPriorityChange 
}) {
  // ✅ Column definitions (keys = your row object fields)
  const columns = [
    // { key: "ReferenceB", label:" Reference B "},
    { key: "ProjectCode", label: "Project Code" },
    { key: "ItemCode", label: "Item Code" },
    { key: "ItemShortDescription", label: "Description" },
    { key: "SupplierName", label: "Supplier" }, // Shortened label
    // { key: "Type", label: "Type" },
    { key: "PONo", label: "PO No." },
    { key: "OrderedLineQuantity", label: " Qty" },
    { key: "UOM", label: "UOM" },
    // { key: "Delivery", label: "Delivery" },
    { key: "OrderLineValue", label: "Order Value" },
    { key: "Currency", label: "Currency" },
    { key: "PlannedReceiptDate", label: "Planned Receipt" },

    ];

   const [visibleColumns, setVisibleColumns] = useState(
     Array(columns.length).fill(false).map((_, index) => index < 12)
   );
   const [showColumnSelector, setShowColumnSelector] = useState(false);
 
   // Use external prioritizedRows if provided, otherwise use internal state
   const [internalPrioritizedRows, setInternalPrioritizedRows] = useState(new Map());
   const prioritizedRows = onPriorityChange ? externalPrioritizedRows : internalPrioritizedRows;
 
   // Generate a unique ID for each row based on key fields
const generateRowId = (row, index) => {
  const base = `${row.ItemCode || ""}|${row.PONo || ""}|${row.Date || ""}|${row.SupplierName || ""}`;
  return btoa(base + "|" + index);  // always unique
};

 
 
   // ✅ Remove empty rows (preserving original logic)
   const filteredRows = useMemo(() => {
     return rows.filter((row) => {
       return Object.entries(row).some(([key, value]) => {
         if (value === null || value === undefined) return false;
         const str = String(value).trim();
         return str !== "" && str !== "0" && str.toUpperCase() !== "NA";
       });
     });
   }, [rows]);
 
   // Separate prioritized rows into those in the current filter and those not
   const { prioritizedInFilter, prioritizedNotInFilter } = useMemo(() => {
     const inFilter = [];
     const notInFilter = [];
 
     prioritizedRows.forEach((row, rowId) => {
       const isInFilter = filteredRows.some(filterRow => generateRowId(filterRow) === rowId);
       if (isInFilter) {
         inFilter.push(row);
       } else {
         notInFilter.push(row);
       }
     });
 
     return { prioritizedInFilter: inFilter, prioritizedNotInFilter: notInFilter };
   }, [filteredRows, prioritizedRows]);
 
   // Create a Set of prioritized row IDs for quick lookup
   const prioritizedRowIds = useMemo(() => {
     return new Set(Array.from(prioritizedRows.keys()));
   }, [prioritizedRows]);
 
   // Sort rows based on priority
   const sortedRows = useMemo(() => {
     // First, get all non-prioritized rows from the current filter
     const nonPrioritizedRows = filteredRows.filter((row , index) => {
       const rowId = generateRowId(row , index );
       return !prioritizedRowIds.has(rowId);
     });
 
     // Combine prioritized rows (in filter) with non-prioritized rows
     return [...prioritizedInFilter, ...nonPrioritizedRows];
   }, [filteredRows, prioritizedInFilter, prioritizedRowIds]);
 
 
 
   // Toggle column visibility
   const toggleColumn = (index) => {
     const newVisibleColumns = [...visibleColumns];
     newVisibleColumns[index] = !newVisibleColumns[index];
     setVisibleColumns(newVisibleColumns);
   };
 
  
 
   // Get visible column count
   const visibleColumnCount = visibleColumns.filter(Boolean).length;
 
   // Render a table row
   const renderTableRow = (row, index, isPrioritizedNotInFilter = false) => {
     const rowId = generateRowId(row , index);
     const isPrioritized = prioritizedRowIds.has(rowId);
 
     return (
      <tr
        key={rowId}
        className={`
          ${index % 2 === 0 ? 'bg-[var(--color-card)]' : 'bg-[var(--color-muted)]'}
          ${isPrioritizedNotInFilter ? 'bg-yellow-500 dark:bg-yellow-900/20' : ''}
          ${isPrioritized ? 'bg-blue-500 dark:bg-blue-900/20' : ''}
          transition-colors duration-200
        `}
      >
        {columns.map((col, colIndex) => {
          if (!visibleColumns[colIndex]) return null;
          
          // Special handling for the Priority column
          if (col.key === "priority") {
            return (
              <td
                key={colIndex}
                className="px-2 py-1 whitespace-nowrap text-xs text-[var(--color-foreground)]"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={isPrioritized}
                  onChange={(e) => handlePriorityChange(row, e)}
                  onClick={(e) => e.stopPropagation()}
                  className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-[var(--color-border)] rounded"
                />
              </td>
            );
          }
          
          return (
            <td
              key={colIndex}
              className="px-2 py-1 whitespace-normal text-center text-xs text-[var(--color-foreground)]"
            >
              {row[col.key] ?? ""}
            </td>
          );
        })}
      </tr>
    );
  };
 
   return (
    <div className=" px-2 text-xs rounded-xl mx-auto">
      {/* Header + Buttons */}
      <div className="flex justify-between items-center mb-1">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <span className="h-5 w-1 bg-[var(--color-primary)] mr-2"></span>
            DATA 
          </h2>
          <h4 className="p-2 font-semibold text-white">
            Total Rows : {sortedRows.length + prioritizedNotInFilter.length}
            {prioritizedNotInFilter.length > 0 && (
              <span className="ml-2 text-yellow-600 dark:text-yellow-400">
                (Includes {prioritizedNotInFilter.length} prioritized item{prioritizedNotInFilter.length > 1 ? 's' : ''} not in current filter)
              </span>
            )}
          </h4>
        </div>

      </div>
      

      {/* Column Selector */}
      {showColumnSelector && (
        <div className="mb-4 p-3 bg-[var(--color-muted)] border border-[var(--color-border)] rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-[var(--color-foreground)]">
              Select Columns to Display
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setVisibleColumns(Array(columns.length).fill(true))}
                className="text-xs bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-[var(--color-primary-foreground)] py-1 px-2 rounded transition-transform duration-200 hover:scale-[1.05]"
              >
                Select All
              </button>
              <button
                onClick={() => setVisibleColumns(Array(columns.length).fill(false))}
                className="text-xs bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/90 text-[var(--color-secondary-foreground)] py-1 px-2 rounded transition-transform duration-200 hover:scale-[1.05]"
              >
                Deselect All
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {columns.map((column, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  id={`column-${index}`}
                  checked={visibleColumns[index]}
                  onChange={() => toggleColumn(index)}
                  className="mr-2"
                />
                <label
                  htmlFor={`column-${index}`}
                  className="text-xs text-[var(--color-foreground)]"
                >
                  {column.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className={`${fullView ? "h-[75vh]" : "h-[29vh]"} overflow-y-auto rounded-md scrollbar-hide `}>
        <table className="w-full">
          <thead className="bg-[var(--color-muted)] sticky top-0 ">
            <tr>
              {columns.map((col, index) => {
                if (!visibleColumns[index]) return null;
                return (
                  <th
                    key={index}
                    className="px-2 py-1 text-center text-xs  text-[var(--color-muted-foreground)] uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="bg-[var(--color-card)] text-xs divide-y divide-[var(--color-border)]">
            {sortedRows.length === 0 && prioritizedNotInFilter.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumnCount}
                  className="px-2 py-4 text-center text-[var(--color-muted-foreground)]"
                >
                  <div className="flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-[var(--color-muted-foreground)] mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm font-medium">NO DATA AVAILABLE</p>
                    <p className="text-xs mt-1">Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {/* Render prioritized rows not in current filter */}
                {prioritizedNotInFilter.length > 0 && (
                  <>
                    <tr className="bg-yellow-100 dark:bg-yellow-900/30">
                      <td 
                        colSpan={visibleColumnCount}
                        className="px-2 py-1 text-xs  font-semibold text-yellow-800 dark:text-yellow-200"
                      >
                        Prioritized Items (Not in Current Filter)
                      </td>
                    </tr>
                    {prioritizedNotInFilter.map((row, index) => 
                      renderTableRow(row, index, true)
                    )}
                  </>
                )}
                
                {/* Render sorted rows (prioritized in filter + non-prioritized) */}
                {sortedRows.map((row, index) => 
                  renderTableRow(row, index)
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
 }
