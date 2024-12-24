import type React from "react";
import { useRef } from "react";
import ReactDOM from "react-dom";
import Header from "../Header";
import { X } from "lucide-react";

type Props = {
	children: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
	name: string;
};
import { Component } from 'react';

class DisableBodyScroll extends Component {
	componentDidMount() {
		document.body.classList.add('overflow-y-hidden');
	}

	componentWillUnmount() {
		document.body.classList.remove('overflow-y-hidden');
	}

	render() {
		return false;
	}
}

const Modal = ({ children, isOpen, onClose, name }: Props) => {
	const modalRef = useRef<HTMLDivElement>(null);

	if (!isOpen) return null;

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		const isInsideContent = modalRef.current?.contains(e.target as Node);
		(e.target as HTMLElement).dataset.ignoreClick = isInsideContent ? "true" : "false";
	};

	const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
		if ((e.target as HTMLElement).dataset.ignoreClick === "false") {
			onClose();
		}
	};

	return ReactDOM.createPortal(
		<>
			<DisableBodyScroll />,
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div
				id="modal"
				className="fixed inset-0 z-50 flex h-full w-full items-center justify-center overflow-y-auto bg-gray-600 bg-opacity-50 p-4"
				onMouseDown={handleMouseDown}
				onClick={handleClickOutside}
			>
				<div
					id="modal-content"
					ref={modalRef}
					className="w-full max-w-2xl rounded-lg bg-white p-4 shadow-lg dark:bg-dark-secondary"
				>
					<Header
						name={name}
						buttonComponent={
							<button
								type="button"
								className="flex h-7 w-7 items-center justify-center rounded-full dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
								onClick={onClose}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										onClose();
									}
								}}
							>
								<X size={18} />
							</button>
						}
						isSmallText
					/>
					{children}
				</div>
			</div>
		</>,
		document.body,
	);
};

export default Modal;
