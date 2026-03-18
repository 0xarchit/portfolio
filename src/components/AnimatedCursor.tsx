"use client";
import { useEffect, useRef, useState } from 'react';

export const AnimatedCursor = () => {
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const currentPosRef = useRef({ x: 0, y: 0 });
  const targetPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const syncEnabled = () => setEnabled(mediaQuery.matches);
    syncEnabled();
    mediaQuery.addEventListener('change', syncEnabled);
    return () => mediaQuery.removeEventListener('change', syncEnabled);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setVisible(false);
      return;
    }

    const animate = () => {
      const cursor = cursorRef.current;
      if (!cursor) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const current = currentPosRef.current;
      const target = targetPosRef.current;
      current.x += (target.x - current.x) * 0.35;
      current.y += (target.y - current.y) * 0.35;
      cursor.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    const moveHandler = (e: MouseEvent) => {
      targetPosRef.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget) setVisible(false);
    };

    const handleMouseOver = () => setVisible(true);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleDragStart = () => setIsDragging(true);
    const handleDragEnd = () => setIsDragging(false);
    const handleHover = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) {
        setIsHovering(false);
        return;
      }
      setIsHovering(
        Boolean(
          e.target.closest(
            'a, button, [role="button"], input, textarea, select, label'
          )
        )
      );
    };

    rafRef.current = requestAnimationFrame(animate);

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('dragstart', handleDragStart);
    window.addEventListener('dragend', handleDragEnd);
    window.addEventListener('mousemove', handleHover);

    return () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('dragend', handleDragEnd);
      window.removeEventListener('mousemove', handleHover);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [enabled, visible]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className={`animated-cursor ${visible ? 'visible' : ''} ${isClicking ? 'active' : ''} ${isHovering ? 'hovering' : ''} ${isDragging ? 'dragging' : ''}`}
    />
  );
};
