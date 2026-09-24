import React from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const MathView: React.FC<MathViewProps> = ({ math, block = true, className = '' }) => {
  try {
    const html = katex.renderToString(math, {
      displayMode: block,
      throwOnError: false,
      output: 'htmlAndMathml',
      strict: false
    });

    return (
      <div
        className={`math-rendered overflow-x-auto text-slate-900 py-1.5 ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch (err) {
    console.error('KaTeX render error:', err);
    return <code className="text-xs font-mono text-slate-700">{math}</code>;
  }
};
