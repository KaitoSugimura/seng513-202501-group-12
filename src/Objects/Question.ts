class Question {
  public image?: string | null;
  constructor(
    public id: number,
    public question: string,
    public answers: string[],
    public correctAnswer: string,
    image?: string
  ) {
    this.id = id;
    this.question = question;
    this.image = image || null;
    this.answers = answers;
    this.correctAnswer = correctAnswer;
  }
}

export default Question;
