import { CheckIcon, CopyIcon, TerminalWindowIcon } from '@phosphor-icons/react'
import { useRef, useState } from 'react'

const command = 'npx skills add KDotIndustries/pm0'
const resetDelay = 1600

async function writeClipboardText(text: string) {
  const clipboard = globalThis.navigator?.clipboard
  if (clipboard?.writeText) {
    try {
      await clipboard.writeText(text)
      return true
    } catch {
      // Fall through to the selection-based copy path below.
    }
  }

  if (typeof document.execCommand !== 'function') {
    return false
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    textarea.style.top = '0'
    document.body.append(textarea)
    textarea.select()

    try {
      return document.execCommand('copy')
    } finally {
      textarea.remove()
    }
  } catch {
    return false
  }
}

export function CommandCopy() {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const resetTimerRef = useRef<number | undefined>(undefined)
  const statusText =
    status === 'copied'
      ? 'PM0 install command copied.'
      : status === 'failed'
        ? `Copy failed. Select ${command} manually.`
        : ''

  async function copyCommand() {
    const didCopy = await writeClipboardText(command)
    setStatus(didCopy ? 'copied' : 'failed')
    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current)
    }
    resetTimerRef.current = window.setTimeout(() => setStatus('idle'), resetDelay)
  }

  return (
    <button
      type='button'
      className='group flex w-full max-w-full min-w-0 items-center justify-between gap-3 border border-command bg-paper px-4 py-3 text-left text-ink shadow-[8px_8px_0_color-mix(in_oklch,var(--color-command)_22%,transparent)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-command sm:max-w-142 sm:gap-4 sm:px-5'
      onClick={copyCommand}
      aria-label={
        status === 'copied'
          ? `${command} copied`
          : status === 'failed'
            ? `Copy failed. Select ${command} manually.`
            : `Copy ${command}`
      }
    >
      <span className='flex min-w-0 flex-1 items-center gap-3 overflow-hidden'>
        <TerminalWindowIcon
          aria-hidden
          className='size-5 shrink-0 text-command-deep'
        />
        <code className='min-w-0 truncate text-[0.72rem] text-ink sm:text-sm'>$ {command}</code>
      </span>
      <span className='flex size-8 shrink-0 items-center justify-center border border-ink/20 bg-command text-ink'>
        {status === 'copied' ? (
          <CheckIcon
            aria-hidden
            className='size-4'
          />
        ) : (
          <CopyIcon
            aria-hidden
            className='size-4'
          />
        )}
      </span>
      <span
        className='sr-only'
        aria-live='polite'
      >
        {statusText}
      </span>
    </button>
  )
}
