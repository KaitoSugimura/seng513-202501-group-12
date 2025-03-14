class Question {
  constructor(
    public question: string,
    public image: string,
    public answers: string[],
    public correctAnswer: string
  ) {
    this.question = question;
    this.image = image;
    this.answers = answers;
    this.correctAnswer = correctAnswer;
  }
}

export default Question;
