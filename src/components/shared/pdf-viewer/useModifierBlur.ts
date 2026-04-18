'use client';

import { useState, useEffect, useRef } from 'react';

const MODIFIER_KEYS = new Set(['Control', 'Alt', 'Meta', 'Shift', 'CapsLock']);

/**
 * Tracks modifier key presses (Control, Alt, Meta, Shift, CapsLock).
 * Returns isBlurred=true when any modifier key is held down.
 * Used to blur the PDF viewer when developer tools / inspect mode is likely active.
 */
export function useModifierBlur() {
  const [isBlurred, setIsBlurred] = useState(false);
  const activeModifiers = useRef(new Set<string>());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (MODIFIER_KEYS.has(e.key)) {
        e.preventDefault?.();
        activeModifiers.current.add(e.key);
        setIsBlurred(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (MODIFIER_KEYS.has(e.key)) {
        activeModifiers.current.delete(e.key);
        if (activeModifiers.current.size === 0) {
          setIsBlurred(false);
        }
      }
    };

    const handleWindowBlur = () => {
      activeModifiers.current.clear();
      setIsBlurred(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);

  return { isBlurred };
}
