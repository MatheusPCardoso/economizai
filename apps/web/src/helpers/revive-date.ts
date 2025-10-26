const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/

const isPlainObject = (v: unknown): v is Record<string, any> => {
  return !!v && typeof v === 'object' && v.constructor === Object
}

export const reviveDatesInObject = <T>(value: T): T => {
  if (value == null) return value
  if (typeof value === 'string' && isoDateRegex.test(value)) return new Date(value) as unknown as T
  if (Array.isArray(value)) return value.map(reviveDatesInObject) as unknown as T
  if (isPlainObject(value)) {
    const out: Record<string, any> = {}
    for (const k of Object.keys(value)) out[k] = reviveDatesInObject((value as any)[k])
    return out as unknown as T
  }
  return value
}
