import { getJson } from '@/api/client'
import type { DrupalResource, JsonApiCollection } from '@/api/jsonapi'
import {
  mapCategories,
  mapReportMeta,
  mapRowsByCategory,
} from '@/api/features/assessment/mapper'
import type {
  AssessmentAttributes,
  AssessmentItemAttributes,
  AssessmentItemRelationships,
  AssessmentRelationships,
  AssessmentReport,
  CategoryAttributes,
} from '@/api/features/assessment/types'

const assessmentEndpoints = {
  assessments: '/jsonapi/node/assessment',
  assessmentItems: '/jsonapi/node/assessment_item',
  categories: '/jsonapi/node/category',
}

export async function getAssessmentReport(): Promise<AssessmentReport> {
  const [assessmentResponse, categoryResponse, assessmentItemsResponse] =
    await Promise.all([
      getJson<JsonApiCollection<
        DrupalResource<AssessmentAttributes, AssessmentRelationships>
      >>(assessmentEndpoints.assessments),
      getJson<JsonApiCollection<DrupalResource<CategoryAttributes>>>(
        assessmentEndpoints.categories,
      ),
      getJson<JsonApiCollection<
        DrupalResource<AssessmentItemAttributes, AssessmentItemRelationships>
      >>(assessmentEndpoints.assessmentItems),
    ])

  const rowsByCategory = mapRowsByCategory(assessmentItemsResponse.data)

  return {
    reportMeta: mapReportMeta(assessmentResponse.data),
    categories: mapCategories(categoryResponse.data, rowsByCategory),
  }
}
