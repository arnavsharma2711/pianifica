import type React from "react";

interface ErrorProps {
	message: string;
}

const ErrorComponent: React.FC<ErrorProps> = ({ message }) => {
	return (
		<div className="flex items-center justify-center min-h-screen bg-red-100">
			<div className="bg-white p-6 rounded-lg shadow-lg text-center">
				<h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
				<p className="text-red-500">{message}</p>
			</div>
		</div>
	);
};

export default ErrorComponent;
