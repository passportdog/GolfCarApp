export interface Session {
  id: string
  user_role: 'employee' | 'customer' | null
  goal: 'social_post' | 'inventory_photo' | 'promo_content' | 'personal_share' | null
  style_pack_id: string | null
  village_name: string | null
  device_id: string | null
  metadata: Record<string, any>
  started_at: string
  completed_at: string | null
}

export interface StylePack {
  id: string
  name: string
  slug: string
  description: string
  base_prompt: string
  icon_emoji: string
  sort_order: number
  is_active: boolean
  style_pack_options?: {
    cinematic_option_id: string
    cinematic_options: CinematicOption
  }[]
}

export interface CinematicOption {
  id: string
  name: string
  type: string
  prompt_fragment: string
  description: string | null
  sort_order: number
  is_active: boolean
}

export interface UploadedPhoto {
  id: string
  session_id: string
  storage_path: string
  public_url: string | null
  file_name: string | null
  file_size: number | null
  mime_type: string | null
  width: number | null
  height: number | null
}

export interface Generation {
  id: string
  session_id: string
  uploaded_photo_id: string | null
  style_pack_id: string | null
  full_prompt: string
  selected_option_ids: string[]
  aspect_ratio: string
  quality: 'basic' | 'high'
  kie_task_id: string | null
  kie_model: string
  status: 'pending' | 'generating' | 'completed' | 'failed'
  result_url: string | null
  error_message: string | null
  started_at: string
  completed_at: string | null
  generation_time_ms: number | null
}

export interface Export {
  id: string
  generation_id: string
  session_id: string
  cta_text: string | null
  cta_style: string | null
  caption_text: string | null
  caption_voice: 'professional' | 'friendly' | 'fun' | 'luxury' | null
  village_branding: boolean
  storage_path: string | null
  public_url: string | null
  format: 'png' | 'jpg' | 'webp'
  download_count: number
}