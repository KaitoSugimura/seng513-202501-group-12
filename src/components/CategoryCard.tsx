import { useNavigate } from "react-router-dom";
import { Category } from "../util/appwrite";
import styles from "./CategoryCard.module.css";

export default function CategoryCard({ category }: { category: Category }) {
  const navigate = useNavigate();

  let combinedHex = "";
  category.split("").forEach((char, index) => {
    if (index > 5) return;
    combinedHex += ((char.charCodeAt(0) + index + 2) % 16).toString(16);
  });

  combinedHex = combinedHex.slice(-6).padStart(6, "3");

  return (
    <div
      className={styles.categoryCardContainer}
      onClick={() => {
        navigate(`/search?theme=${category}`);
      }}
    >
      <div
        className={styles.background}
        style={{ backgroundColor: `#${combinedHex}` }}
      ></div>
      <div className={styles.backgroundOverlay}></div>
      <h3 className={styles.categoryCardTitle}>{category}</h3>
    </div>
  );
}
