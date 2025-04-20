import { Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePopup } from "../context/PopupContext"; 
import { Quiz, QuizHistory, databases, dbId, storage } from "../util/appwrite";
import { Query } from "appwrite";
import styles from "./QuizCard.module.css";

export default function QuizCard({
  quiz,
  quizHistory,
}: {
  quiz: Quiz;
  quizHistory?: QuizHistory;
}) {
  const { user, isAdminUser, toggleFavoriteQuiz } = useAuth();
  const [isQuizFavorited, setIsQuizFavorited] = useState(false);
  const [imageIsLoading, setImageIsLoading] = useState(true);
  const { setContent, clearContent } = usePopup();

  useEffect(() => {
    if (!user) {
      return;
    }

    setIsQuizFavorited(user.favoritedQuizIds.includes(quiz.$id));
  }, [user, quiz.$id]);

  const handleDeleteClick = () => {
    setContent(
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
                clearContent();
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
    );
  };

  const deleteQuiz = async () => {
    try {
      setContent(
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h2 className={styles.popupTitle}>Delete Confirmation</h2>
            <p className={styles.popupMessage}>
              Deleting quiz in progress...
            </p>
          </div>
        </div>
      )
      const correspondingQuizHistories = await databases.listDocuments(
        dbId,
        "quizHistory",
        [Query.equal("quizId", quiz.$id)]
      );
      correspondingQuizHistories.documents.forEach(async (quizHistory) => {
        await databases.deleteDocument(dbId, "quizHistory", quizHistory.$id);
      });

      const usersThatFavoritedTheQuiz = await databases.listDocuments(
        dbId,
        "users",
        [Query.contains("favoritedQuizIds", quiz.$id)]
      );

      usersThatFavoritedTheQuiz.documents.forEach(async (user) => {
        const updatedFavoritedQuizIdsList = user.favoritedQuizIds.filter(
          (id: string) => id !== quiz.$id
        );
        await databases.updateDocument(dbId, "users", user.$id, {
          favoritedQuizIds: updatedFavoritedQuizIdsList,
        });
      });

      const correspondingQuestions = await databases.listDocuments(
        dbId,
        "questions",
        [Query.equal("quizId", quiz.$id)]
      );

      correspondingQuestions.documents.forEach(async (question) => {
        const imageFileId = question.imageUrl
          .split("/files/")[1]
          .split("/view")[0];
        await storage.deleteFile("images", imageFileId);
        await databases.deleteDocument(dbId, "questions", question.$id);
      });

      const previewImageFileId = quiz.previewUrl
        .split("/files/")[1]
        .split("/view")[0];
      await storage.deleteFile("images", previewImageFileId);

      await databases.deleteDocument(dbId, "quizzes", quiz.$id);
      window.location.reload();
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
    } finally {
      clearContent();
    }
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

        {(user?.username === quiz.creatorUsername || isAdminUser) && (
          <button
            className={styles.deleteButton}
            onClick={(e) => {
              e.preventDefault();
              handleDeleteClick();
            }}
          >
            <Trash2 id="deleteIcon" stroke="darkRed" size={22} />
          </button>
        )}
      </div>
    </div>
  );
}
