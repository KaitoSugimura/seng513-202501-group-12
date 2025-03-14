import Question from "./Question";
import User from "./User";

class Quiz {
  constructor(
    public id: number,
    public name: string,
    public genre: string,
    public questions: Question[],
    public image: string,
    public creator: User
  ) {
    this.id = id;
    this.name = name;
    this.genre = genre;
    this.questions = [];
    this.image = image;
    this.creator = creator;
  }
}

export default Quiz;
