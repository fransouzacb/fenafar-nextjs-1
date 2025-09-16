"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        duration: 4000,
        style: {
          fontSize: '14px',
          fontWeight: '500',
        },
        classNames: {
          toast: 'group toast',
          description: 'text-sm opacity-90',
          actionButton: 'bg-white/20 hover:bg-white/30 text-white font-medium',
          cancelButton: 'bg-white/10 hover:bg-white/20 text-white font-medium',
        },
      }}
      position="top-right"
      expand={true}
      richColors={false}
      closeButton={true}
      {...props}
    />
  )
}

export { Toaster }
