import React from "react";
import quizData from "../../database/stubQuiz";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.homeRoot}>
      <h1>Quizzes</h1>
      <div className={styles.quizGrid}>
        {quizData.map((quiz) => (
          <div
            key={quiz.id}
            className={styles.quizContainer}
            onClick={() => {
              navigate(`/Quiz/${quiz.id}`);
            }}
          >
            <div className={styles.quizImageContainer}>
              <img
                src={quiz.image}
                alt={`Image for ${quiz.name}`}
                className={styles.quizImage}
              />
            </div>
            <h4 className={styles.quizSubtitle}>{quiz.genre}</h4>
            <h3 className={styles.quizTitle}>{quiz.name}</h3>
            <p className={styles.quizCreatorText}>
              Quiz by {quiz.creator.username}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
