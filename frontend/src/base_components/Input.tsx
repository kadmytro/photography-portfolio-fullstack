import React, { useRef, useState } from "react";

interface InputProps {
  type?: string;
  label?: string;
  id?: string;

  /** The name of the input, used to identify the form field.
   * It should match with the name of the value field in the form object*/
  name?: string;

  /** The value of the input field. It should be controlled via state. */
  value?: string | number;

  readOnly?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties | undefined;
  autocomplete? : string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const Input: React.FC<InputProps> = ({
  type,
  label,
  id,
  name,
  value,
  readOnly = false,
  required = false,
  placeholder,
  className,
  style,
  autocomplete,
  onChange,
}) => {
  const [inputType, setInputType] = useState(type);
  const inputRef = useRef<HTMLInputElement>(null);
  const isPassword = type === "password";

  function togglePasswordVisibility() {
    if (!isPassword) {
      return;
    }

    const isFocused = document.activeElement?.id === inputRef.current?.id;

    if (inputType === "password") {
      setInputType("text");
    } else {
      setInputType("password");
    }

    if (isFocused && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.selectionStart = inputRef.current.value.length;
      inputRef.current.selectionEnd = inputRef.current.value.length;
    }
  }

  return (
    <div className="mb-4 relative">
      <label
        htmlFor={`${name}`}
        className="block text-cardText font-bold mb-2 pl-1"
      >
        {label}:
      </label>
      <input
        ref={inputRef}
        type={inputType ?? "text"}
        id={id}
        name={name}
        value={value ?? ""}
        readOnly={readOnly}
        required={required}
        onChange={onChange}
        autoComplete={autocomplete ?? ""}
        className={
          "w-full px-3 py-2 bg-input text-inputText text-opacity-80 placeholder:text-inputText placeholder:text-opacity-30 border-primaryText border-opacity-20 border rounded focus:outline-none " +
          (readOnly
            ? "cursor-default "
            : "cursor-text focus:border-blue-500 focus:border-2 ") +
          (className != undefined ? className : "") +
          (type === "number"
            ? "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            : "")
        }
        style={style}
        placeholder={placeholder ?? label}
      />
      {isPassword && (
        <label
          onClick={togglePasswordVisibility}
          className={
            "absolute svg-mask bg-gray-500 h-5 w-9 right-0 bottom-2 text-sm text-gray-600 cursor-pointer" +
            (inputType === "password" ? " show-password-icon" : " hide-password-icon")
          }
        ></label>
      )}
    </div>
  );
};

export default Input;
