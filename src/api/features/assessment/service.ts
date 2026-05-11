import { getRestJson } from '@/api/client'
import {
  mapGridCategories,
  mapHeroBannerMeta,
  mapPillarRowsByTitle,
} from '@/api/features/assessment/mapper'
import type {
  AssessmentPillarResponseItem,
  AssessmentReport,
  GridResponseItem,
  HeroBannerResponseItem,
} from '@/api/features/assessment/types'

const assessmentEndpoints = {
  heroBanner: '/api/hero-banner',
  grid: '/api/grid',
  assessmentPillar: '/api/assessment_pillar?_format=json',
}

export async function getAssessmentReport(): Promise<AssessmentReport> {
  const [heroBannerResponse, gridResponse] = await Promise.all([
    getRestJson<HeroBannerResponseItem[]>(assessmentEndpoints.heroBanner),
    getRestJson<GridResponseItem[]>(assessmentEndpoints.grid),
  ])

  const assessmentPillarResponse = await getAssessmentPillarItems()

  const rowsByCategoryTitle = mapPillarRowsByTitle(assessmentPillarResponse)

  return {
    reportMeta: mapHeroBannerMeta(heroBannerResponse),
    categories: mapGridCategories(gridResponse, rowsByCategoryTitle),
  }
}

async function getAssessmentPillarItems() {
  try {
    return await getRestJson<AssessmentPillarResponseItem[]>(
      assessmentEndpoints.assessmentPillar,
    )
  } catch (error) {
    console.error('Unable to load assessment pillar items', error)

    return []
  }
}
