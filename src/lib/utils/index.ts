export { formatPrice, formatDate, formatDateTime, formatTime } from "./format";
export { toSnakeCase, toCamelCase } from "./transform";

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

