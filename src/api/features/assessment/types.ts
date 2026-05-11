import type { AssessmentCategory } from '@/data/assessment'
import type { ResourceIdentifier } from '@/api/jsonapi'

export type ReportMeta = {
  assessment: string
  client: string
  summary: string
  overallScore: number
  overallMaxScore: number
}

export type AssessmentReport = {
  reportMeta: ReportMeta
  categories: AssessmentCategory[]
}

export type HeroBannerResponseItem = {
  title: string
  field_assessment_description: string | null
  field_assessment_title: string | null
  field_client_name: string | null
  field_hero_description: string | null
  field_overall_max_score: string | number | null
  field_overall_score: string | number | null
}

export type GridResponseItem = {
  assessment_title: string
  assessment_description: string | null
  assessment_min_score: string | number | null
  assessment_max_score: string | number | null
}

export type AssessmentPillarResponseItem = {
  assessment_title: string
  Assessment_consideration: string | null
  Asessment_depth_analysis: string | null
  Assessment_notes: string | null
  Assessment_Performance: string | null
}

export type AssessmentAttributes = {
  title: string
  field_client_name: string | null
  field_overall_score: number[]
  field_summary: string | null
}

export type AssessmentItemAttributes = {
  title: string
  body?: {
    value?: string | null
    processed?: string | null
    summary?: string | null
  } | null
  field_performance?: string | null
  field_performance_ref?: string | null
  field_summary?: string | null
  field_text?: string | null
}

export type CategoryAttributes = {
  title: string
  field_description: string | null
  field_display_order: number[]
  field_max_score: number | null
  field_score: number | null
}

export type AssessmentRelationships = {
  field_categories?: {
    data: ResourceIdentifier[]
  }
}

export type AssessmentItemRelationships = {
  field_category?: {
    data: ResourceIdentifier | null
  }
  field_categories?: {
    data: ResourceIdentifier[]
  }
  field_assessment?: {
    data: ResourceIdentifier | null
  }
}
