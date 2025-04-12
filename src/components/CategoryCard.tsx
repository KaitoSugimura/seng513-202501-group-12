import {
  Book,
  Brain,
  Calculator,
  Car,
  Clapperboard,
  Dices,
  Drama,
  Gamepad2,
  Gavel,
  JapaneseYen,
  LibraryBig,
  LucideIcon,
  MapPinned,
  MessageCircle,
  Microscope,
  Music,
  Palette,
  PcCase,
  PocketKnife,
  Squirrel,
  Star,
  Tv,
  TvMinimal,
  Volleyball,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Category } from "../util/appwrite";
import styles from "./CategoryCard.module.css";

const categoryIcons: Record<Category, LucideIcon> = {
  "General Knowledge": Brain,
  Books: Book,
  Film: Clapperboard,
  Music: Music,
  "Musicals & Theatres": Drama,
  Television: TvMinimal,
  "Video Games": Gamepad2,
  "Board Games": Dices,
  "Science & Nature": Microscope,
  Computers: PcCase,
  Mathematics: Calculator,
  Mythology: Zap,
  Sports: Volleyball,
  Geography: MapPinned,
  History: LibraryBig,
  Politics: Gavel,
  Art: Palette,
  Celebrities: Star,
  Animals: Squirrel,
  Vehicles: Car,
  Comics: MessageCircle,
  Gadgets: PocketKnife,
  "Japanese Anime & Manga": JapaneseYen,
  "Cartoon & Animations": Tv,
};

export default function CategoryCard({ category }: { category: Category }) {
  const navigate = useNavigate();

  let combinedHex = "";
  category.split("").forEach((char, index) => {
    if (index > 5) return;
    combinedHex += ((char.charCodeAt(0) + index + 2) % 16).toString(16);
  });

  combinedHex = combinedHex.slice(-6).padStart(6, "3");

  const Icon = categoryIcons[category];

  return (
    <div
      className={styles.categoryCardContainer}
      onClick={() => {
        navigate(`/search?theme=${category}`);
      }}
    >
      <Icon size={48} color={`#${combinedHex}`} />
      <h3 className={styles.categoryCardTitle}>{category}</h3>
    </div>
  );
}
