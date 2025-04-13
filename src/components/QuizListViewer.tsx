import { useEffect, useRef, useState } from "react";
import { databases, dbId, Quiz, QuizHistory } from "../util/appwrite";
import QuizCard from "./QuizCard";
import styles from "./QuizListViewer.module.css";
import SectionLabel from "./SectionLabel";
import SkeletonQuizCard from "./SkeletonQuizCard";

export default function QuizListViewer({
  title,
  query,
  quizAndQuizHistoryPairs,
}: {
  title: string;
  query?: string[];
  quizAndQuizHistoryPairs?: { quiz: Quiz; quizHistory: QuizHistory }[];
}) {
  const [itemsToShow, setItemsToShow] = useState(0);
  const [filteredData, setFilteredData] = useState<Quiz[] | null>(null);
  const gridRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query || quizAndQuizHistoryPairs) {
      return;
    }
    const fetchQuiz = async () => {
      try {
        const quizzes = await databases.listDocuments(dbId, "quizzes", query);
        setFilteredData(quizzes.documents as Quiz[]);
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
      }
    };

    fetchQuiz();
  }, [query, quizAndQuizHistoryPairs]);

  useEffect(() => {
    const handleResize = () => {
      if (!gridRootRef.current) return;
      if (gridRootRef.current.clientWidth > 1100) {
        setItemsToShow(4);
      } else if (gridRootRef.current.clientWidth > 750) {
        setItemsToShow(3);
      } else if (gridRootRef.current.clientWidth > 480) {
        setItemsToShow(2);
      } else {
        setItemsToShow(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div ref={gridRootRef} className={styles.quizListViewer}>
      <SectionLabel title={title} disabledPrev disabledNext />
      <div
        className={styles.quizGrid}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${itemsToShow}, 1fr)`,
          gap: "8px",
        }}
      >
        {quizAndQuizHistoryPairs && quizAndQuizHistoryPairs.length > 0
          ? quizAndQuizHistoryPairs.map(({ quiz, quizHistory }) => (
              <QuizCard
                key={quizHistory.$id}
                quiz={quiz}
                quizHistory={quizHistory}
              />
            ))
          : filteredData && filteredData.length > 0
          ? filteredData.map((quiz) => <QuizCard key={quiz.$id} quiz={quiz} />)
          : Array.from({ length: itemsToShow }, (_, index) => (
              <SkeletonQuizCard key={index} />
            ))}
      </div>
    </div>
  );
}
