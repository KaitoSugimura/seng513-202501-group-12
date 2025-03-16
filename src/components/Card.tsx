import clsx from "clsx";
import { forwardRef } from "react";
import styles from "./Card.module.css";

const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx(styles.card, className)} {...props} />
  )
);

export default Card;
