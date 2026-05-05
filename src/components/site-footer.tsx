import { Icon, Logo } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { footerColumns } from '@/data/assessment'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <section className="newsletter">
        <div>
          <h2>Want to stay on top of the latest digital and MarTech news?</h2>
          <p>
            Sign up for our newsletter to keep on top of What's Hot, What's New
            and What's Next!
          </p>
        </div>
        <form className="newsletter-form">
          <div>
            <Input placeholder="Enter Email Address" aria-label="Email address" />
            <Button type="button">Send</Button>
          </div>
          <p>By signing up, you agree to receive marketing communications from CXO.</p>
        </form>
      </section>

      <div className="footer-main">
        <div className="footer-brand">
          <Logo inverse />
          <a href="https://www.linkedin.com" aria-label="LinkedIn">
            <Icon name="linkedin" />
            <Icon name="arrow" />
          </a>
        </div>

        {footerColumns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h3>{column.title}</h3>
            {column.links.map((link) => (
              <a href="#top" key={link}>
                {link}
              </a>
            ))}
          </nav>
        ))}
      </div>

      <div className="legal">
        <span>© Copyright 2025-26 cxontology Private Limited. All rights reserved.</span>
        <span>Privacy Policy • Terms & Conditions</span>
      </div>
    </footer>
  )
}
