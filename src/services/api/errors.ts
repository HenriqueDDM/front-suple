export class ApiNotConfiguredError extends Error {
  constructor(
    message = "HTTP API is not configured yet. Set VITE_USE_MOCK_API=false when the NestJS backend is ready.",
  ) {
    super(message);
    this.name = "ApiNotConfiguredError";
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
