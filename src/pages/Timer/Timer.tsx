import { useEffect, useState } from "react";
import styles from "./Timer.module.css";

export default function Timer({
  startTime,
  roundTime,
  gameStarted,
  onEndOfTime,
  currentRound,
  totalRounds,
}: {
  startTime: number;
  roundTime: number;
  gameStarted: boolean;
  onEndOfTime: () => void;
  currentRound: number;
  totalRounds: number;
}) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  useEffect(() => {
    if (!gameStarted) {
      setTimeLeft(roundTime);
      return;
    } else if (startTime === 0) {
      setTimeLeft(0);
      return;
    } else {
      const interval = setInterval(() => {
        const timeElapsed = Number((Date.now() - startTime) / 1000);
        const _timeLeft = roundTime - timeElapsed;
        if (_timeLeft <= 0) {
          console.log("AUGHHHHHHHHHHHHHHHHH!");
          onEndOfTime();
          clearInterval(interval);
          setTimeLeft(0);
        } else {
          setTimeLeft(_timeLeft);
        }
      }, 100);
      return () => {
        clearInterval(interval);
      };
    }
  }, [startTime, onEndOfTime]);
  return (
    <div className={styles.timerRoot}>
      <p className={styles.roundText}>{`Question ${Math.min(
        currentRound,
        totalRounds
      )} of ${totalRounds}`}</p>
      <div
        className={styles.pieTime}
        style={{
          background: `conic-gradient(#00000000 ${Math.round(
            100 - (timeLeft / roundTime) * 100
          )}%, 0, white)`,
        }}
      ></div>
      <p className={styles.timeleftText}>{`Time Left: ${timeLeft.toFixed(
        1
      )}`}</p>
    </div>
  );
}
