import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypePrism from 'rehype-prism-plus';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';

interface MarkdownProps {
  content: string;
  className?: string;
  isStreaming?: boolean;
}

export function Markdown({ content, className, isStreaming = false }: MarkdownProps) {
  return (
    <div className={cn('markdown-body', isStreaming && 'loading', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, [rehypePrism, { ignoreMissing: true }]]}
        components={{
          pre: ({ children, className, ...props }) => (
            <pre {...props} className={cn('group relative', className)}>
              {children}
            </pre>
          ),
          code: ({ children, className, ...props }: ComponentProps<'code'>) => {
            const match = /language-(\w+)/.exec(className || '');
            const isMultiline = (children as string)?.includes('\n');
            
            if (match || isMultiline) {
              return (
                <code {...props} className={cn('block', className)}>
                  {children}
                </code>
              );
            }

            return (
              <code {...props} className="rounded bg-muted/50 px-1.5 py-0.5">
                {children}
              </code>
            );
          },
          // Override link to open in new tab
          a: ({ children, href, ...props }) => (
            <a
              {...props}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4"
            >
              {children}
            </a>
          ),
          // Add proper table styling
          table: ({ children, ...props }) => (
            <div className="my-4 w-full overflow-y-auto">
              <table {...props} className="w-full">
                {children}
              </table>
            </div>
          ),
          // Ensure images are responsive
          img: ({ src, alt, ...props }) => (
            <img
              src={src}
              alt={alt}
              loading="lazy"
              className="rounded-lg"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 