import React, { useState } from "react";
import styles from "./Search.module.css";
import SearchBar from "../../components/SearchBar";
import QuizListViewer from "../../components/QuizListViewer";
import { Query } from "appwrite";
import { useSearchParams } from "react-router-dom";
import { categories } from "../../util/appwrite";

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
    <div>
      <select
        className={styles.categorySelect}
        value={searchCategoryValue}
        onChange={(event) => {
          setSearchCategoryValue(checkCategory(event.target.value));
        }}
      >
        <option value="">Any</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <SearchBar
        value={searchValue}
        onChange={(event) => {
          setSearchValue(event.target.value);
        }}
      />
      <button
        onClick={() => {
          handleSearch();
        }}
      >
        Search
      </button>
      <QuizListViewer
        key={searchKey}
        title="Search Results"
        query={searchQuery}
        limitLessView={true}
      />
    </div>
  );
}
