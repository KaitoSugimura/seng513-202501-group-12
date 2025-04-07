import React from "react";
import styles from "./SectionLabel.module.css";

export default function SectionLabel({
  title,
  onClickPrev,
  onClickNext,
  disabledPrev,
  disabledNext,
}: {
  title: string;
  onClickPrev?: () => void;
  onClickNext?: () => void;
  disabledPrev: boolean;
  disabledNext: boolean;
}) {
  return (
    <div className={styles.sectionLabelContainer}>
      <h2 className={styles.sectionLabelTitle}>{title}</h2>
      {onClickPrev && onClickNext && (
        <div className={styles.sectionLabelButtonsContainer}>
          <button onClick={onClickPrev} disabled={disabledPrev}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              fill="#FFFFFF"
            >
              <path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z" />
            </svg>
          </button>
          <button onClick={onClickNext} disabled={disabledNext}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              fill="#FFFFFF"
            >
              <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
