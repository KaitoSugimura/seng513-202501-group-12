import { Quiz, databases, dbId } from "../util/appwrite";
import styles from "./QuizCard.module.css";
import { Link } from "react-router-dom";
import { Star, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function QuizCard({ quiz }: { quiz: Quiz }) {
  const { user, toggleFavoriteQuiz } = useAuth();
  const [isQuizFavorited, setIsQuizFavorited] = useState(false);
  const [imageIsLoading, setImageIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }
    setIsQuizFavorited(user.favoritedQuizzes.some((q) => q.$id === quiz.$id));
  }, [user]);

  const deleteQuiz = async () => {
    try {
      await databases.deleteDocument(dbId, "quizzes", quiz.$id);
      window.location.reload();
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
    }
    setShowPopup(false);
  };

  return (
    <div>
      <Link
        key={quiz.id}
        className={styles.quizContainer}
        to={`/quiz/${quiz.$id}`}
      >
        <div className={styles.quizImageContainer}>
          <img
            src={quiz.previewUrl}
            alt={`Image for ${quiz.title}`}
            className={`${styles.quizImage} ${imageIsLoading ? "Loading" : ""}`}
            onLoad={() => setImageIsLoading(false)}
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
            <button className={styles.deleteButton} onClick={(e) => {e.preventDefault(); setShowPopup(true);}}>
            <Trash2 id="deleteIcon" fill="red" stroke="black" />
          </button>
        )}
      </Link>

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h2 className={styles.popupTitle}>Delete Confirmation</h2>
            <p className={styles.popupMessage}>Are you sure you want to delete this quiz?</p>
            <div className={styles.popupActions}>
              <button onClick={(e) => {e.preventDefault(); setShowPopup(false);}} className={styles.cancelButton}>Cancel</button>
              <button onClick={(e) => {e.preventDefault(); deleteQuiz();}} className={styles.confirmButton}>Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
