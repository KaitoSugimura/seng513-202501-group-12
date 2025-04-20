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
import { Link } from "react-router-dom";
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
  let combinedHex = "";
  category.split("").forEach((char, index) => {
    if (index > 5) return;
    combinedHex += (((char.charCodeAt(0) + index + 6) % 9) + 7).toString(16);
  });

  combinedHex = combinedHex.slice(-6).padStart(6, "3");

  const Icon = categoryIcons[category];

  return (
    <Link
      to={`/search?theme=${encodeURIComponent(category)}`}
      className={styles.categoryCardContainer}
    >
      <Icon size={48} color={`#${combinedHex}`} />
      <h3 className={styles.categoryCardTitle}>{category}</h3>
    </Link>
  );
}
