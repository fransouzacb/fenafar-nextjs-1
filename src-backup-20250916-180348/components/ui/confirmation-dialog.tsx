'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface ConfirmationDialogProps {
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
  trigger: React.ReactNode
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function ConfirmationDialog({
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  trigger,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmationDialogProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = async () => {
    try {
      await onConfirm()
      setOpen(false)
    } catch (error) {
      console.error('Erro ao confirmar:', error)
    }
  }

  const handleCancel = () => {
    onCancel?.()
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
          >
            {isLoading ? 'Processando...' : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Componentes específicos para ações comuns
interface DeleteConfirmationProps {
  itemName: string
  onConfirm: () => void | Promise<void>
  trigger: React.ReactNode
  isLoading?: boolean
}

export function DeleteConfirmation({ itemName, onConfirm, trigger, isLoading }: DeleteConfirmationProps) {
  return (
    <ConfirmationDialog
      title="Confirmar exclusão"
      description={`Tem certeza que deseja excluir "${itemName}"? Esta ação não pode ser desfeita.`}
      confirmText="Excluir"
      variant="destructive"
      trigger={trigger}
      onConfirm={onConfirm}
      isLoading={isLoading}
    />
  )
}

interface ActivationConfirmationProps {
  itemName: string
  isActive: boolean
  onConfirm: () => void | Promise<void>
  trigger: React.ReactNode
  isLoading?: boolean
}

export function ActivationConfirmation({ itemName, isActive, onConfirm, trigger, isLoading }: ActivationConfirmationProps) {
  const action = isActive ? 'desativar' : 'ativar'
  
  return (
    <ConfirmationDialog
      title={`Confirmar ${action}`}
      description={`Tem certeza que deseja ${action} "${itemName}"?`}
      confirmText={isActive ? 'Desativar' : 'Ativar'}
      variant={isActive ? 'destructive' : 'default'}
      trigger={trigger}
      onConfirm={onConfirm}
      isLoading={isLoading}
    />
  )
}

interface StatusChangeConfirmationProps {
  itemName: string
  currentStatus: string
  newStatus: string
  onConfirm: () => void | Promise<void>
  trigger: React.ReactNode
  isLoading?: boolean
}

export function StatusChangeConfirmation({ 
  itemName, 
  currentStatus, 
  newStatus, 
  onConfirm, 
  trigger, 
  isLoading 
}: StatusChangeConfirmationProps) {
  return (
    <ConfirmationDialog
      title="Confirmar alteração de status"
      description={`Tem certeza que deseja alterar o status de "${itemName}" de "${currentStatus}" para "${newStatus}"?`}
      confirmText="Alterar"
      trigger={trigger}
      onConfirm={onConfirm}
      isLoading={isLoading}
    />
  )
}
