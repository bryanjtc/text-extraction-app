import React from "react";
import "./styles.css";

const UploadedImage = ({ imageURL }) => {
  return <img className="UploadedImage" src={imageURL} alt="upload file" />;
};

export default UploadedImage;
