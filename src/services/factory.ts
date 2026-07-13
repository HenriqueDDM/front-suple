import { env } from "@/config/env";
import { ApiClient } from "@/services/api/client";
import { getAccessToken } from "@/services/api/auth-store";
import { ensureApiReady } from "@/services/api/bootstrap";
import {
  HttpCustomersService,
  HttpProductsService,
  HttpReportsService,
  HttpSalesService,
  HttpSettingsService,
  HttpStockService,
} from "@/services/http";
import type {
  ICustomersService,
  IProductsService,
  IReportsService,
  ISalesService,
  ISettingsService,
  IStockService,
} from "@/services/interfaces";
import {
  mockCustomersService,
  mockProductsService,
  mockReportsService,
  mockSalesService,
  mockSettingsService,
  mockStockService,
} from "@/services/mock";

export { ensureApiReady } from "@/services/api/bootstrap";

let apiClient: ApiClient | null = null;

function getApiClient(): ApiClient {
  if (!apiClient) {
    apiClient = new ApiClient({
      baseUrl: env.apiBaseUrl,
      getAccessToken,
    });
  }
  return apiClient;
}

export function getProductsService(): IProductsService {
  return env.useMockApi ? mockProductsService : new HttpProductsService(getApiClient());
}

export function getCustomersService(): ICustomersService {
  return env.useMockApi ? mockCustomersService : new HttpCustomersService(getApiClient());
}

export function getSalesService(): ISalesService {
  return env.useMockApi ? mockSalesService : new HttpSalesService(getApiClient());
}

export function getStockService(): IStockService {
  return env.useMockApi ? mockStockService : new HttpStockService(getApiClient());
}

export function getReportsService(): IReportsService {
  return env.useMockApi ? mockReportsService : new HttpReportsService(getApiClient());
}

export function getSettingsService(): ISettingsService {
  return env.useMockApi ? mockSettingsService : new HttpSettingsService(getApiClient());
}
