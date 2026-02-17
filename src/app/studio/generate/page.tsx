'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStudio } from '@/lib/context'
import { GolfCartIcon } from '@/components/icons'
import { toast } from 'sonner'

const LOADING_MESSAGES = [
  'Warming up the studio...',
  'Applying your style...',
  'Polishing the details...',
  'Adding Village magic...',
  'Almost ready...',
]

export default function GeneratePage() {
  const router = useRouter()
  const { session, selectedPack, uploadedPhoto, setGeneration } = useStudio()
  const [messageIndex, setMessageIndex] = useState(0)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!session) {
      router.push('/studio')
      return
    }

    const generateImage = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            session_id: session.id,
            uploaded_photo_id: uploadedPhoto?.id || null,
            style_pack_id: selectedPack?.id,
            selected_option_ids: [],
            quality: 'basic',
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to start generation')
        }

        const { generation_id } = await response.json()

        pollRef.current = setInterval(async () => {
          try {
            const checkResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/check-generation`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
              },
              body: JSON.stringify({ generation_id }),
            })

            if (!checkResponse.ok) {
              throw new Error('Failed to check generation status')
            }

            const gen = await checkResponse.json()

            if (gen.status === 'completed') {
              if (pollRef.current) {
                clearInterval(pollRef.current)
              }
              setGeneration(gen)
              router.push('/studio/results')
            } else if (gen.status === 'failed') {
              if (pollRef.current) {
                clearInterval(pollRef.current)
              }
              toast.error(gen.error_message || 'Generation failed')
              router.push('/studio/brand')
            }
          } catch (error) {
            console.error('Error polling:', error)
          }
        }, 3000)
      } catch (error) {
        console.error('Error generating:', error)
        toast.error('Failed to start generation')
        router.push('/studio/brand')
      }
    }

    generateImage()

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current)
      }
    }
  }, [router, selectedPack?.id, session, setGeneration, uploadedPhoto?.id])

  if (!session) return null

  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative p-8 text-center bg-stone-50">
      <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
        <div className="absolute inset-0 border-4 border-emerald-100 rounded-full" />
        <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin" />
        <GolfCartIcon className="w-8 h-8 text-emerald-800" />
      </div>

      <h2 className="text-xl font-medium text-emerald-950 mb-2">Building your Village Pack...</h2>
      <p className="text-stone-500 text-sm animate-pulse">{LOADING_MESSAGES[messageIndex]}</p>

      <div className="mt-12 flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-stone-100 shadow-sm">
        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full bg-stone-200 border border-white" />
          <div className="w-6 h-6 rounded-full bg-stone-300 border border-white" />
          <div className="w-6 h-6 rounded-full bg-stone-400 border border-white" />
        </div>
        <p className="text-[10px] font-medium text-stone-500 uppercase tracking-wide">Trusted by 1000+ Owners</p>
      </div>
    </div>
  )
}
