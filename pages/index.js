import { useState } from "react";
import styles from "../styles/Home.module.css";
import ProgressBar from "../components/ProgressBar";
import Header from "../components/Header";
import UploadedImage from "../components/UploadedImage";
import ChooseFileButton from "../components/ChooseFileButton";
import ConvertImageButton from "../components/ConvertImageButton";
import DownloadFileButton from "../components/DownloadFileButton";
import LoadingWheel from "../components/LoadingWheel";

export default function Home() {
  const [file, setFile] = useState(null);
  const [isDone, setIsDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadPercentage, setuploadPercentage] = useState(0);
  const [getText, setGetText] = useState(false);
  const [imageURL, setImageURL] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/1280px-Placeholder_view_vector.svg.png"
  );
  const [response, setResponse] = useState(null);

  return (
    <div className={styles.Home}>
      <Header />
      <UploadedImage imageURL={imageURL} />
      <ChooseFileButton setFile={setFile} setIsDone={setIsDone} />
      <ProgressBar percentage={uploadPercentage} />
      {isDone ? (
        <ConvertImageButton
          file={file}
          isDone={isDone}
          setuploadPercentage={setuploadPercentage}
          setGetText={setGetText}
          setResponse={setResponse}
          setImageURL={setImageURL}
          setIsLoading={setIsLoading}
        />
      ) : (
        <p className={styles.Text}>Choose an image to convert</p>
      )}
      {isLoading ? <LoadingWheel /> : ""}
      {getText ? (
        <DownloadFileButton response={response} />
      ) : (
        <p className={styles.Text}>
          Extract tables from images (JPG, PNG), convert them to a downloadable
          csv file
        </p>
      )}
    </div>
  );
}
