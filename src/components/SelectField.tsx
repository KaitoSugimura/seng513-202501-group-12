import styles from "./InputField.module.css";

export default function SelectField({
  onChange,
  value,
  label,
  categories,
  id,
  className,
}: {
  onChange: (event: any) => void;
  value: string;
  categories: readonly string[];
  label?: string;
  id?: string;
  className?: string;
}) {
  return (
    <div className={`${className} ${styles.inputRoot}`}>
      {label && <label className={styles.label}>{label}</label>}
      <select
        id={id}
        className={styles.select}
        value={value}
        onChange={onChange}
      >
        <option value="">Any</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}
