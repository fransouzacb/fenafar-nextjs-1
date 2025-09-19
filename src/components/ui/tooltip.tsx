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
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current && tooltipRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect()
        const tooltipRect = tooltipRef.current.getBoundingClientRect()
        
        let top = 0
        let left = 0
        
        switch (side) {
          case 'top':
            top = triggerRect.top - tooltipRect.height - 8
            left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
            break
          case 'bottom':
            top = triggerRect.bottom + 8
            left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
            break
          case 'left':
            top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
            left = triggerRect.left - tooltipRect.width - 8
            break
          case 'right':
            top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
            left = triggerRect.right + 8
            break
        }
        
        setPosition({ top, left })
        setIsVisible(true)
      }
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
    <div className="relative inline-block">
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
          ref={tooltipRef}
          className="absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap"
          style={{
            top: position.top,
            left: position.left,
          }}
        >
          {content}
          <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
            side === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' :
            side === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' :
            side === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' :
            'left-[-4px] top-1/2 -translate-y-1/2'
          }`} />
        </div>
      )}
    </div>
  )
}
