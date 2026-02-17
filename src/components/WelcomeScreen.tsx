'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStudio } from '@/lib/context'
import { createClient } from '@/lib/supabase'
import { ArrowRight, Star, ShoppingBag, User, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function WelcomeScreen() {
  const router = useRouter()
  const { setSession, setUserRole } = useStudio()
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const createSession = async (role: 'employee' | 'customer') => {
    setIsLoading(true)
    setUserRole(role)
    
    try {
      const { data, error } = await supabase
        .from('sessions')
        // @ts-expect-error
        .insert({ user_role: role })
        .select()
        .single()

      if (error) throw error
      
      setSession(data)
      router.push('/studio/goal')
    } catch (error: any) {
      console.error('Error creating session:', error)
      toast.error(error.message || 'Failed to create session')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* Hero Background with Image */}
      <div className="relative flex-1 flex flex-col justify-end p-6 sm:p-8">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg" 
            alt="Golf cart" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/40 to-black/20" />
        </div>

        <div className="relative z-10 max-w-md mx-auto w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium mb-6">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            Official Studio App
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-white mb-4 leading-[1.1]">
            Make your cart look as good as it feels.
          </h1>

          <p className="text-stone-200 text-lg font-light mb-8 leading-relaxed max-w-sm">
            Create stunning, branded posts for your golf cart in minutes. Exclusively for Village Discount Golf Car.
          </p>

          {/* Single CTA */}
          <button
            onClick={() => router.push('/studio/role')}
            disabled={isLoading}
            className="w-full sm:w-auto px-8 h-14 rounded-xl bg-white text-emerald-950 font-semibold text-base hover:bg-stone-100 transition-all shadow-lg shadow-black/20 flex items-center justify-center gap-2"
          >
            Get Started
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}