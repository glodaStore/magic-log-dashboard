export interface TheftOccurrenceLocation {
  id: string;
  name: string;
}

export interface TheftOccurrenceRelatedProduct {
  epc: string;
  sku: string;
  name: string;
  estimatedValue: number;
}

export interface TheftOccurrence {
  occurrenceId: string;
  occurredAt: string;
  location: TheftOccurrenceLocation;
  relatedProducts: TheftOccurrenceRelatedProduct[];
  estimatedValue: number;
  status: string;
  evidences: unknown[];
}

export interface TheftOccurrencesResponse {
  message: string;
  data: TheftOccurrence[];
  total: number;
  page: number;
  totalPages: number;
}

export interface TheftOccurrencesParams {
  page?: number;
  limit?: number;
}
