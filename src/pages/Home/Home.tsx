import { Query } from "appwrite";
import CategoryCarousel from "../../components/CategoryCarousel";
import QuizCarousel from "../../components/QuizCarousel";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.homeRoot}>
      <QuizCarousel
        title="Top Quizzes"
        query={[Query.orderDesc("favoritedCount")]}
      />
      <QuizCarousel title="Newest" query={[Query.orderDesc("$createdAt")]} />
      <QuizCarousel title="Recommended for you" query={[]} />
      <CategoryCarousel />
      <QuizCarousel title="Trending" />
      <QuizCarousel title="Most Played" />
    </div>
  );
}
