'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStudio } from '@/lib/context'
import { createClient } from '@/lib/supabase'
import { StylePack } from '@/lib/types'
import { ArrowRight, Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const PACK_EMOJIS: Record<string, string> = {
  'showroom-clean': '✨',
  'fairway-lifestyle': '⛳',
  'neighborhood-ready': '🏡',
  'inventory-lineup': '📋',
}

const PACK_IMAGES: Record<string, string> = {
  'showroom-clean': 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&auto=format&fit=crop',
  'fairway-lifestyle': 'https://images.unsplash.com/photo-1593111774644-6eb7e8f20e58?w=600&auto=format&fit=crop',
  'neighborhood-ready': 'https://images.unsplash.com/photo-1605218427306-022ba6c5544c?w=600&auto=format&fit=crop',
  'inventory-lineup': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop',
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
      router.push('/studio/upload')
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
    <div className="h-full w-full flex flex-col p-6 sm:p-8">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={20} className="text-emerald-600" />
            <h1 className="text-2xl font-semibold text-emerald-950">
              Choose a Style Pack
            </h1>
          </div>
          <p className="text-stone-500 text-sm">
            Select the vibe for your content.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto no-scrollbar pb-4 flex-1">
          {packs.map((pack) => (
            <button
              key={pack.id}
              onClick={() => selectPack(pack)}
              className="group text-left rounded-xl overflow-hidden bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-900/5 transition-all"
            >
              <div className="aspect-video bg-stone-100 relative overflow-hidden">
                <img
                  src={PACK_IMAGES[pack.slug] || PACK_IMAGES['showroom-clean']}
                  alt={pack.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 text-2xl">
                  {PACK_EMOJIS[pack.slug] || '✨'}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-stone-900">{pack.name}</h3>
                  <ArrowRight
                    size={16}
                    className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <p className="text-xs text-stone-500 line-clamp-2">
                  {pack.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.push('/studio/goal')}
          className="mt-4 text-sm text-stone-400 hover:text-stone-600"
        >
          ← Back
        </button>
      </div>
    </div>
  )
}
