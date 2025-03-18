import { useState } from "react";
import styles from "./Create.module.css";
import ImageUpload from "../../components/ImageUpload";

export default function Create() {
  const [quizType, setQuizType] = useState("");
  return (
    <div className={styles.quizDetails}>
      <h1>Create New Quiz!</h1>
      <input type="text" placeholder={"Quiz name"} />
      <input type="text" placeholder={"Quiz Theme"} />
      <select
        id="quizType"
        value={quizType}
        onChange={(e) => setQuizType(e.target.value)}
      >
        <option value="">Quiz type</option>
        <option value="blur">image blur</option>
        <option value="zoom">image zoom</option>
      </select>
      <ImageUpload></ImageUpload>
      <button>Create Quiz!</button>
    </div>
  );
}
