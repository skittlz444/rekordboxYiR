import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/client/components/ui/card'
import { Spinner } from './ui/spinner'

export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Action Buttons Skeleton */}
      <div className="flex justify-center gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-32 bg-muted rounded-md animate-pulse" />
        ))}
      </div>

      {/* Header Skeleton */}
      <div className="text-center mb-8 space-y-2">
        <div className="h-10 w-96 bg-muted rounded-md mx-auto animate-pulse" />
        <div className="h-6 w-64 bg-muted rounded-md mx-auto animate-pulse" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-32 bg-muted rounded animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse mt-2" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 bg-muted rounded animate-pulse" />
              <div className="h-4 w-32 bg-muted rounded animate-pulse mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* List Cards Skeleton */}
      {[1, 2, 3].map((cardIndex) => (
        <Card key={cardIndex} className="mb-8">
          <CardHeader>
            <div className="h-6 w-40 bg-muted rounded animate-pulse" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                    <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function UploadLoadingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-lg p-8 shadow-2xl max-w-md mx-4"
      >
        <div className="flex flex-col items-center gap-6">
          <Spinner size="lg" />
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Processing Your Database</h3>
            <p className="text-muted-foreground">
              Analyzing your Rekordbox library and generating statistics...
            </p>
            <p className="text-sm text-muted-foreground/70 mt-4">This may take a few moments</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
