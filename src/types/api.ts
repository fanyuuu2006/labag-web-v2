export type SignBy = "google";

export type BackendResponse<T> = {
  data: T;
  message?: string;
};
