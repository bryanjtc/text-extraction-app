import React from "react";
import "./styles.css";

const LoadingWheel = () => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner-rolling">
        <div className="loading-spinner-rolling-inner">
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingWheel;
