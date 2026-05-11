import type { AssessmentCategory, AssessmentRow } from '@/data/assessment'
import type { DrupalResource } from '@/api/jsonapi'
import { cleanText } from '@/api/utils/text'
import { categoryStyles } from '@/api/features/assessment/styles'
import type {
  AssessmentAttributes,
  AssessmentItemAttributes,
  AssessmentItemRelationships,
  AssessmentPillarResponseItem,
  AssessmentRelationships,
  CategoryAttributes,
  GridResponseItem,
  HeroBannerResponseItem,
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

export function mapHeroBannerMeta(
  banners: HeroBannerResponseItem[],
): ReportMeta {
  const banner = banners[0]

  return {
    assessment: cleanText(
      banner?.field_assessment_title,
      'Digital Assessment',
    ),
    client: cleanText(banner?.field_client_name, 'Client'),
    summary: cleanText(
      banner?.field_hero_description,
      'CXO executes comprehensive digital health & growth assessments across multiple aspects of your organization.',
    ),
    overallScore: toNumber(banner?.field_overall_score, 0),
    overallMaxScore: toNumber(banner?.field_overall_max_score, 100),
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

export function mapPillarRowsByTitle(items: AssessmentPillarResponseItem[]) {
  return items.reduce<Record<string, AssessmentRow[]>>((rows, item) => {
    const title = cleanText(item.assessment_title, 'Assessment category')
    const titleKey = getTitleKey(title)

    rows[titleKey] = [
      ...(rows[titleKey] ?? []),
      {
        consideration: cleanText(
          item.Assessment_consideration,
          'Assessment item',
        ),
        performance: mapPerformance(item.Assessment_Performance),
        notes: cleanText(item.Assessment_notes, 'Assessment pending.'),
        fullNotes: cleanText(
          item.Asessment_depth_analysis ?? item.Assessment_notes,
          'Additional analysis pending.',
        ),
        linkLabel: 'Learn more',
      },
    ]

    return rows
  }, {})
}

export function mapGridCategories(
  gridItems: GridResponseItem[],
  rowsByCategoryTitle: Record<string, AssessmentRow[]>,
): AssessmentCategory[] {
  return gridItems
    .map((item, index): AssessmentCategory => {
      const title = cleanText(item.assessment_title, 'Assessment category')
      const style = getStyleForTitle(title, index)

      return {
        id: slugify(title),
        title,
        shortTitle: mapShortTitle(title),
        description: cleanText(item.assessment_description),
        score: toNumber(item.assessment_min_score, 0),
        maxScore: toNumber(item.assessment_max_score, 25),
        color: style.color,
        darkColor: style.darkColor,
        tint: style.tint,
        icon: style.icon,
        rows:
          rowsByCategoryTitle[title] ??
          rowsByCategoryTitle[getTitleKey(title)] ??
          rowsByCategoryTitle[toLegacyTitle(title)] ??
          rowsByCategoryTitle[getTitleKey(toLegacyTitle(title))] ??
          [],
      }
    })
    .sort((current, next) => {
      return (
        getTitleDisplayOrder(current.title) - getTitleDisplayOrder(next.title)
      )
    })
}

function toLegacyTitle(title: string) {
  return title.replace(
    'Digital GTM Efficiency',
    'Digital Go-To-Market Efficiency',
  )
}

function getTitleKey(title: string) {
  return cleanText(title)
    .toLowerCase()
    .replace(/go-to-market/g, 'gtm')
    .replace(/\band\b/g, '&')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
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
    .replace('Digital GTM Efficiency', 'Digital GTM')
    .replace('Digital Go-To-Market Efficiency', 'Digital GTM')
    .replace('Tech & Platform Performance', 'Tech & Platform')
}

export function mapCategoryTitlesById(categories: CategoryResource[]) {
  return categories.reduce<Record<string, string>>((titles, category) => {
    titles[category.id] = cleanText(
      category.attributes.title,
      'Assessment category',
    )

    return titles
  }, {})
}

export function mapRowsByCategoryTitle(
  rowsByCategory: Record<string, AssessmentRow[]>,
  categoryTitlesById: Record<string, string>,
) {
  return Object.entries(rowsByCategory).reduce<Record<string, AssessmentRow[]>>(
    (rows, [categoryId, categoryRows]) => {
      const title = categoryTitlesById[categoryId]

      if (title) {
        rows[title] = categoryRows
      }

      return rows
    },
    {},
  )
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

function toNumber(value: string | number | null | undefined, fallback: number) {
  const numberValue = Number(value)

  return Number.isFinite(numberValue) ? numberValue : fallback
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function getStyleForTitle(title: string, index: number) {
  const normalizedTitle = title.toLowerCase()

  if (normalizedTitle.includes('tech')) {
    return categoryStyles[0]
  }

  if (normalizedTitle.includes('marketing')) {
    return categoryStyles[1]
  }

  if (normalizedTitle.includes('gtm')) {
    return categoryStyles[2]
  }

  if (normalizedTitle.includes('automation')) {
    return categoryStyles[3]
  }

  return categoryStyles[index % categoryStyles.length]
}

function getTitleDisplayOrder(title: string) {
  const normalizedTitle = title.toLowerCase()

  if (normalizedTitle.includes('tech')) {
    return 0
  }

  if (normalizedTitle.includes('marketing')) {
    return 1
  }

  if (normalizedTitle.includes('gtm')) {
    return 2
  }

  if (normalizedTitle.includes('automation')) {
    return 3
  }

  return 99
}
