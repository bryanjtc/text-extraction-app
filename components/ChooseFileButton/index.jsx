import styles from "./styles.module.css";

const ChooseFileButton = ({ setFile, setIsDone }) => {
  const onChange = (e) => {
    setFile(e.target.files[0]);
    setIsDone(true);
  };
  return (
    <input
      type="file"
      className={styles.ChooseFileButton}
      name="Image"
      onChange={onChange}
    />
  );
};

export default ChooseFileButton;
