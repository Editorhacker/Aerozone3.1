import React from 'react';
import Rawmaterial from './Rawmaterial1';
import Baught from './Baught1';
import ProjectNumber from './ProjectNumber1';
import ReferenceBList from './ReferenceBList1';

const UnifiedStatsBoard = ({
    filteredRows,
    uniqueItemCount,
    uniqueBOICount,
    selectedRef,
    setSelectedRef,
    applyFilters,
    setSelectedProject
}) => {
    return (
        <div className="h-[250px] w-full transform transition-transform duration-200 hover:scale-[1.02] drop-shadow-lg">
            <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-[1px] clip-angled h-full">
                <div className="bg-gray-900 clip-angled p-2 h-full flex flex-col gap-2">

                    {/* Row 1: RM & BOI Stats */}
                    <div className="flex flex-row gap-3 h-[25%] shrink-0">
                        <div className="w-full h-full">
                            <Rawmaterial
                                value={`${uniqueItemCount} `}
                                bgColor="bg-gray-900"
                                valueColor="text-[var(--color-primary)]"
                                labelColor="text-[var(--color-muted-foreground)]"
                            />
                        </div>
                        <div className="w-full h-full">
                            <Baught
                                value={`${uniqueBOICount} `}
                                bgColor="bg-gray-900"
                                valueColor="text-[var(--color-primary)]"
                                labelColor="text-[var(--color-muted-foreground)]"
                            />
                        </div>
                    </div>

                    {/* Row 2: Project Numbers */}
                    <div className="flex-1 w-full h-full overflow-hidden">
                        <ProjectNumber
                            values={[...new Set(filteredRows.map(row => row.ProjectNo))]}
                            selectedProject={selectedRef}
                            onSelectProject={(project) => {
                                setSelectedProject(project);
                                setTimeout(() => applyFilters(), 0);
                            }}
                        />
                    </div>

                    {/* Row 3: Reference List */}
                    <div className="flex-1 w-full -mt-2 h-full overflow-hidden">
                        <ReferenceBList
                            rows={filteredRows}
                            selectedRef={selectedRef}
                            onSelectRef={(ref) => {
                                setSelectedRef(ref);
                                setTimeout(() => applyFilters(), 0);
                            }}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UnifiedStatsBoard;
