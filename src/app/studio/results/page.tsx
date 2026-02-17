'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStudio } from '@/lib/context'
import { Generation } from '@/lib/types'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ResultsPage() {
  const router = useRouter()
  const { session } = useStudio()
  const [generations, setGenerations] = useState<Generation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!session) {
      router.push('/studio')
      return
    }
    fetchGenerations()
  }, [session, router])

  const fetchGenerations = async () => {
    if (!session) return
    try {
      const supabase = (await import('@/lib/supabase')).createClient()
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
  }

  const handleSelect = (generationId: string) => {
    router.push(`/studio/edit?id=${generationId}`)
  }

  if (isLoading || !session) {
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
        <button className="text-xs text-stone-500 hover:text-emerald-700 font-medium">
          Select All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {generations.length === 0 ? (
          <>
            <button 
              onClick={() => handleSelect('mock1')}
              className="group relative aspect-[4/5] bg-stone-200 rounded-xl overflow-hidden cursor-pointer ring-1 ring-black/5 hover:ring-emerald-500 transition-all shadow-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-emerald-400" />
              <div className="absolute inset-0 flex flex-col justify-end p-3">
                <div className="bg-white/90 backdrop-blur px-2 py-1 rounded self-start mb-1">
                  <span className="text-[8px] font-bold text-emerald-900 uppercase">New Arrival</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="px-3 py-1.5 bg-white rounded-full text-xs font-bold text-stone-900 shadow-sm">Edit</span>
              </div>
            </button>
            
            <button 
              onClick={() => handleSelect('mock2')}
              className="group relative aspect-[4/5] bg-stone-200 rounded-xl overflow-hidden cursor-pointer ring-1 ring-black/5 hover:ring-emerald-500 transition-all shadow-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-orange-400" />
              <div className="absolute inset-0 flex flex-col justify-end p-3">
                <div className="bg-white/90 backdrop-blur px-2 py-1 rounded self-start mb-1">
                  <span className="text-[8px] font-bold text-emerald-900 uppercase">Street Legal</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="px-3 py-1.5 bg-white rounded-full text-xs font-bold text-stone-900 shadow-sm">Edit</span>
              </div>
            </button>

            <button 
              onClick={() => handleSelect('mock3')}
              className="group relative aspect-[4/5] bg-stone-200 rounded-xl overflow-hidden cursor-pointer ring-1 ring-black/5 hover:ring-emerald-500 transition-all shadow-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-stone-300 to-stone-500" />
              <div className="absolute inset-0 flex flex-col justify-end p-3">
                <div className="bg-white/90 backdrop-blur px-2 py-1 rounded self-start mb-1">
                  <span className="text-[8px] font-bold text-emerald-900 uppercase">Villages Ready</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="px-3 py-1.5 bg-white rounded-full text-xs font-bold text-stone-900 shadow-sm">Edit</span>
              </div>
            </button>
          </>
        ) : (
          generations.map((gen) => (
            <button 
              key={gen.id}
              onClick={() => handleSelect(gen.id)}
              className="group relative aspect-[4/5] bg-stone-200 rounded-xl overflow-hidden cursor-pointer ring-1 ring-black/5 hover:ring-emerald-500 transition-all shadow-sm"
            >
              {gen.result_url ? (
                <img 
                  src={gen.result_url} 
                  alt="Generated" 
                  className="w-full h-full object-cover"
                />
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
    </div>
  )
}
