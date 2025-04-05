import React from "react";
import Genre from "../Objects/Genre";

export default function GenreCard({
  key,
  genre,
}: {
  key: string;
  genre: Genre;
}) {
  return (
    <div key={key}>
      <div className="genreCardContainer">
        <img
          src={genre.image}
          alt={`Image for ${genre.name}`}
          className="genreCardImage"
        />
      </div>
      <h4 className="genreCardTitle">{genre.name}</h4>
    </div>
  );
}
