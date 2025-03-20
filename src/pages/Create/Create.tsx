import { useState, useRef, useEffect } from "react";
import styles from "./Create.module.css";
import { Plus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import ImageUpload from "../../components/ImageUpload";

export type Question = {
  imageFile: File | null;
};

export default function Create() {
  const [quizName, setQuizName] = useState("");
  const [quizTheme, setQuizTheme] = useState("");
  const [quizType, setQuizType] = useState("");
  const previewImage = useRef<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [inputImage, setInputImage] = useState<File | null>(null);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const saveQuestions = () => {
    if (currentIndex === -1) {
      console.log("saving preview image");
      previewImage.current = inputImage;
      return;
    }
    let questionToAdd: Question = {
      imageFile: inputImage,
    };
    console.log(
      "saving the question" + questionToAdd + " at index " + currentIndex
    );
    setQuestions((prevQuestions) => {
      let newQuestions = [...prevQuestions];
      newQuestions[currentIndex] = questionToAdd;
      return newQuestions;
    });
  };

  const addQuestion = () => {
    saveQuestions();
    if (currentIndex == -1) {
      console.log("saving preview image");
      previewImage.current = inputImage;
      setCurrentIndex((prevCurrentIndex) => prevCurrentIndex + 1);
    } else {
      if (currentIndex === -1) {
        console.log("saving preview image");
        previewImage.current = inputImage;
        return;
      }
      let questionToAdd: Question = {
        imageFile: inputImage,
      };
      console.log(
        "saving the question" + questionToAdd + " at index " + currentIndex
      );
      setQuestions((prevQuestions) => {
        let newQuestions = [...prevQuestions];
        newQuestions[currentIndex] = questionToAdd;
        setCurrentIndex(newQuestions.length);
        return newQuestions;
      });
    }
    setInputImage(null);
  };

  const onBack = () => {
    console.log(questions);
    const newIndex = currentIndex - 1;
    saveQuestions();
    if (newIndex == -1) {
      setInputImage(previewImage.current);
    } else {
      console.log("trying to acccess index " + newIndex);
      setInputImage(questions[newIndex].imageFile);
    }
    setCurrentIndex(newIndex);
  };

  const onNext = () => {
    console.log(questions);
    saveQuestions();
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      setInputImage(questions[newIndex]?.imageFile || null);
      return newIndex;
    });
  };

  const onDelete = () => {
    setQuestions((prevQuestions) => {
      const newQuestions = prevQuestions.filter(
        (_, index) => index !== currentIndex
      );
      const newIndex = currentIndex - 1;
      setCurrentIndex(() => newIndex);
      if (newIndex == -1) {
        setInputImage(previewImage.current);
      } else {
        setInputImage(newQuestions[newIndex].imageFile);
      }
      return newQuestions;
    });
  };

  const navigateToQuestion = (index: number) => {
    saveQuestions();
    setInputImage(questions[index].imageFile);
    setCurrentIndex(index);
  };

  const navigateToPreview = () => {
    saveQuestions();
    setInputImage(previewImage.current);
    setCurrentIndex(-1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.questionList}>
        <ol className={styles.listEntryImage} onClick={navigateToPreview}>
          <h2 className={styles.overlayText}></h2>
          {previewImage.current && (
            <img src={URL.createObjectURL(previewImage.current)} alt="" />
          )}
        </ol>
        {questions.map((question, index) => (
          <ol
            className={styles.listEntryImage}
            key={index}
            onClick={() => navigateToQuestion(index)}
          >
            <h2 className={styles.overlayText}>{index}</h2>
            {question.imageFile && (
              <img src={URL.createObjectURL(question.imageFile)} alt="" />
            )}
          </ol>
        ))}
      </div>
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
        <select
          id="quizTheme"
          value={quizTheme}
          onChange={(e) => setQuizType(e.target.value)}
        >
          <option value="">Quiz Theme</option>
          <option value="blur">Need to add these still</option>
          <option value="zoom">Animals</option>
        </select>
        <select
          id="quizType"
          value={quizType}
          onChange={(e) => setQuizType(e.target.value)}
        >
          <option value="">Quiz type</option>
          <option value="blur">image blur</option>
          <option value="zoom">image zoom</option>
        </select>
        <h2>
          {currentIndex > -1
            ? `Question ${currentIndex} and ${questions.length}`
            : "Preview Image"}
        </h2>

        <div className={styles.imageContainer}>
          <div className={styles.questionButtonContainer}>
            {currentIndex > -1 && (
              <button className={styles.questionButtons} onClick={onDelete}>
                <Trash2 />
              </button>
            )}
            {currentIndex > -1 && (
              <button className={styles.questionButtons} onClick={onBack}>
                <ArrowLeft />
              </button>
            )}
          </div>
          <ImageUpload file={inputImage} setFile={setInputImage}></ImageUpload>
          <div className={styles.questionButtonContainer}>
            <button className={styles.questionButtons} onClick={addQuestion}>
              <Plus />
            </button>
            {questions.length > 0 && currentIndex < questions.length - 1 && (
              <button className={styles.questionButtons} onClick={onNext}>
                <ArrowRight />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
