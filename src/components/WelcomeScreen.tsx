'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Star, Loader2 } from 'lucide-react'

export default function WelcomeScreen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGetStarted = () => {
    setIsLoading(true)
    router.push('/studio/role')
  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* Hero Background with Image */}
      <div className="relative flex-1 flex flex-col justify-end p-6 sm:p-8">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1593111774648-63562bf86e78?w=1200&auto=format&fit=crop&q=80" 
            alt="Golf cart on scenic fairway" 
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
            onClick={handleGetStarted}
            disabled={isLoading}
            className="w-full sm:w-auto px-8 h-14 rounded-xl bg-white text-emerald-950 font-semibold text-base hover:bg-stone-100 transition-all shadow-lg shadow-black/20 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Loading...
              </>
            ) : (
              <>
                Get Started
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}