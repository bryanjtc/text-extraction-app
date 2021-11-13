/* eslint-disable @next/next/no-img-element */
import styles from "./styles.module.css";
import cloudinary from "cloudinary-core";

const UploadedImage = ({ imageURL }) => {
  const cl = cloudinary.Cloudinary.new({ cloud_name: "dzilzrhfk" });
  const cloudinary_url = cl.url(imageURL, { type: "fetch" });
  return (
    <div className={styles.UploadedImageContainer}>
      <img
        src={cloudinary_url}
        alt="upload file"
        layout="fill"
        priority="true"
      />
    </div>
  );
};

export default UploadedImage;
