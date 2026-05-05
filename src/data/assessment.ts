export type IconName = 'calendar' | 'shield' | 'growth' | 'bolt' | 'bot'

export type AssessmentCategory = {
  id: string
  title: string
  shortTitle: string
  description: string
  score: number
  maxScore: number
  color: string
  darkColor: string
  tint: string
  icon: IconName
  rows: AssessmentRow[]
}

export type AssessmentRow = {
  consideration: string
  performance: 'High' | 'Medium' | 'Low' | 'Undiscovered'
  notes: string
  linkLabel?: string
}

export type AccessRequest = {
  access: string
  discover: string[]
  outcome: string[]
}

export const reportMeta = {
  assessment: 'Q2 2026 Assessment',
  client: 'NorthShoreCare',
  overallScore: 69,
  overallMaxScore: 100,
}

export const categories: AssessmentCategory[] = [
  {
    id: 'technology',
    title: 'Tech & Platform Performance',
    shortTitle: 'Tech & Platform',
    description: 'Performance, security, compliance & backend setup',
    score: 23,
    maxScore: 25,
    color: '#22c55e',
    darkColor: '#16784b',
    tint: '#edf9f2',
    icon: 'shield',
    rows: [
      {
        consideration: 'Core Web Vitals - Web',
        performance: 'Medium',
        notes:
          'Score is 63. Time to load is 3.5 seconds across Safari, Chrome and 4.5 in Opera. 8 common issues & 13 code-specific issues.',
        linkLabel: 'Learn more',
      },
      {
        consideration: 'Core Web Vitals - Mobile',
        performance: 'Low',
        notes:
          'Score is 32. Time to load is 5.5 seconds across Safari, Chrome and 2.5 in Opera. 19 common issues & 20 code-specific issues.',
        linkLabel: 'Learn more',
      },
      {
        consideration: 'Coding Best Practices',
        performance: 'Undiscovered',
        notes: 'Extensions, plugins, code vulnerabilities assessment pending.',
        linkLabel: 'Learn more',
      },
      {
        consideration: 'Security - Web',
        performance: 'High',
        notes: '3 recommendations identified, no critical issues.',
        linkLabel: 'Learn more',
      },
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing, Conversions & Growth',
    shortTitle: 'Marketing & Growth',
    description: 'User experience, purchase path & top-of-funnel growth',
    score: 19,
    maxScore: 25,
    color: '#f97316',
    darkColor: '#c45120',
    tint: '#fff1e7',
    icon: 'growth',
    rows: [
      {
        consideration: 'User Journey Analysis',
        performance: 'Low',
        notes:
          'Many user friction points with seamless transaction opportunities, no cross/up-sell, page load times high, minimal FAQ/User Review buildout.',
        linkLabel: 'Learn more',
      },
      {
        consideration: 'Conversion Experience & Maturity',
        performance: 'Medium',
        notes:
          'Competitors allow pay overtime feature for large purchases, only allow Visa & MasterCard, no AMEX, Apple Pay, Google Pay, etc.',
        linkLabel: 'Learn more',
      },
      {
        consideration: 'Digital Engagement Feature Maturity',
        performance: 'Medium',
        notes:
          'Minimal visible use of personalization, no tracking, no authenticated user features, wish list, etc.',
        linkLabel: 'Learn more',
      },
      {
        consideration: 'Authenticated User Experience',
        performance: 'Medium',
        notes: 'Organization currently requires a manual onboarding feature.',
        linkLabel: 'Learn more',
      },
    ],
  },
  {
    id: 'gtm',
    title: 'Digital GTM Efficiency',
    shortTitle: 'Digital GTM',
    description: 'Internal processes & business functions efficiency',
    score: 18,
    maxScore: 25,
    color: '#7c3aed',
    darkColor: '#6d28d9',
    tint: '#f1eafe',
    icon: 'bolt',
    rows: [
      {
        consideration: 'BPO using Automation & A.I.',
        performance: 'Undiscovered',
        notes:
          'Use of AI within common business processes associated with digital, MarTech & Digital GTM functions.',
        linkLabel: 'Learn more',
      },
      {
        consideration: 'ContentOps Maturity',
        performance: 'Undiscovered',
        notes:
          'Channel content management, use of SEO/GEO best practices within content deployment, aggressiveness of content calendar, campaign plans & analytics.',
        linkLabel: 'Learn more',
      },
      {
        consideration: 'SDLC Process Oversight',
        performance: 'Undiscovered',
        notes: 'Software development lifecycle process assessment pending.',
        linkLabel: 'Learn more',
      },
      {
        consideration: 'Authenticated User Behavior / Account Functionality',
        performance: 'Undiscovered',
        notes: 'Internal process efficiency for user management assessment pending.',
        linkLabel: 'Learn more',
      },
    ],
  },
  {
    id: 'automation',
    title: 'Automation & AI',
    shortTitle: 'Automation & AI',
    description: 'AI integration in business processes & digital operations',
    score: 9,
    maxScore: 25,
    color: '#2563eb',
    darkColor: '#1d4ed8',
    tint: '#eaf5ff',
    icon: 'bot',
    rows: [
      {
        consideration: 'AI-Powered Customer Experience',
        performance: 'Undiscovered',
        notes:
          'Assessment of AI integration in customer-facing touchpoints and personalization engines.',
        linkLabel: 'Learn more',
      },
      {
        consideration: 'Marketing Automation & AI',
        performance: 'Undiscovered',
        notes:
          'Evaluation of AI usage in marketing workflows, campaign optimization, and predictive analytics.',
        linkLabel: 'Learn more',
      },
      {
        consideration: 'Operational AI & Process Automation',
        performance: 'Undiscovered',
        notes:
          'Assessment of AI/ML usage in internal operations, inventory management, and business intelligence.',
        linkLabel: 'Learn more',
      },
      {
        consideration: 'Authenticated User Behavior / Account Functionality',
        performance: 'Undiscovered',
        notes: 'Internal process efficiency for user management assessment pending.',
        linkLabel: 'Learn more',
      },
    ],
  },
]

export const accessRequests: AccessRequest[] = [
  {
    access: 'Digital Platform (Read-Only)',
    discover: ['Usage of coding best practices', 'Analyze usage of 3rd Party Plugins'],
    outcome: [
      'Identify opportunities for performance optimizations',
      'Identify security, performance or compliance gaps',
    ],
  },
  {
    access: 'Analytics & Reporting Access',
    discover: ['Tracking elements & dashboard configurations across channels & properties'],
    outcome: ['Review alignment of dashboards to business KPIs & decision making processes'],
  },
  {
    access: 'Compliance Management Solution',
    discover: ['Risk exposure due to current non-compliance of consumer data protection & privacy laws'],
    outcome: ['Recommend efficient steps to compliance - Business Processes, Tech & Digital Asset Creation'],
  },
  {
    access: 'Account Created',
    discover: ['Current ecosystem has an authenticated experience for customers'],
    outcome: ['Analyze behavior'],
  },
]

export const footerColumns = [
  {
    title: 'Home',
    links: ['What is Ontology?', 'Technology Services', 'How We Deliver', 'Measurable impact of CXO'],
  },
  {
    title: 'Our Capabilities',
    links: ['Platform Capabilities', 'Engagement Models', 'Delivery Framework', 'Services Targeted'],
  },
  {
    title: 'How We Deliver',
    links: ['About Us', 'Our Leadership Team', 'How We Deliver', 'Who We Serve', 'Our Mission & Vision'],
  },
]
