export interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
}

export function createResponse<T>(
  status: 'success' | 'error',
  message: string,
  data?: T,
): ApiResponse<T> {
  return {
    status,
    message,
    data,
  };
}
