import { loginWithEnvCredentials } from "@/lib/authEnvLogin";
import { getEpcQueue } from "@/services/magic_api/magiclog";
import { useCallback, useEffect, useState } from "react";

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
      const loggedIn = await loginWithEnvCredentials();
      if (!loggedIn) {
        setError(
          new Error(
            "Não autenticado e falha no login com credenciais do .env"
          )
        );
        setLoading(false);
        return;
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
          setError(
            new Error(
              "Não autenticado e falha no login com credenciais do .env"
            )
          );
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
