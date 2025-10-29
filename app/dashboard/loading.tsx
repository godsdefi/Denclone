export default function Loading() {
  return (
    <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="font-mono text-sm text-foreground/60">Loading dashboard...</p>
      </div>
    </div>
  )
}
