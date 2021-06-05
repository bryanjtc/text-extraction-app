import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import { storage } from "./firebase";
import config from "./config/index";
import { CSVLink } from "react-csv";

const App = () => {
  const { azureKey } = config;
  const [file, setItemImage] = useState(null);
  const [uploadPercentage, setuploadPercentage] = useState(0);
  const [imageURL, setImageURL] = useState("");
  const [response, setResponse] = useState();
  const [getText, setGetText] = useState(false);

  function uploadImage(e) {
    e.preventDefault();

    if (file !== null) {
      const uploadTask = storage.ref(`OCRImages/${file.name}`).put(file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          //progress function
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setuploadPercentage(progress);
        },
        (error) => {
          //error function
          console.log(error);
        },
        () => {
          //complete function
          storage
            .ref("OCRImages")
            .child(file.name)
            .getDownloadURL()
            .then((urlFirebase) => {
              console.log(urlFirebase);
              setImageURL(urlFirebase);

              const newText = {
                url: urlFirebase,
              };

              const config1 = {
                headers: {
                  "Content-Type": "application/json",
                  "Ocp-Apim-Subscription-Key": azureKey,
                },
              };

              const config2 = {
                headers: {
                  "Ocp-Apim-Subscription-Key": azureKey,
                },
              };
              const axiosPostCall = async () => {
                try {
                  const res = await axios.post(
                    "https://tableextractionmanagement.cognitiveservices.azure.com/formrecognizer/v2.1/layout/analyze",
                    newText,
                    config1
                  );
                  console.log(res);
                  const axiosGetCall = async (res) => {
                    try {
                      const response = await axios.get(
                        res.headers["operation-location"],
                        config2
                      );

                      console.log(response);
                      if (response.data.status === "succeeded") {
                        console.log(response.data);
                        setResponse(
                          response.data.analyzeResult.pageResults[0].tables[0]
                        );
                        setGetText(true);
                      }
                    } catch (error) {
                      // enter your logic for when there is an error (ex. error toast)
                      console.log(`error: `, error);
                    }
                  };
                  axiosGetCall(res);
                  const delay = (ms) =>
                    new Promise((res) => setTimeout(res, ms));
                  const axiosGetCallAgain = async () => {
                    await delay(5000);
                    console.log("Waited 5s");
                    axiosGetCall(res);
                  };
                  axiosGetCallAgain();
                } catch (error) {
                  // enter your logic for when there is an error (ex. error toast)
                  console.log(`error: `, error);
                }
              };
              axiosPostCall();
            });
        }
      );
    } else {
      alert("First You Must Select An Image");
    }
  }

  return (
    <div>
      <div>
        <center>
          <img src={imageURL} alt="upload file" />
          <br />
          <input
            type="file"
            name="Image"
            onChange={(e) => {
              setItemImage(e.target.files[0]);
            }}
          />
          <br />
          <h3>{uploadPercentage}</h3>
          <br />
          <button onClick={uploadImage}>Convert Image</button>
        </center>
      </div>
      <div>
        <div>
          {getText ? (
            <div>
              {response.cells.map((cell, index) => {
                return (
                  <p key={index}>
                    {cell.rowIndex} {cell.columnIndex} {cell.text}
                    {"\n"}
                  </p>
                );
              })}
              {<CSVLink data={response.cells}>Download me</CSVLink>}
            </div>
          ) : (
            <div>
              <p>
                Extract text from images (JPG, PNG), convert it to text output
                format and convert it to a downloadable csv file
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
