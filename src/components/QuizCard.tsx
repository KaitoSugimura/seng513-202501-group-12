import { Quiz } from "../util/appwrite";
import styles from "./QuizCard.module.css";
import { useNavigate } from "react-router-dom";

export default function QuizCard({ key, quiz }: { key: string; quiz: Quiz }) {
  const navigate = useNavigate();

  return (
    <div
      key={key}
      className={styles.quizContainer}
      onClick={() => {
        navigate(`/Quiz/${quiz.$id}`);
      }}
    >
      <div className={styles.quizImageContainer}>
        <img
          src={quiz.image}
          alt={`Image for ${quiz.name}`}
          className={styles.quizImage}
        />
      </div>
      {/* <img src={quiz.creator.image} alt="" className={styles.creatorImage} /> */}
      <h4 className={styles.quizGenre}>{quiz.genre}</h4>
      <h3 className={styles.quizTitle}>{quiz.name}</h3>
      <p className={styles.quizCreatorText}>By {quiz.creator.username}</p>
    </div>
  );
}
