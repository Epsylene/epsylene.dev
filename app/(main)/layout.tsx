import { HomePrompt } from './components/links'
import { LinkDir, LinkFile } from './components/links'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="min-h-screen max-w-[75ch] mx-auto my-[2ch] p-[1ch]">
        <div className="mb-10">
          <HomePrompt><strong>ls</strong></HomePrompt>
          <nav className="flex flex-wrap gap-10">
            <span><LinkDir href="https://github.com/Epsylene">code/</LinkDir></span>
            <span><LinkDir href="/notes">notes/</LinkDir></span>
            <span><LinkDir href="/etc">etc/</LinkDir></span>
            <span><LinkFile href="/">about.md</LinkFile></span>
            <span><LinkFile href="/resume.pdf">résumé.pdf</LinkFile></span>
          </nav>
        </div>
        <main className="text mb-8">
          {children}
        </main>
        <div className="mt-10">
          <HomePrompt />
        </div>
      </div>
    </>
  );
}