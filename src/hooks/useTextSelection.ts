import { useState, useEffect, useCallback } from 'react';

export interface TextSelection {
  text: string;
  range: Range;
  rect: DOMRect;
}

export function useTextSelection(containerRef: React.RefObject<HTMLElement | null>) {
  const [selection, setSelection] = useState<TextSelection | null>(null);

  const handleMouseUp = useCallback(() => {
    requestAnimationFrame(() => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) {
        return; // don't clear — let clicks on popover work
      }

      const range = sel.getRangeAt(0);
      const text = sel.toString().trim();

      if (!text || !containerRef.current?.contains(range.commonAncestorContainer)) {
        return;
      }

      const rect = range.getBoundingClientRect();
      setSelection({ text, range: range.cloneRange(), rect });
    });
  }, [containerRef]);

  const clearSelection = useCallback(() => {
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseUp]);

  // Clear selection when clicking outside the container and popover
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't clear if clicking inside the popover or a comment card
      if (target.closest('[data-popover]') || target.closest('[data-comment-card]')) return;
      // Don't clear if inside the container (user might be starting a new selection)
      if (containerRef.current?.contains(target)) {
        setSelection(null);
        return;
      }
      setSelection(null);
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [containerRef]);

  return { selection, clearSelection };
}
