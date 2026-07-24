import React from 'react';
import ReactMarkdown from 'react-markdown';

const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      components={{
        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-yellow-400 my-6 font-serif" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-yellow-300 my-4 font-serif" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-yellow-200 my-3 font-serif" {...props} />,
        p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 text-slate-300 space-y-1" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 text-slate-300 space-y-1" {...props} />,
        li: ({ node, ...props }) => <li className="pl-2" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-bold text-purple-300" {...props} />,
        em: ({ node, ...props }) => <em className="italic text-slate-300" {...props} />,
        hr: ({ node, ...props }) => <hr className="my-6 border-white/10" {...props} />,
        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-purple-500 pl-4 py-1 my-4 bg-purple-900/20 italic" {...props} />
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
