import { useCallback, useEffect, useState } from "react";
import { useActor } from "./useActor";

const SESSION_KEY = "dmt_organiser_session";

export interface OrganiserSession {
  organiserId: string;
  username: string;
  name: string;
}

function readSession(): OrganiserSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OrganiserSession;
    if (!parsed.organiserId || !parsed.username || !parsed.name) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeSession(session: OrganiserSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function useOrganiserAuth() {
  const { actor } = useActor();
  const [session, setSession] = useState<OrganiserSession | null>(() =>
    readSession(),
  );

  useEffect(() => {
    const existing = readSession();
    setSession(existing);
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<void> => {
      if (!actor) {
        throw new Error("Service unavailable. Please try again.");
      }
      const result = await actor.organiserLogin(username, password);
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      const data = result.ok;
      const newSession: OrganiserSession = {
        organiserId: String(data.organiserId),
        username: data.username,
        name: data.name,
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
