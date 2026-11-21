import { useEffect, useRef } from 'react';

export function useCursorFollow(enabled: boolean) {
  const catRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const posRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const isFacingLeftRef = useRef(false);
  const lastMoveTimeRef = useRef(Date.now());
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Parked resting position in top-right corner
    const initX = window.innerWidth - 72;
    const initY = 40;
    targetRef.current = { x: initX, y: initY };
    posRef.current = { x: initX, y: initY };

    if (prefersReducedMotion) {
      if (catRef.current) {
        catRef.current.style.transform = `translate3d(${initX}px, ${initY}px, 0)`;
      }
      return;
    }

    const onPointerMove = (e: PointerEvent) => {
      // Offset slightly to the lower-right so cursor click target is never obscured
      targetRef.current = { x: e.clientX + 10, y: e.clientY + 12 };
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

      // Idle breathing bob when stationary
      const isIdle = Date.now() - lastMoveTimeRef.current > 1200;
      const bob = isIdle ? Math.sin(Date.now() / 320) * 2.5 : 0;

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
