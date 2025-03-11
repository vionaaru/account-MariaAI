import React from 'react';
import { Copy, Download, Eye, FileText } from 'lucide-react';
import { FormatType } from '../types';

interface ControlPanelProps {
  formatType: FormatType;
  onFormatTypeChange: (type: FormatType) => void;
  onCopyToClipboard: () => void;
  onExport: (format: 'md' | 'txt') => void;
  onPreview: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  formatType,
  onFormatTypeChange,
  onCopyToClipboard,
  onExport,
  onPreview
}) => {
  return (
    <div className="w-64 bg-dark-500 border-l border-gray-700 p-4 h-full">
      <h2 className="text-xl font-bold mb-6 text-gray-100">Controls</h2>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2 text-gray-200">Global Format Type</h3>
        <div className="space-y-2">
          <label className="flex items-center text-gray-300">
            <input
              type="radio"
              name="formatType"
              checked={formatType === 'HASHTAG'}
              onChange={() => onFormatTypeChange('HASHTAG')}
              className="mr-2"
            />
            <span className="text-sm">
              ###### [!TAG] ######
            </span>
          </label>
          <label className="flex items-center text-gray-300">
            <input
              type="radio"
              name="formatType"
              checked={formatType === 'TAG'}
              onChange={() => onFormatTypeChange('TAG')}
              className="mr-2"
            />
            <span className="text-sm">
              [!TAG] ... [/!TAG]
            </span>
          </label>
        </div>
        <div className="mt-2 text-xs text-gray-400">
          <p>You can override format for individual blocks using the settings icon on each block.</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <button
          onClick={onPreview}
          className="w-full flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Eye size={18} className="mr-2" />
          Preview
        </button>
        
        <button
          onClick={onCopyToClipboard}
          className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Copy size={18} className="mr-2" />
          Copy to Clipboard
        </button>
        
        <div className="relative group">
          <button
            className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Download size={18} className="mr-2" />
            Export
          </button>
          <div className="absolute hidden group-hover:block right-0 mt-1 bg-dark-400 border border-gray-600 rounded-md shadow-lg z-10">
            <button
              onClick={() => onExport('md')}
              className="block w-full text-left px-4 py-2 hover:bg-dark-300 text-gray-200"
            >
              <FileText size={16} className="inline mr-2" />
              Markdown (.md)
            </button>
            <button
              onClick={() => onExport('txt')}
              className="block w-full text-left px-4 py-2 hover:bg-dark-300 text-gray-200"
            >
              <FileText size={16} className="inline mr-2" />
              Text (.txt)
            </button>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-gray-400 mt-6">
        <p className="mb-1">Format Examples:</p>
        <div className="bg-dark-300 p-2 rounded text-xs font-mono mb-2">
          ###### [!TASK] ######<br />
          Your task content here<br />
          ###### [/!TASK] ######
        </div>
        <div className="bg-dark-300 p-2 rounded text-xs font-mono">
          [!TASK]<br />
          Your task content here<br />
          [/!TASK]
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;