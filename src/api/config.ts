export const API_BASE_URL =
  import.meta.env.VITE_DRUPAL_BASE_URL?.replace(/\/$/, '') ??
  (import.meta.env.DEV ? '/drupal-jsonapi' : 'http://localhost:8080')
