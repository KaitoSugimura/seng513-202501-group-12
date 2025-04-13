import { Loader2 } from "lucide-react";
import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = () => {
  return <Loader2 size={60} strokeWidth={1.5} className={styles.spinner} />;
};

export default LoadingSpinner;
