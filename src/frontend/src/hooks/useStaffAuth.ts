import { useCallback, useEffect, useState } from "react";
import { useActor } from "./useActor";

const SESSION_KEY = "dmt_staff_session";

export interface StaffSession {
  staffId: string; // bigint serialized as string
  username: string;
  role: string; // "gateStaff" | "eventManager" | "admin"
}

function readSession(): StaffSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StaffSession;
    if (!parsed.staffId || !parsed.username || !parsed.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeSession(session: StaffSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function useStaffAuth() {
  const { actor } = useActor();
  const [session, setSession] = useState<StaffSession | null>(() =>
    readSession(),
  );

  // Sync on mount from localStorage
  useEffect(() => {
    const existing = readSession();
    setSession(existing);
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<void> => {
      if (!actor) {
        throw new Error("Service unavailable. Please try again.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (actor as any).staffLogin(username, password);
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      const data = result.ok;
      const newSession: StaffSession = {
        staffId: String(data.staffId),
        username: data.username,
        role: data.role as string,
      };
      writeSession(newSession);
      setSession(newSession);
    },
    [actor],
  );

  const logout = useCallback((): void => {
    clearSession();
    setSession(null);
  }, []);

  return {
    session,
    isAuthenticated: session !== null,
    login,
    logout,
  };
}
