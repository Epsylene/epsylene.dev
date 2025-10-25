'use client'
import { useEffect } from "react";

export function MarginNoteHandler() {
  useEffect(() => {
    const notes = document.querySelectorAll('.margin-note')
    if (notes.length === 0) return

    let hoverTimeout: NodeJS.Timeout | null = null
    const HOVER_PADDING = 3

    const isNearElement = (mouseX: number, mouseY: number, element: HTMLElement): boolean => {
      const rect = element.getBoundingClientRect()
      return (
        mouseX >= rect.left - HOVER_PADDING &&
        mouseX <= rect.right + HOVER_PADDING &&
        mouseY >= rect.top - HOVER_PADDING &&
        mouseY <= rect.bottom + HOVER_PADDING
      )
    }

    // Hover a footnote reference -> expand corresponding
    // margin note
    notes.forEach(note => {
      const id = note.id.replace('margin-note-', 'user-content-fnref-')
      const ref = document.getElementById(id)

      if (ref) {
        // ref.addEventListener('mouseenter', () => {
        //   note.classList.add('expanded')

        //   if (hoverTimeout) {
        //     clearTimeout(hoverTimeout)
        //     hoverTimeout = null
        //   }
        // })

        // ref.addEventListener('mouseleave', () => {
        //   hoverTimeout = setTimeout(() => {
        //     note.classList.remove('expanded')
        //   }, 200)
        // })

        const handleMouseMove = (e: MouseEvent) => {
          if (isNearElement(e.clientX, e.clientY, ref)) {
            note.classList.add('expanded')

            if (hoverTimeout) {
              clearTimeout(hoverTimeout)
              hoverTimeout = null
            }
          } else {
            if (!note.classList.contains('expanded')) return

            hoverTimeout = setTimeout(() => {
              note.classList.remove('expanded')
            }, 200)
          }
        }

        document.addEventListener('mousemove', handleMouseMove)
      }
    })

    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    }
  })

  return null
}