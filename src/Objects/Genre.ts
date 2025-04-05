class Genre {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public image: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
  }
}

export default Genre;
