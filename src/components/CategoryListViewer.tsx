import { useEffect, useState } from "react";
import { categories, Category } from "../util/appwrite";
import CategoryCard from "./CategoryCard";
import styles from "./CategoryListViewer.module.css";
import SectionLabel from "./SectionLabel";

export default function CategoryListViewer() {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [categoriesToShow, setCategoriesToShow] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setCategoriesToShow(5);
      } else if (window.innerWidth > 620) {
        setCategoriesToShow(4);
      } else if (window.innerWidth > 480) {
        setCategoriesToShow(3);
      } else {
        setCategoriesToShow(2);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentViewingCategories = categories.slice(
    categoryIndex * categoriesToShow,
    categoryIndex * categoriesToShow + categoriesToShow
  );

  return (
    <div>
      <SectionLabel
        title="Explore Categories"
        onClickNext={() => {
          setCategoryIndex((prevIndex) =>
            Math.min(
              prevIndex + 1,
              Math.floor((categories.length - 1) / categoriesToShow)
            )
          );
        }}
        onClickPrev={() => {
          setCategoryIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        }}
        disabledPrev={categoryIndex === 0}
        disabledNext={
          categoryIndex ===
          Math.floor((categories.length - 1) / categoriesToShow)
        }
      />
      <div
        className={styles.categorySection}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${categoriesToShow}, 1fr)`,
          gap: "16px",
          padding: "8px",
        }}
      >
        {currentViewingCategories.map((category: Category) => (
          <CategoryCard key={category} category={category} />
        ))}
      </div>
    </div>
  );
}
