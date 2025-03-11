import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, ChevronDown, ChevronUp, GripVertical, Edit } from 'lucide-react';
import { Block, FormatType } from '../types';
import { getBlockIcon, getBlockColor, getBlockDescription } from '../utils/blockUtils';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface BlockItemProps {
  block: Block;
  onUpdate: (id: string, content: string) => void;
  onUpdateTooltip: (id: string, tooltip: string) => void;
  onDelete: (id: string) => void;
  onToggleCollapse: (id: string) => void;
  onFormatTypeChange: (id: string, formatType: FormatType | undefined) => void;
  globalFormatType: FormatType;
}

const BlockItem: React.FC<BlockItemProps> = ({ 
  block, 
  onUpdate, 
  onUpdateTooltip,
  onDelete,
  onToggleCollapse,
  onFormatTypeChange,
  globalFormatType
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingTooltip, setIsEditingTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState(block.tooltip || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const tooltipInputRef = useRef<HTMLInputElement>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(block.id, e.target.value);
  };

  const handleTooltipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTooltipText(e.target.value);
  };

  const handleTooltipSave = () => {
    onUpdateTooltip(block.id, tooltipText);
    setIsEditingTooltip(false);
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleContentClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  // Focus tooltip input when editing tooltip starts
  useEffect(() => {
    if (isEditingTooltip && tooltipInputRef.current) {
      tooltipInputRef.current.focus();
    }
  }, [isEditingTooltip]);

  const blockColorClass = getBlockColor(block.type);
  const blockDescription = block.tooltip || getBlockDescription(block.type);
  
  const currentFormatType = block.formatType !== undefined ? block.formatType : globalFormatType;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`mb-4 rounded-lg border-2 ${blockColorClass} overflow-hidden bg-dark-400`}
    >
      <div className="flex items-center justify-between p-2 border-b border-gray-700 bg-dark-300 group relative">
        <div className="flex items-center gap-2">
          <div 
            {...attributes} 
            {...listeners} 
            className="cursor-grab p-1 hover:bg-dark-200 rounded"
          >
            <GripVertical size={16} className="text-gray-400" />
          </div>
          <div className="flex items-center gap-1">
            <span>{getBlockIcon(block.type)}</span>
            <span className="font-semibold text-gray-200">{block.type}</span>
            {block.tooltip && (
              <span 
                className="text-xs bg-dark-200 px-1 rounded text-gray-400 cursor-pointer"
                onClick={() => setIsEditingTooltip(true)}
                title="Edit tooltip"
              >
                {block.tooltip}
              </span>
            )}
            {!block.tooltip && (
              <button
                onClick={() => setIsEditingTooltip(true)}
                className="p-1 hover:bg-dark-200 rounded text-gray-400"
                title="Add tooltip"
              >
                <Edit size={12} />
              </button>
            )}
            {block.formatType && (
              <span className="text-xs bg-dark-200 px-1 rounded text-gray-400">
                {block.formatType === 'HASHTAG' ? '#' : 'T'}
              </span>
            )}
          </div>
          
          {/* Tooltip */}
          <div className="absolute top-full left-0 mt-1 bg-dark-300 text-gray-200 p-2 rounded shadow-lg text-xs z-10 invisible group-hover:visible">
            {blockDescription}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onToggleCollapse(block.id)}
            className="p-1 hover:bg-dark-200 rounded text-gray-300"
          >
            {block.isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
          <button 
            onClick={handleToggleEdit}
            className="p-1 hover:bg-dark-200 rounded text-gray-300"
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
          <button 
            onClick={() => onDelete(block.id)}
            className="p-1 hover:bg-red-900 text-red-400 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {isEditingTooltip && (
        <div className="p-3 bg-dark-300 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <input
              ref={tooltipInputRef}
              type="text"
              value={tooltipText}
              onChange={handleTooltipChange}
              placeholder="Enter tooltip text"
              className="flex-1 p-2 bg-dark-400 border border-gray-600 rounded text-gray-200"
            />
            <button
              onClick={handleTooltipSave}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditingTooltip(false)}
              className="px-3 py-2 bg-dark-500 hover:bg-dark-400 text-gray-300 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {!block.isCollapsed && (
        <div className="p-3">
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={block.content}
              onChange={handleContentChange}
              className="w-full min-h-[100px] p-2 border border-gray-600 rounded bg-dark-500 text-gray-200"
              placeholder={`Enter ${block.type} content here...`}
            />
          ) : (
            <div 
              className="whitespace-pre-wrap min-h-[40px] p-2 rounded cursor-text hover:bg-dark-500"
              onClick={handleContentClick}
            >
              {block.type === 'CODE' ? (
                <SyntaxHighlighter language="javascript" style={atomOneDark}>
                  {block.content || 'Click to add code...'}
                </SyntaxHighlighter>
              ) : (
                block.content || `Click to add ${block.type} content...`
              )}
            </div>
          )}
          
          <div className="mt-3 pt-2 border-t border-gray-700 flex items-center justify-between">
            <div className="text-xs text-gray-500">Format:</div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onFormatTypeChange(block.id, undefined)}
                className={`px-2 py-1 text-xs rounded ${block.formatType === undefined ? 'bg-blue-600 text-white' : 'bg-dark-300 text-gray-400 hover:bg-dark-200'}`}
                title="Use global format setting"
              >
                Global
              </button>
              <button 
                onClick={() => onFormatTypeChange(block.id, 'HASHTAG')}
                className={`px-2 py-1 text-xs rounded ${block.formatType === 'HASHTAG' ? 'bg-blue-600 text-white' : 'bg-dark-300 text-gray-400 hover:bg-dark-200'}`}
                title="###### [!TAG] ###### format"
              >
                ###### [!TAG] ######
              </button>
              <button 
                onClick={() => onFormatTypeChange(block.id, 'TAG')}
                className={`px-2 py-1 text-xs rounded ${block.formatType === 'TAG' ? 'bg-blue-600 text-white' : 'bg-dark-300 text-gray-400 hover:bg-dark-200'}`}
                title="[!TAG] ... [/!TAG] format"
              >
                [!TAG] ... [/!TAG]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockItem;