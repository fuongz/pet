'use client'

import { cn } from '@/lib'
import { cva, VariantProps } from 'class-variance-authority'
import { motion } from 'motion/react'

const alertMotionVariants = cva('relative overflow-hidden rounded-lg border p-4 shadow-sm', {
  variants: {
    variant: {
      success: [
        'border-emerald-200/30',
        'bg-emerald-50/50',
        '[&_[data-slot=alert-icon]]:bg-emerald-100',
        '[&_[data-slot=alert-icon]]:text-emerald-600',
        '[&_[data-slot=alert-content]]:text-emerald-800',
      ],
      error: ['border-rose-200/30', 'bg-rose-50/50', '[&_[data-slot=alert-icon]]:bg-rose-100', '[&_[data-slot=alert-icon]]:text-rose-600', '[&_[data-slot=alert-content]]:text-rose-800'],
    },
  },
  defaultVariants: {
    variant: 'success',
  },
})

function AlertMotionIcon({ className, icon, ...props }: React.ComponentProps<'div'> & { icon?: React.ReactNode }) {
  return (
    <div data-slot="alert-icon" className={cn('rounded-full p-1', className)} {...props}>
      {icon}
    </div>
  )
}

interface Props {
  children: React.ReactNode
  variant?: 'success' | 'error'
  className?: string
  icon?: React.ReactNode
}

export function AlertMotion({ children, variant, className, icon, ...props }: Props & VariantProps<typeof alertMotionVariants>) {
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="w-full mb-4 mx-auto">
      <div className={cn(alertMotionVariants({ variant, className }))} {...props}>
        <div className="flex items-center gap-3">
          {!!icon && (
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
              }}
            >
              <AlertMotionIcon icon={icon} />
            </motion.div>
          )}
          <motion.div data-slot="alert-content" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-sm font-medium">
            {children}
          </motion.div>
        </div>

        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
      </div>
    </motion.div>
  )
}
