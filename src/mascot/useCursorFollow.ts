import { useEffect, useRef } from 'react';

export function useCursorFollow(enabled: boolean) {
  const catRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const posRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const isFacingLeftRef = useRef(false);
  const lastMoveTimeRef = useRef(Date.now());
  const bobAmpRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Parked resting position: top-right corner, full cat visible
    const initX = window.innerWidth - 56;
    const initY = 6;
    targetRef.current = { x: initX, y: initY };
    posRef.current = { x: initX, y: initY };

    if (prefersReducedMotion) {
      if (catRef.current) {
        catRef.current.style.transform = `translate3d(${initX}px, ${initY}px, 0)`;
      }
      return;
    }

    const onPointerMove = (e: PointerEvent) => {
      // Center the cat on the cursor (sprite is 48px; subtract half to align center)
      targetRef.current = { x: e.clientX - 24, y: e.clientY - 24 };
      lastMoveTimeRef.current = Date.now();
    };

    const loop = () => {
      if (document.hidden) {
        rafIdRef.current = requestAnimationFrame(loop);
        return;
      }

      const cur = posRef.current;
      const target = targetRef.current;

      // Smooth lerp easing
      const dx = target.x - cur.x;
      const dy = target.y - cur.y;

      cur.x += dx * 0.12;
      cur.y += dy * 0.12;

      // Face toward cursor direction
      if (Math.abs(dx) > 1.2) {
        isFacingLeftRef.current = dx < 0;
      }

      // Idle breathing bob smoothly eased when stationary
      const isIdle = Date.now() - lastMoveTimeRef.current > 1200;
      const targetAmp = isIdle ? 2.5 : 0;
      bobAmpRef.current += (targetAmp - bobAmpRef.current) * 0.08;
      const bob = Math.sin(Date.now() / 320) * bobAmpRef.current;

      const scaleX = isFacingLeftRef.current ? -1 : 1;

      if (catRef.current) {
        catRef.current.style.transform = `translate3d(${cur.x}px, ${cur.y + bob}px, 0) scaleX(${scaleX})`;
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [enabled]);

  return catRef;
}
