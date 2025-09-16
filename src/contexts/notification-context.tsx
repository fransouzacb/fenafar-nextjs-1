'use client'

import { createContext, useContext, useCallback, useState, ReactNode } from 'react'
import { toast } from 'sonner'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
}

export interface ConfirmationDialog {
  id: string
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
  onConfirm: () => void
  onCancel?: () => void
}

interface NotificationContextType {
  // Notificações
  showNotification: (notification: Omit<Notification, 'id'>) => void
  showSuccess: (title: string, description?: string) => void
  showError: (title: string, description?: string) => void
  showWarning: (title: string, description?: string) => void
  showInfo: (title: string, description?: string) => void
  
  // Confirmações
  showConfirmation: (dialog: Omit<ConfirmationDialog, 'id'>) => Promise<boolean>
  showDeleteConfirmation: (itemName: string, onConfirm: () => void) => Promise<boolean>
  showActivationConfirmation: (itemName: string, isActive: boolean, onConfirm: () => void) => Promise<boolean>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [confirmations, setConfirmations] = useState<ConfirmationDialog[]>([])

  // Notificações
  const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    // const id = Math.random().toString(36).substr(2, 9)
    
    switch (notification.type) {
      case 'success':
        toast.success(notification.title, {
          description: notification.description,
          duration: notification.duration || 4000,
        })
        break
      case 'error':
        toast.error(notification.title, {
          description: notification.description,
          duration: notification.duration || 6000,
        })
        break
      case 'warning':
        toast.warning(notification.title, {
          description: notification.description,
          duration: notification.duration || 5000,
        })
        break
      case 'info':
        toast.info(notification.title, {
          description: notification.description,
          duration: notification.duration || 4000,
        })
        break
    }
  }, [])

  const showSuccess = useCallback((title: string, description?: string) => {
    showNotification({ type: 'success', title, description })
  }, [showNotification])

  const showError = useCallback((title: string, description?: string) => {
    showNotification({ type: 'error', title, description })
  }, [showNotification])

  const showWarning = useCallback((title: string, description?: string) => {
    showNotification({ type: 'warning', title, description })
  }, [showNotification])

  const showInfo = useCallback((title: string, description?: string) => {
    showNotification({ type: 'info', title, description })
  }, [showNotification])

  // Confirmações
  const showConfirmation = useCallback((dialog: Omit<ConfirmationDialog, 'id'>): Promise<boolean> => {
    return new Promise((resolve) => {
      const id = Math.random().toString(36).substr(2, 9)
      
      const newDialog: ConfirmationDialog = {
        ...dialog,
        id,
        onConfirm: () => {
          dialog.onConfirm()
          setConfirmations(prev => prev.filter(d => d.id !== id))
          resolve(true)
        },
        onCancel: () => {
          dialog.onCancel?.()
          setConfirmations(prev => prev.filter(d => d.id !== id))
          resolve(false)
        }
      }
      
      setConfirmations(prev => [...prev, newDialog])
    })
  }, [])

  const showDeleteConfirmation = useCallback((itemName: string, onConfirm: () => void): Promise<boolean> => {
    return showConfirmation({
      title: 'Confirmar exclusão',
      description: `Tem certeza que deseja excluir "${itemName}"? Esta ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive',
      onConfirm
    })
  }, [showConfirmation])

  const showActivationConfirmation = useCallback((itemName: string, isActive: boolean, onConfirm: () => void): Promise<boolean> => {
    const action = isActive ? 'desativar' : 'ativar'
    return showConfirmation({
      title: `Confirmar ${action}`,
      description: `Tem certeza que deseja ${action} "${itemName}"?`,
      confirmText: isActive ? 'Desativar' : 'Ativar',
      cancelText: 'Cancelar',
      variant: isActive ? 'destructive' : 'default',
      onConfirm
    })
  }, [showConfirmation])

  const value: NotificationContextType = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirmation,
    showDeleteConfirmation,
    showActivationConfirmation,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Renderizar diálogos de confirmação */}
      {confirmations.map((dialog) => (
        <ConfirmationDialog key={dialog.id} dialog={dialog} />
      ))}
    </NotificationContext.Provider>
  )
}

// Componente de diálogo de confirmação
function ConfirmationDialog({ dialog }: { dialog: ConfirmationDialog }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {dialog.title}
        </h3>
        <p className="text-gray-600 mb-6">
          {dialog.description}
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={dialog.onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {dialog.cancelText || 'Cancelar'}
          </button>
          <button
            onClick={dialog.onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              dialog.variant === 'destructive'
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
            }`}
          >
            {dialog.confirmText || 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
