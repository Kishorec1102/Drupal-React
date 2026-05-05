export function cleanText(value: string | null | undefined, fallback = '') {
  return value?.trim() || fallback
}
