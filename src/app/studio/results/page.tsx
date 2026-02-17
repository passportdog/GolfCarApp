'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStudio } from '@/lib/context'
import { Generation } from '@/lib/types'
import { Loader2, Camera, Download, ArrowRight, Sparkles, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

export default function ResultsPage() {
  const router = useRouter()
  const { session, selectedPack, uploadedPhoto } = useStudio()
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

  const handleUploadYourCart = () => {
    router.push('/studio/upload')
  }

  const handleGenerateAnother = () => {
    router.push('/studio/generate')
  }

  if (isLoading || !session) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-emerald-600" />
      </div>
    )
  }

  const hasUserPhoto = !!uploadedPhoto

  return (
    <div className="h-full w-full flex flex-col bg-stone-50">
      {/* Header Bar */}
      <div className="flex-none px-6 py-4 flex items-center justify-between border-b border-stone-200 bg-white z-10">
        <div>
          <h2 className="font-semibold text-stone-900 text-sm">
            {hasUserPhoto ? 'Your Cart, Styled' : 'Preview Gallery'}
          </h2>
          <p className="text-[11px] text-stone-500">
            {hasUserPhoto 
              ? 'Tap any image to customize & export'
              : `${selectedPack?.name || 'Style Pack'} — See what's possible`
            }
          </p>
        </div>
        <button 
          onClick={handleGenerateAnother}
          className="px-3 py-1.5 rounded-lg text-stone-500 hover:bg-stone-100 text-xs font-medium transition-colors flex items-center gap-1"
        >
          <RefreshCw size={12} />
          Regenerate
        </button>
      </div>

      {/* Results Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {generations.length === 0 ? (
            [1, 2, 3].map((i) => (
              <button 
                key={i}
                onClick={() => handleSelect(`mock${i}`)}
                className="group relative aspect-[4/5] bg-stone-200 rounded-xl overflow-hidden cursor-pointer ring-1 ring-black/5 hover:ring-emerald-500 transition-all shadow-sm"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  i === 1 ? 'from-emerald-200 to-emerald-400' : 
                  i === 2 ? 'from-amber-200 to-orange-400' : 
                  'from-stone-300 to-stone-500'
                }`} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="px-3 py-1.5 bg-white rounded-full text-xs font-bold text-stone-900 shadow-sm">Edit</span>
                </div>
              </button>
            ))
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
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

      {/* Bottom CTA */}
      {!hasUserPhoto ? (
        <div className="flex-none px-6 py-5 border-t border-stone-200 bg-white">
          <button
            onClick={handleUploadYourCart}
            className="w-full h-14 rounded-xl bg-emerald-900 text-white font-semibold hover:bg-emerald-800 transition-colors shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-3"
          >
            <Camera size={20} />
            Use Your Own Cart
            <ArrowRight size={18} />
          </button>
          <p className="text-center text-[10px] text-stone-400 mt-2.5 flex items-center justify-center gap-1.5">
            <Sparkles size={10} />
            Upload a photo and we&apos;ll apply this exact style to YOUR cart
          </p>
        </div>
      ) : (
        <div className="flex-none px-6 py-5 border-t border-stone-200 bg-white">
          <button
            onClick={() => generations.length > 0 && handleSelect(generations[0].id)}
            className="w-full h-14 rounded-xl bg-emerald-900 text-white font-semibold hover:bg-emerald-800 transition-colors shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2"
          >
            <Download size={20} />
            Edit & Export
          </button>
        </div>
      )}
    </div>
  )
}
