import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const visibleRef = useRef(true);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      if (!outerRef.current || !innerRef.current) return;
      gsap.to(outerRef.current, { x, y, duration: 0.18, ease: 'power3.out' });
      gsap.to(innerRef.current, { x, y, duration: 0.03, ease: 'none' });
    };
    const onDown = () => {
      if (!outerRef.current || !innerRef.current) return;
      gsap.to(outerRef.current, { scale: 0.7, duration: 0.12, ease: 'power1.out' });
      gsap.to(innerRef.current, { scale: 0.6, duration: 0.12, ease: 'power1.out' });
    };
    const onUp = () => {
      if (!outerRef.current || !innerRef.current) return;
      gsap.to(outerRef.current, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
      gsap.to(innerRef.current, { scale: 1, duration: 0.25, ease: 'power3.out' });
    };
    const onEnterWindow = () => {
      if (!outerRef.current || !innerRef.current) return;
      visibleRef.current = true;
      outerRef.current.style.display = 'block';
      innerRef.current.style.display = 'block';
    };
    const onLeaveWindow = () => {
      if (!outerRef.current || !innerRef.current) return;
      visibleRef.current = false;
      outerRef.current.style.display = 'none';
      innerRef.current.style.display = 'none';
    };
    const onOverElement = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || !outerRef.current || !innerRef.current) return;
      const tag = target.tagName.toLowerCase();
      const isInput = tag === 'input' || tag === 'textarea' || target.isContentEditable;
      if (isInput) {
        outerRef.current.style.display = 'none';
        innerRef.current.style.display = 'none';
      } else if (visibleRef.current) {
        outerRef.current.style.display = 'block';
        innerRef.current.style.display = 'block';
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mouseenter', onEnterWindow);
    window.addEventListener('mouseleave', onLeaveWindow);
    window.addEventListener('mouseover', onOverElement);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mouseenter', onEnterWindow);
      window.removeEventListener('mouseleave', onLeaveWindow);
      window.removeEventListener('mouseover', onOverElement);
    };
  }, []);

  return (
    <>
      <div
        ref={outerRef}
        className="custom-cursor-outer"
        style={{ position: 'fixed', left: 0, top: 0, pointerEvents: 'none', display: 'block' }}
      />
      <div
        ref={innerRef}
        className="custom-cursor-inner"
        style={{ position: 'fixed', left: 0, top: 0, pointerEvents: 'none', display: 'block' }}
      />
    </>
  );
}
