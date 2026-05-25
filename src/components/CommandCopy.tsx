import { CheckIcon, CopyIcon, TerminalWindowIcon } from '@phosphor-icons/react'
import { useState } from 'react'

const command = 'npx skills add KDotIndustries/pm0'

export function CommandCopy() {
  const [copied, setCopied] = useState(false)

  async function copyCommand() {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <button
      type='button'
      className='group flex w-full max-w-142 items-center justify-between gap-4 border border-ink bg-ink px-4 py-3 text-left text-paper shadow-[8px_8px_0_#d6cbb7] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rust sm:px-5'
      onClick={copyCommand}
      aria-label='Copy PM0 install command'
    >
      <span className='flex min-w-0 items-center gap-3'>
        <TerminalWindowIcon
          aria-hidden
          className='size-5 shrink-0 text-paper/75'
        />
        <code className='min-w-0 truncate text-xs text-paper sm:text-sm'>
          {command}
        </code>
      </span>
      <span className='flex size-8 shrink-0 items-center justify-center border border-paper/20 bg-paper/10 text-paper'>
        {copied ? (
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
    </button>
  )
}
