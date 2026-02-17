'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStudio } from '@/lib/context'
import { createClient } from '@/lib/supabase'
import { StylePack } from '@/lib/types'
import { ArrowRight, Sparkles, Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'

const PACK_IMAGES: Record<string, string> = {
  'showroom-clean': 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg',
  'fairway-lifestyle': 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&auto=format&fit=crop',
  'neighborhood-ready': 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c543a9e1-f226-4ced-80b0-feb8445a75b9_1600w.jpg',
  'inventory-lineup': '', // Will use placeholder
}

export default function StylePage() {
  const router = useRouter()
  const { session, setSelectedPack, setStylePacks } = useStudio()
  const [packs, setPacks] = useState<StylePack[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchStylePacks()
  }, [])

  if (!session) {
    router.push('/studio')
    return null
  }

  const fetchStylePacks = async () => {
    try {
      const { data, error } = await supabase
        .from('style_packs')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')

      if (error) throw error

      setPacks(data || [])
      setStylePacks(data || [])
    } catch (error) {
      console.error('Error fetching style packs:', error)
      toast.error('Failed to load style packs')
    } finally {
      setIsLoading(false)
    }
  }

  const selectPack = async (pack: StylePack) => {
    try {
      const { error } = await supabase
        .from('sessions')
        // @ts-expect-error
        .update({ style_pack_id: pack.id })
        .eq('id', session.id)

      if (error) throw error

      setSelectedPack(pack)
      router.push('/studio/brand')
    } catch (error) {
      console.error('Error updating style pack:', error)
      toast.error('Failed to save style pack')
    }
  }

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="h-full w-full flex flex-col p-6 sm:p-10 w-full">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={20} className="text-emerald-600" />
          <h2 className="text-2xl font-medium text-emerald-950">Choose a Style Pack</h2>
        </div>
        <p className="text-stone-500 text-sm mt-1">Select the vibe for this batch of content.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto no-scrollbar pb-20">
        {packs.map((pack) => (
          <button
            key={pack.id}
            onClick={() => selectPack(pack)}
            className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-stone-200 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-900/5 transition-all text-left"
          >
            <div className="aspect-[16/9] bg-stone-100 relative overflow-hidden">
              {PACK_IMAGES[pack.slug] ? (
                <img
                  src={PACK_IMAGES[pack.slug]}
                  alt={pack.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-1 opacity-20 transform -rotate-12">
                    <div className="w-12 h-16 bg-black rounded"></div>
                    <div className="w-12 h-16 bg-black rounded"></div>
                    <div className="w-12 h-16 bg-black rounded"></div>
                    <div className="w-12 h-16 bg-black rounded"></div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-stone-900">{pack.name}</h3>
                <Check size={16} className="text-emerald-600 opacity-0 group-hover:opacity-100" />
              </div>
              <p className="text-xs text-stone-500">{pack.description}</p>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => router.push('/studio/frequency')}
        className="mt-4 text-sm text-stone-400 hover:text-stone-600"
      >
        ← Back
      </button>
    </div>
  )
}
