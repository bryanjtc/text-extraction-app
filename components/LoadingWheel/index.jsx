import styles from "./styles.module.css";

const LoadingWheel = () => {
  return (
    <div className={styles["loading-spinner-container"]}>
      <div className={styles["loading-spinner-rolling"]}>
        <div className={styles["loading-spinner-rolling-inner"]}>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingWheel;
