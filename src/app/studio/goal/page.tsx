'use client'

import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStudio } from '@/lib/context'
import { createClient } from '@/lib/supabase'
import { ArrowRight, Tag, Camera, Users, Wrench } from 'lucide-react'
import { toast } from 'sonner'

const ROLE_GOALS = {
  employee: [
    { id: 'inventory', icon: <Tag size={20} />, title: 'New Inventory', desc: 'Showroom units & arrivals' },
    { id: 'sale', icon: <Tag size={20} />, title: 'Sale / Promo', desc: 'Price drops and offers' },
    { id: 'service', icon: <Wrench size={20} />, title: 'Service Special', desc: 'Maintenance promos' },
  ],
  customer: [
    { id: 'showcase', icon: <Camera size={20} />, title: 'My Cart Showcase', desc: 'Show off your ride' },
    { id: 'community', icon: <Users size={20} />, title: 'Community Life', desc: 'Course & neighborhood' },
  ],
}

export default function GoalPage() {
  const router = useRouter()
  const { session, userRole, setGoal } = useStudio()
  const supabase = createClient()

  useEffect(() => {
    if (!session) {
      router.push('/studio')
    }
  }, [router, session])

  const selectGoal = useCallback(
    async (goalId: string) => {
      if (!session) return

      try {
        const { error } = await supabase
          .from('sessions')
          // @ts-expect-error Supabase Database types are not generated yet in this repo.
          .update({
            goal: goalId,
            metadata: { ...(session.metadata || {}), goal_selected: goalId },
          })
          .eq('id', session.id)

        if (error) {
          console.error('Supabase error:', error)
          throw error
        }

        setGoal(goalId)
        router.push('/studio/frequency')
      } catch (error) {
        console.error('Error updating goal:', error)
        toast.error('Failed to save goal. Please try again.')
      }
    },
    [router, session, setGoal, supabase]
  )

  if (!session) return null

  const goals = userRole ? ROLE_GOALS[userRole] : []

  return (
    <div className="h-full w-full flex flex-col p-6 sm:p-10 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-medium text-emerald-950 mb-2">What are we creating today?</h2>
        <p className="text-stone-500 text-sm">We&apos;ll optimize the layout for your goal.</p>
      </div>

      <div className="space-y-3" id="goal-list">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => selectGoal(goal.id)}
            className="w-full text-left p-4 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all group flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              {goal.icon}
            </div>
            <div>
              <h3 className="font-medium text-stone-900 text-sm">{goal.title}</h3>
              <p className="text-stone-500 text-xs">{goal.desc}</p>
            </div>
            <ArrowRight size={16} className="ml-auto mt-2 text-stone-300 group-hover:text-emerald-500" />
          </button>
        ))}
      </div>

      <button onClick={() => router.push('/studio/role')} className="mt-6 text-sm text-stone-400 hover:text-stone-600">
        ← Back
      </button>
    </div>
  )
}
