export class NuRouteError extends Error {
  readonly status: number;
  readonly errorType: string;
  readonly code: string | null;

  constructor(
    status: number,
    message: string,
    errorType = 'api_error',
    code: string | null = null,
  ) {
    super(message);
    this.name = 'NuRouteError';
    this.status = status;
    this.errorType = errorType;
    this.code = code;
  }
}

/**
 * @deprecated Use `NuRouteError` instead. `AICPError` will be removed in a future major version.
 *
 * This is a plain re-export (not a subclass) so that `err instanceof AICPError` keeps working
 * for every error thrown by the SDK — a subclass would only satisfy that check for errors
 * constructed directly as `AICPError`, not for the `NuRouteError` instances the client throws.
 */
export { NuRouteError as AICPError };
