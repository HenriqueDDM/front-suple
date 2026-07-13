export const env = {
  /** Backend URL without trailing slash. Routes are at root (e.g. /products), not /api. */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000",
  useMockApi: import.meta.env.VITE_USE_MOCK_API !== "false",
  /** Dev auto-login when useMockApi is false (seed user from supplement-back) */
  devEmail: import.meta.env.VITE_DEV_EMAIL ?? "admin@loja-a.com",
  devPassword: import.meta.env.VITE_DEV_PASSWORD ?? "password123",
} as const;
