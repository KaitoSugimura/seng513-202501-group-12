import styles from "./InputField.module.css";

export default function SelectField({
  onChange,
  value,
  placeholder,
  label,
  categories,
}: {
  onChange: (event: any) => void;
  value: string;
  placeholder: string;
  categories: readonly string[];
  label?: string;
}) {
  return (
    <div className={styles.inputRoot}>
      {label && <label className={styles.label}>{label}</label>}
      <select className={styles.select} value={value} onChange={onChange}>
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
