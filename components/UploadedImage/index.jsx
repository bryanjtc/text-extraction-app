import Image from "next/image";
import styles from "./styles.module.css";

const UploadedImage = ({ imageURL }) => {
  return (
    <div className={styles.UploadedImageContainer}>
      <Image
        src={imageURL}
        alt="upload file"
        layout="fill"
        objectFit="contain"
        priority="true"
      />
    </div>
  );
};

export default UploadedImage;
