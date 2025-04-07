import { Quiz } from "../util/appwrite";
import styles from "./QuizCard.module.css";
import { Link } from "react-router-dom";
import { Star, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function QuizCard({ quiz }: { quiz: Quiz }) {
  const { user, toggleFavoriteQuiz } = useAuth();
  const [isQuizFavorited, setIsQuizFavorited] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }
    setIsQuizFavorited(user.favoritedQuizzes.some((q) => q.$id === quiz.$id));
  }, [user]);

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
        {user && (
          <button
            className={styles.favoriteButton}
            onClick={(e) => {
              e.preventDefault();
              toggleFavoriteQuiz(quiz);
            }}
          >
            <Star
              id="favoriteIcon"
              fill={isQuizFavorited ? "gold" : "white"}
              stroke="black"
            />
          </button>
        )}
      </div>
      <h4 className={styles.quizGenre}>{quiz.theme}</h4>
      <h3 className={styles.quizTitle}>{quiz.title}</h3>
      <p className={styles.quizCreatorText}>By {quiz.creatorUsername}</p>
      {user?.username === quiz.creatorUsername && (
          <button className={styles.deleteButton}>
            <Trash2
              id="deleteIcon"
              fill="red"
              stroke="black"
            />
          </button>
        )}
    </Link>
  );
}
