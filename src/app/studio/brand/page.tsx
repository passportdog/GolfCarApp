'use client'

import { useRouter } from 'next/navigation'
import { useStudio } from '@/lib/context'
import { createClient } from '@/lib/supabase'
import { Lock, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'

const LOCATIONS = [
  'The Villages (Main)',
  'Summerfield Location', 
  'Ocala Showroom',
]

const CTAS = ['Call Us', 'Text Us', 'Visit Web']

export default function BrandPage() {
  const router = useRouter()
  const { session, userRole } = useStudio()
  const [location, setLocation] = useState(LOCATIONS[0])
  const [cta, setCta] = useState(CTAS[0])
  const [promo, setPromo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  if (!session) {
    router.push('/studio')
    return null
  }

  const handleContinue = async () => {
    setIsLoading(true)
    try {
      // Store brand details in metadata
      const { error } = await supabase
        .from('sessions')
        // @ts-expect-error
        .update({ 
          metadata: {
            ...(session.metadata || {}),
            location,
            cta,
            promo: userRole === 'employee' ? promo : null,
          }
        })
        .eq('id', session.id)

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      router.push('/studio/upload')
    } catch (error) {
      console.error('Error saving brand details:', error)
      toast.error('Failed to save details')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full w-full flex flex-col p-6 sm:p-10 w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-emerald-950">Village Details</h2>
        <p className="text-stone-500 text-sm">Review the info for this post.</p>
      </div>

      <div className="space-y-6 max-w-lg flex-1">
        <div className="space-y-4">
          {/* Locked Brand Fields */}
          <div className="relative opacity-70">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5 block">Dealership</label>
            <div className="w-full h-11 rounded-lg px-4 bg-stone-100 border border-stone-200 text-stone-600 text-sm flex items-center gap-2">
              <Lock size={14} /> Village Discount Golf Car
            </div>
          </div>
          
          {/* Location Selector */}
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 block">Location</label>
            <select 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-11 rounded-lg px-3 bg-white border border-stone-200 text-stone-800 text-sm focus:border-emerald-500 outline-none appearance-none"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Call to Action */}
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-3 block">Primary Call to Action</label>
            <div className="grid grid-cols-3 gap-2">
              {CTAS.map((c) => (
                <label key={c} className="cursor-pointer">
                  <input 
                    type="radio" 
                    name="cta" 
                    className="peer hidden" 
                    checked={cta === c}
                    onChange={() => setCta(c)}
                  />
                  <div className="h-10 rounded-lg border border-stone-200 bg-white text-stone-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-700 peer-checked:border-emerald-500 flex items-center justify-center text-xs font-medium transition-all">
                    {c}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Employee Only Fields */}
          {userRole === 'employee' && (
            <div className="pt-4 border-t border-dashed border-stone-200">
              <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1.5 block">Promo Details (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. $500 Off this week"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                className="w-full h-11 rounded-lg px-4 bg-white border border-stone-200 text-sm focus:border-emerald-500 outline-none"
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto pt-8">
        <button 
          onClick={handleContinue}
          disabled={isLoading}
          className="w-full h-12 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-medium transition-colors shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Continue to Upload'}
        </button>
      </div>

      <button
        onClick={() => router.push('/studio/style')}
        className="mt-4 text-sm text-stone-400 hover:text-stone-600 text-center"
      >
        ← Back
      </button>
    </div>
  )
}
