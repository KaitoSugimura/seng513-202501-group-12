import { Quiz } from "../util/appwrite";
import styles from "./QuizCard.module.css";
import { Link } from "react-router-dom";
import { Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function QuizCard({ quiz }: { quiz: Quiz }) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorited(!isFavorited);
    //Make this actually update list of users favorited quizzes
  };

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
          <button className={styles.favoriteButton} onClick={toggleFavorite}>
            <Star
              id="favoriteIcon"
              fill={isFavorited ? "gold" : "white"}
              stroke="black"
            />
          </button>
        )}
      </div>
      <h4 className={styles.quizGenre}>{quiz.theme}</h4>
      <h3 className={styles.quizTitle}>{quiz.title}</h3>
      <p className={styles.quizCreatorText}>By {quiz.creatorUsername}</p>
      {user?.id === quiz.creatorId && (
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
