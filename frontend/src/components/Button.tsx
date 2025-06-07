
import styles from "./Button.module.css";

type ButtonProps = {
  label: string;
  onClick: () => void;
};

export const Button = ({ label, onClick }: ButtonProps) => (
  <button className={styles.button} onClick={onClick}>
    {label}
  </button>
);
