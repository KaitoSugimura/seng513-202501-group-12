import { ID } from "appwrite";
import clsx from "clsx";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../../components/ImageUpload";
import { useAuth } from "../../context/AuthContext";
import {
  categories,
  databases,
  dbId,
  getImgUrl as getFileUrl,
  storage,
} from "../../util/appwrite";
import styles from "./Create.module.css";

export type Question = {
  imageFile: File | null;
  answers: string[];
  correctAnswer: number;
};

export default function Create() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [quizName, setQuizName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [quizTheme, setQuizTheme] = useState("");
  const [quizType, setQuizType] = useState("");
  const previewImage = useRef<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [inputImage, setInputImage] = useState<File | null>(null);
  const [answers, setAnswers] = useState<string[]>(new Array(4).fill(""));
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    saveQuestions();
  }, [inputImage, answers, correctAnswer]);

  useEffect(() => {
    if (currentIndex === -1 || questions[currentIndex] === undefined) {
      return;
    }
    console.log("trying to navigate!");
    const questionToSet = questions[currentIndex];
    setInputImage(questionToSet.imageFile);
    setAnswers(questionToSet.answers);
    setCorrectAnswer(questionToSet.correctAnswer);
    setCurrentIndex(currentIndex);
  }, [currentIndex]);

  const saveQuestions = () => {
    if (currentIndex === -1) {
      console.log("saving preview image");
      previewImage.current = inputImage;
      return;
    }
    const questionToAdd: Question = {
      imageFile: inputImage,
      answers: answers,
      correctAnswer: correctAnswer,
    };
    console.log(
      "saving the question" + questionToAdd + " at index " + currentIndex
    );
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
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
      const questionToAdd: Question = {
        imageFile: inputImage,
        answers: answers,
        correctAnswer: correctAnswer,
      };
      console.log(
        "saving the question" + questionToAdd + " at index " + currentIndex
      );
      setQuestions((prevQuestions) => {
        const newQuestions = [...prevQuestions];
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
    }
    setCurrentIndex(newIndex);
  };

  const onNext = () => {
    console.log(questions);
    saveQuestions();
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
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
      }
      return newQuestions;
    });
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
      } else if (index < currentIndex) {
        newIndex = currentIndex - 1;
      }

      setCurrentIndex(newIndex);

      if (newIndex == -1) {
        setInputImage(previewImage.current);
      } else {
      }

      return newQuestions;
    });
  };

  const setAnswer = (index: number, answer: string) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[index] = answer;
      return newAnswers;
    });
  };

  const createQuiz = async () => {
    if (quizName === "") {
      setNameError(true);
      return;
    }
    if (!previewImage.current) {
      throw new Error("Preview image is not set");
    }

    if (questions.some((question) => question.imageFile === null)) {
      throw new Error("Some questions do not have an image");
    }

    // Upload preview image
    const previewImageFile = await storage.createFile(
      "images",
      ID.unique(),
      previewImage.current
    );

    console.log(user);

    // Create quiz
    const quiz = await databases.createDocument(dbId, "quizzes", ID.unique(), {
      title: quizName,
      theme: quizTheme,
      type: quizType,
      previewUrl: getFileUrl(previewImageFile.$id),
      creatorId: user?.$id,
      creatorUsername: user?.username,
    });
    console.log("yo");

    // Create questions
    await Promise.all(
      questions.map(async (question) => {
        const uploadedFile = await storage.createFile(
          "images",
          ID.unique(),
          question.imageFile!
        );

        await databases.createDocument(dbId, "questions", ID.unique(), {
          imageUrl: getFileUrl(uploadedFile.$id),
          options: question.answers,
          answerIndex: question.correctAnswer,
          quizId: quiz.$id,
        });
      })
    );

    navigate("/library");
  };

  return (
    <div className={styles.container}>
      <div className={styles.questionList}>
        <ol
          className={clsx(
            styles.listEntryImage,
            currentIndex === -1 && styles.selectedListEntry
          )}
          onClick={navigateToPreview}
        >
          <div className={styles.overlay}></div>
          <img
            src={
              previewImage.current
                ? URL.createObjectURL(previewImage.current)
                : "/NoImage.png"
            }
            alt=""
          />
        </ol>
        {questions.map((question, index) => (
          <ol
            className={clsx(
              styles.listEntryImage,
              currentIndex === index && styles.selectedListEntry
            )}
            key={index}
            onClick={(event) => {
              event.stopPropagation();
              setCurrentIndex(index);
            }}
          >
            <div className={styles.overlay}>
              <h2>{index + 1}</h2>
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
          <button onClick={createQuiz}>Create Quiz!</button>
        </div>
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder={"Quiz name"}
            value={quizName}
            onChange={(e) => {
              setQuizName(e.target.value);
              setNameError(false);
            }}
            className={clsx(
              !nameError ? styles.quizDetailsInput : styles.errorInput
            )}
          />
          <label
            className={clsx(
              !nameError ? styles.quizDetailsInput : styles.errorLabel
            )}
          >
            {nameError && (
              <>
                <TriangleAlert />
                &nbsp;Please Enter a Name
              </>
            )}
          </label>
        </div>
        <select
          id="quizTheme"
          value={quizTheme}
          onChange={(e) => setQuizTheme(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
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
          <ImageUpload
            file={inputImage}
            setFile={setInputImage}
            text={
              currentIndex === -1
                ? "Upload or drag and drop thumbnail"
                : "Upload or drag and drop question image"
            }
          ></ImageUpload>
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
              <div key={index} className={styles.inputWrapper}>
                <input
                  type="text"
                  placeholder="answer"
                  value={answer}
                  onChange={(e) => setAnswer(index, e.target.value)}
                />
                <div
                  className={clsx(
                    styles.check,
                    index === correctAnswer
                      ? styles.correctCheck
                      : styles.incorrectCheck
                  )}
                  onClick={() => setCorrectAnswer(index)}
                >
                  <Check />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
