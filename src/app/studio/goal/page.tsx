'use client'

import { useRouter } from 'next/navigation'
import { useStudio } from '@/lib/context'
import { createClient } from '@/lib/supabase'
import { GOALS } from '@/lib/constants'
import { ArrowRight, Video, Package, Tag, UserCircle } from 'lucide-react'
import { toast } from 'sonner'

const GOAL_ICONS: Record<string, React.ReactNode> = {
  social_post: <Video size={24} />,
  inventory_photo: <Package size={24} />,
  promo_content: <Tag size={24} />,
  personal_share: <UserCircle size={24} />,
}

export default function GoalPage() {
  const router = useRouter()
  const { session, userRole, setGoal } = useStudio()
  const supabase = createClient()

  if (!session) {
    router.push('/studio')
    return null
  }

  const goals = userRole ? GOALS[userRole] : []

  const selectGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('sessions')
        // @ts-expect-error
        .update({ goal: goalId })
        .eq('id', session.id)

      if (error) throw error

      setGoal(goalId)
      router.push('/studio/style')
    } catch (error) {
      console.error('Error updating goal:', error)
      toast.error('Failed to save goal')
    }
  }

  return (
    <div className="h-full w-full flex flex-col p-6 sm:p-8">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-emerald-950 mb-2">
            What are we creating today?
          </h1>
          <p className="text-stone-500 text-sm">
            We&apos;ll optimize the layout for your goal.
          </p>
        </div>

        <div className="space-y-3 flex-1">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => selectGoal(goal.id)}
              className="w-full group text-left p-4 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-900/5 transition-all flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                {GOAL_ICONS[goal.id]}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-stone-900">{goal.title}</h3>
                <p className="text-stone-500 text-sm">{goal.description}</p>
              </div>
              <ArrowRight
                size={20}
                className="mt-2 text-stone-300 group-hover:text-emerald-500 transition-colors"
              />
            </button>
          ))}
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.push('/studio')}
          className="mt-6 text-sm text-stone-400 hover:text-stone-600"
        >
          ← Back
        </button>
      </div>
    </div>
  )
}
