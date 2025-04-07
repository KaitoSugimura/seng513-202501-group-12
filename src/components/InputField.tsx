import styles from "./InputField.module.css";

export default function InputField({
  onChange,
  value,
  placeholder,
  label,
  type = "text",
  error,
  className,
}: {
  onChange: (event: any) => void;
  value: string;
  placeholder: string;
  label?: string;
  type?: string;
  error?: string;
  className?: string;
}) {
  return (
    <div className={`${className} ${styles.inputRoot}`}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.error : ""}`}
      />
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}
