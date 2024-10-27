import React from "react";

const Loading = () => {
  return (
    <div className="w-[350px] mx-auto h-fit text-white rounded-[8px] bg-gray-800 animate-pulse flex flex-col gap-4 p-4">
      <div className="w-full aspect-square bg-gray-600 rounded">
      </div>
      <div className="w-full flex flex-col gap-2 justify-between">
        <div className="w-full flex flex-row items-start justify-between gap-2">
          <div className="h-6 w-1/2 bg-gray-600 rounded"></div>{" "}
          {/* Placeholder for title */}
          <div className="h-6 w-1/3 bg-gray-600 rounded"></div>{" "}
          {/* Placeholder for author */}
        </div>
        <button
          className="w-full bg-mivCol text-black p-3 rounded-[15px] font-semibold cursor-pointer opacity-50"
          disabled
        >
          Loading... {/* Placeholder for button */}
        </button>
      </div>
    </div>
  );
};

export default Loading;