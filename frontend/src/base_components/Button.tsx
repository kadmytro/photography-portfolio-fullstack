import React from "react";
import { text } from "stream/consumers";

type ButtonType =
  | "normal"
  | "default"
  | "success"
  | "danger"
  | "warning"
  | "custom";
type ButtonStyle = "contained" | "outlined" | "text";

interface ButtonProps {
  /** The type of button: 'normal', 'default', 'success', 'danger', 'warning', or 'custom' */
  buttonType?: ButtonType;

  /** The style of button: 'contained', 'outlined', or 'text' */
  buttonStyle?: ButtonStyle;

  /** Custom class names for additional styling */
  className?: string;

  /** Custom inline styles */
  style?: React.CSSProperties;

  /** Click handler for the button */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;

  /** Button text */
  text?: string;

  /** Button type attribute:
   * "button" | "submit" | "reset" | undefined
   */
  type?: "button" | "submit" | "reset" | undefined;

  /** Button disable attribute */
  disabled?: boolean;
}

/** Utility function to get Tailwind classes based on buttonType and buttonStyle */
const getButtonClasses = (buttonType: ButtonType, buttonStyle: ButtonStyle) => {
  const typeColors: Record<ButtonType, string> = {
    normal: "white",
    default: "blue-500",
    success: "green-500",
    danger: "red-500",
    warning: "yellow-500",
    custom: "", // Custom will fallback to normal unless styles or className is passed
  };

  const color = typeColors[buttonType];
  const textColor =
    buttonStyle === "contained"
      ? buttonType === "normal"
        ? "black"
        : "white"
      : buttonType === "normal"
      ? "primaryText"
      : color;

  const styleClassess: Record<ButtonStyle, string> = {
    contained: `bg-${color} drop-shadow text-${textColor}`,
    outlined: `border-1 border-${textColor} text-${textColor}`,
    text: `text-${color}`,
  };

  return styleClassess[buttonStyle];
};

const Button: React.FC<ButtonProps> = ({
  buttonType = "default",
  buttonStyle = "contained",
  className = "",
  style,
  onClick,
  text = "Button",
  type,
  disabled,
}) => {
  const buttonClasses = getButtonClasses(buttonType, buttonStyle);

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      style={style}
      className={`px-4 py-2 opacity-90 rounded hover:opacity-100 ${buttonClasses} ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
