import { useState } from "react";
import styles from "./Create.module.css";
import ImageUpload from "../../components/ImageUpload";

export default function Create() {
  const [quizName, setQuizName] = useState("");
  const [quizTheme, setQuizTheme] = useState("");
  const [quizType, setQuizType] = useState("");
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  return (
    <div className={styles.quizDetails}>
      <div className={styles.topContainer}>
        <h1>Create New Quiz!</h1>
        <button>Create Quiz!</button>
      </div>
      <input
        type="text"
        placeholder={"Quiz name"}
        value={quizName}
        onChange={(e) => setQuizName(e.target.value)}
      />
      <input
        type="text"
        placeholder={"Quiz Theme"}
        value={quizTheme}
        onChange={(e) => setQuizTheme(e.target.value)}
      />
      <select
        id="quizType"
        value={quizType}
        onChange={(e) => setQuizType(e.target.value)}
      >
        <option value="">Quiz type</option>
        <option value="blur">image blur</option>
        <option value="zoom">image zoom</option>
      </select>
      <ImageUpload file={previewImage} setFile={setPreviewImage}></ImageUpload>
    </div>
  );
}
