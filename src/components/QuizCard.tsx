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

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-2">Delete Confirmation</h2>
            <p className="mb-4">Are you sure you want to delete this quiz?</p>
            <div className="flex justify-end gap-4">
              <button onClick={(e) => {e.preventDefault(); setShowPopup(false)}} className="bg-gray-200 hover:bg-gray-300 text-black p-2 rounded">Cancel</button>
              <button onClick={(e) => {e.preventDefault(); deleteQuiz()}} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded">Yes</button>
            </div>
          </div>
        </div>
      )}
    </Link>
  );
}
