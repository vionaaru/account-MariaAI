import React, { useState } from 'react';
import { X, Code } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface PreviewModalProps {
  content: string;
  rawContent: string;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ content, rawContent, onClose }) => {
  const [showRaw, setShowRaw] = useState(false);
  
  // Process content to handle our custom format for the markdown preview
  const processedContent = content
    .replace(/###### \[!(\w+)\] ######--(.+?)--/g, '### $1 ($2)')
    .replace(/###### \[!(\w+)\] ######/g, '### $1')
    .replace(/\[!(\w+)\]--(.+?)--/g, '### $1 ($2)')
    .replace(/\[!(\w+)\]/g, '### $1')
    .replace(/\[\/!(\w+)\]/g, '')
    .replace(/###### \[\/!(\w+)\] ######/g, '');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-dark-400 rounded-lg w-3/4 max-h-[80vh] flex flex-col text-gray-200 shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-600">
          <div className="flex items-center">
            <h2 className="text-xl font-bold">Preview</h2>
            <div className="ml-4 flex items-center bg-dark-300 rounded-md overflow-hidden">
              <button 
                onClick={() => setShowRaw(false)}
                className={`px-3 py-1 text-sm ${!showRaw ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-dark-200'}`}
              >
                Formatted
              </button>
              <button 
                onClick={() => setShowRaw(true)}
                className={`px-3 py-1 text-sm flex items-center ${showRaw ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-dark-200'}`}
              >
                <Code size={14} className="mr-1" />
                Raw Output
              </button>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-dark-300 rounded text-gray-300"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="overflow-auto p-6 flex-grow">
          {showRaw ? (
            <pre className="whitespace-pre-wrap bg-dark-300 p-4 rounded-md text-gray-200 font-mono text-sm">
              {rawContent}
            </pre>
          ) : (
            <div className="markdown-preview">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {processedContent}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;