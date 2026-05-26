import {
  BookOpenTextIcon,
  BrowserIcon,
  ChartBarIcon,
  ChatCircleTextIcon,
  ChatsCircleIcon,
  ClipboardTextIcon,
  DatabaseIcon,
  EnvelopeIcon,
  FileArrowUpIcon,
  FileCsvIcon,
  FileTextIcon,
  MicrophoneStageIcon,
  NewspaperClippingIcon,
  PhoneCallIcon,
  QuestionIcon,
  RowsIcon,
  TrendUpIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react'
import {
  ClickUp,
  Figma,
  GitHubDark,
  Linear,
  Notion,
  PostHog,
  Slack,
} from '@ridemountainpig/svgl-react'
import Matter from 'matter-js'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ComponentType, SVGProps } from 'react'

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

type InputCard = {
  label: string
  tone: string
  Icon: IconComponent
}

type BoundaryBody = {
  body: Matter.Body
  w: number
  h: number
}

type MatterMouseWithHandlers = Matter.Mouse & {
  mousemove?: EventListener
  mousedown?: EventListener
  mouseup?: EventListener
  mousewheel?: EventListener
}

const cards: InputCard[] = [
  { label: 'Customer calls', tone: '#f3e2df', Icon: PhoneCallIcon },
  { label: 'Support tickets', tone: '#f3dfb8', Icon: ChatCircleTextIcon },
  { label: 'Founder memory', tone: '#f6f1e8', Icon: BookOpenTextIcon },
  { label: 'Slack threads', tone: '#f1eee6', Icon: Slack },
  { label: 'User interviews', tone: '#cfe0ee', Icon: MicrophoneStageIcon },
  { label: 'GitHub issues', tone: '#e6e3da', Icon: GitHubDark },
  { label: 'Linear issues', tone: '#dcdff0', Icon: Linear },
  { label: 'PostHog events', tone: '#f5d2a3', Icon: PostHog },
  { label: 'Activation drop-off', tone: '#cfe0ee', Icon: ChartBarIcon },
  { label: 'Sales calls', tone: '#f3e2df', Icon: TrendUpIcon },
  { label: 'CSV exports', tone: '#e5dcc5', Icon: FileCsvIcon },
  { label: 'Old PRDs', tone: '#f6f1e8', Icon: FileTextIcon },
  { label: 'Roadmap.xlsx', tone: '#f3dfb8', Icon: RowsIcon },
  { label: 'Email feedback', tone: '#f3e2df', Icon: EnvelopeIcon },
  { label: 'Research notes', tone: '#e6e3da', Icon: NewspaperClippingIcon },
  { label: 'User stories', tone: '#dcebd0', Icon: UsersThreeIcon },
  { label: 'Analytics gaps', tone: '#cfe0ee', Icon: ChartBarIcon },
  { label: 'Feature request', tone: '#f3dfb8', Icon: QuestionIcon },
  { label: 'Data warehouse', tone: '#e6e3da', Icon: DatabaseIcon },
  { label: 'Stakeholder notes', tone: '#f6f1e8', Icon: ClipboardTextIcon },
  { label: 'Prototype branch', tone: '#dcebd0', Icon: FileArrowUpIcon },
  { label: 'Intercom tickets', tone: '#cfe0ee', Icon: ChatCircleTextIcon },
  { label: 'Slack messages', tone: '#f1eee6', Icon: Slack },
  { label: 'User uploads', tone: '#e5dcc5', Icon: FileArrowUpIcon },
  { label: 'Emails', tone: '#f3dfb8', Icon: EnvelopeIcon },
  { label: 'Miro boards', tone: '#f3dfb8', Icon: NewspaperClippingIcon },
  { label: 'Jira tickets', tone: '#cfe0ee', Icon: ClipboardTextIcon },
  { label: 'Granola notes', tone: '#dcebd0', Icon: FileTextIcon },
  { label: 'Amplitude charts', tone: '#cfe0ee', Icon: ChartBarIcon },
  { label: 'ClickUp tasks', tone: '#f3e2df', Icon: ClickUp },
  { label: 'Figma comments', tone: '#f3e2df', Icon: Figma },
  { label: 'Customer feedback', tone: '#f3e2df', Icon: ChatCircleTextIcon },
  { label: 'Session replay', tone: '#dcdff0', Icon: BrowserIcon },
  { label: 'Community posts', tone: '#dcebd0', Icon: ChatsCircleIcon },
  { label: 'Notion docs', tone: '#f6f1e8', Icon: Notion },
  { label: 'Research repo', tone: '#e5ece4', Icon: BookOpenTextIcon },
  { label: 'Stakeholder decks', tone: '#f3e2df', Icon: NewspaperClippingIcon },
]

const desktopEvidenceLabels = new Set([
  'Customer calls',
  'Support tickets',
  'Founder memory',
  'Slack threads',
  'User interviews',
  'GitHub issues',
  'Linear issues',
  'PostHog events',
  'Activation drop-off',
  'Old PRDs',
  'Roadmap.xlsx',
  'Customer feedback',
  'Research repo',
  'Stakeholder decks',
])

const mobileCardLabels = new Set([
  'Customer calls',
  'Support tickets',
  'Founder memory',
  'Slack threads',
  'User interviews',
  'GitHub issues',
  'PostHog events',
  'Old PRDs',
  'Roadmap.xlsx',
  'Feature request',
])

function removeMatterMouseListeners(mouse: Matter.Mouse) {
  const matterMouse = mouse as MatterMouseWithHandlers
  const { element } = matterMouse

  if (matterMouse.mousemove) {
    element.removeEventListener('mousemove', matterMouse.mousemove)
    element.removeEventListener('touchmove', matterMouse.mousemove)
  }

  if (matterMouse.mousedown) {
    element.removeEventListener('mousedown', matterMouse.mousedown)
    element.removeEventListener('touchstart', matterMouse.mousedown)
  }

  if (matterMouse.mouseup) {
    element.removeEventListener('mouseup', matterMouse.mouseup)
    element.removeEventListener('touchend', matterMouse.mouseup)
  }

  if (matterMouse.mousewheel) {
    element.removeEventListener('wheel', matterMouse.mousewheel)
    element.removeEventListener('DOMMouseScroll', matterMouse.mousewheel)
  }
}

function setBoundary(boundary: BoundaryBody, x: number, y: number, nextW: number, nextH: number) {
  Matter.Body.scale(boundary.body, nextW / boundary.w, nextH / boundary.h)
  Matter.Body.setPosition(boundary.body, { x, y })
  boundary.w = nextW
  boundary.h = nextH
}

export function InputGravityHero() {
  const sceneRef = useRef<HTMLDivElement | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isMobileScene, setIsMobileScene] = useState<boolean | null>(null)
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null)

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 639px)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      setIsMobileScene(mobileQuery.matches)
      setReducedMotion(motionQuery.matches)
    }

    update()
    mobileQuery.addEventListener('change', update)
    motionQuery.addEventListener('change', update)

    return () => {
      mobileQuery.removeEventListener('change', update)
      motionQuery.removeEventListener('change', update)
    }
  }, [])

  const visibleCards = useMemo(
    () =>
      cards.filter(card =>
        isMobileScene ? mobileCardLabels.has(card.label) : desktopEvidenceLabels.has(card.label),
      ),
    [isMobileScene],
  )

  useEffect(() => {
    if (reducedMotion !== false) return
    if (isMobileScene === null) return
    const scene = sceneRef.current
    if (!scene) return

    const Engine = Matter.Engine
    const Runner = Matter.Runner
    const Bodies = Matter.Bodies
    const Composite = Matter.Composite
    const Mouse = Matter.Mouse
    const MouseConstraint = Matter.MouseConstraint
    const Events = Matter.Events
    const engine = Engine.create()
    engine.gravity.y = 1
    engine.positionIterations = 10
    engine.velocityIterations = 8

    const getSize = () => ({
      w: scene.clientWidth,
      h: scene.clientHeight,
    })

    let { w: width, h: height } = getSize()
    const wallThickness = 400

    const ground = Bodies.rectangle(
      width / 2,
      height + wallThickness / 2,
      width * 3,
      wallThickness,
      {
        isStatic: true,
      },
    )
    const ceiling = Bodies.rectangle(
      width / 2,
      -wallThickness / 2 - 800,
      width * 3,
      wallThickness,
      {
        isStatic: true,
      },
    )
    const leftWall = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 6, {
      isStatic: true,
    })
    const rightWall = Bodies.rectangle(
      width + wallThickness / 2,
      height / 2,
      wallThickness,
      height * 6,
      {
        isStatic: true,
      },
    )
    const boundaries = {
      ground: { body: ground, w: width * 3, h: wallThickness },
      ceiling: { body: ceiling, w: width * 3, h: wallThickness },
      leftWall: { body: leftWall, w: wallThickness, h: height * 6 },
      rightWall: { body: rightWall, w: wallThickness, h: height * 6 },
    }
    Composite.add(engine.world, [ground, ceiling, leftWall, rightWall])

    const dimensions = visibleCards.map((_, index) => {
      const element = cardRefs.current[index]
      const rect = element?.getBoundingClientRect()
      return {
        w: rect?.width ? Math.ceil(rect.width) : 144,
        h: rect?.height ? Math.ceil(rect.height) : 42,
      }
    })

    const bodies = dimensions.map(({ w, h }, index) => {
      const laneWidth = isMobileScene ? Math.max(150, width * 0.74) : Math.max(250, width * 0.4)
      const laneStart = isMobileScene ? 0 : width - laneWidth - 32
      const x = isMobileScene
        ? Math.max(w / 2, Math.min(width - w / 2, Math.random() * width))
        : Math.max(w / 2, Math.min(width - w / 2, laneStart + Math.random() * laneWidth))
      const y =
        -120 - index * (isMobileScene ? 38 : 19) - Math.random() * (isMobileScene ? 120 : 58)
      const body = Bodies.rectangle(x, y, w, h, {
        restitution: 0.08,
        friction: 0.5,
        frictionStatic: 0.9,
        frictionAir: 0.026,
        density: 0.0015,
        angle: (Math.random() - 0.5) * 0.45,
      })
      Matter.Body.setVelocity(body, {
        x: isMobileScene ? (Math.random() - 0.5) * 2.4 : -0.35 - Math.random() * 0.8,
        y: 0,
      })
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08)
      return { body, w, h }
    })

    Composite.add(
      engine.world,
      bodies.map(entry => entry.body),
    )

    const runner = Runner.create()
    Runner.run(runner, engine)

    let mouse: Matter.Mouse | null = null
    let mouseConstraint: Matter.MouseConstraint | null = null
    if (!isMobileScene) {
      mouse = Mouse.create(scene)
      mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: 0.12,
          damping: 0.2,
          render: { visible: false },
        },
      })
      Composite.add(engine.world, mouseConstraint)

      const wheelHandler = (mouse as MatterMouseWithHandlers).mousewheel
      if (wheelHandler) {
        scene.removeEventListener('wheel', wheelHandler)
        scene.removeEventListener('DOMMouseScroll', wheelHandler)
      }
    }

    const maxSpeed = 40
    const clampBodies = () => {
      const dragged = mouseConstraint?.body
      bodies.forEach(({ body, w, h }) => {
        if (body === dragged) return
        const speed = Math.hypot(body.velocity.x, body.velocity.y)
        if (speed > maxSpeed) {
          const k = maxSpeed / speed
          Matter.Body.setVelocity(body, { x: body.velocity.x * k, y: body.velocity.y * k })
        }
        const minX = w / 2
        const maxX = width - w / 2
        const maxY = height - h / 2
        let { x, y } = body.position
        let corrected = false
        if (x < minX) {
          x = minX
          corrected = true
        } else if (x > maxX) {
          x = maxX
          corrected = true
        }
        if (y > maxY) {
          y = maxY
          corrected = true
        }
        if (corrected) {
          Matter.Body.setPosition(body, { x, y })
          Matter.Body.setVelocity(body, { x: body.velocity.x * 0.4, y: body.velocity.y * 0.4 })
        }
      })
    }
    Events.on(engine, 'beforeUpdate', clampBodies)

    let raf = 0
    const update = () => {
      bodies.forEach((entry, index) => {
        const element = cardRefs.current[index]
        if (!element) return
        const w = element.offsetWidth || entry.w
        const h = element.offsetHeight || entry.h
        if (Math.abs(w - entry.w) > 1 || Math.abs(h - entry.h) > 1) {
          Matter.Body.scale(entry.body, w / entry.w, h / entry.h)
          entry.w = w
          entry.h = h
        }
        element.style.transform = `translate(${entry.body.position.x - entry.w / 2}px, ${
          entry.body.position.y - entry.h / 2
        }px) rotate(${entry.body.angle}rad)`
      })
      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)

    const applyBounds = () => {
      const next = getSize()
      if (next.w === width && next.h === height) return
      width = next.w
      height = next.h
      setBoundary(
        boundaries.ground,
        width / 2,
        height + wallThickness / 2,
        width * 3,
        wallThickness,
      )
      setBoundary(boundaries.ceiling, width / 2, -wallThickness / 2 - 800, width * 3, wallThickness)
      setBoundary(
        boundaries.rightWall,
        width + wallThickness / 2,
        height / 2,
        wallThickness,
        height * 6,
      )
      setBoundary(boundaries.leftWall, -wallThickness / 2, height / 2, wallThickness, height * 6)
    }

    const resizeObserver = new ResizeObserver(applyBounds)
    resizeObserver.observe(scene)
    window.addEventListener('resize', applyBounds)

    return () => {
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      window.removeEventListener('resize', applyBounds)
      Runner.stop(runner)
      if (mouseConstraint) {
        Composite.remove(engine.world, mouseConstraint)
      }
      if (mouse) {
        Mouse.clearSourceEvents(mouse)
        removeMatterMouseListeners(mouse)
      }
      Events.off(engine, 'beforeUpdate', clampBodies)
      Events.off(engine, 'beforeUpdate')
      Composite.clear(engine.world, false)
      Engine.clear(engine)
    }
  }, [visibleCards, isMobileScene, reducedMotion])

  return (
    <>
      <div className='sr-only'>
        Product inputs shown in the hero:
        <ul>
          {cards.map(card => (
            <li key={card.label}>{card.label}</li>
          ))}
        </ul>
      </div>
      <div
        ref={sceneRef}
        className={`absolute inset-0 z-[2] overflow-hidden ${
          isMobileScene === false
            ? 'cursor-grab touch-none active:cursor-grabbing'
            : 'pointer-events-none'
        }`}
        aria-hidden='true'
      >
        {visibleCards.map((card, index) => {
          const Icon = card.Icon
          const fallbackStyle =
            reducedMotion === true
              ? {
                  left: `${8 + (index % 3) * 31}%`,
                  top: `${12 + Math.floor(index / 3) * 18}%`,
                  transform: `rotate(${(index % 2 === 0 ? -1 : 1) * (4 + index)}deg)`,
                }
              : {
                  transform: 'translate(-9999px, -9999px)',
                }

          return (
            <div
              key={card.label}
              ref={element => {
                cardRefs.current[index] = element
              }}
              className='gravity-card absolute top-0 left-0 box-border flex w-fit items-center border border-ink p-2 text-ink shadow-[5px_5px_0_rgba(7,24,15,0.2)] will-change-transform'
              style={fallbackStyle}
            >
              <span
                className='flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden border border-ink/25 text-ink md:size-10'
                style={{ backgroundColor: card.tone }}
              >
                <Icon
                  aria-hidden
                  className='size-5 shrink-0 md:size-6'
                />
              </span>
              <span className='mx-3 font-mono text-sm font-medium whitespace-nowrap md:text-base'>
                {card.label}
              </span>
            </div>
          )
        })}
      </div>
    </>
  )
}
