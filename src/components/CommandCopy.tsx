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
      className='group flex w-full max-w-142 items-center justify-between gap-4 border border-ink bg-ink px-4 py-3 text-left text-paper shadow-[8px_8px_0_var(--color-line)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rust sm:px-5'
      onClick={copyCommand}
      aria-label={
        status === 'copied'
          ? `${command} copied`
          : status === 'failed'
            ? `Copy failed. Select ${command} manually.`
            : `Copy ${command}`
      }
    >
      <span className='flex min-w-0 items-center gap-3'>
        <TerminalWindowIcon
          aria-hidden
          className='size-5 shrink-0 text-paper/75'
        />
        <code className='min-w-0 truncate text-xs text-paper sm:text-sm'>{command}</code>
      </span>
      <span className='flex size-8 shrink-0 items-center justify-center border border-paper/20 bg-paper/10 text-paper'>
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
