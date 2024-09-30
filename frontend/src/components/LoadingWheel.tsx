import React from "react";
import "../styles/LoadingWheel.css";

interface LoadingWheelProps {
  className?: string;
  style?: React.CSSProperties;
}

const LoadingWheel: React.FC<LoadingWheelProps> = ({ className, style }) => {
  return (
    <div className={`content-center h-full ${className ?? ""}`} style={style}>
      <div className="spinner w-10 h-10 relative m-auto">
        <div className="double-bounce1 w-full h-full rounded-full bg-primaryText bg-opacity-60 absolute top-0 left-0"></div>
        <div className="double-bounce2 w-full h-full rounded-full bg-primaryText bg-opacity-60 absolute top-0 left-0"></div>
      </div>
    </div>
  );
};

export default LoadingWheel;
