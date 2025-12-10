'use client'
import { Children, ReactElement, ReactNode, isValidElement, useEffect, useRef, useState } from 'react'

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

interface WordsSoupProps {
  children: ReactNode
}

export function WordsSoup({ children }: WordsSoupProps) {
  const [lines, setLines] = useState<ReactNode[][]>([[]])
  const containerRef = useRef<HTMLDivElement>(null)
  const measuringRef = useRef<HTMLDivElement>(null)
  
  // Extract word titles from Word components
  const getWordTitles = (items: ReactNode[]): string[] => {
    return Children.toArray(items)
      .filter(isValidElement)
      .map(child => (child.props as { title?: string }).title)
      .filter(Boolean) as string[]
  }
  
  useEffect(() => {
    if (!containerRef.current || !measuringRef.current) return
    
    const calculateLines = () => {
      const container = containerRef.current
      const measuring = measuringRef.current
      if (!container || !measuring) return
      
      const containerWidth = container.offsetWidth
      const gap = 12 // gap-3 = 12px
      
      // Extract child array and filter out newlines and whitespace
      const childArray = Children.toArray(children).filter(child => {
        if (typeof child === 'string') {
          return child.trim() !== ''
        }
        return isValidElement(child)
      }) as ReactElement[]
      
      // Get all measuring span elements (should match childArray length now)
      const wordElements = Array.from(measuring.children) as HTMLElement[]
      
      const newLines: number[][] = []
      let currentLine: number[] = []
      let currentWidth = 0
      
      wordElements.forEach((element, index) => {
        const wordWidth = element.offsetWidth
        
        const widthWithGap = currentWidth + (currentLine.length > 0 ? gap : 0) + wordWidth
        
        if (widthWithGap > containerWidth && currentLine.length > 0) {
          newLines.push(currentLine)
          currentLine = [index]
          currentWidth = wordWidth
        } else {
          currentLine.push(index)
          currentWidth = widthWithGap
        }
      })
      
      if (currentLine.length > 0) {
        newLines.push(currentLine)
      }
      
      const groupedLines = newLines.map(indices =>
        indices.map(i => childArray[i]).filter(Boolean)
      )
      
      setLines(groupedLines)
    }
    
    setTimeout(calculateLines, 0)
    
    // Listen to window resize
    window.addEventListener('resize', calculateLines)
    
    // Use ResizeObserver to detect container size changes (handles zoom)
    const resizeObserver = new ResizeObserver(calculateLines)
    resizeObserver.observe(containerRef.current)

    return () => {
      window.removeEventListener('resize', calculateLines)
      resizeObserver.disconnect()
    }
  }, [children])
  
    const wordTitles = getWordTitles(Children.toArray(children))
  
  return (
    <>
      <div 
        ref={measuringRef}
        className="fixed top-0 left-0 opacity-0 pointer-events-none flex gap-3 text-lg whitespace-nowrap"
        aria-hidden="true"
      >
        {wordTitles.map((title, i) => (
          <span key={i}>{title}</span>
        ))}
      </div>
      
      <div ref={containerRef} className="space-y-2">
        {lines.map((line, i) => (
          <WordLine key={i}>
            {line}
          </WordLine>
        ))}
      </div>
    </>
  )
}

interface WordProps {
  title: string
  children: ReactNode
}

// Global state to track which modal is currently open
let openModalId: string | null = null
const modalListeners = new Map<string, (shouldOpen: boolean) => void>()

const stateListeners = new Set<() => void>()

function notifyModalStateChange(triggeringId: string) {
  // Close all other modals
  modalListeners.forEach((listener, id) => {
    if (id !== triggeringId) {
      listener(false)
    }
  })
  openModalId = triggeringId
  // Notify all components about state change
  stateListeners.forEach(listener => listener())
}

export function Word({ title, children }: WordProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scale, setScale] = useState(1)
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  const id = slugify(title)

  // Register this modal and listen for external close signals
  useEffect(() => {
    const externalCloseListener = (shouldOpen: boolean) => {
      setIsOpen(shouldOpen)
    }
    
    modalListeners.set(id, externalCloseListener)
    const stateListener = () => setIsAnyModalOpen(openModalId !== null)
    stateListeners.add(stateListener)
    stateListener() // Initialize
    
    return () => {
      modalListeners.delete(id)
      stateListeners.delete(stateListener)
    }
  }, [id])

  // Update global modal state when this modal opens/closes
  useEffect(() => {
    if (isOpen) {
      notifyModalStateChange(id)
      setIsAnyModalOpen(true)
    } else if (openModalId === id) {
      openModalId = null
      setIsAnyModalOpen(false)
      // Notify all listeners that no modal is open
      stateListeners.forEach(listener => listener())
    }
  }, [isOpen, id])

  // Check if this word should be opened based on URL hash
  useEffect(() => {
    const checkHash = () => {
      const { hash } = window.location
      if (!hash) {
        setIsOpen(false)
        return
      }

      if (hash === `#${id}`) {
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

  const word = (
    <a href={`#${id}`} className="inline-block shrink-0">
        <button
          id={id}
          ref={buttonRef}
          onClick={() => setIsOpen(true)}
          className="hover:text-[#ff2957] text-[#c7bebe] transition-colors inline-flex items-center justify-center"
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

  // Default state: word with ID for linking
  if (!isOpen) {
    return word
  }

  // Open state: overlay popup with greyed-out background
  return (
    <>
      {word}
      <div 
        className="fixed inset-0 flex items-start justify-center p-8 z-50 overflow-scroll bg-[#00000082]"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsOpen(false)
            window.history.pushState(null, '', window.location.pathname)
          }
        }}
      >
        <div className="bg-[#131418] text-[#c7bebe] shadow-xl max-w-3xl w-full p-6 my-auto">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 className="text-3xl text-[#ff2957] font-bold">{title}</h2>
            <button
              onClick={() => {
                setIsOpen(false)
                window.history.pushState(null, '', window.location.pathname)
              }}
              className="text-gray-400 hover:text-gray-200 text-2xl leading-none shrink-0"
            >
              ×
            </button>
          </div>
          <div className="prose-lg prose-p:m-0 prose-p:mb-2 prose-p:mt-4 prose-p:text-[1em] prose-ul:m-0 prose-ul:mr-5 prose-ol:m-6 prose-ol:mb-2 prose-li:m-0 prose-a:text-red-400 prose-a:hover:underline prose-blockquote:border-l-4 prose-blockquote:border-red-400/65 prose-blockquote:pl-4 prose-blockquote:my-4 prose-blockquote:text-[0.96em] prose-blockquote:leading-6 text-[#c7bebe] leading-7 text-wrap">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}