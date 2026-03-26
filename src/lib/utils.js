import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to smartly merge Tailwind classes
 * Crucial for creating reusable components with class-variance-authority
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
