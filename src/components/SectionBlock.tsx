import { useState } from 'react';
import type { PlanSection, InlineComment } from '../lib/types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { InlineCommentForm } from './InlineCommentForm';
import { CommentThread } from './CommentThread';

interface Props {
  section: PlanSection;
  comments: InlineComment[];
  allComments: InlineComment[];
  onAddComment: (sectionId: string, lineRange: [number, number], body: string) => void;
  onRemoveComment: (index: number) => void;
}

export function SectionBlock({ section, comments, allComments, onAddComment, onRemoveComment }: Props) {
  const [showForm, setShowForm] = useState(false);

  // Find the global indices for this section's comments
  const getGlobalIndex = (localIdx: number): number => {
    const comment = comments[localIdx];
    return allComments.indexOf(comment);
  };

  return (
    <div className="group relative">
      {/* Comment gutter — "+" button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="absolute -left-10 top-2 w-7 h-7 rounded-sm flex items-center justify-center
          opacity-0 group-hover:opacity-100 transition-opacity
          bg-claude-accent-light dark:bg-claude-accent-dark text-white text-lg leading-none
          hover:scale-110 transition-transform"
        title="Add comment"
      >
        +
      </button>

      {/* Section content */}
      <div className="rounded-md border border-claude-border-light dark:border-claude-border-dark bg-claude-surface-light dark:bg-claude-surface-dark p-md mb-3">
        {/* Comment count badge */}
        {comments.length > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-claude-accent-light dark:bg-claude-accent-dark text-white text-xs font-medium float-right">
            {comments.length}
          </span>
        )}

        <MarkdownRenderer content={section.rawContent} sectionId={section.id} />

        {/* Comments on this section */}
        <CommentThread
          comments={comments}
          onRemove={(localIdx) => onRemoveComment(getGlobalIndex(localIdx))}
        />

        {/* Inline comment form */}
        {showForm && (
          <InlineCommentForm
            sectionId={section.id}
            lineRange={[section.startLine, section.endLine]}
            onSubmit={onAddComment}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>

      {/* Render children recursively */}
      {section.children.map((child) => {
        const childComments = allComments.filter((c) => c.sectionId === child.id);
        return (
          <div key={child.id} className="ml-4">
            <SectionBlock
              section={child}
              comments={childComments}
              allComments={allComments}
              onAddComment={onAddComment}
              onRemoveComment={onRemoveComment}
            />
          </div>
        );
      })}
    </div>
  );
}
