'use client'

import { useRouter } from 'next/navigation'
import { useStudio } from '@/lib/context'
import { createClient } from '@/lib/supabase'
import { ArrowRight, ShoppingBag, User, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'

export default function RolePage() {
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
        // @ts-expect-error Supabase Database types are not generated yet in this repo.
        .insert({ user_role: role })
        .select()
        .single()

      if (error) throw error
      
      setSession(data)
      router.push('/studio/goal')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create session'
      console.error('Error creating session:', error)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 sm:p-12 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-medium text-emerald-950 mb-2">How are you using the Studio?</h2>
        <p className="text-stone-500 text-sm">Select your role to unlock the right templates.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
        {/* Employee Card */}
        <button
          onClick={() => createSession('employee')}
          disabled={isLoading}
          className="group text-left p-6 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-900/5 transition-all relative overflow-hidden"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            {isLoading ? <Loader2 size={24} className="animate-spin" /> : <ShoppingBag size={24} />}
          </div>
          <h3 className="text-lg font-semibold text-stone-900 mb-1">Village Employee</h3>
          <p className="text-stone-500 text-xs leading-relaxed">Sales & Service team. Create inventory promos and service specials.</p>
          <div className="mt-6 flex items-center gap-2 text-xs font-medium text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity">
            Enter Staff Portal <ArrowRight size={14} />
          </div>
        </button>

        {/* Customer Card */}
        <button
          onClick={() => createSession('customer')}
          disabled={isLoading}
          className="group text-left p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-500 hover:shadow-xl hover:shadow-amber-900/5 transition-all relative overflow-hidden"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            {isLoading ? <Loader2 size={24} className="animate-spin" /> : <User size={24} />}
          </div>
          <h3 className="text-lg font-semibold text-stone-900 mb-1">Cart Owner</h3>
          <p className="text-stone-500 text-xs leading-relaxed">Proud owners. Show off your ride and join the Village community.</p>
          <div className="mt-6 flex items-center gap-2 text-xs font-medium text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
            Join Community <ArrowRight size={14} />
          </div>
        </button>
      </div>
      
      <p className="mt-10 text-[11px] text-stone-400 flex items-center gap-1.5">
        <span className="text-stone-400">🔒</span>
        Exclusive access for Village Discount Golf Car network.
      </p>
    </div>
  )
}
