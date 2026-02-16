'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Session, StylePack, CinematicOption, UploadedPhoto, Generation } from '@/lib/types'

interface StudioContextType {
  session: Session | null
  setSession: (session: Session | null) => void
  stylePacks: StylePack[]
  setStylePacks: (packs: StylePack[]) => void
  selectedPack: StylePack | null
  setSelectedPack: (pack: StylePack | null) => void
  cinematicOptions: CinematicOption[]
  setCinematicOptions: (options: CinematicOption[]) => void
  selectedOptions: string[]
  setSelectedOptions: (options: string[]) => void
  uploadedPhoto: UploadedPhoto | null
  setUploadedPhoto: (photo: UploadedPhoto | null) => void
  generation: Generation | null
  setGeneration: (gen: Generation | null) => void
  userRole: 'employee' | 'customer' | null
  setUserRole: (role: 'employee' | 'customer' | null) => void
  goal: string | null
  setGoal: (goal: string | null) => void
}

const StudioContext = createContext<StudioContextType | undefined>(undefined)

export function StudioProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [stylePacks, setStylePacks] = useState<StylePack[]>([])
  const [selectedPack, setSelectedPack] = useState<StylePack | null>(null)
  const [cinematicOptions, setCinematicOptions] = useState<CinematicOption[]>([])
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [uploadedPhoto, setUploadedPhoto] = useState<UploadedPhoto | null>(null)
  const [generation, setGeneration] = useState<Generation | null>(null)
  const [userRole, setUserRole] = useState<'employee' | 'customer' | null>(null)
  const [goal, setGoal] = useState<string | null>(null)

  return (
    <StudioContext.Provider
      value={{
        session,
        setSession,
        stylePacks,
        setStylePacks,
        selectedPack,
        setSelectedPack,
        cinematicOptions,
        setCinematicOptions,
        selectedOptions,
        setSelectedOptions,
        uploadedPhoto,
        setUploadedPhoto,
        generation,
        setGeneration,
        userRole,
        setUserRole,
        goal,
        setGoal,
      }}
    >
      {children}
    </StudioContext.Provider>
  )
}

export function useStudio() {
  const context = useContext(StudioContext)
  if (context === undefined) {
    throw new Error('useStudio must be used within a StudioProvider')
  }
  return context
}