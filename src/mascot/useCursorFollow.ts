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

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Default parked position: top-right corner
    const initX = window.innerWidth - 80;
    const initY = 56;
    targetRef.current = { x: initX, y: initY };
    posRef.current = { x: initX, y: initY };

    if (prefersReducedMotion) {
      if (catRef.current) {
        catRef.current.style.transform = `translate3d(${initX}px, ${initY}px, 0)`;
      }
      return;
    }

    const onPointerMove = (e: PointerEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      lastMoveTimeRef.current = Date.now();
    };

    const loop = () => {
      if (document.hidden) {
        rafIdRef.current = requestAnimationFrame(loop);
        return;
      }

      const cur = posRef.current;
      const target = targetRef.current;

      // Lerp follow with ease 0.12
      const dx = target.x - cur.x;
      const dy = target.y - cur.y;

      cur.x += dx * 0.12;
      cur.y += dy * 0.12;

      // Determine facing direction
      if (Math.abs(dx) > 1.5) {
        isFacingLeftRef.current = dx < 0;
      }

      // Idle bob when still >= 1.5s
      const isIdle = Date.now() - lastMoveTimeRef.current > 1500;
      const bob = isIdle ? Math.sin(Date.now() / 300) * 3 : 0;

      const scaleX = isFacingLeftRef.current ? -1 : 1;

      if (catRef.current) {
        catRef.current.style.transform = `translate3d(${cur.x + 10}px, ${cur.y + 10 + bob}px, 0) scaleX(${scaleX})`;
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
