import styles from "./QuizCard.module.css";

export default function SkeletonQuizCard() {
  return (
    <div className={styles.quizContainer}>
      <div className={styles.quizImageContainer}>
        <div className={`${styles.quizImage} Loading`}></div>
      </div>
      <h3 className={styles.quizTitle}>
        <div className={`${styles.quizTitleStub} Loading`}></div>
      </h3>
      <p className={styles.quizCreatorText}>
        <span className={`${styles.quizCreatorTextStub} Loading`}></span>
      </p>
    </div>
  );
}
