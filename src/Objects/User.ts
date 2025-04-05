class User {
  constructor(
    public id: number,
    public username: string,
    public email: string,
    public ranking: number,
    public image: string
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.image = image || "/guest.png";
    this.ranking = ranking;
  }
}

export default User;
