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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    setIsUploading(true)

    try {
      // Upload to Supabase Storage
      const fileName = `${session.id}/${Date.now()}_${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cart-photos')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('cart-photos')
        .getPublicUrl(uploadData.path)

      // Save to database
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
      toast.success('Photo uploaded!')
      
      // Navigate to generate after a short delay
      setTimeout(() => {
        router.push('/studio/generate')
      }, 1000)
    } catch (error: any) {
      console.error('Error uploading:', error)
      toast.error(error.message || 'Failed to upload photo')
    } finally {
      setIsUploading(false)
    }
  }

  const skipUpload = () => {
    // User can skip upload and go straight to generation
    router.push('/studio/generate')
  }

  return (
    <div className="h-full w-full flex flex-col p-6 sm:p-8">
      <div className="max-w-lg mx-auto w-full flex-1 flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-emerald-950 mb-2">
            Upload Photos
          </h1>
          <p className="text-stone-500 text-sm">
            Select a photo of your cart. Skip if you want text-to-image only.
          </p>
        </div>

        {/* Upload Zone */}
        <div className="flex-1 flex flex-col">
          {preview ? (
            <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500">
              <img
                src={preview}
                alt="Preview"
                className="w-full aspect-video object-cover"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 size={40} className="animate-spin text-white" />
                </div>
              )}
              <button
                onClick={() => {
                  setPreview(null)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
                disabled={isUploading}
                className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 border-2 border-dashed border-stone-300 rounded-3xl bg-stone-50 hover:bg-emerald-50 hover:border-emerald-400 transition-all flex flex-col items-center justify-center group cursor-pointer min-h-[300px]"
            >
              <div className="w-16 h-16 rounded-full bg-white border border-stone-200 flex items-center justify-center mb-4 group-hover:scale-110 shadow-sm transition-transform">
                {isUploading ? (
                  <Loader2 size={24} className="animate-spin text-emerald-600" />
                ) : (
                  <Camera size={24} className="text-stone-400 group-hover:text-emerald-600 transition-colors" />
                )}
              </div>
              <span className="text-stone-700 font-medium block">
                {isUploading ? 'Uploading...' : 'Tap to upload photo'}
              </span>
              <span className="text-xs text-stone-400 mt-2">JPG, PNG supported</span>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Pro Tip */}
          <div className="mt-6 flex gap-4 overflow-x-auto no-scrollbar pb-2">
            <div className="flex-shrink-0 w-64 p-3 rounded-lg bg-emerald-50 border border-emerald-100 flex gap-3 items-start">
              <Lightbulb size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900">
                <span className="font-semibold">Pro Tip:</span> Front 3/4 angle (waist height) creates the most heroic look.
              </div>
            </div>
          </div>

          {/* Skip Button */}
          <button
            onClick={skipUpload}
            className="mt-6 text-sm text-stone-400 hover:text-stone-600"
          >
            Skip upload →
          </button>
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.push('/studio/style')}
          className="mt-4 text-sm text-stone-400 hover:text-stone-600"
        >
          ← Back
        </button>
      </div>
    </div>
  )
}
