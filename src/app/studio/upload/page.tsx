'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useStudio } from '@/lib/context'
import { createClient } from '@/lib/supabase'
import { Camera, X, Loader2, Lightbulb } from 'lucide-react'
import { toast } from 'sonner'

export default function UploadPage() {
  const router = useRouter()
  const { session, setUploadedPhoto } = useStudio()
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  if (!session) {
    router.push('/studio')
    return null
  }

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
      toast.success('Photo added!')
      
      // Go to generating screen
      setTimeout(() => {
        router.push('/studio/generate')
      }, 500)
    } catch (error: any) {
      console.error('Error uploading:', error)
      toast.error(error.message || 'Failed to upload photo')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="h-full w-full flex flex-col p-6 sm:p-10 w-full relative">
      <h2 className="text-2xl font-medium text-emerald-950 mb-2">Upload Photos</h2>
      <p className="text-stone-500 text-sm mb-6">Select photos of the cart. No logo needed.</p>

      <div 
        className="flex-1 border-2 border-dashed border-stone-300 rounded-3xl bg-stone-50 hover:bg-emerald-50 hover:border-emerald-400 transition-all cursor-pointer flex flex-col items-center justify-center group relative overflow-hidden"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="relative z-10 text-center p-6">
          <div className="w-16 h-16 rounded-full bg-white border border-stone-200 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 shadow-sm transition-transform">
            {isUploading ? (
              <Loader2 size={24} className="animate-spin text-emerald-600" />
            ) : (
              <Camera size={24} className="text-stone-400 group-hover:text-emerald-600 transition-colors" />
            )}
          </div>
          <span className="text-stone-700 font-medium block">
            {isUploading ? 'Uploading...' : 'Tap to upload photos'}
          </span>
          <span className="text-xs text-stone-400 mt-2">JPG, PNG supported</span>
        </div>

        {/* Progress Bar */}
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

      <div className="mt-6 flex gap-4 overflow-x-auto no-scrollbar pb-2">
        <div className="flex-shrink-0 w-64 p-3 rounded-lg bg-emerald-50 border border-emerald-100 flex gap-3 items-start">
          <Lightbulb size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-[11px] text-emerald-900">
            <span className="font-semibold">Pro Tip:</span> Front 3/4 angle (waist height) creates the most heroic look.
          </div>
        </div>
      </div>

      <button
        onClick={() => router.push('/studio/brand')}
        className="mt-4 text-sm text-stone-400 hover:text-stone-600"
      >
        ← Back
      </button>
    </div>
  )
}
