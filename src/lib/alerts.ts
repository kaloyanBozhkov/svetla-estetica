import { env } from "@/env";

const PROJECT_NAME = "svetla-estetica";
const ALERT_API_BASE = "https://project-alert-flame.vercel.app/api";

export async function sendCelebration(payload: Record<string, string>) {
  if (!env.TG_BOT_KEY) {
    console.warn("TG_BOT_KEY not configured, skipping celebration alert");
    return;
  }

  try {
    await fetch(`${ALERT_API_BASE}/send-good-news-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": env.TG_BOT_KEY,
      },
      body: JSON.stringify({
        type: "celebrate",
        project_name: PROJECT_NAME,
        payload,
      }),
    });
  } catch (error) {
    console.error("Failed to send celebration alert:", error);
  }
}

export async function sendErrorLog(payload: Record<string, string>) {
  if (!env.TG_BOT_KEY) {
    console.warn("TG_BOT_KEY not configured, skipping error alert");
    return;
  }

  try {
    await fetch(`${ALERT_API_BASE}/send-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": env.TG_BOT_KEY,
      },
      body: JSON.stringify({
        type: "error",
        project_name: PROJECT_NAME,
        payload,
      }),
    });
  } catch (error) {
    console.error("Failed to send error alert:", error);
  }
}

