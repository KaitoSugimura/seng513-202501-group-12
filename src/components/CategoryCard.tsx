import { useNavigate } from "react-router-dom";
import { Category, databases, dbId } from "../util/appwrite";
import styles from "./CategoryCard.module.css";
import { useEffect } from "react";
import { Query } from "appwrite";

export default function CategoryCard({
  key,
  category,
}: {
  key: string;
  category: Category;
}) {
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
      key={key}
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
