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
      console.log('Creating session for role:', role)
      
      const { data, error } = await supabase
        .from('sessions')
        // @ts-expect-error
        .insert({ user_role: role })
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      console.log('Session created:', data)
      setSession(data)
      toast.success('Session started!')
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
      {/* Hero Background */}
      <div className="relative flex-1 flex flex-col justify-end p-6 sm:p-8">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-emerald-900/60 to-black/20" />
          <div className="h-full w-full bg-emerald-900" />
        </div>

        <div className="relative z-10 max-w-md mx-auto w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium mb-6">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            Official Studio App
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-4 leading-tight">
            Make your cart look as good as it feels.
          </h1>

          <p className="text-stone-200 text-lg font-light mb-8 leading-relaxed">
            Create stunning, branded posts for your golf cart in minutes. Exclusively for Village Discount Golf Car.
          </p>

          {/* Role Selection Cards */}
          <div className="space-y-3 mb-8">
            <button
              onClick={() => createSession('employee')}
              disabled={isLoading}
              className="w-full group text-left p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all flex items-center gap-4 disabled:opacity-50"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {isLoading ? <Loader2 size={24} className="animate-spin" /> : <ShoppingBag size={24} />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">Village Employee</h3>
                <p className="text-stone-300 text-sm">Sales & Service team</p>
              </div>
              <ArrowRight size={20} className="text-stone-400 group-hover:text-white transition-colors" />
            </button>

            <button
              onClick={() => createSession('customer')}
              disabled={isLoading}
              className="w-full group text-left p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all flex items-center gap-4 disabled:opacity-50"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {isLoading ? <Loader2 size={24} className="animate-spin" /> : <User size={24} />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">Cart Owner</h3>
                <p className="text-stone-300 text-sm">Proud cart owners</p>
              </div>
              <ArrowRight size={20} className="text-stone-400 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Trust Badge */}
          <p className="text-xs text-stone-400 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Exclusive access for Village Discount Golf Car network
          </p>
        </div>
      </div>
    </div>
  )
}
