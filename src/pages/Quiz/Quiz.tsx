import React from "react";
import quizData from "../../database/stubQuiz";

export default function Quiz() {
  // WE WILL NEED TO IMPLEMENT AN ACTUAL QUIZ FETCHING SYSTEM
  const [thisQuiz, setThisQuiz] = React.useState(
    quizData[Number(window.location.pathname.split("/")[2]) - 1]
  );

  return (
    <div>
      <h1>Quiz of {thisQuiz.name}</h1>
      <h2>{thisQuiz.genre}</h2>
      Not implemented yet, just press back button to go back
      {/* <h3>{thisQuiz.creator.username}</h3> */}
      {/* <img src={thisQuiz.image} alt={`Image for ${thisQuiz.name}`} /> */}
    </div>
  );
}
