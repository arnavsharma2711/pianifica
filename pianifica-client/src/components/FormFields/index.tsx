type InputFieldProps = {
	label: string;
	value: string;
	onChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => void;
	type?: "text" | "textarea" | "date" | "number" | "password" | "email";
	placeholder?: string;
};

const InputField = ({
	label,
	value,
	onChange,
	type = "text",
	placeholder,
}: InputFieldProps) => {
	const className =
		"h-10 w-full box-border rounded-md border border-gray-300 dark:border-dark-tertiary dark:bg-dark-tertiary px-3 py-2 ring-offset-background md:text-sm";
	return (
		<div className="w-full">
			<label htmlFor={label} className="w-full ml-1 block font-medium">
				{label}
			</label>

			{type === "textarea" ? (
				<textarea
					className={className}
					placeholder={placeholder || label}
					value={value}
					onChange={onChange}
				/>
			) : (
				<input
					type={type}
					className={className}
					placeholder={placeholder || label}
					value={value}
					onChange={onChange}
				/>
			)}
		</div>
	);
};

export default InputField;
