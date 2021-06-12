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
  var cellRow = 0;
  var line = [];
  var rows = [];

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
          setGetText(false);
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
                        setResponse(response.data.analyzeResult.pageResults[0]);
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

  function addNewRow(rowIndex, text) {
    cellRow = rowIndex;
    line = [];
    if (text.includes(",")) text = `"${text}"`;
    line.push(text);
  }

  function updateRow(text, columnIndex, totalColumns) {
    line.push(text);
    if (columnIndex === totalColumns - 1) {
      rows.push(line.toString() + "\n");
    }
  }

  function organizeData(results) {
    console.log(results);
    if (results.tables.length > 0) {
      results.tables[0].cells.forEach((cell) => {
        cell.rowIndex !== cellRow
          ? addNewRow(cell.rowIndex, cell.text)
          : updateRow(cell.text, cell.columnIndex, results.tables[0].columns);
      });
      return rows.join("");
    } else
      return "No table extracted, try again with an image that shows only a table";
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
              {<CSVLink data={organizeData(response)}>Download table</CSVLink>}
            </div>
          ) : (
            <div>
              <p>
                Extract tables from images (JPG, PNG), convert them to a
                downloadable csv file
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
