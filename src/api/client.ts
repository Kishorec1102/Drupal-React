import axios, { AxiosError } from 'axios'
import { API_BASE_URL } from '@/api/config'

export const drupalApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/vnd.api+json',
  },
})

export async function getJson<T>(path: string): Promise<T> {
  try {
    const response = await drupalApi.get<T>(path)

    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        `Drupal API request failed: ${error.response?.status ?? error.message}`,
        { cause: error },
      )
    }

    throw error
  }
}
