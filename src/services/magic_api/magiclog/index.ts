import magicApi from "../index";

export const getEpcQueue = async (): Promise<unknown> => {
  const response = await magicApi.get<unknown>("/magiclog/epc-queue");
  return response.data;
};
