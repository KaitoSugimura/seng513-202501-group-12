import { useNavigate } from "react-router-dom";
import quizData from "../../database/stubQuiz";
import styles from "./Home.module.css";
import SearchBar from "../../components/SearchBar";
import { useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState(quizData);

  return (
    <div className={styles.homeRoot}>
      <div className={styles.topContainer}>
        <h1 className={styles.header}>Featured Quizzes</h1>
        <SearchBar
          value={searchValue}
          onChange={(event) => {
            setSearchValue(event.target.value);
            setFilteredData(
              quizData.filter((quiz) =>
                quiz.name
                  .toLowerCase()
                  .includes(event.target.value.toLowerCase())
              )
            );
          }}
        />
      </div>
      <div className={styles.quizGrid}>
        {filteredData.map((quiz) => (
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
