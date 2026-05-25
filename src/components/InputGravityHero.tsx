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
  MegaphoneIcon,
  MicrophoneStageIcon,
  NewspaperClippingIcon,
  PhoneCallIcon,
  PresentationChartIcon,
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
  { label: 'Intercom tickets', tone: '#e8f1ff', Icon: ChatCircleTextIcon },
  { label: 'Linear issues', tone: '#eeefff', Icon: Linear },
  { label: 'Slack messages', tone: '#f3f0ed', Icon: Slack },
  { label: 'User uploads', tone: '#ebe4d3', Icon: FileArrowUpIcon },
  { label: 'Interviews', tone: '#f1e8ff', Icon: MicrophoneStageIcon },
  { label: 'Emails', tone: '#fff1d8', Icon: EnvelopeIcon },
  { label: 'User stories', tone: '#e7f2dc', Icon: UsersThreeIcon },
  { label: 'GitHub issues', tone: '#e9e9e4', Icon: GitHubDark },
  { label: 'Figma comments', tone: '#f1e8ff', Icon: Figma },
  { label: 'Notion docs', tone: '#f6f2e8', Icon: Notion },
  { label: 'Jira tickets', tone: '#e8f1ff', Icon: ClipboardTextIcon },
  { label: 'Granola notes', tone: '#f1f5d8', Icon: FileTextIcon },
  { label: 'PostHog events', tone: '#ffe3bf', Icon: PostHog },
  { label: 'Amplitude charts', tone: '#e8f1ff', Icon: ChartBarIcon },
  { label: 'Mixpanel cohorts', tone: '#f1e8ff', Icon: ChartBarIcon },
  { label: 'ClickUp tasks', tone: '#f1e8ff', Icon: ClickUp },
  { label: 'Miro boards', tone: '#fff2a6', Icon: NewspaperClippingIcon },
  { label: 'Attio records', tone: '#e9e9e4', Icon: DatabaseIcon },
  { label: 'HubSpot deals', tone: '#ffe8df', Icon: TrendUpIcon },
  { label: 'Call notes', tone: '#eaf1ff', Icon: FileTextIcon },
  { label: 'Customer feedback', tone: '#ffe8ef', Icon: ChatCircleTextIcon },
  { label: 'Sales calls', tone: '#eaf1ff', Icon: PhoneCallIcon },
  { label: 'CSV exports', tone: '#ebe4d3', Icon: FileCsvIcon },
  { label: 'Surveys', tone: '#fff1d8', Icon: QuestionIcon },
  { label: 'Roadmaps', tone: '#e7f2dc', Icon: RowsIcon },
  { label: 'Changelogs', tone: '#e9e9e4', Icon: ClipboardTextIcon },
  { label: 'Analytics', tone: '#dfedf4', Icon: ChartBarIcon },
  { label: 'Session replay', tone: '#f1e8ff', Icon: BrowserIcon },
  { label: 'Win/loss notes', tone: '#ffe8ef', Icon: TrendUpIcon },
  { label: 'Community posts', tone: '#e7f2dc', Icon: ChatsCircleIcon },
  { label: 'Launch notes', tone: '#fff1d8', Icon: MegaphoneIcon },
  { label: 'Data warehouse', tone: '#eaf1ff', Icon: DatabaseIcon },
  { label: 'Research repo', tone: '#e5ece4', Icon: BookOpenTextIcon },
  { label: 'Stakeholder decks', tone: '#f1e8ff', Icon: PresentationChartIcon },
]

const mobileCardLabels = new Set([
  'Intercom tickets',
  'Linear issues',
  'Slack messages',
  'Emails',
  'GitHub issues',
  'Jira tickets',
  'PostHog events',
  'Miro boards',
  'Call notes',
  'Customer feedback',
  'CSV exports',
  'Roadmaps',
  'Session replay',
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
    () => (isMobileScene ? cards.filter(card => mobileCardLabels.has(card.label)) : cards),
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
    let centerSpawnGap = Math.min(width * 0.34, 440)

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
      const side = index % 2 === 0 ? 'left' : 'right'
      const laneWidth = isMobileScene
        ? Math.max(150, width * 0.74)
        : Math.max(160, (width - centerSpawnGap) / 2)
      const laneStart = side === 'left' ? -w * 0.35 : width - laneWidth
      const x = isMobileScene
        ? Math.max(w / 2, Math.min(width - w / 2, Math.random() * width))
        : side === 'left'
          ? laneStart + Math.random() * laneWidth
          : laneStart + Math.random() * laneWidth + w * 0.35
      const y =
        -120 - index * (isMobileScene ? 34 : 16) - Math.random() * (isMobileScene ? 110 : 48)
      const body = Bodies.rectangle(x, y, w, h, {
        restitution: 0.1,
        friction: 0.42,
        frictionStatic: 0.85,
        frictionAir: 0.022,
        density: 0.0015,
        angle: (Math.random() - 0.5) * 0.45,
      })
      Matter.Body.setVelocity(body, {
        x: isMobileScene
          ? (Math.random() - 0.5) * 2.4
          : side === 'left'
            ? 0.9 + Math.random() * 1.4
            : -0.9 - Math.random() * 1.4,
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
      centerSpawnGap = Math.min(width * 0.34, 440)
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
        className={`absolute inset-0 z-0 overflow-hidden ${
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
              className='absolute top-0 left-0 box-border flex w-fit items-center border border-line bg-paper/95 p-1 text-ink shadow-[4px_4px_0_rgba(23,20,17,0.1)] backdrop-blur-sm will-change-transform'
              style={fallbackStyle}
            >
              <span
                className='flex aspect-square size-7 shrink-0 items-center justify-center overflow-hidden border border-ink/10 md:size-8'
                style={{ backgroundColor: card.tone }}
              >
                <Icon
                  aria-hidden
                  className='size-4 shrink-0 md:size-5'
                />
              </span>
              <span className='mx-3 text-xs whitespace-nowrap md:text-sm'>{card.label}</span>
            </div>
          )
        })}
      </div>
    </>
  )
}
