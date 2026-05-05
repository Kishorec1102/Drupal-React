import { useState } from 'react'
import { Logo } from '@/components/icons'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { submitWebform } from '@/api/webform'

export function ContactSection() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [businessEmail, setBusinessEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const canSubmit =
    firstName.trim() &&
    lastName.trim() &&
    businessEmail.trim() &&
    companyName.trim() &&
    jobTitle.trim() &&
    message.trim()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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

  return (
    <section className="contact-section">
      <div className="contact-copy">
        <Logo inverse />
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
          placeholder="First Name*"
          aria-label="First name"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
        />
        <Input
          placeholder="Last Name*"
          aria-label="Last name"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
        />
        <Input
          placeholder="Business Email*"
          aria-label="Business email"
          type="email"
          value={businessEmail}
          onChange={(event) => setBusinessEmail(event.target.value)}
        />
        <Input
          placeholder="Company Name*"
          aria-label="Company name"
          value={companyName}
          onChange={(event) => setCompanyName(event.target.value)}
        />
        <Input
          placeholder="Job Title*"
          aria-label="Job title"
          value={jobTitle}
          onChange={(event) => setJobTitle(event.target.value)}
        />
        <Textarea
          placeholder="Your Message*"
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
          {status === 'submitting' ? 'Sending…' : 'Submit'}
        </Button>
      </form>
    </section>
  )
}
