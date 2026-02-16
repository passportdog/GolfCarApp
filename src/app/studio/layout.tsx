import { StudioProvider } from '@/lib/context'

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StudioProvider>
      <div className="h-screen w-full bg-stone-50">
        {/* Mobile Container */}
        <div className="mx-auto h-full w-full max-w-md sm:max-w-lg sm:h-[90vh] sm:mt-[5vh] sm:rounded-3xl sm:shadow-2xl sm:shadow-stone-900/10 bg-white overflow-hidden">
          {children}
        </div>
      </div>
    </StudioProvider>
  )
}