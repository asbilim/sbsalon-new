import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  if (!name) return "";

  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generate URL for model items in the dashboard
 * @param modelKey - The model key identifier
 * @param id - The item ID or "create" for new item form
 * @returns The relative URL path
 */
export function getModelUrl(modelKey: string, id: string | number): string {
  if (id === "create") {
    return `/dashboard/models/${modelKey}/create`;
  }
  return `/dashboard/models/${modelKey}/${id}`;
}

/**
 * Format date string into a localized date representation
 * @param date - Date string or Date object
 * @param options - Date formatting options
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
): string {
  if (!date) return "-";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return String(date);
  }
}

/**
 * Extracts localized name and description from an item.
 * Falls back to default fields if localized versions are not available.
 * @param item - The object containing fields like name, name_en, description, description_fr, etc.
 * @param locale - The desired locale (e.g., "en", "de", "fr").
 * @returns An object with the localized name and description.
 */
export function getLocalizedFields(
  item: Record<string, any>,
  locale: string
): { name: string; description: string } {
  const name = item[`name_${locale}`] ?? item.name;
  const description = item[`description_${locale}`] ?? item.description;

  return { name, description };
}

/**
 * Converts a string into a URL-friendly slug.
 * @param text - The string to slugify.
 * @returns The slugified string.
 */
export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}
