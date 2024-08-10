// components/codingPlayground/OutputWindow.js

import React from "react";

const OutputWindow = ({ outputDetails }) => {
  return (
    <div className="w-full h-full bg-gray-800 p-4 rounded-md shadow-lg overflow-auto">
      {outputDetails === null ? (
        <p className="text-gray-400">Here you see your output</p>
      ) : outputDetails.output ? (
        <pre className="text-white whitespace-pre-wrap">{outputDetails.output}</pre>
      ) : (
        <pre className="text-white whitespace-pre-wrap">{JSON.stringify(outputDetails, null, 2)}</pre>
      )}
    </div>
  );
};

export default OutputWindow;
