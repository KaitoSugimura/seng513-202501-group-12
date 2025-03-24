import styles from "./SearchBar.module.css";

export default function SearchBar({
  onChange,
  value,
}: {
  onChange: (event: any) => void;
  value: string;
}) {
  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search..."
        className={styles.searchBar}
      />
    </div>
  );
}
