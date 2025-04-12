import { categories } from "../util/appwrite";
import Carousel from "./Carousel";
import CategoryCard from "./CategoryCard";
import styles from "./CategoryCarousel.module.css";

export default function CategoryCarousel() {
  return (
    <Carousel title="Explore Categories">
      {categories.map((category) => (
        <div key={category} className={styles.emblaSlide}>
          <CategoryCard key={category} category={category} />
        </div>
      ))}
    </Carousel>
  );
}
