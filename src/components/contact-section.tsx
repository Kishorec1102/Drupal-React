import { useEffect, useState, type FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { getWebformElements, submitWebform } from '@/api/webform'

type WebformElementDefinition = {
  '#title'?: string
  '#required'?: boolean
}

type WebformElementMap = Record<string, WebformElementDefinition>
type ContactField =
  | 'firstName'
  | 'lastName'
  | 'businessEmail'
  | 'companyName'
  | 'jobTitle'
  | 'message'

type FieldErrors = Partial<Record<ContactField, string>>

const defaultLabels: Record<string, string> = {
  first_name: 'First Name',
  last_name: 'Last Name',
  business_email: 'Business Email',
  company_name: 'Company Name',
  job_title: 'Job Title',
  your_message: 'Your Message',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const getFieldError = (field: ContactField, value: string) => {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return 'This field is required.'
  }

  if (
    (field === 'firstName' || field === 'lastName') &&
    trimmedValue.length < 2
  ) {
    return 'Enter at least 2 characters.'
  }

  if (field === 'businessEmail' && !emailPattern.test(trimmedValue)) {
    return 'Enter a valid email address.'
  }

  if (field === 'message' && trimmedValue.length < 10) {
    return 'Enter at least 10 characters.'
  }

  return ''
}

const getFormErrors = (values: Record<ContactField, string>) => {
  return Object.entries(values).reduce<FieldErrors>(
    (errors, [field, value]) => {
      const error = getFieldError(field as ContactField, value)

      if (error) {
        errors[field as ContactField] = error
      }

      return errors
    },
    {},
  )
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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<ContactField, boolean>>
  >({})

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

  const formValues: Record<ContactField, string> = {
    firstName,
    lastName,
    businessEmail,
    companyName,
    jobTitle,
    message,
  }

  const currentErrors = getFormErrors(formValues)
  const canSubmit =
    Object.values(formValues).every((value) => value.trim()) &&
    Object.keys(currentErrors).length === 0

  const handleTyping = (
    field: ContactField,
    value: string,
    update: (nextValue: string) => void,
  ) => {
    update(value)
    setTouchedFields((current) => ({ ...current, [field]: true }))
    setFieldErrors((current) => {
      const error = getFieldError(field, value)
      const nextErrors = { ...current }

      if (error) {
        nextErrors[field] = error
      } else {
        delete nextErrors[field]
      }

      return nextErrors
    })

    if (status === 'error') {
      setStatus('idle')
      setStatusMessage(null)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = getFormErrors(formValues)

    if (Object.keys(nextErrors).length > 0) {
      setTouchedFields({
        firstName: true,
        lastName: true,
        businessEmail: true,
        companyName: true,
        jobTitle: true,
        message: true,
      })
      setFieldErrors(nextErrors)
      setStatus('error')
      setStatusMessage('Please fix the highlighted fields before submitting.')
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
      setFieldErrors({})
      setTouchedFields({})
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

  const showError = (field: ContactField) =>
    touchedFields[field] ? fieldErrors[field] : undefined

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
        <div className="form-field">
          <Input
            placeholder={getPlaceholder('first_name')}
            aria-label="First name"
            aria-describedby="first-name-error"
            aria-invalid={Boolean(showError('firstName'))}
            className={showError('firstName') ? 'field-invalid' : undefined}
            required
            value={firstName}
            onChange={(event) =>
              handleTyping('firstName', event.target.value, setFirstName)
            }
          />
          <p className="field-error" id="first-name-error">
            {showError('firstName')}
          </p>
        </div>
        <div className="form-field">
          <Input
            placeholder={getPlaceholder('last_name')}
            aria-label="Last name"
            aria-describedby="last-name-error"
            aria-invalid={Boolean(showError('lastName'))}
            className={showError('lastName') ? 'field-invalid' : undefined}
            required
            value={lastName}
            onChange={(event) =>
              handleTyping('lastName', event.target.value, setLastName)
            }
          />
          <p className="field-error" id="last-name-error">
            {showError('lastName')}
          </p>
        </div>
        <div className="form-field">
          <Input
            placeholder={getPlaceholder('business_email')}
            aria-label="Business email"
            aria-describedby="business-email-error"
            aria-invalid={Boolean(showError('businessEmail'))}
            className={
              showError('businessEmail') ? 'field-invalid' : undefined
            }
            type="email"
            required
            value={businessEmail}
            onChange={(event) =>
              handleTyping(
                'businessEmail',
                event.target.value,
                setBusinessEmail,
              )
            }
          />
          <p className="field-error" id="business-email-error">
            {showError('businessEmail')}
          </p>
        </div>
        <div className="form-field">
          <Input
            placeholder={getPlaceholder('company_name')}
            aria-label="Company name"
            aria-describedby="company-name-error"
            aria-invalid={Boolean(showError('companyName'))}
            className={showError('companyName') ? 'field-invalid' : undefined}
            required
            value={companyName}
            onChange={(event) =>
              handleTyping('companyName', event.target.value, setCompanyName)
            }
          />
          <p className="field-error" id="company-name-error">
            {showError('companyName')}
          </p>
        </div>
        <div className="form-field">
          <Input
            placeholder={getPlaceholder('job_title')}
            aria-label="Job title"
            aria-describedby="job-title-error"
            aria-invalid={Boolean(showError('jobTitle'))}
            className={showError('jobTitle') ? 'field-invalid' : undefined}
            required
            value={jobTitle}
            onChange={(event) =>
              handleTyping('jobTitle', event.target.value, setJobTitle)
            }
          />
          <p className="field-error" id="job-title-error">
            {showError('jobTitle')}
          </p>
        </div>
        <div className="form-field form-field-wide">
          <Textarea
            placeholder={getPlaceholder('your_message')}
            aria-label="Your message"
            aria-describedby="message-error"
            aria-invalid={Boolean(showError('message'))}
            className={showError('message') ? 'field-invalid' : undefined}
            required
            value={message}
            onChange={(event) =>
              handleTyping('message', event.target.value, setMessage)
            }
          />
          <p className="field-error" id="message-error">
            {showError('message')}
          </p>
        </div>
        <p className="privacy-note">
          <span>!</span>
          CXO will not use this data for marketing and promotional purposes or
          share this data with any third-party organizations.
        </p>
        {statusMessage ? (
          <Alert
            className="contact-alert"
            variant={status === 'success' ? 'success' : 'error'}
            aria-live="polite"
          >
            {statusMessage}
          </Alert>
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
