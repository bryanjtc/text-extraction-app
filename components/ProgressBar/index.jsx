import styles from "./styles.module.css";

const ProgressBar = ({ percentage }) => {
  return (
    <>
      <progress className={styles.ProgressBar} min="0" max="100" value={percentage} />
    </>
  );
};

export default ProgressBar;
