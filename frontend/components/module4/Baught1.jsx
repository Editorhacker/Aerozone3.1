import React from 'react';

const Baught1 = ({
    value = "52 BOI",
    label = "BOI",
    bgColor = "bg-gray-900",
    hoverScale = "hover:scale-105",
    bare = false
}) => {
    const content = (
        <div className={`${bare ? "" : bgColor + " p-3"} text-center rounded-lg h-full relative overflow-hidden flex flex-col items-center justify-center`}>
            <div className="relative z-10 ">
                <div className="text-2xl font-bold text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.3)] group-hover:drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-300 flex flex-row items-baseline justify-center gap-2">
                    {value}<h3 className='text-purple-400 text-lg'>Items</h3>
                </div>
                <div className="text-lg font-semibold text-purple-300 group-hover:text-purple-200 transition-colors duration-300">
                    {label}
                </div>
            </div>
        </div>
    );

    if (bare) return content;

    return (
        <div className={`relative w-full h-20 group ${hoverScale} transition-all duration-300 drop-shadow-lg `}>
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-[1px] h-full rounded-lg">
                {content}
            </div>
        </div>
    );
};

export default Baught1;