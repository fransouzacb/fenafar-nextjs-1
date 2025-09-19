'use client'

import React, { useState, useRef, useEffect } from 'react'

interface TooltipProps {
  content: string
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

export function Tooltip({ content, children, side = 'top', delay = 200 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const updatePosition = () => {
    if (triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      
      let top = 0
      let left = 0
      
      switch (side) {
        case 'top':
          top = triggerRect.top + window.scrollY - tooltipRect.height - 8
          left = triggerRect.left + window.scrollX + (triggerRect.width - tooltipRect.width) / 2
          break
        case 'bottom':
          top = triggerRect.bottom + window.scrollY + 8
          left = triggerRect.left + window.scrollX + (triggerRect.width - tooltipRect.width) / 2
          break
        case 'left':
          top = triggerRect.top + window.scrollY + (triggerRect.height - tooltipRect.height) / 2
          left = triggerRect.left + window.scrollX - tooltipRect.width - 8
          break
        case 'right':
          top = triggerRect.top + window.scrollY + (triggerRect.height - tooltipRect.height) / 2
          left = triggerRect.right + window.scrollX + 8
          break
      }
      
      setPosition({ top, left })
    }
  }

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
      setTimeout(updatePosition, 0) // Aguarda o DOM atualizar
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  useEffect(() => {
    if (isVisible) {
      updatePosition()
      const handleScroll = () => updatePosition()
      const handleResize = () => updatePosition()
      
      window.addEventListener('scroll', handleScroll)
      window.addEventListener('resize', handleResize)
      
      return () => {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [isVisible, side])

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
          ref={tooltipRef}
          className="fixed z-[9999] px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-xl whitespace-nowrap pointer-events-none"
          style={{
            top: position.top,
            left: position.left,
          }}
        >
          {content}
          <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
            side === 'top' ? '-bottom-1 left-1/2 -translate-x-1/2' :
            side === 'bottom' ? '-top-1 left-1/2 -translate-x-1/2' :
            side === 'left' ? '-right-1 top-1/2 -translate-y-1/2' :
            '-left-1 top-1/2 -translate-y-1/2'
          }`} />
        </div>
      )}
    </div>
  )
}
