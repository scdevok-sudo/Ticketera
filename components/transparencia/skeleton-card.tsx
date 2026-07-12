interface SkeletonCardProps {
  height?: number
  className?: string
}

export function SkeletonCard({ height = 240, className = '' }: SkeletonCardProps) {
  return <div className={`animate-pulse rounded-xl bg-gray-100 ${className}`} style={{ height }} />
}
