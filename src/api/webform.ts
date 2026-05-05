import axios from 'axios'
import { API_BASE_URL } from '@/api/config'

export const CXO_SUPPORT_WEBFORM_ID = 'lets_disscuss_how_cxo_can_suppo'

const webformApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export type WebformSubmissionPayload = {
  webform_id?: string
  first_name: string
  last_name: string
  business_email: string
  company_name: string
  job_title: string
  your_message: string
}

export type WebformElementsResponse = Record<string, unknown>

const getAuthHeader = () => {
  const user = import.meta.env.VITE_DRUPAL_WEBFORM_USER ?? 'CXOAdmin'
  const password = import.meta.env.VITE_DRUPAL_WEBFORM_PASSWORD ?? 'CXO@123'

  if (!user || !password) {
    return {}
  }

  return {
    Authorization: `Basic ${btoa(`${user}:${password}`)}`,
  }
}

export async function getWebformElements(): Promise<WebformElementsResponse> {
  const response = await webformApi.get<WebformElementsResponse>(
    `/webform_rest/${CXO_SUPPORT_WEBFORM_ID}/elements`,
    { headers: getAuthHeader() },
  )

  return response.data
}

export async function submitWebform(
  payload: WebformSubmissionPayload,
): Promise<unknown> {
  const response = await webformApi.post(
    `/webform_rest/${CXO_SUPPORT_WEBFORM_ID}/submit?_format=json`,
    {
      ...payload,
      webform_id: CXO_SUPPORT_WEBFORM_ID,
    },
    {
      headers: getAuthHeader(),
    },
  )

  return response.data
}
