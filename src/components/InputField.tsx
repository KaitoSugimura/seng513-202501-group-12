import styles from "./InputField.module.css";

export default function InputField({
  onChange,
  value,
  placeholder,
  label,
}: {
  onChange: (event: any) => void;
  value: string;
  placeholder: string;
  label?: string;
}) {
  return (
    <div className={styles.inputRoot}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={styles.input}
      />
    </div>
  );
}
