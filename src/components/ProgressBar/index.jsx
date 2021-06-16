import React from "react";
import "./styles.css";

const ProgressBar = ({ percentage }) => {
  return (
    <>
      <progress min="0" max="100" value={percentage} />
    </>
  );
};

export default ProgressBar;
