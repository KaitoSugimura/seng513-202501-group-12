import { useState, useRef, useEffect } from "react";
import styles from "./Create.module.css";
import { Plus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import ImageUpload from "../../components/ImageUpload";

export type Question = {
  imageFile: File | null;
  answers: string[];
  correctAnswer: number;
};

export default function Create() {
  const [quizName, setQuizName] = useState("");
  const [quizTheme, setQuizTheme] = useState("");
  const [quizType, setQuizType] = useState("");
  const previewImage = useRef<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [inputImage, setInputImage] = useState<File | null>(null);
  const [answers, setAnswers] = useState<string[]>(new Array(4).fill(""));
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const saveQuestions = () => {
    if (currentIndex === -1) {
      console.log("saving preview image");
      previewImage.current = inputImage;
      return;
    }
    let questionToAdd: Question = {
      imageFile: inputImage,
      answers: answers,
      correctAnswer: correctAnswer,
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
      setCurrentIndex(questions.length);
    } else {
      let questionToAdd: Question = {
        imageFile: inputImage,
        answers: answers,
        correctAnswer: correctAnswer,
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
    resetInputData();
  };

  const resetInputData = () => {
    setInputImage(null);
    setAnswers(new Array(4).fill(""));
    setCorrectAnswer(0);
  };

  const onBack = () => {
    console.log(questions);
    const newIndex = currentIndex - 1;
    saveQuestions();
    if (newIndex == -1) {
      setInputImage(previewImage.current);
    } else {
      console.log("trying to acccess index " + newIndex);
      navigateToQuestion(newIndex);
    }
    setCurrentIndex(newIndex);
  };

  const onNext = () => {
    console.log(questions);
    saveQuestions();
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      navigateToQuestion(newIndex);
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
        navigateToQuestion(newIndex);
      }
      return newQuestions;
    });
  };

  const navigateToQuestion = (index: number) => {
    console.log("trying to navigate!");
    saveQuestions();
    const questionToSet = questions[index];
    setInputImage(questionToSet.imageFile);
    setAnswers(questionToSet.answers);
    setCurrentIndex(index);
  };

  const navigateToPreview = () => {
    saveQuestions();
    setInputImage(previewImage.current);
    setCurrentIndex(-1);
  };

  const deleteIndex = (index: number) => {
    setQuestions((prevQuestions) => {
      console.log("Filtering index " + index);
      const newQuestions = prevQuestions.filter(
        (_, indexToCheck) => indexToCheck !== index
      );
      let newIndex = currentIndex;
      if (index === currentIndex) {
        newIndex = currentIndex - 1;
      } else if (index === questions.length - 1) {
        newIndex = questions.length - 1;
      } else if (index < currentIndex) {
        newIndex = currentIndex - 1;
      }

      setCurrentIndex(newIndex);

      if (newIndex == -1) {
        setInputImage(previewImage.current);
      } else {
        navigateToQuestion(newIndex);
      }

      return newQuestions;
    });
  };

  const setAnswer = (index: number, answer: string) => {
    setAnswers((prevAnswers) => {
      let newAnswers = [...prevAnswers];
      newAnswers[index] = answer;
      return newAnswers;
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.questionList}>
        <ol className={styles.listEntryImage} onClick={navigateToPreview}>
          <div className={styles.overlay}>
            <h2></h2>
          </div>
          {previewImage.current && (
            <img src={URL.createObjectURL(previewImage.current)} alt="" />
          )}
        </ol>
        {questions.map((question, index) => (
          <ol
            className={styles.listEntryImage}
            key={index}
            onClick={(event) => {
              event.stopPropagation();
              navigateToQuestion(index);
            }}
          >
            <div className={styles.overlay}>
              <h2>{index}</h2>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  deleteIndex(index);
                }}
              >
                <Trash2 />
              </button>
            </div>
            <img
              src={
                question.imageFile
                  ? URL.createObjectURL(question.imageFile)
                  : "/NoImage.png"
              }
              alt=""
            />
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
        {currentIndex >= 0 && (
          <div className={styles.answersContainer}>
            {answers.map((answer, index) => (
              <input
                key={index}
                type="text"
                placeholder={"answer"}
                value={answer}
                onChange={(e) => setAnswer(index, e.target.value)}
              ></input>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
