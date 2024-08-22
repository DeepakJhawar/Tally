import React from "react";

const OutputWindow = ({ outputDetails }) => {
	const textColor = outputDetails && outputDetails.status === 'Failed' ? 'text-red-500' : 'text-white';

	return (
		<div className="w-full bg-gray-800 p-4 rounded-md shadow-lg overflow-auto max-h-96">
			{outputDetails === null || outputDetails.output === null ? (
				<p className="text-gray-400">Here you see your output</p>
			) : (
				<pre className={`${textColor} whitespace-pre-wrap`}>{outputDetails.output}</pre>
			)}
		</div>
	);
};

export default OutputWindow;
