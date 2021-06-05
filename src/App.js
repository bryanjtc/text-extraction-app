import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { storage } from "./firebase";
import config from "./config/index";
import { CSVLink, CSVDownload } from "react-csv";

const App = () => {
  const { azureKey } = config;
  const [file, setItemImage] = useState(null);
  const [uploadPercentage, setuploadPercentage] = useState(0);
  const [imageURL, setImageURL] = useState("");
  const [url, setUrl] = useState("");
  const [Cells, setCells] = useState([]);
  const [GetText, setGetText] = useState(false);
  const [cellRow, setCellRow] = useState(0);
  const [row, setRow] = useState([]);
  const [line, setLine] = useState([]);

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
              axios
                .post(
                  "https://tableextractionmanagement.cognitiveservices.azure.com/formrecognizer/v2.1/layout/analyze",
                  newText,
                  config1
                )
                .then((res) => {
                  console.log("Respuesta");
                  setUrl(res.headers["operation-location"].toString());
                  console.log(url);
                  axios
                    .get(url, config2)
                    .then((response) => {
                      console.log("data");
                      console.log(response);
                      if (typeof response !== undefined) {
                        setCells(
                          response.data.analyzeResult.pageResults[0].tables[0]
                            .cells
                        );
                        console.log(
                          response.data.analyzeResult.pageResults[0].tables[0]
                            .cells
                        );
                        setGetText(true);
                        Cells.forEach((cell) => {
                          cell.rowIndex !== cellRow
                            ? addNewRow(cell.rowIndex, cell.text)
                            : updateRow(
                                cell.text,
                                cell.columnIndex,
                                response.data.analyzeResult.pageResults[0]
                                  .tables[0].columns
                              );
                        });
                      }
                    })
                    .catch((err) => {
                      setGetText(false);
                      console.log(err);
                      alert("Intente de nuevo");
                    });
                })
                .catch((err) => {
                  setGetText(false);
                  console.log(err);
                  alert("Intente de nuevo");
                });
            });
        }
      );
    } else {
      alert("First You Must Select An Image");
    }
  }

  const addNewRow = (rowIndex, text) => {
    console.log(rowIndex);
    setCellRow(rowIndex);

    setLine([text + ","]);
  };

  const updateRow = (text, columnIndex, columns) => {
    setLine((oldarray) => [...oldarray, text + ","]);
    if (columnIndex === columns) {
      setRow((oldarray) => [...oldarray, line.join() + "\n"]);
    }
  };

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
          {GetText ? (
            <div>
              {row.map((line) => {
                console.log(line);
                return line;
              })}
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
