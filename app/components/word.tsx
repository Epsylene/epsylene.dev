'use client'
import React, { ReactNode, useEffect, useRef, useState } from 'react'

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .normalize('NFD') // Normalize (remove accents)
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
}

interface WordLineProps {
  children: ReactNode
}

export function WordLine({ children }: WordLineProps) {
  return (
    <div className="flex gap-3 justify-center text-lg overflow-visible whitespace-nowrap">
      {children}
    </div>
  )
}

interface WordProps {
  title: string
  children: ReactNode
}

// Global state to track if any modal is open (using counter for multiple modals)
let openModalCount = 0
const modalListeners = new Set<() => void>()

function notifyModalStateChange() {
  modalListeners.forEach(listener => listener())
}

export function Word({ title, children }: WordProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scale, setScale] = useState(1)
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  const id = slugify(title)

  // Listen if a modal is open
  useEffect(() => {
    const listener = () => setIsAnyModalOpen(openModalCount > 0)
    modalListeners.add(listener)
    listener() // Initialize state
    return () => {
      modalListeners.delete(listener)
    }
  }, [])

  // Update global modal count when this modal opens/closes
  useEffect(() => {
    if (isOpen) {
      openModalCount++
      notifyModalStateChange()
    }
    
    return () => {
      if (isOpen) {
        openModalCount--
        notifyModalStateChange()
      }
    }
  }, [isOpen])

  // Check if this word should be opened based on URL hash
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === `#${id}`) {
        setIsOpen(true)
      }
    }
    
    // Check on mount
    checkHash()
    
    // Listen for hash changes
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
  }, [id])

  useEffect(() => {
    if (isOpen || isAnyModalOpen) {
      setScale(1)
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return

      const rect = buttonRef.current.getBoundingClientRect()
    
      // Calculate distance to the nearest edge of the bounding box
      const closestX = Math.max(rect.left, Math.min(e.clientX, rect.right))
      const closestY = Math.max(rect.top, Math.min(e.clientY, rect.bottom))
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - closestX, 2) + 
        Math.pow(e.clientY - closestY, 2)
      )

      const maxDistance = 100 // pixels
      const maxScale = 1.5
      
      if (distance < maxDistance) {
        const proximityScale = 1 - (distance / maxDistance)
        const newScale = 1 + (proximityScale * (maxScale - 1))
        setScale(newScale)
      } else {
        setScale(1)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isOpen, isAnyModalOpen])

  // Default state: word with ID for linking
  if (!isOpen) {
    return (
      <a href={`#${id}`} className="inline-block shrink-0">
        <button
          id={id}
          ref={buttonRef}
          onClick={() => setIsOpen(true)}
          className="hover:text-blue-600 transition-colors inline-flex items-center justify-center"
          style={{
            minWidth: '1em',
            minHeight: '1.2em',
          }}
        >
          <span
            style={{
              fontSize: `${scale}em`,
              transition: 'font-size 0.1s ease-out',
              lineHeight: 1
            }}
          >
            {title}
          </span>
        </button>
      </a>
    )
  }

  // Open state: overlay popup with greyed-out background
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-8 z-50 overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsOpen(false)
          window.history.pushState(null, '', window.location.pathname)
        }
      }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 max-h-[35em] overflow-scroll">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold text-blue-600">{title}</h2>
          <button
            onClick={() => {
              setIsOpen(false)
              window.history.pushState(null, '', window.location.pathname)
            }}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none shrink-0"
          >
            ×
          </button>
        </div>
        <div className="prose text-wrap text-black">
          {children}
        </div>
      </div>
    </div>
  )
}