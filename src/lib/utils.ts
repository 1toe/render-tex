import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) { // Merge seguro de clases tailwind condicionadas
  return twMerge(clsx(inputs))
}
 