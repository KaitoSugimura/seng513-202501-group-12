import { Query } from "appwrite";
import CategoryListViewer from "../../components/CategoryListViewer";
import QuizCarousel from "../../components/QuizCarousel";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.homeRoot}>
      <QuizCarousel
        title="Top Quizzes"
        query={[Query.orderDesc("favoritedCount")]}
      />
      <QuizCarousel title="Newest" />
      <QuizCarousel
        title="Recommended for you"
        query={[Query.contains("title", ["Ri"])]}
      />
      <CategoryListViewer />
      <QuizCarousel title="Trending" />
      <QuizCarousel title="Most Played" />
    </div>
  );
}
