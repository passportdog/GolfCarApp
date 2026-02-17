'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useStudio } from '@/lib/context'
import { useState, Suspense } from 'react'
import { ArrowLeft, Download, Copy, Instagram, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

const BADGES = ['Street Legal', 'New Arrival', 'Villages Ready', 'Proud Owner']
const CAPTION_VOICES = ['Premium Clubhouse', 'Friendly Local', 'Quick Promo']

const MOCK_CAPTION = '"Cruising through the weekend in style. Swing by Village Discount Golf Car to see why this is the neighborhood favorite. ⛳️ #VillageLife"'

function EditContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const generationId = searchParams.get('id')
  const { userRole } = useStudio()
  
  const [headline, setHeadline] = useState('SUMMER\\nREADY')
  const [badge, setBadge] = useState('Street Legal')
  const [captionVoice, setCaptionVoice] = useState(CAPTION_VOICES[0])

  const handleDownload = () => {
    toast.success('Image downloaded!')
  }

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(MOCK_CAPTION)
    toast.success('Caption copied!')
  }

  const handleReset = () => {
    router.push('/studio')
  }

  return (
    <div className="h-full w-full flex flex-col sm:flex-row overflow-hidden bg-stone-100">
      {/* Canvas Area */}
      <div className="flex-1 relative flex items-center justify-center p-4 sm:p-10 bg-[radial-gradient(#e7e5e4_1px,transparent_1px)] [background-size:20px_20px]">
        <button 
          onClick={() => router.push('/studio/results')}
          className="absolute top-4 left-4 p-2 rounded-full bg-white border border-stone-200 text-stone-500 hover:text-stone-900 shadow-sm z-20"
        >
          <ArrowLeft size={20} />
        </button>

        {/* The Ad Preview */}
        <div className="relative w-full max-w-[300px] aspect-[4/5] bg-white rounded-lg shadow-2xl shadow-stone-900/20 overflow-hidden ring-1 ring-stone-900/5">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-emerald-400" />
          
          {/* Overlay Elements (Village Style) */}
          <div className="absolute top-0 left-0 right-0 p-6 pt-8 bg-gradient-to-b from-emerald-950/80 to-transparent">
            <div className="flex justify-center">
              <span className="text-[10px] text-white/90 font-medium tracking-[0.2em] uppercase">Village Discount Golf Car</span>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-emerald-950 via-emerald-900/80 to-transparent pt-12 text-center">
            <div className="inline-block px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-wider mb-2 rounded-sm">
              {badge}
            </div>
            <h2 className="text-2xl font-bold text-white leading-none mb-2 whitespace-pre-line">
              {headline}
            </h2>
            <div className="w-full h-px bg-white/20 my-3"></div>
            <p className="text-[10px] text-stone-200 uppercase tracking-wide font-medium">The Villages • Ocala • Summerfield</p>
          </div>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="w-full sm:w-80 bg-white border-t sm:border-t-0 sm:border-l border-stone-200 flex flex-col overflow-y-auto z-10">
        <div className="p-5 border-b border-stone-100">
          <h3 className="font-semibold text-stone-900">Customize</h3>
        </div>

        <div className="p-5 space-y-6">
          {/* Text Control */}
          <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 block">Headline</label>
            <textarea
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full h-20 bg-stone-50 border border-stone-200 rounded px-3 py-2 text-sm text-stone-900 focus:border-emerald-500 outline-none font-medium resize-none"
            />
          </div>

          {/* Badge Toggles */}
          <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-3 block">Badges</label>
            <div className="grid grid-cols-2 gap-2">
              {BADGES.map((b) => (
                <button
                  key={b}
                  onClick={() => setBadge(b)}
                  className={`px-2 py-2 rounded border text-[10px] font-medium transition-colors ${
                    badge === b 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                      : 'border-stone-200 hover:border-emerald-500 hover:bg-emerald-50 text-stone-600'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 block">Caption Voice</label>
            <select
              value={captionVoice}
              onChange={(e) => setCaptionVoice(e.target.value)}
              className="w-full h-10 bg-stone-50 border border-stone-200 rounded px-3 text-sm text-stone-700 outline-none"
            >
              {CAPTION_VOICES.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Generated Caption */}
          <div className="p-3 rounded bg-emerald-50/50 border border-emerald-100 text-xs text-stone-600 italic leading-relaxed">
            {MOCK_CAPTION}
          </div>
        </div>

        <div className="mt-auto p-5 border-t border-stone-100 space-y-3">
          <button 
            onClick={handleDownload}
            className="w-full h-12 rounded-xl bg-emerald-900 text-white font-medium hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/10"
          >
            <Download size={18} />
            Export & Share
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => toast.success('Shared to Instagram!')}
              className="h-10 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-medium text-xs transition-colors flex items-center justify-center gap-1"
            >
              <Instagram size={14} />
              Instagram
            </button>
            <button 
              onClick={handleCopyCaption}
              className="h-10 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-medium text-xs transition-colors flex items-center justify-center gap-1"
            >
              <Copy size={14} />
              Copy
            </button>
          </div>
          
          <button 
            onClick={handleReset}
            className="w-full h-10 rounded-lg text-stone-400 hover:text-emerald-700 font-medium text-xs transition-colors flex items-center justify-center gap-1"
          >
            <RefreshCw size={14} />
            Create Another Pack
          </button>
        </div>
      </div>
    </div>
  )
}

export default function EditPage() {
  return (
    <Suspense fallback={<div className="h-full w-full flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>}>
      <EditContent />
    </Suspense>
  )
}
