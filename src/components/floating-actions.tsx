import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'

export function FloatingActions() {
  return (
    <div className="floating-actions" aria-label="Quick actions">
      <Button variant="floating" aria-label="Open AI assistant">
        <Icon name="sparkle" />
      </Button>
      <Button variant="floating" aria-label="Open details">
        <Icon name="arrow" />
      </Button>
    </div>
  )
}
