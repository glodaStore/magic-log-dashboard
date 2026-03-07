import magicApi from "../index";
import type {
  TheftOccurrencesParams,
  TheftOccurrencesResponse
} from "./models";

export { type TheftOccurrence, type TheftOccurrencesResponse } from "./models";

export const getTheftOccurrences = async (
  params?: TheftOccurrencesParams
): Promise<TheftOccurrencesResponse> => {
  const response = await magicApi.get<TheftOccurrencesResponse>(
    "/security/theft-occurrences",
    { params }
  );
  return response.data;
};
