import axios from 'axios'
import { API_BASE_URL } from '@/api/config'

const webformApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export type WebformSubmissionPayload = {
  first_name: string
  last_name: string
  business_email: string
  company_name: string
  job_title: string
  your_message: string
}

export type WebformElementsResponse = Record<string, unknown>

const getAuthHeader = () => {
  const user = import.meta.env.VITE_DRUPAL_WEBFORM_USER
  const password = import.meta.env.VITE_DRUPAL_WEBFORM_PASSWORD

  if (!user || !password) {
    return {}
  }

  return {
    Authorization: `Basic ${btoa(`${user}:${password}`)}`,
  }
}

export async function getWebformElements(): Promise<WebformElementsResponse> {
  const response = await webformApi.get<WebformElementsResponse>(
    '/webform_rest/let_s_disscuss_how_cxo_can_suppo/elements',
    { headers: getAuthHeader() },
  )

  return response.data
}

export async function submitWebform(
  payload: WebformSubmissionPayload,
): Promise<unknown> {
  const response = await webformApi.post(
    '/webform_rest/let_s_disscuss_how_cxo_can_suppo/submit?_format=json',
    payload,
    {
      headers: getAuthHeader(),
    },
  )

  return response.data
}
