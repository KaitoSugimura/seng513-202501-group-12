import { Link } from "react-router-dom";
import { Quiz } from "../util/appwrite";
import styles from "./QuizCard.module.css";

const QuizCard = ({ quiz }: { quiz: Quiz }) => {
  return (
    <Link
      key={quiz.id}
      className={styles.quizContainer}
      to={`/quiz/${quiz.$id}`}
    >
      <div className={styles.quizImageContainer}>
        <img
          src={quiz.previewUrl}
          alt={`Image for ${quiz.name}`}
          className={styles.quizImage}
        />
      </div>
      <h4 className={styles.quizSubtitle}>{quiz.theme}</h4>
      <h3 className={styles.quizTitle}>{quiz.title}</h3>
      <p className={styles.quizCreatorText}>Quiz by {quiz.creatorUsername}</p>
    </Link>
  );
};

export default QuizCard;
