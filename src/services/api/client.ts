import { ApiError } from "@/services/api/errors";

export interface ApiClientConfig {
  baseUrl: string;
  getAccessToken?: () => string | null;
}

export interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
}

export class ApiClient {
  constructor(private readonly config: ApiClientConfig) {}

  get baseUrl(): string {
    return this.config.baseUrl;
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const response = await fetch(url, {
      method: "GET",
      headers: this.buildHeaders(options?.headers),
    });
    return this.handleResponse<T>(response);
  }

  async getText(path: string, options?: RequestOptions): Promise<string> {
    const url = this.buildUrl(path, options?.params);
    const response = await fetch(url, {
      method: "GET",
      headers: this.buildHeaders({ ...options?.headers, Accept: "application/xml,text/xml" }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => undefined);
      const message =
        typeof body === "object" && body !== null && "message" in body
          ? String((body as { message: unknown }).message)
          : response.statusText;
      throw new ApiError(message, response.status, body);
    }
    return response.text();
  }

  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const response = await fetch(url, {
      method: "POST",
      headers: this.buildHeaders(options?.headers),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const response = await fetch(url, {
      method: "PATCH",
      headers: this.buildHeaders(options?.headers),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const response = await fetch(url, {
      method: "DELETE",
      headers: this.buildHeaders(options?.headers),
    });
    return this.handleResponse<T>(response);
  }

  private buildUrl(path: string, params?: RequestOptions["params"]): string {
    const url = new URL(`${this.config.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) url.searchParams.set(key, String(value));
      });
    }
    return url.toString();
  }

  private buildHeaders(extra?: Record<string, string>): HeadersInit {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...extra,
    };
    const token = this.config.getAccessToken?.();
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const body = await response.json().catch(() => undefined);
      const message =
        typeof body === "object" && body !== null && "message" in body
          ? String((body as { message: unknown }).message)
          : response.statusText;
      throw new ApiError(message, response.status, body);
    }
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }
}
