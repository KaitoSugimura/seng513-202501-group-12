import { ID } from "appwrite";
import { NavLink } from "react-router-dom";
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
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import { useMediaQuery } from "@mui/material";
export type Question = {
  imageFile: File | null;
  answers: string[];
  correctAnswer: number;
  imageError: boolean;
  answerErrors: boolean[];
};

export default function Create() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [quizName, setQuizName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [quizTheme, setQuizTheme] = useState("Any");
  const [quizType, setQuizType] = useState("blur");
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
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
      setThumbnailImage(inputImage);
      return;
    }
    questionsHaveError();
    const questionToAdd: Question = {
      imageFile: inputImage,
      answers: answers,
      correctAnswer: correctAnswer,
      imageError: questions[currentIndex].imageError,
      answerErrors: questions[currentIndex].answerErrors,
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
      setThumbnailImage(inputImage);
      const questionToAdd: Question = {
        imageFile: null,
        answers: answers,
        correctAnswer: correctAnswer,
        imageError: false,
        answerErrors: new Array(answers.length).fill(false),
      };
      setQuestions((prevQuestions) => {
        const newQuestions = [...prevQuestions];
        newQuestions.splice(currentIndex + 1, 0, questionToAdd);
        setCurrentIndex(currentIndex + 1);
        return newQuestions;
      });
    } else {
      questionsHaveError();
      const questionToAdd: Question = {
        imageFile: null,
        answers: new Array(4).fill(""),
        correctAnswer: 0,
        imageError: false,
        answerErrors: new Array(answers.length).fill(false),
      };

      setQuestions((prevQuestions) => {
        const newQuestions = [...prevQuestions];
        newQuestions.splice(currentIndex + 1, 0, questionToAdd);
        setCurrentIndex(currentIndex + 1);
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
      setInputImage(thumbnailImage);
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
        setInputImage(thumbnailImage);
      } else {
      }
      return newQuestions;
    });
  };

  const navigateToPreview = () => {
    saveQuestions();
    setInputImage(thumbnailImage);
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
        setInputImage(thumbnailImage);
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

  const questionsHaveError = (): boolean => {
    let hasError = false;

    const updatedQuestions = questions.map((question) => {
      let imageError = false;
      let answerErrors = new Array<boolean>(answers.length).fill(false);

      const missingImage = question.imageFile === null;

      if (missingImage) {
        imageError = true;
      }

      for (let i = 0; i < question.answers.length; i++) {
        if (question.answers[i] === "") {
          answerErrors[i] = true;
        }
      }
      if (answerErrors.some(Boolean)) {
        hasError = true;
      }

      return {
        ...question,
        imageError,
        answerErrors,
      };
    });

    setQuestions(updatedQuestions);
    return hasError;
  };

  const createQuiz = async () => {
    let error = false;
    if (quizName === "") {
      setNameError(true);
      error = true;
    }
    if (questionsHaveError()) {
      error = true;
    }
    if (error) {
      return;
    }
    if (!thumbnailImage) {
      throw new Error("Preview image is not set");
    }

    if (questions.some((question) => question.imageFile === null)) {
      throw new Error("Some questions do not have an image");
    }

    // Upload preview image
    const previewImageFile = await storage.createFile(
      "images",
      ID.unique(),
      thumbnailImage
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

    navigate("/account");
  };

  return (
    <div className={styles.container}>
      {!user && (
        <div className={styles.unregisteredContainer}>
          <h3 className={styles.unregisteredUserMessage}>
            Only registered users can create quizzes.
          </h3>

          <NavLink to="/account">
            <button className={styles.navigateElsewhereButton}>
              Sign In Now To Create a Quiz!
            </button>
          </NavLink>
        </div>
      )}
      {user && (
        <>
          <div className={styles.questionList}>
            <ol
              className={clsx(
                styles.listEntryImage,
                currentIndex === -1 && styles.selectedListEntry
              )}
              onClick={navigateToPreview}
            >
              <div className={styles.listEntryImageSizing}>
                <div className={styles.thumbnailOverlay}>
                  <h3>Thumbnail</h3>
                </div>
                {thumbnailImage ? (
                  <img src={URL.createObjectURL(thumbnailImage)} alt="" />
                ) : (
                  <img className={styles.noImage} src="/NoImage.svg" alt="" />
                )}{" "}
              </div>
            </ol>

            {questions.map((question, index) => (
              <ol
                className={clsx(
                  styles.listEntryImage,
                  currentIndex === index && styles.selectedListEntry,
                  (questions[index].imageError ||
                    questions[index].answerErrors.some(Boolean)) &&
                    styles.errorInput
                )}
                key={index}
                onClick={(event) => {
                  event.stopPropagation();
                  setCurrentIndex(index);
                }}
              >
                <div className={styles.listEntryImageSizing}>
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
                  {question.imageFile ? (
                    <img src={URL.createObjectURL(question.imageFile)} alt="" />
                  ) : (
                    <img className={styles.noImage} src="/NoImage.svg" alt="" />
                  )}{" "}
                </div>
              </ol>
            ))}
            <ol className={styles.listEntryImage}>
              <button
                className={styles.addQuestionButton}
                onClick={addQuestion}
              >
                <Plus />
                Add Question
              </button>
            </ol>
          </div>
          <div className={styles.quizDetails}>
            <div className={styles.topContainer}>
              <InputField
                type="text"
                label="Quiz Name"
                placeholder={"Quiz name"}
                value={quizName}
                onChange={(e) => {
                  setQuizName(e.target.value);
                  setNameError(false);
                }}
                error={nameError ? "Please Enter a Name" : ""}
                className={styles.inputField}
              />
            </div>
            <div className={styles.selectFields}>
              <SelectField
                id="quizTheme"
                label="Quiz Theme"
                value={quizTheme}
                onChange={(e) => setQuizTheme(e.target.value)}
                categories={categories}
                className={styles.selectField}
              />
              <SelectField
                id="quizType"
                label="Quiz Type"
                value={quizType}
                onChange={(e) => setQuizType(e.target.value)}
                categories={["blur", "zoom"]}
                className={styles.selectField}
              />
            </div>
            <div className={styles.imageContainer}>
              <div className={styles.questionButtonContainer}>
                <button
                  className={styles.questionButtons}
                  onClick={onBack}
                  disabled={currentIndex === -1}
                >
                  <ArrowLeft />
                </button>
              </div>
              <div className={styles.imageUploadContainer}>
                <ImageUpload
                  file={inputImage}
                  setFile={setInputImage}
                  text={
                    currentIndex === -1
                      ? "Click to browse or drag and drop thumbnail"
                      : "Click to browse or drag and drop question image"
                  }
                ></ImageUpload>
              </div>

              <div className={styles.questionButtonContainer}>
                <button
                  className={styles.questionButtons}
                  onClick={onNext}
                  disabled={
                    questions.length === 0 ||
                    currentIndex >= questions.length - 1
                  }
                >
                  <ArrowRight />
                </button>
              </div>
            </div>{" "}
            {currentIndex >= 0 && (
              <div className={styles.answersContainer}>
                {answers.map((answer, index) => (
                  <div>
                    <div key={index} className={styles.inputWrapper}>
                      <input
                        type="text"
                        placeholder="answer"
                        value={answer}
                        onChange={(e) => setAnswer(index, e.target.value)}
                        className={clsx(
                          styles.answerInput,
                          questions[currentIndex].answerErrors[index] &&
                            styles.errorInput
                        )}
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
                    <label
                      className={clsx(
                        styles.quizDetailsInput,
                        questions[currentIndex].answerErrors[index] &&
                          styles.errorLabel
                      )}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          visibility: questions[currentIndex].answerErrors[
                            index
                          ]
                            ? "visible"
                            : "hidden",
                        }}
                      >
                        <TriangleAlert />
                        Enter an Answer
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            )}
            <div className={styles.createButtonContainer}>
              <button className={styles.createButton} onClick={createQuiz}>
                Create Quiz!
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
