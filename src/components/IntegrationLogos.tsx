import {
  Asana,
  ClickUp,
  Figma,
  GitHubDark,
  GoogleAnalytics,
  GoogleSheets,
  GranolaLight,
  Linear,
  Loom,
  MicrosoftExcel,
  MicrosoftTeams,
  Notion,
  PostHog,
  Salesforce,
  Slack,
  Trello,
  Zoom,
} from '@ridemountainpig/svgl-react'
import type { ComponentType, SVGProps } from 'react'

type LogoComponent = ComponentType<SVGProps<SVGSVGElement>>

type LogoTile = {
  name: string
  Logo: LogoComponent
  className: string
}

const logos: LogoTile[] = [
  { name: 'Granola', Logo: GranolaLight, className: 'left-[8%] top-[5%] rotate-[-7deg]' },
  { name: 'PostHog', Logo: PostHog, className: 'right-[18%] top-[4%] rotate-[5deg]' },
  { name: 'Slack', Logo: Slack, className: 'right-[4%] top-[22%] rotate-[7deg]' },
  { name: 'Linear', Logo: Linear, className: 'left-[44%] top-[8%] rotate-[-6deg]' },
  { name: 'GitHub', Logo: GitHubDark, className: 'right-[10%] bottom-[13%] rotate-[8deg]' },
  { name: 'Notion', Logo: Notion, className: 'left-[33%] bottom-[7%] rotate-[-3deg]' },
  { name: 'Figma', Logo: Figma, className: 'right-[5%] top-[57%] rotate-[-8deg]' },
  {
    name: 'Google Analytics',
    Logo: GoogleAnalytics,
    className: 'left-[6%] bottom-[20%] rotate-[4deg]',
  },
  { name: 'Google Sheets', Logo: GoogleSheets, className: 'right-[37%] top-[46%] rotate-[5deg]' },
  { name: 'Excel', Logo: MicrosoftExcel, className: 'left-[38%] top-[26%] rotate-[8deg]' },
  { name: 'Salesforce', Logo: Salesforce, className: 'right-[32%] bottom-[30%] rotate-[-5deg]' },
  { name: 'Zoom', Logo: Zoom, className: 'left-[52%] top-[66%] rotate-[4deg]' },
  { name: 'Loom', Logo: Loom, className: 'left-[17%] top-[16%] rotate-[5deg]' },
  { name: 'Asana', Logo: Asana, className: 'right-[8%] top-[9%] rotate-[5deg]' },
  { name: 'Trello', Logo: Trello, className: 'left-[59%] bottom-[6%] rotate-[-7deg]' },
  { name: 'ClickUp', Logo: ClickUp, className: 'right-[18%] top-[73%] rotate-[6deg]' },
  {
    name: 'Microsoft Teams',
    Logo: MicrosoftTeams,
    className: 'left-[24%] bottom-[31%] rotate-[-6deg]',
  },
]

export function IntegrationLogos() {
  return (
    <div
      className='pointer-events-none absolute inset-0 z-[4]'
      aria-label='Relevant product management integrations'
    >
      {logos.map(({ name, Logo, className }) => (
        <span
          key={name}
          className={`absolute flex size-9 items-center justify-center border border-ink/80 bg-paper/95 shadow-[4px_4px_0_color-mix(in_oklch,var(--color-ink)_16%,transparent)] sm:size-10 ${className}`}
          aria-label={name}
          title={name}
        >
          <Logo
            aria-hidden
            className='size-[1.35rem] sm:size-[1.55rem]'
          />
        </span>
      ))}
    </div>
  )
}
