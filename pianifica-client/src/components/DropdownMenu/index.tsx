import type React from "react";
import { useState, useRef, useEffect } from "react";

interface DropdownMenuProps {
	toggle: React.ReactNode;
	options: {
		key: string;
		icon: React.ReactNode;
		value: string;
		onClick?: () => void;
		className?: string;
	}[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ toggle, options }) => {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div ref={menuRef} className="relative">
			<button
				type="button"
				onClick={toggleMenu}
				className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 ${isOpen ? "bg-gray-200 dark:bg-zinc-700" : ""}`}
			>
				{toggle}
			</button>
			{isOpen && (
				<ul className="absolute right-0 -translate-x-full flex flex-col gap-0.5 mt-2 w-max max-w-xs border bg-gray-300 dark:border-zinc-700 dark:bg-zinc-700 border-gray-300 shadow-lg z-10 rounded-lg overflow-hidden">
					{options.map((option) => (
						<li
							onClick={option.onClick}
							onKeyUp={option.onClick}
							key={option.key}
							className={`px-4 py-2 flex items-center justify-end gap-2 bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 ${option.className}`}
						>
							{option.value}
							{option.icon}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default DropdownMenu;
