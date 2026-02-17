import { StudioProvider } from '@/lib/context'

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StudioProvider>
      <div className="h-screen w-full bg-stone-100 fairway-bg">
        {/* Desktop: Centered container | Mobile: Full screen */}
        <div className="mx-auto h-full w-full max-w-[900px] sm:h-[90vh] sm:max-h-[850px] sm:mt-[5vh] sm:rounded-[2rem] bg-white shadow-2xl shadow-stone-900/10 overflow-hidden flex flex-col">
          {/* Header */}
          <header className="flex-none h-16 px-6 sm:px-8 flex items-center justify-between border-b border-stone-100 bg-white z-20">
            <div className="flex items-center gap-3">
              {/* Brand Mark */}
              <div className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center text-white shadow-md text-sm font-bold">
                V
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm tracking-tight text-emerald-950 leading-tight">Village Cart Studio</span>
                <span className="text-[10px] text-stone-500 font-medium tracking-wide uppercase">Village Discount Golf Car</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 relative overflow-hidden flex flex-col bg-stone-50/50">
            {children}
          </div>
        </div>
      </div>
    </StudioProvider>
  )
}
