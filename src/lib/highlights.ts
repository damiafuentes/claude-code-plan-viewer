const PENDING_ID = '__pending__';

/** Wrap all text nodes inside a Range with <mark> elements */
function wrapRange(range: Range, commentId: string, className: string): HTMLElement[] {
  const marks: HTMLElement[] = [];

  const walker = document.createTreeWalker(
    range.commonAncestorContainer.nodeType === Node.TEXT_NODE
      ? range.commonAncestorContainer.parentElement!
      : range.commonAncestorContainer,
    NodeFilter.SHOW_TEXT
  );

  const textNodes: Text[] = [];
  let node: Node | null = walker.nextNode();
  while (node) {
    if (range.intersectsNode(node)) textNodes.push(node as Text);
    node = walker.nextNode();
  }

  for (const textNode of textNodes) {
    const nodeRange = document.createRange();
    nodeRange.setStart(
      textNode,
      textNode === range.startContainer ? range.startOffset : 0
    );
    nodeRange.setEnd(
      textNode,
      textNode === range.endContainer ? range.endOffset : textNode.length
    );
    if (nodeRange.toString().trim() === '') continue;

    const mark = document.createElement('mark');
    mark.dataset.commentId = commentId;
    mark.className = className;
    try {
      nodeRange.surroundContents(mark);
      marks.push(mark);
    } catch {
      // Range crosses element boundaries — skip
    }
  }

  return marks;
}

/** Create a pending highlight while the user is typing a comment */
export function createPendingHighlight(range: Range): void {
  wrapRange(range, PENDING_ID, 'comment-highlight-pending');
}

/** Remove pending highlights (user cancelled) */
export function removePendingHighlight(): void {
  removeHighlightsById(PENDING_ID, 'comment-highlight-pending');
}

/** Promote pending highlight to permanent with a real comment ID */
export function promotePendingHighlight(commentId: string): void {
  const marks = document.querySelectorAll(`mark[data-comment-id="${PENDING_ID}"]`);
  marks.forEach((mark) => {
    (mark as HTMLElement).dataset.commentId = commentId;
    mark.className = 'comment-highlight';
  });
}

/** Create a permanent highlight for a submitted comment */
export function createHighlight(range: Range, commentId: string): void {
  wrapRange(range, commentId, 'comment-highlight');
}

/** Remove all highlights for a comment ID */
export function removeHighlights(commentId: string): void {
  removeHighlightsById(commentId, 'comment-highlight');
}

function removeHighlightsById(commentId: string, className: string): void {
  const marks = document.querySelectorAll(`mark[data-comment-id="${commentId}"]`);
  marks.forEach((mark) => {
    const parent = mark.parentNode;
    if (parent) {
      while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
      parent.removeChild(mark);
      parent.normalize();
    }
  });
}

/** Set the active (hovered) state on highlights for a comment */
export function setHighlightActive(commentId: string, active: boolean): void {
  const marks = document.querySelectorAll(`mark.comment-highlight[data-comment-id="${commentId}"]`);
  marks.forEach((mark) => {
    mark.classList.toggle('active', active);
  });
}

/** Get the comment ID from a DOM element (if it's inside a highlight mark) */
export function getCommentIdFromElement(el: HTMLElement): string | null {
  const mark = el.closest('mark.comment-highlight');
  return mark ? (mark as HTMLElement).dataset.commentId ?? null : null;
}
