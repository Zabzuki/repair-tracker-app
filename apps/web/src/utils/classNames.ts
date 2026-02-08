// src/utils/classNames.ts

/**
 * Concatenates class names, ignoring falsy values.
 * Works like the popular `classnames` library.
 */
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
