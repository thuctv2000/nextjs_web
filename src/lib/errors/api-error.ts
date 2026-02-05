export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }

  static fromResponse(status: number, data: unknown): ApiError {
    if (typeof data === 'object' && data !== null && 'error' in data) {
      return new ApiError((data as { error: string }).error, status)
    }
    return new ApiError('An unexpected error occurred', status)
  }
}
