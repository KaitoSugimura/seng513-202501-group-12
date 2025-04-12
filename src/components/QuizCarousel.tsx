import { useEffect, useState } from "react";
import { databases, dbId, Quiz } from "../util/appwrite";
import Carousel from "./Carousel";
import QuizCard from "./QuizCard";
import styles from "./QuizCarousel.module.css";

export default function QuizCarousel({
  title,
  query,
}: {
  title: string;
  query?: string[];
}) {
  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizzes = await databases.listDocuments(dbId, "quizzes", query);
        setQuizzes(quizzes.documents as Quiz[]);
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
      }
    };

    fetchQuiz();
  }, [query]);

  return (
    <Carousel title={title}>
      {quizzes?.map((quiz) => (
        <div key={`${quiz.$id}`} className={styles.emblaSlide}>
          <QuizCard quiz={quiz} />
        </div>
      ))}
    </Carousel>
  );
}
