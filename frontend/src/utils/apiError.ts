type ApiError = {
  data?: {
    detail?: string
  }
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  const apiError = error as ApiError
  return apiError.data?.detail || fallback
}
