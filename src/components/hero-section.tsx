import { Icon, Logo } from '@/components/icons'
import { Card } from '@/components/ui/card'
import { ScoreRing } from '@/components/score-ring'
import type { AssessmentCategory } from '@/data/assessment'
import type { ReportMeta } from '@/api'

type HeroSectionProps = {
  reportMeta: ReportMeta
  categories: AssessmentCategory[]
}

export function HeroSection({ reportMeta, categories }: HeroSectionProps) {
  const overallPercent = Math.min(
    100,
    Math.round((reportMeta.overallScore / reportMeta.overallMaxScore) * 100),
  )

  return (
    <section className="hero-section">
      <header className="topbar">
        <Logo inverse />
      </header>

      <div className="hero-content">
        <div className="meta-pills">
          <span>
            <Icon name="calendar" /> {reportMeta.assessment}
          </span>
          <span>
            <Icon name="shield" /> {reportMeta.client}
          </span>
        </div>

        <h1>
          Digital Ecosystem <span>Assessment Summary</span>
        </h1>
        <p>{reportMeta.summary}</p>

        <div className="score-summary">
          <Card className="overall-score">
            <strong>{reportMeta.overallScore}</strong>
            <span>/ {reportMeta.overallMaxScore}</span>
            <small>Overall Score</small>
            <div className="mini-meter">
              <span style={{ width: `${overallPercent}%` }} />
            </div>
          </Card>

          <div className="ring-row">
            {categories.map((category) => (
              <ScoreRing
                key={category.id}
                score={category.score}
                maxScore={category.maxScore}
                color={category.color}
                label={category.shortTitle}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
