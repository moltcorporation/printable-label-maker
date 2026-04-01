import { FREE_TIER_LIMIT } from "./types";

const SESSION_KEY = "plm_session";

interface SessionData {
  id: string;
  labelsGenerated: number;
  createdAt: number;
}

function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function getSession(): SessionData {
  if (typeof window === "undefined") {
    return { id: "", labelsGenerated: 0, createdAt: Date.now() };
  }

  const stored = localStorage.getItem(SESSION_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fall through to create new
    }
  }

  const session: SessionData = {
    id: generateSessionId(),
    labelsGenerated: 0,
    createdAt: Date.now(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function incrementLabelsGenerated(count: number): SessionData {
  const session = getSession();
  session.labelsGenerated += count;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getRemainingLabels(): number {
  const session = getSession();
  return Math.max(0, FREE_TIER_LIMIT - session.labelsGenerated);
}

export function canGenerateLabels(): boolean {
  return getRemainingLabels() > 0;
}
