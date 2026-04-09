import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownViewerProps {
  content: string;
}

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  const [plugins, setPlugins] = useState<{ remark: any[], rehype: any[] }>({
    remark: [remarkGfm],
    rehype: []
  });
  
  const hasMath = content.includes('$') || content.includes('\\(') || content.includes('\\[');

  useEffect(() => {
    if (hasMath) {
      Promise.all([
        import('remark-math'),
        import('rehype-katex'),
        import('katex/dist/katex.min.css')
      ]).then(([remarkMath, rehypeKatex]) => {
        setPlugins({
          remark: [remarkGfm, remarkMath.default],
          rehype: [rehypeKatex.default]
        });
      }).catch(err => {
        console.error('Failed to load math plugins', err);
      });
    }
  }, [hasMath]);

  return (
    <div className="prose-custom">
      <ReactMarkdown 
        remarkPlugins={plugins.remark} 
        rehypePlugins={plugins.rehype}
        components={{
          a: ({ node, ...props }) => (
            <a target="_blank" rel="noopener noreferrer" {...props} />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}