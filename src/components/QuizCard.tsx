import { Quiz } from "../util/appwrite";
import styles from "./QuizCard.module.css";
import { Link } from "react-router-dom";

export default function QuizCard({ quiz }: { quiz: Quiz }) {
  return (
    <Link
      key={quiz.id}
      className={styles.quizContainer}
      to={`/quiz/${quiz.$id}`}
    >
      <div className={styles.quizImageContainer}>
        <img
          src={quiz.previewUrl}
          alt={`Image for ${quiz.title}`}
          className={styles.quizImage}
        />
      </div>
      <h4 className={styles.quizGenre}>{quiz.theme}</h4>
      <h3 className={styles.quizTitle}>{quiz.title}</h3>
      <p className={styles.quizCreatorText}>By {quiz.creatorUsername}</p>
    </Link>
  );
}
