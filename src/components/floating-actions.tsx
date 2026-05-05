import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'

export function FloatingActions() {
  const [isShareOpen, setIsShareOpen] = useState(false)

  const pageUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleCopyLink = async () => {
    if (navigator.clipboard && pageUrl) {
      await navigator.clipboard.writeText(pageUrl)
    }
    setIsShareOpen(false)
  }

  const handleShareEmail = () => {
    const subject = encodeURIComponent('CXO digital assessment report')
    const body = encodeURIComponent(`Here is the assessment report: ${pageUrl}`)

    window.location.href = `mailto:?subject=${subject}&body=${body}`
    setIsShareOpen(false)
  }

  return (
    <div className="floating-actions" aria-label="Quick actions">
      {isShareOpen ? (
        <div className="floating-share-menu" role="menu">
          <button type="button" role="menuitem" onClick={handleCopyLink}>
            <span className="floating-share-icon">
              <Icon name="copy" />
            </span>
            <span>
              <strong>Copy Link</strong>
              <small>Share this assessment URL</small>
            </span>
          </button>
          <button type="button" role="menuitem" onClick={handleShareEmail}>
            <span className="floating-share-icon">
              <Icon name="mail" />
            </span>
            <span>
              <strong>Share via Email</strong>
              <small>Draft a message with this report</small>
            </span>
          </button>
        </div>
      ) : null}

      <Button
        variant="floating"
        aria-expanded={isShareOpen}
        aria-label={isShareOpen ? 'Close share actions' : 'Open share actions'}
        onClick={() => setIsShareOpen((current) => !current)}
      >
        <Icon name="arrow" />
      </Button>
    </div>
  )
}
