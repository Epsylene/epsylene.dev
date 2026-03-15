import Link from 'next/link'

export function LinkDir({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link className="text-green-400 hover:bg-green-400 hover:text-white" href={href}>
      {children}
    </Link>
  )
}

export function LinkFile({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link className="text-blue-400 hover:bg-blue-400 hover:text-white" href={href}>
      {children}
    </Link>
  )
}

export function HomePrompt({ children }: { children?: React.ReactNode }) {
  return (
    <span>
      <span className="after:content-['\00a0::\00a0'] after:text-[#a8a095]">
        epsylene.dev
      </span>
      <span className="after:content-['\00a0$\00a0'] after:text-[#a8a095]">
        <LinkDir href="/">~</LinkDir>
      </span>
      {children}
    </span>
  )
}