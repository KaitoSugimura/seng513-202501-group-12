import { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import { databases, dbId, Quiz } from "../util/appwrite";
import QuizCard from "./QuizCard";
import styles from "./QuizCarousel.module.css";
import SectionLabel from "./SectionLabel";
import SkeletonQuizCard from "./SkeletonQuizCard";

export default function QuizCarousel({
  title,
  query,
}: {
  title: string;
  query?: string[];
}) {
  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [disabledPrev, setDisabledPrev] = useState(true);
  const [disabledNext, setDisabledNext] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    active: !!quizzes,
    align: "start",
    slidesToScroll: "auto",
    duration: 20,
  });

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizzes = await databases.listDocuments(dbId, "quizzes", query);
        setQuizzes(quizzes.documents as Quiz[]);
        emblaApi?.reInit();
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
      }
    };

    fetchQuiz();
  }, [query, emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const onSelect = (emblaApi: EmblaCarouselType) => {
      setDisabledPrev(!emblaApi.canScrollPrev());
      setDisabledNext(!emblaApi.canScrollNext());
    };

    emblaApi.on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi]);

  return (
    <div className={styles.quizCarousel}>
      <SectionLabel
        title={title}
        onClickNext={() => emblaApi?.scrollNext()}
        onClickPrev={() => emblaApi?.scrollPrev()}
        disabledPrev={!quizzes || disabledPrev}
        disabledNext={!quizzes || disabledNext}
      />
      <div className={styles.carouselWrapper}>
        <div className={styles.embla} ref={emblaRef}>
          <div className={styles.emblaContainer}>
            {quizzes
              ? quizzes.map((quiz) => (
                  <div key={`${quiz.$id}`} className={styles.emblaSlide}>
                    <QuizCard quiz={quiz} />
                  </div>
                ))
              : Array.from({ length: 4 }, (_, index) => (
                  <div key={index} className={styles.emblaSlide}>
                    <SkeletonQuizCard key={index} />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
