import React from "react";
import "./styles.css";

const ChooseFileButton = ({ setFile, setIsDone }) => {
  const onChange = (e) => {
    setFile(e.target.files[0]);
    setIsDone(true);
  };
  return (
    <input
      type="file"
      className="ChooseFileButton"
      name="Image"
      onChange={onChange}
    />
  );
};

export default ChooseFileButton;
