import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.scss";

type ButtonVariant = "primary" | "neutral";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  children: ReactNode;
}

/** Shared button primitive covering the buy / checkout / load-more button states used across the app. */
export function Button({
  variant = "primary",
  fullWidth = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = [styles.button, styles[variant], fullWidth ? styles.fullWidth : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
