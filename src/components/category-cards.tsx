import { Card } from '@/components/ui/card'
import { Icon } from '@/components/icons'
import type { AssessmentCategory } from '@/data/assessment'

type CategoryCardsProps = {
  categories: AssessmentCategory[]
}

export function CategoryCards({ categories }: CategoryCardsProps) {
  return (
    <section className="section category-grid" aria-label="Assessment categories">
      {categories.map((category) => (
        <Card
          className="category-card"
          key={category.id}
          style={{ backgroundColor: category.tint }}
        >
          <span className="category-icon" style={{ color: category.darkColor }}>
            <Icon name={category.icon} />
          </span>
          <h2>{category.title}</h2>
          <p>{category.description}</p>
          <strong style={{ color: category.darkColor }}>
            {category.score}/{category.maxScore}
          </strong>
        </Card>
      ))}
    </section>
  )
}
