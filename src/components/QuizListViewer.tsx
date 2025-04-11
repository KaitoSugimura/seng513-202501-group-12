import { useEffect, useRef, useState } from "react";
import { databases, dbId, Quiz } from "../util/appwrite";
import QuizCard from "./QuizCard";
import styles from "./QuizListViewer.module.css";
import SectionLabel from "./SectionLabel";
import SkeletonQuizCard from "./SkeletonQuizCard";

export default function QuizListViewer({
  title,
  query,
}: {
  title: string;
  query?: string[];
}) {
  const [itemsToShow, setItemsToShow] = useState(0);
  const [filteredData, setFilteredData] = useState<Quiz[] | null>(null);
  const gridRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizzes = await databases.listDocuments(dbId, "quizzes", query);
        setFilteredData(quizzes.documents as Quiz[]);
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
      }
    };

    fetchQuiz();
  }, [query]);

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

  const currentViewingItems = filteredData;

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
        {currentViewingItems ? (
          currentViewingItems.map((quiz) => (
            <QuizCard key={`${quiz.$id}`} quiz={quiz} />
          ))
        ) : (
          <>
            {Array.from({ length: itemsToShow }, (_, index) => (
              <SkeletonQuizCard key={index} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
