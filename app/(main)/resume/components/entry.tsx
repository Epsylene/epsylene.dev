import { ReactNode } from 'react'

export interface EntryProps {
  aside?: string
  title: string
  org?: string
  href?: string
  children?: ReactNode
}

export function Entry({ aside, title, org, href, children }: EntryProps) {
  return (
    <div className="flex flex-col sm:flex-row mb-5">
      <div className="w-[17ch] shrink-0 text-[var(--gray)]">
        {aside}
      </div>
      <div className="flex-1">
        <div>
          <strong>{href ? <a href={href}>{title}</a> : title}</strong>
          {org && <span className="text-[var(--gray)]"> — {org}</span>}
        </div>
        <div className="[&_p]:mb-0">
          {children}
        </div>
      </div>
    </div>
  )
}
