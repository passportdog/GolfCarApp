'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStudio } from '@/lib/context'
import { createClient } from '@/lib/supabase'
import { Camera, X, Loader2, Lightbulb, ArrowRight, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

export default function UploadPage() {
  const router = useRouter()
  const { session, selectedPack, setUploadedPhoto } = useStudio()
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!session) router.push('/studio')
  }, [session, router])

  if (!session) return null

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    setIsUploading(true)

    try {
      const fileName = `${session.id}/${Date.now()}_${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cart-photos')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('cart-photos')
        .getPublicUrl(uploadData.path)

      const { data: photoData, error: dbError } = await supabase
        .from('uploaded_photos')
        // @ts-expect-error
        .insert({
          session_id: session.id,
          storage_path: uploadData.path,
          public_url: urlData.publicUrl,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
        })
        .select()
        .single()

      if (dbError) throw dbError

      setUploadedPhoto(photoData)
      toast.success('Photo uploaded! Generating your styled image...')
      
      // Go to generate — now WITH the photo
      setTimeout(() => {
        router.push('/studio/generate')
      }, 600)
    } catch (error: any) {
      console.error('Error uploading:', error)
      toast.error(error.message || 'Failed to upload photo')
      setPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="h-full w-full flex flex-col p-6 sm:p-10 relative">
      {/* Headline */}
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={18} className="text-emerald-600" />
          <h2 className="text-2xl font-medium text-emerald-950">Now use YOUR cart</h2>
        </div>
        <p className="text-stone-500 text-sm">
          Upload a photo and we&apos;ll apply the <span className="font-medium text-emerald-700">{selectedPack?.name || 'style'}</span> look to your ride.
        </p>
      </div>

      {/* Upload Area */}
      <div 
        className="flex-1 border-2 border-dashed border-stone-300 rounded-3xl bg-stone-50 hover:bg-emerald-50 hover:border-emerald-400 transition-all cursor-pointer flex flex-col items-center justify-center group relative overflow-hidden"
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <div className="absolute inset-0">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              {isUploading ? (
                <div className="text-center">
                  <Loader2 size={32} className="animate-spin text-white mx-auto mb-2" />
                  <span className="text-white font-medium text-sm">Uploading...</span>
                </div>
              ) : (
                <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-stone-900 shadow-lg">
                  Change Photo
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="relative z-10 text-center p-6">
            <div className="w-16 h-16 rounded-full bg-white border border-stone-200 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 shadow-sm transition-transform">
              {isUploading ? (
                <Loader2 size={24} className="animate-spin text-emerald-600" />
              ) : (
                <Camera size={24} className="text-stone-400 group-hover:text-emerald-600 transition-colors" />
              )}
            </div>
            <span className="text-stone-700 font-medium block">
              {isUploading ? 'Uploading...' : 'Tap to upload your cart'}
            </span>
            <span className="text-xs text-stone-400 mt-2 block">JPG, PNG up to 10MB</span>
          </div>
        )}

        {isUploading && (
          <div className="absolute bottom-0 left-0 h-1.5 bg-emerald-500 w-full animate-pulse"></div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Tips */}
      <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar pb-2">
        <div className="flex-shrink-0 w-56 p-3 rounded-lg bg-emerald-50 border border-emerald-100 flex gap-3 items-start">
          <Lightbulb size={14} className="text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-[11px] text-emerald-900">
            <span className="font-semibold">Pro Tip:</span> Front 3/4 angle at waist height creates the most heroic look.
          </div>
        </div>
        <div className="flex-shrink-0 w-56 p-3 rounded-lg bg-amber-50 border border-amber-100 flex gap-3 items-start">
          <Camera size={14} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-[11px] text-amber-900">
            <span className="font-semibold">Best Results:</span> One cart, good lighting, clean background.
          </div>
        </div>
      </div>

      {/* Back to results */}
      <button
        onClick={() => router.push('/studio/results')}
        className="mt-4 text-sm text-stone-400 hover:text-stone-600"
      >
        ← Back to Gallery
      </button>
    </div>
  )
}
