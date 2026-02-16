'use client'

import { useRouter } from 'next/navigation'
import { useStudio } from '@/lib/context'
import { Download, Share2, Copy, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'

export default function EditPage() {
  const router = useRouter()
  const { generation } = useStudio()

  if (!generation) {
    router.push('/studio')
    return null
  }

  const handleDownload = () => {
    if (generation.result_url) {
      const link = document.createElement('a')
      link.href = generation.result_url
      link.download = `village-cart-${Date.now()}.png`
      link.click()
      toast.success('Image downloaded!')
    }
  }

  const handleShare = async () => {
    if (navigator.share && generation.result_url) {
      try {
        await navigator.share({
          title: 'My Village Cart',
          text: 'Check out my golf cart from Village Discount Golf Car!',
          url: generation.result_url,
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      toast.error('Sharing not supported on this device')
    }
  }

  const handleCopy = () => {
    if (generation.result_url) {
      navigator.clipboard.writeText(generation.result_url)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <div className="h-full w-full flex flex-col p-6 sm:p-8">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-emerald-950 mb-2">
            Ready to Post
          </h1>
          <p className="text-stone-500 text-sm">
            Your Village Cart content is ready!
          </p>
        </div>

        {/* Result Image */}
        <div className="flex-1 min-h-0 mb-6">
          {generation.result_url ? (
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-stone-200">
              <img
                src={generation.result_url}
                alt="Generated cart"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="h-full rounded-2xl bg-stone-200 flex items-center justify-center">
              <span className="text-stone-400">No image generated</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleDownload}
            className="w-full h-12 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/10"
          >
            <Download size={18} />
            Download Image
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleShare}
              className="h-11 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Share2 size={16} />
              Share
            </button>
            <button
              onClick={handleCopy}
              className="h-11 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Copy size={16} />
              Copy Link
            </button>
          </div>

          <button
            onClick={() => router.push('/studio')}
            className="w-full h-11 rounded-xl text-stone-400 hover:text-emerald-700 font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} />
            Create Another
          </button>
        </div>
      </div>
    </div>
  )
}