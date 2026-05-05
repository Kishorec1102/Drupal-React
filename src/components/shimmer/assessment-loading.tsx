import { Skeleton } from '@/components/ui/skeleton'

const categoryPlaceholders = Array.from({ length: 4 }, (_, index) => index)
const navPlaceholders = Array.from({ length: 4 }, (_, index) => index)
const rowPlaceholders = Array.from({ length: 5 }, (_, index) => index)
const fieldPlaceholders = Array.from({ length: 6 }, (_, index) => index)

export function AssessmentLoading() {
  return (
    <main id="top" aria-busy="true" aria-live="polite">
      <section className="hero-section shimmer-hero">
        <div className="topbar shimmer-topbar">
          <Skeleton className="shimmer-logo" />
        </div>

        <div className="hero-content">
          <div className="meta-pills">
            <Skeleton className="shimmer-pill" />
            <Skeleton className="shimmer-pill" />
          </div>

          <Skeleton className="shimmer-heading" />
          <Skeleton className="shimmer-heading shimmer-heading-short" />
          <Skeleton className="shimmer-copy" />
          <Skeleton className="shimmer-copy shimmer-copy-short" />

          <div className="score-summary">
            <Skeleton className="overall-score shimmer-score-card" />
            <div className="ring-row">
              {categoryPlaceholders.map((item) => (
                <div className="score-ring-group" key={item}>
                  <Skeleton className="shimmer-ring" />
                  <Skeleton className="shimmer-ring-label" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section category-grid" aria-label="Loading categories">
        {categoryPlaceholders.map((item) => (
          <div className="card category-card shimmer-card" key={item}>
            <Skeleton className="shimmer-icon" />
            <Skeleton className="shimmer-card-title" />
            <Skeleton className="shimmer-card-line" />
            <Skeleton className="shimmer-card-line shimmer-card-line-short" />
            <Skeleton className="shimmer-card-score" />
          </div>
        ))}
      </section>

      <section className="assessment-details shimmer-details">
        <aside className="side-nav" aria-label="Loading assessment sections">
          <Skeleton className="collapse-button shimmer-nav-control" />
          {navPlaceholders.map((item) => (
            <Skeleton className="side-nav-item shimmer-nav-item" key={item} />
          ))}
        </aside>

        <div className="detail-stack">
          <div className="card detail-panel shimmer-detail-panel">
            <div className="detail-panel-header">
              <div>
                <Skeleton className="shimmer-detail-title" />
                <Skeleton className="shimmer-detail-subtitle" />
              </div>
              <div className="panel-progress">
                <Skeleton className="shimmer-progress" />
                <Skeleton className="shimmer-percent" />
              </div>
            </div>

            <div className="detail-table">
              {rowPlaceholders.map((item) => (
                <div className="detail-row" key={item}>
                  <Skeleton className="shimmer-table-cell" />
                  <Skeleton className="shimmer-table-badge" />
                  <Skeleton className="shimmer-table-note" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section shimmer-contact">
        <div className="contact-copy">
          <Skeleton className="shimmer-contact-title" />
          <Skeleton className="shimmer-contact-copy" />
          <Skeleton className="shimmer-contact-copy shimmer-copy-short" />
        </div>
        <div className="contact-form">
          {fieldPlaceholders.map((item) => (
            <Skeleton className="shimmer-field" key={item} />
          ))}
          <Skeleton className="shimmer-textarea" />
          <Skeleton className="shimmer-submit" />
        </div>
      </section>

      <section className="section next-steps shimmer-next">
        <Skeleton className="shimmer-next-title" />
        <Skeleton className="shimmer-next-copy" />
        <Skeleton className="shimmer-next-copy shimmer-copy-short" />
        <div className="access-table">
          {rowPlaceholders.slice(0, 3).map((item) => (
            <div className="access-row" key={item}>
              <Skeleton className="shimmer-access-cell" />
              <Skeleton className="shimmer-access-cell" />
              <Skeleton className="shimmer-access-cell" />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
