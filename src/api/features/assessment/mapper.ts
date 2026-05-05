import type { AssessmentCategory, AssessmentRow } from '@/data/assessment'
import type { DrupalResource } from '@/api/jsonapi'
import { cleanText } from '@/api/utils/text'
import { categoryStyles } from '@/api/features/assessment/styles'
import type {
  AssessmentAttributes,
  AssessmentItemAttributes,
  AssessmentItemRelationships,
  AssessmentRelationships,
  CategoryAttributes,
  ReportMeta,
} from '@/api/features/assessment/types'

type AssessmentResource = DrupalResource<
  AssessmentAttributes,
  AssessmentRelationships
>

type CategoryResource = DrupalResource<CategoryAttributes>

type AssessmentItemResource = DrupalResource<
  AssessmentItemAttributes,
  AssessmentItemRelationships
>

export function mapReportMeta(assessments: AssessmentResource[]): ReportMeta {
  const overview =
    assessments.find(
      (assessment) => assessment.attributes.field_overall_score.length > 0,
    ) ?? assessments[0]

  return {
    assessment: cleanText(overview?.attributes.title, 'Digital Assessment'),
    client: cleanText(overview?.attributes.field_client_name, 'Client'),
    summary: cleanText(
      overview?.attributes.field_summary,
      'CXO executes comprehensive digital health & growth assessments across multiple aspects of your organization.',
    ),
    overallScore: overview?.attributes.field_overall_score[0] ?? 0,
    overallMaxScore: 100,
  }
}

export function mapRowsByCategory(items: AssessmentItemResource[]) {
  return items.reduce<Record<string, AssessmentRow[]>>((rows, item) => {
    const categoryIds = getItemCategoryIds(item)

    categoryIds.forEach((categoryId) => {
      rows[categoryId] = [
        ...(rows[categoryId] ?? []),
        {
          consideration: cleanText(item.attributes.title, 'Assessment item'),
          performance: mapPerformance(
            item.attributes.field_performance_ref ??
              item.attributes.field_performance,
          ),
          notes: cleanText(
            item.attributes.field_text ?? item.attributes.field_summary,
            'Assessment pending.',
          ),
          fullNotes: cleanText(
            item.attributes.body?.processed ??
              item.attributes.body?.value ??
              item.attributes.field_text ??
              item.attributes.field_summary,
          ),
          linkLabel: 'Show more',
        },
      ]
    })

    return rows
  }, {})
}

function getItemCategoryIds(item: AssessmentItemResource) {
  const category = item.relationships?.field_category?.data

  if (category) {
    return [category.id]
  }

  return (
    item.relationships?.field_categories?.data.map(
      (categoryItem) => categoryItem.id,
    ) ??
    []
  )
}

export function mapCategories(
  categories: CategoryResource[],
  rowsByCategory: Record<string, AssessmentRow[]>,
): AssessmentCategory[] {
  return categories
    .map((category, index): AssessmentCategory => {
      const title = cleanText(category.attributes.title, 'Assessment category')
      const style = categoryStyles[index % categoryStyles.length]

      return {
        id: category.id,
        title,
        shortTitle: mapShortTitle(title),
        description: cleanText(category.attributes.field_description),
        score: category.attributes.field_score ?? 0,
        maxScore: category.attributes.field_max_score ?? 25,
        color: style.color,
        darkColor: style.darkColor,
        tint: style.tint,
        icon: style.icon,
        rows: rowsByCategory[category.id] ?? [],
      }
    })
    .sort((current, next) => {
      return (
        getDisplayOrder(categories, current.id) -
        getDisplayOrder(categories, next.id)
      )
    })
}

function getDisplayOrder(categories: CategoryResource[], categoryId: string) {
  return (
    categories.find((category) => category.id === categoryId)?.attributes
      .field_display_order[0] ?? 0
  )
}

function mapShortTitle(title: string) {
  return title
    .replace('Marketing, Conversions & Growth', 'Marketing & Growth')
    .replace('Digital Go-To-Market Efficiency', 'Digital GTM')
    .replace('Tech & Platform Performance', 'Tech & Platform')
}

function mapPerformance(
  value: string | null | undefined,
): AssessmentRow['performance'] {
  switch (value?.toLowerCase()) {
    case 'high':
      return 'High'
    case 'medium':
      return 'Medium'
    case 'low':
      return 'Low'
    default:
      return 'Undiscovered'
  }
}
