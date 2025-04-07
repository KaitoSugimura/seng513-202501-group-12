import { useEffect, useRef, useState } from "react";
import SectionLabel from "./SectionLabel";
import { databases, dbId, Quiz } from "../util/appwrite";
import SkeletonQuizCard from "./SkeletonQuizCard";
import QuizCard from "./QuizCard";
import styles from "./QuizListViewer.module.css";

export default function QuizListViewer({
  title,
  query,
  limitLessView = false,
}: {
  title: string;
  query?: string[];
  limitLessView?: boolean;
}) {
  const [listIndex, setListIndex] = useState(0);
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
  }, []);

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

  const currentViewingItems = limitLessView
    ? filteredData
    : filteredData?.slice(listIndex * 5, listIndex * 5 + itemsToShow);

  return (
    <div ref={gridRootRef}>
      <SectionLabel
        title={title}
        onClickNext={
          limitLessView
            ? undefined
            : () => {
                setListIndex((prevIndex) => {
                  if (filteredData === null) return prevIndex;
                  return Math.min(
                    prevIndex + 1,
                    Math.floor((filteredData.length - 1) / itemsToShow)
                  );
                });
              }
        }
        onClickPrev={
          limitLessView
            ? undefined
            : () => {
                setListIndex((prevIndex) => Math.max(prevIndex - 1, 0));
              }
        }
      />
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
