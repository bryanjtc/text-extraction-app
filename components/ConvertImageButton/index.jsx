import axios from "axios";
import { storage } from "../../firebase/index";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import config from "../../config/index";
import styles from "./styles.module.css";

const ConvertImageButton = ({
  file,
  isDone,
  setuploadPercentage,
  setImageURL,
  setResponse,
  setGetText,
  setIsLoading,
}) => {
  const { azureKey } = config;
  const postConfig = {
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": azureKey,
    },
  };

  const getConfig = {
    headers: {
      "Ocp-Apim-Subscription-Key": azureKey,
    },
  };

  const axiosPostCall = async (postText) => {
    try {
      const res = await axios.post(
        "https://tableextractionmanagement.cognitiveservices.azure.com/formrecognizer/v2.1/layout/analyze",
        postText,
        postConfig
      );
      console.log(res);
      axiosGetCall(res);
      axiosGetCallAgain(res);
    } catch (error) {
      console.log(`error: `, error);
    }
  };

  const axiosGetCall = async (res) => {
    try {
      const response = await axios.get(
        res.headers["operation-location"],
        getConfig
      );
      setIsLoading(true);
      console.log(response);
      if (response.data.status === "succeeded") {
        console.log(response.data);
        if (!(response.data.analyzeResult.pageResults[0].tables.length > 0)) {
          setGetText(false);
          alert(
            "No table extracted, try again with an image that shows only a table"
          );
        } else {
          setResponse(response.data.analyzeResult.pageResults[0]);
          setGetText(true);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.log(`error: `, error);
      setIsLoading(false);
    }
  };

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const axiosGetCallAgain = async (res) => {
    await delay(5000);
    axiosGetCall(res);
  };

  function uploadImage(e) {
    e.preventDefault();
    if (isDone) {
      if (file !== null) {
        const storageRef = ref(storage, `OCRImages/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setuploadPercentage(progress);
            setGetText(false);
          },
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then((urlFirebase) => {
                console.log(urlFirebase);
                setImageURL(urlFirebase);
                axiosPostCall({ url: urlFirebase });
              })
              .catch((error) => console.log(error));
          }
        );
      } else {
        alert("First You Must Select An Image");
      }
    }
  }
  return (
    <button className={styles.Button} onClick={uploadImage}>
      Convert Image
    </button>
  );
};

export default ConvertImageButton;
