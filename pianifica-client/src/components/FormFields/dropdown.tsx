import { Check, ChevronDown } from "lucide-react";
import React, { useState } from "react";

type Option = {
  label: string;
  value: string;
  imgSrc?: string;
};

type DropdownProps = {
  options: Option[];
  value: string;
  setValue: (value: string) => void;
  label: string;
  disabled?: boolean;
};

const Dropdown = ({ options, value, setValue, label, disabled }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(option => option.value === value);
  return (
    <div className="w-full">
      <p className="block text-sm font-medium">
        {label}
      </p>
      <div className="relative mt-2">
        <button
          type="button"
          className={`flex border border-gray-300 dark:border-dark-tertiary dark:bg-dark-tertiary w-full items-center justify-between rounded bg-white py-1.5 pr-2 pl-3 sm:text-sm ${disabled ? "cursor-not-allowed opacity-85" : "cursor-pointer"}`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby="listbox-label"
          onClick={() => {
            if (disabled) return;
            setIsOpen(!isOpen)
          }}
        >
          <span className="flex items-center gap-3">
            {selectedOption?.imgSrc && (
              <img src={selectedOption.imgSrc} alt="" className="size-7 object-cover rounded-full" />
            )}
            <span className="block truncate">{selectedOption?.label}</span>
          </span>
          <span className={`${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>

            <ChevronDown />
          </span>
        </button>

        {isOpen && (
          <ul
            className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden sm:text-sm"
            tabIndex={-1}
            role="listbox"
            aria-labelledby="listbox-label"
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                className="relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none"
                id={`listbox-option-${index}`}
                onClick={() => {
                  setValue(option.value);
                  setIsOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setValue(option.value);
                    setIsOpen(false);
                  }
                }}
                tabIndex={0}
              >
                <div className="flex items-center">
                  {option.imgSrc && (
                    <img src={option.imgSrc} alt="" className="size-7 object-cover rounded-full" />
                  )}
                  <span className="ml-3 block truncate font-normal">{option.label}</span>
                </div>
                {option.value === value && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                    <Check />
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dropdown;