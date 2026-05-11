import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  sendCopilotMessage,
  startCopilotConversation,
} from '@/api/copilot'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'

type ChatMessage = {
  id: string
  role: 'assistant' | 'user'
  text: string
}

const initialMessages: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    text: "Hi! I'm the CXO Assessment Assistant. I can answer questions about CXO Client's digital ecosystem findings. What would you like to explore?",
  },
]

export function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [conversationId, setConversationId] = useState<string>()
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [draft, setDraft] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [connectionError, setConnectionError] = useState<string>()
  const messagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, isSending, connectionError])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmed = draft.trim()

    if (!trimmed || isSending) {
      return
    }

    setConnectionError(undefined)
    setDraft('')
    setIsSending(true)
    setMessages((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        text: trimmed,
      },
    ])

    try {
      let activeConversationId = conversationId

      if (!activeConversationId) {
        const conversation = await startCopilotConversation()
        activeConversationId = conversation.conversationId
        setConversationId(conversation.conversationId)
      }

      const reply = await sendCopilotMessage(trimmed, activeConversationId)

      if (reply.conversationId) {
        setConversationId(reply.conversationId)
      }

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: reply.text,
        },
      ])
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'The assistant could not be reached.'

      setConnectionError(message)
    } finally {
      setIsSending(false)
    }
  }

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

          <div className="chatbot-messages" ref={messagesRef} aria-live="polite">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chatbot-message chatbot-message-${message.role}`}
              >
                <p>{message.text}</p>
              </div>
            ))}
            {isSending ? (
              <div className="chatbot-message chatbot-message-assistant chatbot-typing">
                <span />
                <span />
                <span />
              </div>
            ) : null}
            {connectionError ? (
              <p className="chatbot-error" role="alert">
                {connectionError}
              </p>
            ) : null}
          </div>

          <form className="chatbot-input-bar" onSubmit={handleSubmit}>
            <input
              className="chatbot-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask about this assessment..."
              aria-label="Ask CXO Assistant"
            />
            <button
              type="submit"
              className="chatbot-send"
              disabled={!draft.trim() || isSending}
              aria-label="Send message"
            >
              <Icon name="send" />
            </button>
          </form>
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
