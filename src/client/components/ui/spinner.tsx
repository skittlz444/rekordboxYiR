import { motion } from 'framer-motion'
import { cn } from '@/client/lib/utils'

interface SpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}

export function Spinner({ className, size = 'md' }: SpinnerProps) {
  return (
    <motion.div
      className={cn('border-2 border-muted border-t-primary rounded-full', sizeClasses[size], className)}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  )
}
