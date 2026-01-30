/**
 * Interface - HTTP Client
 * Abstraction for HTTP client implementations
 */
export interface IHttpClient {
  get<T>(url: string, config?: RequestConfig): Promise<HttpResponse<T>>;
  post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<HttpResponse<T>>;
  put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<HttpResponse<T>>;
  patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<HttpResponse<T>>;
  delete<T>(url: string, config?: RequestConfig): Promise<HttpResponse<T>>;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
  timeout?: number;
}

export interface HttpResponse<T> {
  data: T;
  status: number;
  statusText: string;
}
