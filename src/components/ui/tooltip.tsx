'use client'

import React, { useState, useRef, useEffect } from 'react'

interface TooltipProps {
  content: string
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

export function Tooltip({ content, children, side = 'top', delay = 300 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="relative inline-block w-full">
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className="w-full"
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          className={`absolute z-[9999] px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap pointer-events-none ${
            side === 'top' ? 'bottom-full left-1/2 transform -translate-x-1/2 mb-2' :
            side === 'bottom' ? 'top-full left-1/2 transform -translate-x-1/2 mt-2' :
            side === 'left' ? 'right-full top-1/2 transform -translate-y-1/2 mr-2' :
            'left-full top-1/2 transform -translate-y-1/2 ml-2'
          }`}
        >
          {content}
          <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
            side === 'top' ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2' :
            side === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2' :
            side === 'left' ? 'left-full top-1/2 -translate-y-1/2 -translate-x-1/2' :
            'right-full top-1/2 -translate-y-1/2 translate-x-1/2'
          }`} />
        </div>
      )}
    </div>
  )
}
