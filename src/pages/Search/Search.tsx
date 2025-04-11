import { Query } from "appwrite";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import InputField from "../../components/InputField";
import QuizListViewer from "../../components/QuizListViewer";
import SelectField from "../../components/SelectField";
import { categories } from "../../util/appwrite";
import styles from "./Search.module.css";

const checkCategory = (category: string | null) => {
  if (!category) return "";
  if (categories.some((c) => c === category)) {
    return category;
  }
  return "";
};

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("title") || ""
  );
  const [searchKey, setSearchKey] = useState(0);

  const [searchCategoryValue, setSearchCategoryValue] = useState(
    checkCategory(searchParams.get("theme"))
  );

  const handleSearch = () => {
    setSearchKey((prevKey) => prevKey + 1);
    setSearchParams({
      title: searchValue,
      theme: searchCategoryValue,
    });
  };

  const searchQuery = [Query.contains("title", [searchValue])];

  if (searchCategoryValue) {
    searchQuery.push(Query.equal("theme", searchCategoryValue));
  }

  return (
    <div className={styles.searchPanelRoot}>
      <div className={styles.searchPanel}>
        <SelectField
          value={searchCategoryValue}
          onChange={(event) => {
            setSearchCategoryValue(checkCategory(event.target.value));
          }}
          placeholder="Any"
          label="Category"
          categories={categories}
        />
        <InputField
          value={searchValue}
          onChange={(event) => {
            setSearchValue(event.target.value);
          }}
          placeholder="Search by title"
          label="Title"
        />
        <div className={styles.searchPanelButtons}>
          <button
            onClick={() => {
              handleSearch();
            }}
            className={styles.searchButton}
          >
            Search
          </button>
          <button
            onClick={() => {
              setSearchCategoryValue("");
              setSearchValue("");
            }}
            className={styles.resetButton}
          >
            Reset
          </button>
        </div>
      </div>
      <QuizListViewer
        key={searchKey}
        title="Search Results"
        query={searchQuery}
      />
    </div>
  );
}
