import { useEffect, useState } from 'react'
import { AssessmentDetails } from '@/components/assessment-detail'
import { CategoryCards } from '@/components/category-cards'
import { ChatbotWidget } from '@/components/chatbot-widget'
import { ContactSection } from '@/components/contact-section'
import { FloatingActions } from '@/components/floating-actions'
import { HeroSection } from '@/components/hero-section'
import { NextSteps } from '@/components/next-steps'
import { SiteFooter } from '@/components/site-footer'
import { AssessmentLoading } from '@/components/shimmer/assessment-loading'
import { getAssessmentReport, type AssessmentReport } from '@/api'
import { accessRequests } from '@/data/assessment'

const minimumLoadingTime = 700

function App() {
  const [report, setReport] = useState<AssessmentReport | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    let loadingTimer: number | undefined
    const loadingStartedAt = window.performance.now()

    getAssessmentReport()
      .then((nextReport) => {
        const elapsedTime = window.performance.now() - loadingStartedAt
        const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime)

        loadingTimer = window.setTimeout(() => {
          if (active) {
            setReport(nextReport)
          }
        }, remainingTime)
      })
      .catch((requestError: Error) => {
        if (active) {
          setError(requestError.message)
        }
      })

    return () => {
      active = false
      window.clearTimeout(loadingTimer)
    }
  }, [])

  if (error) {
    return (
      <main id="top">
        <section className="section app-message" role="alert">
          <h1>Unable to load assessment data</h1>
          <p>{error}</p>
        </section>
      </main>
    )
  }

  if (!report) {
    return <AssessmentLoading />
  }

  return (
    <main id="top">
      <HeroSection
        reportMeta={report.reportMeta}
        categories={report.categories}
      />
      <CategoryCards categories={report.categories} />
      <AssessmentDetails categories={report.categories} />
      <ContactSection />
      <NextSteps requests={accessRequests} />
      <SiteFooter />
      <FloatingActions />
      <ChatbotWidget />
    </main>
  )
}

export default App
