import React, { useCallback, useEffect, useRef, useState } from 'react';

// Must match the gap-7 class on the scrolling row
const GAP_PX = 28;

const Arrow: React.FC<{ direction: 'left' | 'right'; visible: boolean; onClick: () => void }> = ({ direction, visible, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={direction === 'left' ? 'Previous projects' : 'Next projects'}
    className={`hidden md:flex absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-100 border border-gray-200 dark:border-slate-600 shadow-lg hover:bg-[#EF6461] hover:text-white hover:border-[#EF6461] transition-all duration-200 ${
      direction === 'left' ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'
    } ${visible ? 'opacity-0 group-hover/carousel:opacity-100 focus-visible:opacity-100' : 'invisible opacity-0'}`}
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d={direction === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
    </svg>
  </button>
);

const ProjectCarousel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    setCanScrollLeft(row.scrollLeft > 1);
    setCanScrollRight(row.scrollLeft + row.clientWidth < row.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    updateArrows();
    const observer = new ResizeObserver(updateArrows);
    observer.observe(row);
    row.addEventListener('scroll', updateArrows, { passive: true });
    return () => {
      observer.disconnect();
      row.removeEventListener('scroll', updateArrows);
    };
  }, [updateArrows, children]);

  const scrollByOneCard = (direction: 1 | -1) => {
    const row = rowRef.current;
    const card = row?.firstElementChild as HTMLElement | null;
    if (!row || !card) return;
    row.scrollBy({ left: direction * (card.offsetWidth + GAP_PX), behavior: 'smooth' });
  };

  return (
    <div className="relative group/carousel">
      <Arrow direction="left" visible={canScrollLeft} onClick={() => scrollByOneCard(-1)} />
      <div ref={rowRef} className="flex gap-7 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-3 -my-3">
        {children}
      </div>
      <Arrow direction="right" visible={canScrollRight} onClick={() => scrollByOneCard(1)} />
    </div>
  );
};

export default ProjectCarousel;
