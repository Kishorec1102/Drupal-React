const DEFAULT_COPILOT_CONVERSATION_URL =
  'https://3814220bfb8eed3487b7e471f83697.11.environment.api.powerplatform.com/copilotstudio/dataverse-backed/authenticated/bots/cr63f_v10CXOAssessmentAgentDEV/conversations?api-version=2022-03-01-preview'

const COPILOT_CONVERSATION_URL =
  import.meta.env.VITE_COPILOT_CONVERSATION_URL ??
  DEFAULT_COPILOT_CONVERSATION_URL

const COPILOT_ACCESS_TOKEN = import.meta.env.VITE_COPILOT_ACCESS_TOKEN

type CopilotApiResponse = {
  id?: string
  conversationId?: string
  ConversationId?: string
  conversationID?: string
  lastResponse?: string
  LastResponse?: string
  responses?: string[]
  Responses?: string[]
  activities?: CopilotActivity[]
  activity?: CopilotActivity
}

type CopilotActivity = {
  id?: string
  type?: string
  text?: string
  from?: {
    role?: string
  }
}

type CopilotConversation = {
  conversationId: string
  greeting?: string
}

type CopilotReply = {
  conversationId?: string
  text: string
}

const agentName = 'cr63f_v10CXOAssessmentAgentDEV'

function getHeaders() {
  const headers = new Headers({
    Accept: 'application/json, text/event-stream',
    'Content-Type': 'application/json',
  })

  if (COPILOT_ACCESS_TOKEN) {
    headers.set('Authorization', `Bearer ${COPILOT_ACCESS_TOKEN}`)
  }

  return headers
}

function getActivitiesUrl(conversationId: string) {
  const url = new URL(COPILOT_CONVERSATION_URL)
  const apiVersion = url.searchParams.get('api-version') ?? '2022-03-01-preview'

  url.search = ''
  url.pathname = `${url.pathname.replace(/\/$/, '')}/${conversationId}/activities`
  url.searchParams.set('api-version', apiVersion)

  return url.toString()
}

async function readCopilotResponse(response: Response) {
  const responseText = await response.text()

  if (!response.ok) {
    throw new Error(
      `Copilot request failed with ${response.status}. ${
        responseText || 'Check the authenticated bot access token and CORS settings.'
      }`,
    )
  }

  if (!responseText.trim()) {
    return {}
  }

  return parseCopilotPayload(responseText)
}

function parseCopilotPayload(responseText: string): CopilotApiResponse {
  try {
    return JSON.parse(responseText) as CopilotApiResponse
  } catch {
    const eventMessages = responseText
      .split('\n')
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.replace(/^data:\s*/, '').trim())
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line) as CopilotApiResponse
        } catch {
          return { lastResponse: line }
        }
      })

    return {
      responses: eventMessages
        .map((message) => extractReplyText(message))
        .filter(Boolean),
    }
  }
}

function extractConversationId(response: CopilotApiResponse) {
  return (
    response.conversationId ??
    response.ConversationId ??
    response.conversationID ??
    response.id
  )
}

function extractReplyText(response: CopilotApiResponse) {
  const directResponse = response.lastResponse ?? response.LastResponse

  if (directResponse) {
    return directResponse
  }

  const responses = response.responses ?? response.Responses

  if (responses?.length) {
    return responses.filter(Boolean).join('\n\n')
  }

  const activities = [
    ...(response.activity ? [response.activity] : []),
    ...(response.activities ?? []),
  ]

  return activities
    .filter((activity) => activity.type === 'message')
    .filter((activity) => activity.from?.role === 'bot' || activity.text)
    .map((activity) => activity.text)
    .filter(Boolean)
    .join('\n\n')
}

export async function startCopilotConversation(): Promise<CopilotConversation> {
  const response = await fetch(COPILOT_CONVERSATION_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      emitStartConversationEvent: true,
      locale: 'en-US',
    }),
  })

  const payload = await readCopilotResponse(response)
  const conversationId = extractConversationId(payload)

  if (!conversationId) {
    throw new Error('Copilot did not return a conversation ID.')
  }

  return {
    conversationId,
    greeting: extractReplyText(payload),
  }
}

export async function sendCopilotMessage(
  message: string,
  conversationId?: string,
): Promise<CopilotReply> {
  if (!conversationId) {
    return sendCopilotExecuteMessage(message)
  }

  const response = await fetch(getActivitiesUrl(conversationId), {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      type: 'message',
      text: message,
      from: {
        id: 'assessment-user',
        role: 'user',
      },
      conversation: {
        id: conversationId,
      },
    }),
  })

  const payload = await readCopilotResponse(response)
  const reply = extractReplyText(payload)

  return {
    conversationId: extractConversationId(payload) ?? conversationId,
    text:
      reply ||
      'I received your question, but the assistant did not return a readable response.',
  }
}

async function sendCopilotExecuteMessage(message: string): Promise<CopilotReply> {
  const response = await fetch(COPILOT_CONVERSATION_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      message,
      notificationUrl: 'https://notificationurlplaceholder',
      agentName,
    }),
  })

  const payload = await readCopilotResponse(response)
  const reply = extractReplyText(payload)

  return {
    conversationId: extractConversationId(payload),
    text:
      reply ||
      'I received your question, but the assistant did not return a readable response.',
  }
}
