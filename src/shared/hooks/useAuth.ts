import { useState, useEffect } from "react";
import { ensureAuthenticated } from "../services/firebase";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const uid = await ensureAuthenticated();
        setUserId(uid);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication failed:", error);
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };

    authenticate();
  }, []);

  return {
    isAuthenticated,
    authLoading,
    userId,
  };
}
