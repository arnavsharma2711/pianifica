import type React from "react";
import ReactDOM from "react-dom";
import Header from "../Header";
import { X } from "lucide-react";

type Props = {
	children: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
	name: string;
};

const Modal = ({ children, isOpen, onClose, name }: Props) => {
	if (!isOpen) return null;

	return ReactDOM.createPortal(
		<div
			className="fixed inset-0 z-50 flex h-full w-full items-center justify-center overflow-y-auto bg-gray-600 bg-opacity-50 p-4"
			onClick={onClose}
			onKeyUp={onClose}
		>
			<div
				className="w-full max-w-2xl rounded-lg bg-white p-4 shadow-lg dark:bg-dark-secondary"
				onClick={(e) => e.stopPropagation()}
				onKeyUp={(e) => e.stopPropagation()}
			>
				<Header
					name={name}
					buttonComponent={
						<button
							type="button"
							className="flex h-7 w-7 items-center justify-center rounded-full dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
							onClick={onClose}
						>
							<X size={18} />
						</button>
					}
					isSmallText
				/>
				{children}
			</div>
		</div>,
		document.body,
	);
};

export default Modal;
