import Modal from "@/components/Modal";
import { useState } from "react";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	message?: string;
	component?: React.ReactNode;
};

const ConfirmationModal = ({
	isOpen,
	onClose,
	onConfirm,
	message = "Are you sure?",
	component,
}: Props) => {
	const [isProcessing, setIsProcessing] = useState(false);

	const handleConfirm = async () => {
		setIsProcessing(true);
		await onConfirm();
		setIsProcessing(false);
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} name="Confirmation">
			<div className="p-4">
				<p>{message}</p>
				{component}
				<div className="mt-4 flex justify-end space-x-2">
					<button
						type="button"
						onClick={onClose}
						className="focus-offset-2 rounded-md border border-transparent bg-zinc-300 px-4 py-2 text-base font-medium text-black shadow-sm hover:bg-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleConfirm}
						className={`focus-offset-2 rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-800 ${
							isProcessing ? "cursor-not-allowed opacity-50" : ""
						}`}
						disabled={isProcessing}
					>
						{isProcessing ? "Processing..." : "Confirm"}
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default ConfirmationModal;
