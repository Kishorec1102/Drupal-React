import { useEffect, useState, type FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { getWebformElements, submitWebform } from '@/api/webform'

type WebformElementDefinition = {
  '#title'?: string
  '#required'?: boolean
}

type WebformElementMap = Record<string, WebformElementDefinition>

const defaultLabels: Record<string, string> = {
  first_name: 'First Name',
  last_name: 'Last Name',
  business_email: 'Business Email',
  company_name: 'Company Name',
  job_title: 'Job Title',
  your_message: 'Your Message',
}

export function ContactSection() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [businessEmail, setBusinessEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [message, setMessage] = useState('')
  const [elements, setElements] = useState<WebformElementMap>({})
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    getWebformElements()
      .then((response) => {
        if (active) {
          setElements(response as WebformElementMap)
        }
      })
      .catch((error) => {
        console.error('Unable to load Drupal webform elements', error)
      })

    return () => {
      active = false
    }
  }, [])

  const canSubmit =
    firstName.trim() &&
    lastName.trim() &&
    businessEmail.trim() &&
    companyName.trim() &&
    jobTitle.trim() &&
    message.trim()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSubmit) {
      setStatus('error')
      setStatusMessage('Please complete all required fields.')
      return
    }

    setStatus('submitting')
    setStatusMessage(null)

    try {
      await submitWebform({
        first_name: firstName,
        last_name: lastName,
        business_email: businessEmail,
        company_name: companyName,
        job_title: jobTitle,
        your_message: message,
      })

      setStatus('success')
      setStatusMessage('Thanks! Your message was submitted successfully.')
      setFirstName('')
      setLastName('')
      setBusinessEmail('')
      setCompanyName('')
      setJobTitle('')
      setMessage('')
    } catch (error) {
      console.error(error)
      setStatus('error')
      setStatusMessage(
        'Unable to submit the form. Please check your connection or credentials and try again.',
      )
    }
  }

  const getPlaceholder = (key: keyof typeof defaultLabels) => {
    const title = elements[key]?.['#title'] ?? defaultLabels[key]
    const required = elements[key]?.['#required'] ?? true

    return `${title}${required ? '*' : ''}`
  }

  return (
    <section className="contact-section">
      <div className="contact-copy">
        <h2>Let's Discuss How CXO Can Support Your Digital Goals</h2>
        <p>
          CXO is a team that understands your world - technically, functionally
          & operationally. Whether you're launching a new platform or website,
          optimizing an existing one, or navigating a complex digital
          transformation, we would love to see how we can add value.
        </p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <Input
          placeholder={getPlaceholder('first_name')}
          aria-label="First name"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
        />
        <Input
          placeholder={getPlaceholder('last_name')}
          aria-label="Last name"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
        />
        <Input
          placeholder={getPlaceholder('business_email')}
          aria-label="Business email"
          type="email"
          value={businessEmail}
          onChange={(event) => setBusinessEmail(event.target.value)}
        />
        <Input
          placeholder={getPlaceholder('company_name')}
          aria-label="Company name"
          value={companyName}
          onChange={(event) => setCompanyName(event.target.value)}
        />
        <Input
          placeholder={getPlaceholder('job_title')}
          aria-label="Job title"
          value={jobTitle}
          onChange={(event) => setJobTitle(event.target.value)}
        />
        <Textarea
          placeholder={getPlaceholder('your_message')}
          aria-label="Your message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <p className="privacy-note">
          <span>!</span>
          CXO will not use this data for marketing and promotional purposes or
          share this data with any third-party organizations.
        </p>
        {statusMessage ? (
          <p
            className={`contact-status contact-status-${status}`}
            aria-live="polite"
          >
            {statusMessage}
          </p>
        ) : null}
        <Button
          type="submit"
          className="submit-button"
          disabled={!canSubmit || status === 'submitting'}
        >
          {status === 'submitting' ? 'Sending...' : 'Submit'}
        </Button>
      </form>
    </section>
  )
}
