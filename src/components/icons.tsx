export function GolfCartIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="M5 17h-2v-11a1 1 0 0 1 1 -1h2l3.5 8h7l2.5 -5h2" />
      <path d="M7 17l1.5 -5h7l1.5 5" />
      <path d="M10 6v-2" />
    </svg>
  )
}
