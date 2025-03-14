class User {
  constructor(
    public id: number,
    public username: string,
    public email: string,
    public image: string,
    public ranking: number
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.image = image;
    this.ranking = ranking;
  }
}

export default User;
