'use client'
import React, { useEffect, useState } from 'react';

type TocHeading = {
  depth: number;
  text: string;
  id: string;
};

export default function Toc({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const heading = headingElements[i];
        if (heading.getBoundingClientRect().top <= 100) {
          setActiveId(heading.id);
          return;
        }
      }
      setActiveId('');
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  return (
    <div className="toc-div">
      <nav className="toc-nav">
        <b className="toc-title">contenu</b>
        <ul className="toc-list">
          {headings.map((heading) => (
            <li 
              key={heading.id} 
              className={`toc-item toc-level-${heading.depth} ${activeId === heading.id ? 'active' : ''}`}
            >
              <a href={`#${heading.id}`}>{heading.text}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}