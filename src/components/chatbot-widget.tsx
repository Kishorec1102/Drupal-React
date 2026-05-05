import { useMemo, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'

type ChatMessage = {
  id: string
  role: 'assistant' | 'user'
  text: string
}

const initialMessages = [
  {
    id: 'explain',
    role: 'assistant',
    text: 'I can explain findings, summarize risks, and turn this report into next steps.',
  },
  {
    id: 'hello',
    role: 'user',
    text: 'hi',
  },
  {
    id: 'intro',
    role: 'assistant',
    text: 'CXO Copilot can help interpret this report, summarize priorities, and draft stakeholder-ready next steps.',
  },
] satisfies ChatMessage[]

export function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [draft, setDraft] = useState('')
  const [isSending, setIsSending] = useState(false)

  const chatBody = useMemo(
    () => messages.map((message) => (
      <div
        key={message.id}
        className={`chatbot-message chatbot-message-${message.role}`}
      >
        <p>{message.text}</p>
      </div>
    )),
    [messages],
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmed = draft.trim()
    if (!trimmed) {
      return
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    }

    setMessages((current) => [...current, userMessage])
    setDraft('')
    setIsSending(true)

    setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: 'Thanks for your question. Share more details and we will help you interpret the report or scope the next steps.',
        },
      ])
      setIsSending(false)
    }, 700)
  }

  return (
    <div className={`chatbot-widget ${open ? 'chatbot-widget-open' : ''}`}>
      {open ? (
        <div className="chatbot-panel" role="dialog" aria-label="CXO Copilot chat">
          <div className="chatbot-header">
            <div className="chatbot-heading">
              <span className="chatbot-brand-icon" aria-hidden="true">
                <Icon name="bot" />
              </span>
              <div>
                <p className="chatbot-title">CXO Copilot</p>
                <p className="chatbot-subtitle">Digital Agent</p>
              </div>
            </div>
            <button
              type="button"
              className="chatbot-close"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
            >
              x
            </button>
          </div>

          <div className="chatbot-messages" aria-live="polite">
            {chatBody}
          </div>

          <form className="chatbot-input-bar" onSubmit={handleSubmit}>
            <input
              className="chatbot-input"
              placeholder="Ask CXO Copilot about this report..."
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              aria-label="Chat message"
            />
            <Button type="submit" disabled={!draft.trim() || isSending}>
              Send
            </Button>
          </form>
        </div>
      ) : (
        <Button
          variant="floating"
          aria-label="Open CXO Copilot"
          onClick={() => setOpen(true)}
        >
          <Icon name="sparkle" />
        </Button>
      )}
    </div>
  )
}
