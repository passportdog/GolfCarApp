'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStudio } from '@/lib/context'
import { createClient } from '@/lib/supabase'
import { Generation } from '@/lib/types'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ResultsPage() {
  const router = useRouter()
  const { session, uploadedPhoto, setGeneration } = useStudio()
  const [generations, setGenerations] = useState<Generation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const fetchGenerations = useCallback(async () => {
    if (!session) return

    try {
      const { data, error } = await supabase
        .from('generations')
        .select('*')
        .eq('session_id', session.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })

      if (error) throw error

      setGenerations(data || [])
    } catch (error) {
      console.error('Error fetching generations:', error)
      toast.error('Failed to load results')
    } finally {
      setIsLoading(false)
    }
  }, [session, supabase])

  useEffect(() => {
    if (!session) {
      router.push('/studio')
      return
    }

    fetchGenerations()
  }, [fetchGenerations, router, session])

  const handleSelect = (generationId: string) => {
    const selected = generations.find((gen) => gen.id === generationId) || null
    setGeneration(selected)
    router.push(`/studio/edit?id=${generationId}`)
  }

  if (!session) return null

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="h-full w-full flex flex-col bg-stone-50">
      <div className="flex-none px-6 py-4 flex items-center justify-between border-b border-stone-200 bg-white z-10">
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-semibold">
            Feed (4:5)
          </button>
          <button className="px-3 py-1.5 rounded-lg text-stone-500 hover:bg-stone-100 text-xs font-medium transition-colors">
            Story (9:16)
          </button>
        </div>
        <button className="text-xs text-stone-500 hover:text-emerald-700 font-medium">Select All</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {generations.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500">
            No completed generations yet.
          </div>
        ) : (
          generations.map((gen) => (
            <button
              key={gen.id}
              onClick={() => handleSelect(gen.id)}
              className="group relative aspect-[4/5] bg-stone-200 rounded-xl overflow-hidden cursor-pointer ring-1 ring-black/5 hover:ring-emerald-500 transition-all shadow-sm"
            >
              {gen.result_url ? (
                <img src={gen.result_url} alt="Generated" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-stone-300" />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="px-3 py-1.5 bg-white rounded-full text-xs font-bold text-stone-900 shadow-sm">Edit</span>
              </div>
            </button>
          ))
        )}
      </div>

      <div className="border-t border-stone-200 bg-white px-6 py-4">
        {!uploadedPhoto ? (
          <button
            onClick={() => router.push('/studio/upload')}
            className="w-full h-12 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-medium transition-colors"
          >
            Use Your Own Cart
          </button>
        ) : (
          <button
            onClick={() => {
              const firstGen = generations[0]
              if (firstGen) {
                handleSelect(firstGen.id)
              } else {
                router.push('/studio/edit')
              }
            }}
            className="w-full h-12 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-medium transition-colors"
          >
            Edit & Export
          </button>
        )}
      </div>
    </div>
  )
}
