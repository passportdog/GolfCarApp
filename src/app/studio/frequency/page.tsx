'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStudio } from '@/lib/context'
import { createClient } from '@/lib/supabase'
import { CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

const FREQUENCIES = [
  { id: 'daily', label: 'Daily (High Volume)' },
  { id: 'weekly', label: 'A few times a week' },
  { id: 'occasional', label: 'Just occasionally' },
]

export default function FrequencyPage() {
  const router = useRouter()
  const { session } = useStudio()
  const supabase = createClient()

  useEffect(() => {
    if (!session) router.push('/studio')
  }, [session, router])

  if (!session) return null

  const selectFrequency = async (freqId: string) => {
    try {
      const { error } = await supabase
        .from('sessions')
        // @ts-expect-error - Supabase types mismatch, runtime works correctly
        .update({ 
          metadata: { 
            ...(session.metadata || {}), 
            frequency: freqId 
          }
        })
        .eq('id', session.id)

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      router.push('/studio/style')
    } catch (error) {
      console.error('Error updating frequency:', error)
      toast.error('Failed to save frequency')
    }
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-medium text-emerald-950 mb-8 text-center">How often do you post?</h2>
      
      <div className="w-full space-y-3">
        {FREQUENCIES.map((freq) => (
          <button
            key={freq.id}
            onClick={() => selectFrequency(freq.id)}
            className="w-full p-4 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 flex items-center justify-between group transition-all"
          >
            <span className="text-stone-600 group-hover:text-emerald-900 font-medium">{freq.label}</span>
            <CheckCircle2 size={20} className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>

      <button
        onClick={() => router.push('/studio/goal')}
        className="mt-6 text-sm text-stone-400 hover:text-stone-600"
      >
        ← Back
      </button>
    </div>
  )
}
