import { IHttpClient, RequestConfig, HttpResponse } from '@/core/application/interfaces';
import { ApiError } from '@/lib/errors';

/**
 * Infrastructure - HTTP Client Implementation
 * Implements IHttpClient using native fetch
 */
export class HttpClient implements IHttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    method: string,
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<HttpResponse<T>> {
    try {
      const fullUrl = new URL(url, this.baseUrl);

      if (config?.params) {
        Object.entries(config.params).forEach(([key, value]) => {
          fullUrl.searchParams.append(key, String(value));
        });
      }

      const response = await fetch(fullUrl.toString(), {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...config?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: config?.timeout ? AbortSignal.timeout(config.timeout) : undefined,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw ApiError.fromResponse(response.status, responseData);
      }

      return {
        data: responseData as T,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error occurred', 0);
    }
  }

  async get<T>(url: string, config?: RequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>('GET', url, undefined, config);
  }

  async post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>('POST', url, data, config);
  }

  async put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>('PUT', url, data, config);
  }

  async patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>('PATCH', url, data, config);
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>('DELETE', url, undefined, config);
  }
}

export const httpClient = new HttpClient(process.env.NEXT_PUBLIC_API_URL || '');
