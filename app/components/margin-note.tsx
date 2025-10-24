'use client'
import { useEffect } from "react";

export function MarginNoteHandler() {
  useEffect(() => {
    const notes = document.querySelectorAll('.margin-note')
    if (notes.length === 0) return

    const toggleNote = (note: HTMLElement) => {
      const selection = document.getSelection();
      const selecting = selection && !selection.isCollapsed;

      // If user is selecting text, do nothing
      if (selecting) {
        return;
      }

      note.classList.toggle('expanded');
    }

    const collapseAll = () => {
      notes.forEach((note: HTMLElement) => {
        note.classList.remove('expanded')
      })
    }

    // Toggle the note on click
    const marginNoteClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const marginNote = target.closest('.margin-note')

      if (marginNote) {
        e.stopPropagation()
        toggleNote(marginNote as HTMLElement)
      }
    }

    notes.forEach(note => {
      note.addEventListener('click', marginNoteClick)
    })
    
    // Click anywhere else -> collapse all
    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.margin-note')) {
        collapseAll()
      }
    })

    // Click on a footnote reference -> expand corresponding margin note
    notes.forEach(note => {
      const id = note.id.replace('margin-note-', 'user-content-fnref-')
      const ref = document.getElementById(id)

      if (ref) {
        ref.addEventListener('click', (e: MouseEvent) => {
          e.stopPropagation()
          console.log('Footnote reference clicked:', id)
          const isExpanded = note.classList.contains('expanded')
          collapseAll()
          if (!isExpanded) {
            toggleNote(note as HTMLElement)
          }
        })
      }
    })

    return () => {
      // Avoid triggering event multiple times
      notes.forEach(note => {
          note.removeEventListener('click', marginNoteClick)
      })
    }
  })

  return null
}