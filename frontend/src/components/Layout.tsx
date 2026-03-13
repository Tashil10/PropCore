import { Link, Outlet, useLocation } from 'react-router-dom'
import { Logo } from './Logo'

export function Layout() {
  const location = useLocation()
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-semibold tracking-tight text-primary hover:text-accent transition-colors"
          >
            <Logo className="w-8 h-8 shrink-0" />
            <span>PropCore</span>
          </Link>
          <nav className="flex items-center gap-1 p-1 rounded-[999px] bg-[rgba(184,232,255,0.1)] backdrop-blur-[20px] border border-[rgba(184,232,255,0.2)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_32px_rgba(184,232,255,0.12)]">
            <Link
              to="/"
              className={`px-4 py-2 rounded-[999px] text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-primary bg-[rgba(184,232,255,0.25)]'
                  : 'text-muted hover:text-primary'
              }`}
            >
              Properties
            </Link>
            <Link
              to="/search"
              className={`px-4 py-2 rounded-[999px] text-sm font-medium transition-colors ${
                location.pathname === '/search'
                  ? 'text-primary bg-[rgba(184,232,255,0.25)]'
                  : 'text-muted hover:text-primary'
              }`}
            >
              Search
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="mt-auto py-6 px-4 border-t border-[rgba(0,0,0,0.08)]">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-muted max-w-2xl">
            <strong className="text-primary">Tech:</strong> React 18, Vite, TypeScript, Tailwind · NestJS API, MongoDB · Gemini for embeddings (semantic search) and maintenance triage (urgency & category).
          </p>
        </div>
      </footer>
    </div>
  )
}
