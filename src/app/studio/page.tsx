import { StudioProvider } from '@/lib/context'
import WelcomeScreen from '@/components/WelcomeScreen'

export default function StudioPage() {
  return (
    <StudioProvider>
      <main className="h-full w-full">
        <WelcomeScreen />
      </main>
    </StudioProvider>
  )
}