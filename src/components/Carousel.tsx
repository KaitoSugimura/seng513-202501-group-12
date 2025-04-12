import { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { ReactNode, useEffect, useState } from "react";
import styles from "./Carousel.module.css";
import SectionLabel from "./SectionLabel";
import SkeletonQuizCard from "./SkeletonQuizCard";

export default function Carousel({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  const [disabledPrev, setDisabledPrev] = useState(true);
  const [disabledNext, setDisabledNext] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    active: !!children,
    align: "start",
    slidesToScroll: "auto",
    duration: 20,
  });

  useEffect(() => {
    emblaApi?.reInit();
  }, [emblaApi, children]);

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
        disabledPrev={!children || disabledPrev}
        disabledNext={!children || disabledNext}
      />
      <div className={styles.carouselWrapper}>
        <div className={styles.embla} ref={emblaRef}>
          <div className={styles.emblaContainer}>
            {children ??
              Array.from({ length: 4 }, (_, index) => (
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
