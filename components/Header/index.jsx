import styles from "./styles.module.css";

const Header = () => {
  return (
    <div className={styles.Header}>
      <p className={styles["Header-text"]}>
        Text extraction app | Convert table images to csv
      </p>
    </div>
  );
};

export default Header;
