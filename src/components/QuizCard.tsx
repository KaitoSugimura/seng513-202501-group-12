import { Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Quiz, QuizHistory, databases, dbId } from "../util/appwrite";
import styles from "./QuizCard.module.css";

export default function QuizCard({
  quiz,
  quizHistory,
}: {
  quiz: Quiz;
  quizHistory?: QuizHistory;
}) {
  const { user, toggleFavoriteQuiz } = useAuth();
  const [isQuizFavorited, setIsQuizFavorited] = useState(false);
  const [imageIsLoading, setImageIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    setIsQuizFavorited(user.favoritedQuizIds.includes(quiz.$id));
  }, [user, quiz.$id]);

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
      <div key={quiz.id} className={styles.quizContainer}>
        <div className={styles.quizImageContainer}>
          <Link to={`/quiz/${quiz.$id}`} tabIndex={-1}>
            <img
              src={quiz.previewUrl}
              alt={`Image for ${quiz.title}`}
              className={`${styles.quizImage} ${
                imageIsLoading ? "Loading" : ""
              }`}
              onLoad={() => setImageIsLoading(false)}
            />
          </Link>
          {user && (
            <button
              className={styles.favoriteButton}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavoriteQuiz(quiz);
              }}
            >
              <Star
                id="favoriteIcon"
                fill={isQuizFavorited ? "gold" : "transparent"}
                stroke={isQuizFavorited ? "gold" : "#999"}
                strokeWidth={1.5}
                size={22}
              />
            </button>
          )}
        </div>
        <h4 className={styles.quizGenre}>{quiz.theme}</h4>
        <h3 className={styles.quizTitle}>
          <Link to={`/quiz/${quiz.$id}`}>{quiz.title}</Link>
        </h3>
        <div className={styles.quizCreatorText}>
          <span>By: </span>
          <NavLink
            to="/account"
            state={`${quiz.creatorUsername}`}
            className={styles.linkStyle}
          >
            <span>{quiz.creatorUsername}</span>
          </NavLink>
        </div>
        {quizHistory && (
          <>
            <h5>
              Played on:{" "}
              {new Date(quizHistory.date).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </h5>
            <h5>Your Score: {quizHistory?.score}</h5>
          </>
        )}

        {user?.username === quiz.creatorUsername && (
          <button
            className={styles.deleteButton}
            onClick={(e) => {
              e.preventDefault();
              setShowPopup(true);
            }}
          >
            <Trash2 id="deleteIcon" stroke="darkRed" size={22} />
          </button>
        )}
      </div>

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h2 className={styles.popupTitle}>Delete Confirmation</h2>
            <p className={styles.popupMessage}>
              Are you sure you want to delete this quiz?
            </p>
            <div className={styles.popupActions}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowPopup(false);
                }}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  deleteQuiz();
                }}
                className={styles.confirmButton}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
