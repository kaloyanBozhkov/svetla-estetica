import { env } from "@/env";

export const BASE_URL = env.NEXT_PUBLIC_BASE_URL;

// Shipping cost in cents
export const SHIPPING_COST = 1500; // 15.00 EUR

export const OPENING_HOUR = "09:00";
export const CLOSING_HOUR_WEEKDAY = "20:00";
export const CLOSING_HOUR_SATURDAY = "18:00";

export const businessHours = [
  { day: "Lunedì", hours: "09.00 - 20.00" },
  { day: "Martedì", hours: "09.00 - 20.00" },
  { day: "Mercoledì", hours: "09.00 - 20.00" },
  { day: "Giovedì", hours: "09.00 - 20.00" },
  { day: "Venerdì", hours: "09.00 - 20.00" },
  { day: "Sabato", hours: "09.00 - 18.00" },
];

export const openingHoursSchema = [
  "Mo-Fr 09:00-20:00",
  "Sa 09:00-18:00",
];

