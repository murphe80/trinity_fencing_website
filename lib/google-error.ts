// Google request errors can embed bearer tokens or signed assertions. Log only safe fields.
export function googleErrorSummary(error: unknown) {
  const e = error as {
    code?: string | number
    response?: { status?: number; data?: { error?: { status?: string } } }
  } | null
  return {
    status: e?.response?.status ?? e?.code ?? 'unavailable',
    reason: e?.response?.data?.error?.status ?? 'Google request failed',
  }
}
