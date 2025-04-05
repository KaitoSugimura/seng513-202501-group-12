import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import quizData from "../../database/stubQuiz";
import genreData from "../../database/stubGenre";
import styles from "./Home.module.css";
import SearchBar from "../../components/SearchBar";
import { useState } from "react";
import QuizCard from "../../components/QuizCard";
import GenreCard from "../../components/GenreCard";

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
          <QuizCard key={`${quiz.id}`} quiz={quiz} />
        ))}
      </div>
      <div className={styles.genreSection}>
        {genreData.map((genre) => (
          <GenreCard key={`${genre.id}`} genre={genre} />
        ))}
      </div>
    </div>
  );
}
