class User {
  constructor(
    public id: number,
    public username: string,
    public email: string,
    public ranking: number,
    public image: string,
    public points: number,
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.image = image || "/guest.png";
    this.ranking = ranking;
    this.points = points;
  }
}

export default User;
