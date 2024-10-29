import React from "react";

interface TextAreaProps {
  label?: string;

  /** The name of the input, used to identify the form field.
   * It should match with the name of the value field in the form object*/
  name?: string;

  /** The value of the input field. It should be controlled via state. */
  value?: string;
  readOnly?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties | undefined;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  name,
  value,
  readOnly = false,
  required = false,
  placeholder,
  className,
  style,
  onChange,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor="caption" className="block text-cardText font-bold mb-2">
        {label}:
      </label>
      <textarea
        name={name}
        value={value ?? ""}
        readOnly={readOnly}
        required={true}
        onChange={onChange}
        className={
          "w-full px-3 py-2 bg-input text-inputText text-opacity-80 placeholder:text-inputText placeholder:text-opacity-30 border-primaryText border-opacity-20 border rounded focus:outline-none " +
          (readOnly
            ? "resize-none cursor-default "
            : "resize-y cursor-text focus:border-blue-500 ") +
          (className != undefined ? className : "")
        }
        style={style}
        placeholder={placeholder ?? label}
      />
    </div>
  );
};

export default TextArea;
