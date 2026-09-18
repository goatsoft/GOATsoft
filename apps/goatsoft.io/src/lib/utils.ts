import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** shadcn-vue's class merger; the only export this directory holds. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
