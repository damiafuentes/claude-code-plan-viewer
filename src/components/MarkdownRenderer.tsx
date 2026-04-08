import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface Props {
  content: string;
  sectionId?: string;
}

export function MarkdownRenderer({ content, sectionId }: Props) {
  return (
    <div className="prose" data-section-id={sectionId}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
