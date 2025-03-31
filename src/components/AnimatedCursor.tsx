import { useEffect, useRef, useState } from 'react';
import './AnimatedCursor.css';

export const AnimatedCursor = () => {
  // Only render custom cursor on devices supporting hover (i.e. desktops)
  if (window.matchMedia('(hover: none)').matches) {
    return null;
  }

  const [visible, setVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveHandler = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.setProperty('--cursor-x', `${e.clientX}px`);
        cursorRef.current.style.setProperty('--cursor-y', `${e.clientY}px`);
      }
      if (!visible) setVisible(true);
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget) setVisible(false);
    };

    const handleMouseOver = () => setVisible(true);

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [visible]);

  return (
    <div ref={cursorRef} className={`animated-cursor ${visible ? 'visible' : ''}`} />
  );
};
