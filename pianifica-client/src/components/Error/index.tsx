import type React from "react";
import { ServerCrash } from "lucide-react";

interface ErrorProps {
	message: string;
}

const ErrorComponent: React.FC<ErrorProps> = ({ message }) => {
	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="flex gap-2 dark:bg-zinc-800 p-6 rounded-lg shadow-lg text-center mb-32">
				<ServerCrash className="w-16 h-16 text-red-600" />
				<div>
					<h1 className="text-2xl font-bold text-red-600 mb-4">
						Sorry something went wrong...
					</h1>
					<p className="text-red-500">{message}</p>
				</div>
			</div>
		</div>
	);
};

export default ErrorComponent;
