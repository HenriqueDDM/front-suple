import { env } from "@/config/env";
import { ApiClient } from "@/services/api/client";
import { getAccessToken } from "@/services/api/auth-store";
import { ensureApiReady } from "@/services/api/bootstrap";
import {
  HttpCustomersService,
  HttpPurchasesService,
  HttpProductsService,
  HttpReportsService,
  HttpSalesService,
  HttpSettingsService,
  HttpStockService,
  HttpSuppliersService,
  HttpPlatformService,
  HttpFiscalService,
} from "@/services/http";
import type {
  ICustomersService,
  IPurchasesService,
  IProductsService,
  IReportsService,
  ISalesService,
  ISettingsService,
  IStockService,
  ISuppliersService,
  IPlatformService,
  IFiscalService,
} from "@/services/interfaces";
import {
  mockCustomersService,
  mockPurchasesService,
  mockProductsService,
  mockReportsService,
  mockSalesService,
  mockSettingsService,
  mockStockService,
  mockSuppliersService,
  mockPlatformService,
  mockFiscalService,
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

export function getPurchasesService(): IPurchasesService {
  return env.useMockApi ? mockPurchasesService : new HttpPurchasesService(getApiClient());
}

export function getProductsService(): IProductsService {
  return env.useMockApi ? mockProductsService : new HttpProductsService(getApiClient());
}

export function getSuppliersService(): ISuppliersService {
  return env.useMockApi ? mockSuppliersService : new HttpSuppliersService(getApiClient());
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

export function getPlatformService(): IPlatformService {
  return env.useMockApi ? mockPlatformService : new HttpPlatformService(getApiClient());
}

export function getFiscalService(): IFiscalService {
  return env.useMockApi ? mockFiscalService : new HttpFiscalService(getApiClient());
}
