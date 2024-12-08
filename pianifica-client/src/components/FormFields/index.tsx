type InputFieldProps = {
	label: string;
	value: string;
	onChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => void;
	type?: "text" | "textarea" | "date";
	placeholder?: string;
};

const InputField = ({
	label,
	value,
	onChange,
	type = "text",
	placeholder,
}: InputFieldProps) => (
	<div className="w-full">
		<label htmlFor={label} className="w-full block font-medium dark:text-white">
			{label}
		</label>

		{type === "text" && (
			<input
				type="text"
				className={
					"w-full rounded border border-gray-300 p-2 mt-1 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none"
				}
				placeholder={placeholder || label}
				value={value}
				onChange={onChange}
			/>
		)}
		{type === "date" && (
			<input
				type="date"
				className={
					"w-full rounded border border-gray-300 p-2 mt-1 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none"
				}
				value={value}
				onChange={onChange}
			/>
		)}
		{type === "textarea" && (
			<textarea
				className={
					"w-full rounded border border-gray-300 p-2 mt-1 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none"
				}
				placeholder={placeholder || label}
				value={value}
				onChange={onChange}
			/>
		)}
	</div>
);

export default InputField;
