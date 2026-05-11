import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'

const COPILOT_WEBCHAT_URL =
  'https://copilotstudio.microsoft.com/environments/3814220b-fb8e-ed34-87b7-e471f8369711/bots/cr63f_v10CXOAssessmentAgentDEV/webchat?__version__=2'

export function ChatbotWidget() {
  const [open, setOpen] = useState(false)

  return (
    <div className={`chatbot-widget ${open ? 'chatbot-widget-open' : ''}`}>
      {open ? (
        <div className="chatbot-panel" role="dialog" aria-label="CXO Assistant chat">
          <div className="chatbot-header">
            <div className="chatbot-heading">
              <span className="chatbot-brand-icon" aria-hidden="true">
                {Array.from({ length: 25 }).map((_, index) => (
                  <span key={index} className={`chatbot-dot chatbot-dot-${index}`} />
                ))}
              </span>
              <div>
                <p className="chatbot-title">CXO Assistant</p>
                <p className="chatbot-subtitle">
                  <span aria-hidden="true" />
                  Online
                </p>
              </div>
            </div>
            <button
              type="button"
              className="chatbot-close"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
            >
              &times;
            </button>
          </div>

          <iframe
            className="chatbot-frame"
            src={COPILOT_WEBCHAT_URL}
            title="CXO Assistant"
            allow="clipboard-write"
          />
        </div>
      ) : (
        <Button
          variant="floating"
          aria-label="Open CXO Assistant"
          onClick={() => setOpen(true)}
        >
          <Icon name="sparkle" />
        </Button>
      )}
    </div>
  )
}
