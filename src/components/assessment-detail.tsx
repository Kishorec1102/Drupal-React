import { useState } from 'react'
import { Icon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { AssessmentCategory, AssessmentRow } from '@/data/assessment'

type AssessmentDetailProps = {
  categories: AssessmentCategory[]
}

const badgeTone: Record<
  AssessmentRow['performance'],
  'green' | 'amber' | 'red' | 'gray'
> = {
  High: 'green',
  Medium: 'amber',
  Low: 'red',
  Undiscovered: 'gray',
}

export function AssessmentDetails({ categories }: AssessmentDetailProps) {
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id)
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const activeCategory =
    categories.find((category) => category.id === activeCategoryId) ??
    categories[0]

  if (!activeCategory) {
    return null
  }

  const percent = Math.round(
    (activeCategory.score / activeCategory.maxScore) * 100,
  )

  return (
    <section
      className={
        isNavCollapsed
          ? 'assessment-details nav-collapsed'
          : 'assessment-details'
      }
    >
      <aside className="side-nav" aria-label="Assessment sections">
        <button
          className="collapse-button"
          type="button"
          aria-expanded={!isNavCollapsed}
          aria-label={
            isNavCollapsed
              ? 'Expand assessment navigation'
              : 'Collapse assessment navigation'
          }
          onClick={() => setIsNavCollapsed((current) => !current)}
        >
          {isNavCollapsed ? '>' : '<'}
        </button>

        {categories.map((category) => (
          <button
            className={
              category.id === activeCategory.id
                ? 'side-nav-item active'
                : 'side-nav-item'
            }
            key={category.id}
            onClick={() => setActiveCategoryId(category.id)}
            type="button"
          >
            <span className="side-nav-icon">
              <Icon name={category.icon} />
            </span>
            <span className="side-nav-label">{category.title}</span>
          </button>
        ))}
      </aside>

      <div className="detail-stack">
        <Card className="detail-panel" id={activeCategory.id}>
          <div
            className="detail-panel-header"
            style={{ backgroundColor: activeCategory.tint }}
          >
            <div>
              <h2 style={{ color: activeCategory.darkColor }}>
                <span>v</span> {activeCategory.title}
              </h2>
              <p>
                Score: <strong>{activeCategory.score}</strong> /{' '}
                {activeCategory.maxScore}
              </p>
            </div>
            <div className="panel-progress">
              <Progress value={percent} color={activeCategory.darkColor} />
              <strong>{percent}%</strong>
            </div>
          </div>

          <div className="detail-table" role="table" tabIndex={0}>
            <div className="detail-row detail-head" role="row">
              <span role="columnheader">Consideration</span>
              <span role="columnheader">Performance</span>
              <span role="columnheader">Notes</span>
            </div>
            {activeCategory.rows.map((row) => (
              <div className="detail-row" role="row" key={row.consideration}>
                <strong role="cell">{row.consideration}</strong>
                <span role="cell">
                  <Badge tone={badgeTone[row.performance]}>
                    {row.performance}
                  </Badge>
                </span>
                <p role="cell">
                  {row.notes}
                  {row.linkLabel ? (
                    <a href={`#${activeCategory.id}`}>{row.linkLabel} -&gt;</a>
                  ) : null}
                </p>
              </div>
            ))}
            {activeCategory.rows.length === 0 ? (
              <div className="detail-row detail-empty" role="row">
                <strong role="cell">No assessment items published yet.</strong>
                <span role="cell" />
                <p role="cell">
                  Add assessment nodes in Drupal and relate them to this
                  category to populate this section.
                </p>
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    </section>
  )
}
