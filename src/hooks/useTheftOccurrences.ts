import { useCallback, useEffect, useState } from "react";
import {
  getTheftOccurrences,
  type TheftOccurrence
} from "@/services/magic_api/security";
import type { TheftOccurrencesParams } from "@/services/magic_api/security/models";

interface UseTheftOccurrencesResult {
  occurrences: TheftOccurrence[];
  total: number;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useTheftOccurrences(
  params?: TheftOccurrencesParams
): UseTheftOccurrencesResult {
  const [occurrences, setOccurrences] = useState<TheftOccurrence[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOccurrences = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTheftOccurrences(params);
      setOccurrences(response.data ?? []);
      setTotal(response.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setOccurrences([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchOccurrences();
  }, [fetchOccurrences]);

  return { occurrences, total, loading, error, refetch: fetchOccurrences };
}
