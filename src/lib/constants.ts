// Brand Colors
export const COLORS = {
  primary: '#1B5E20',      // Deep golf green
  accent: '#F4A900',       // Gold/warm
  background: '#FAFAF9',   // Off-white/cream
  card: '#FFFFFF',
  text: {
    primary: '#1C1917',    // Stone-900
    secondary: '#78716C',  // Stone-500
    muted: '#A8A29E',      // Stone-400
  }
}

// CTA Options
export const CTA_OPTIONS = [
  { id: 'shop', text: 'Shop Now at Village Discount Golf Car' },
  { id: 'test_drive', text: 'Schedule a Test Drive' },
  { id: 'visit', text: 'Visit Us Today' },
  { id: 'call', text: 'Call (352) XXX-XXXX' },
  { id: 'custom', text: 'Custom' },
]

// Caption Voices
export const CAPTION_VOICES = [
  { id: 'professional', label: 'Professional', description: 'Polished and business-focused' },
  { id: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
  { id: 'fun', label: 'Fun', description: 'Playful and energetic' },
  { id: 'luxury', label: 'Luxury', description: 'Sophisticated and premium' },
]

// Goals by Role
export const GOALS = {
  employee: [
    { 
      id: 'social_post', 
      title: 'Social Post', 
      description: 'Create scroll-stopping content',
      icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zm-2 14.5v-9l6 4.5-6 4.5z'
    },
    { 
      id: 'inventory_photo', 
      title: 'Inventory Photo', 
      description: 'Clean product shots for listings',
      icon: 'M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h4v4H7V7z'
    },
    { 
      id: 'promo_content', 
      title: 'Promo Content', 
      description: 'Sales & promotional materials',
      icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
    },
  ],
  customer: [
    { 
      id: 'social_post', 
      title: 'Social Post', 
      description: 'Share your new ride',
      icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zm-2 14.5v-9l6 4.5-6 4.5z'
    },
    { 
      id: 'personal_share', 
      title: 'Personal Share', 
      description: 'Show off your cart',
      icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'
    },
  ],
}