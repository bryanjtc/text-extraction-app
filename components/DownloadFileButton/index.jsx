import { CSVLink } from "react-csv";
import styles from "./styles.module.css";

const DownloadFileButton = ({ response }) => {
  var cellRow = 0;
  var line = [];
  var rows = [];
  function addNewRow(rowIndex, text) {
    rows.push(line.toString() + "\n");
    cellRow = rowIndex;
    line = [];
    if (text.includes(",")) text = `"${text}"`;
    line.push(text);
  }

  function updateRow(text, total, index) {
    if (text.includes(",")) text = `"${text}"`;
    line.push(text);
    if (total - 1 === index) rows.push(line.toString() + "\n");
  }
  function organizeData() {
    if (response.tables.length > 0) {
      response.tables[0].cells.forEach((cell, index) => {
        cell.rowIndex !== cellRow
          ? addNewRow(cell.rowIndex, cell.text)
          : updateRow(cell.text, response.tables[0].cells.length, index);
      });
      console.log(rows);
      return rows.join("");
    } else {
      alert(
        "No table extracted, try again with an image that shows only a table"
      );
      return "";
    }
  }
  return (
    <div className={styles.Button}>
      {<CSVLink data={organizeData()}>Download table</CSVLink>}
    </div>
  );
};

export default DownloadFileButton;
