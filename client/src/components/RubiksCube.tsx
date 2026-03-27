import React, { useEffect, useRef, useState } from 'react';

const CUBE_SIZE = 240;
const GAP = 5;

const RubiksCube: React.FC = () => {
  const cubeRef = useRef<HTMLDivElement>(null);
  const rotYRef = useRef(20);
  const rotXRef = useRef(-22);
  const rafRef = useRef<number>();
  const pausedRef = useRef(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      if (!pausedRef.current) {
        rotYRef.current += 0.18;
        if (cubeRef.current) {
          cubeRef.current.style.transform = `rotateX(${rotXRef.current}deg) rotateY(${rotYRef.current}deg)`;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const half = CUBE_SIZE / 2;
  const faceTransforms: Record<string, string> = {
    front:  `translateZ(${half}px)`,
    back:   `rotateY(180deg) translateZ(${half}px)`,
    left:   `rotateY(-90deg) translateZ(${half}px)`,
    right:  `rotateY(90deg) translateZ(${half}px)`,
    top:    `rotateX(90deg) translateZ(${half}px)`,
    bottom: `rotateX(-90deg) translateZ(${half}px)`,
  };

  return (
    <div
      style={{ perspective: `${CUBE_SIZE * 3.5}px` }}
      className="flex items-center justify-center"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; setHovered(null); }}
    >
      <div
        ref={cubeRef}
        style={{
          width: `${CUBE_SIZE}px`,
          height: `${CUBE_SIZE}px`,
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotXRef.current}deg) rotateY(${rotYRef.current}deg)`,
        }}
      >
        {Object.entries(faceTransforms).map(([face, transform]) => (
          <div
            key={face}
            style={{
              position: 'absolute',
              inset: 0,
              transform,
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: `${GAP}px`,
              padding: `${GAP}px`,
            }}
          >
            {Array.from({ length: 9 }).map((_, i) => {
              const id = `${face}-${i}`;
              const isHot = hovered === id;
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHovered(id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    borderRadius: '5px',
                    transition: 'background 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
                    background: isHot
                      ? 'rgba(239,100,97,0.9)'
                      : 'rgba(255,255,255,0.04)',
                    border: `1.5px solid ${isHot ? 'rgba(239,100,97,1)' : 'rgba(239,100,97,0.22)'}`,
                    boxShadow: isHot
                      ? '0 0 18px rgba(239,100,97,0.6), inset 0 0 8px rgba(239,100,97,0.3)'
                      : 'inset 0 0 4px rgba(255,255,255,0.04)',
                    cursor: 'pointer',
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RubiksCube;
