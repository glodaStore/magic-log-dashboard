import magicApiAuth from "@/services/magic_api/auth";
import { getEpcQueue } from "@/services/magic_api/magiclog";
import { useCallback, useEffect, useState } from "react";

function getAuthCredentials() {
  const email = process.env.NEXT_PUBLIC_AUTH_EMAIL;
  const password = process.env.NEXT_PUBLIC_AUTH_PASSWORD;
  const magicId = process.env.NEXT_PUBLIC_AUTH_MAGIC_ID;
  if (!email || !password || !magicId) return null;
  return { email, password, magicId };
}

function storeTokens(accessToken: string, refreshToken: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("loginToken", accessToken);
  sessionStorage.setItem("loginToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  sessionStorage.setItem("refreshToken", refreshToken);
}

async function loginWithEnvCredentials(): Promise<boolean> {
  const creds = getAuthCredentials();
  if (!creds) return false;
  try {
    const res = await magicApiAuth.emailLogin(creds);
    if (res?.data?.accessToken && res?.data?.refreshToken) {
      storeTokens(res.data.accessToken, res.data.refreshToken);
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

function hasStoredToken(): boolean {
  if (typeof window === "undefined") return false;
  return !!(
    localStorage.getItem("loginToken") || sessionStorage.getItem("loginToken")
  );
}

interface UseEpcQueueResult {
  data: unknown;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useEpcQueue(): UseEpcQueueResult {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEpcQueue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!hasStoredToken()) {
        const loggedIn = await loginWithEnvCredentials();
        if (!loggedIn) {
          setError(new Error("Não autenticado e falha no login com credenciais do .env"));
          setLoading(false);
          return;
        }
      }
      const result = await getEpcQueue();
      setData(result);
    } catch (err: unknown) {
      const is401 =
        err &&
        typeof err === "object" &&
        "response" in err &&
        (err as { response?: { status?: number } }).response?.status === 401;
      if (is401) {
        const loggedIn = await loginWithEnvCredentials();
        if (loggedIn) {
          try {
            const result = await getEpcQueue();
            setData(result);
            return;
          } catch (retryErr) {
            setError(
              retryErr instanceof Error ? retryErr : new Error(String(retryErr))
            );
          }
        } else {
          setError(new Error("Não autenticado e falha no login com credenciais do .env"));
        }
      } else {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEpcQueue();
  }, [fetchEpcQueue]);

  return { data, loading, error, refetch: fetchEpcQueue };
}
