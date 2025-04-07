import { Account, Client, Databases, Storage, type Models } from "appwrite";

const projectId = "67ed793100349d84e285";

const client = new Client();
client.setProject(projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const dbId = "67ed7f5e001576945780";

export const categories = [
  "General Knowledge",
  "Books",
  "Film",
  "Music",
  "Musicals & Theatres",
  "Television",
  "Video Games",
  "Board Games",
  "Science & Nature",
  "Computers",
  "Mathematics",
  "Mythology",
  "Sports",
  "Geography",
  "History",
  "Politics",
  "Art",
  "Celebrities",
  "Animals",
  "Vehicles",
  "Comics",
  "Gadgets",
  "Japanese Anime & Manga",
  "Cartoon & Animations",
] as const;
export type Category = (typeof categories)[number];

export type QuizType = "blur" | "zoom";

export interface User extends Models.Document {
  username: string;
  points: number;
  favoritedQuizzes: Quiz[];
}

export interface Quiz extends Models.Document {
  title: string;
  theme: string;
  type: QuizType;
  previewUrl: string;
  creatorId: string;
  creatorUsername: string;
  favoritedCount: number;
}

export interface Question extends Models.Document {
  imageUrl: string;
  options: string[];
  answerIndex: number;
}

export function getImgUrl(id: string) {
  return `https://cloud.appwrite.io/v1/storage/buckets/images/files/${id}/view?project=${projectId}`;
}
