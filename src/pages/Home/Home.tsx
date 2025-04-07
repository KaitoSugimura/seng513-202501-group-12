import styles from "./Home.module.css";
import CategoryListViewer from "../../components/CategoryListViewer";
import QuizListViewer from "../../components/QuizListViewer";
import { Query } from "appwrite";

export default function Home() {
  return (
    <div className={styles.homeRoot}>
      <QuizListViewer
        title="Top Quizzes"
        query={[Query.orderDesc("favoritedCount")]}
      />
      <QuizListViewer title="Newest" />
      <QuizListViewer
        title="Recommended for you"
        query={[Query.contains("title", ["Ri"])]}
      />
      <CategoryListViewer />
      <QuizListViewer title="Trending" />
      <QuizListViewer title="Most Played" />
    </div>
  );
}
