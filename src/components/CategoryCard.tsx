import { useNavigate } from "react-router-dom";
import { Category } from "../util/appwrite";
import styles from "./CategoryCard.module.css";

export default function CategoryCard({
  key,
  category,
}: {
  key: string;
  category: Category;
}) {
  const navigate = useNavigate();

  return (
    <div
      className={styles.categoryCardContainer}
      key={key}
      onClick={() => {
        navigate(`/search?theme=${category}`);
      }}
    >
      <div>
        {/* <img
          src={category.image}
          alt={`Image for ${category.name}`}
          className="categoryCardImage"
        /> */}
      </div>
      <h3 className={styles.categoryCardTitle}>{category}</h3>
    </div>
  );
}
