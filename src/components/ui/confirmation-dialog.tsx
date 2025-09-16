'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'danger' | 'success'
  isLoading?: boolean
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  isLoading = false
}: ConfirmationDialogProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: XCircle,
          iconColor: 'text-red-600',
          buttonVariant: 'destructive' as const,
          buttonText: 'Excluir'
        }
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-600',
          buttonVariant: 'default' as const,
          buttonText: 'Aprovar'
        }
      default:
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-600',
          buttonVariant: 'default' as const,
          buttonText: confirmText
        }
    }
  }

  const styles = getVariantStyles()
  const Icon = styles.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full bg-gray-100`}>
              <Icon className={`h-6 w-6 ${styles.iconColor}`} />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                {title}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={styles.buttonVariant}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processando...' : styles.buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
