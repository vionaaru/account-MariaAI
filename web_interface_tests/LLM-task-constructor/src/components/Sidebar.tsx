import React, { useState } from 'react';
import { Plus, List, MoveHorizontal, ArrowUp, ArrowDown, Trash2, Edit, Check, X } from 'lucide-react';
import { BlockType } from '../types';
import { BLOCK_TYPES, getBlockIcon, getBlockColor, getBlockDescription } from '../utils/blockUtils';
import { useDraggable } from '@dnd-kit/core';

interface SidebarProps {
  onAddBlock: (type: BlockType) => void;
  blockCount: number;
  customBlockTypes: string[];
  customBlockTooltips: Record<string, string>;
  onAddCustomBlockType: (type: string, tooltip: string) => void;
  onRemoveCustomBlockType: (type: string) => void;
}

interface BlockTemplateProps {
  type: BlockType;
  onAddBlock: (type: BlockType) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  isCustom?: boolean;
  tooltip?: string;
  onRemove?: () => void;
}

const BlockTemplate: React.FC<BlockTemplateProps> = ({ 
  type, 
  onAddBlock, 
  onMoveUp, 
  onMoveDown, 
  isFirst, 
  isLast,
  isCustom,
  tooltip,
  onRemove
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `template-${type}`,
    data: {
      type,
      isTemplate: true
    }
  });

  const blockColorClass = getBlockColor(type);
  const description = tooltip || getBlockDescription(type);
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex flex-col mr-1">
        <button 
          onClick={onMoveUp} 
          disabled={isFirst}
          className={`p-1 rounded ${isFirst ? 'text-gray-600' : 'text-gray-400 hover:bg-dark-300'}`}
        >
          <ArrowUp size={14} />
        </button>
        <button 
          onClick={onMoveDown} 
          disabled={isLast}
          className={`p-1 rounded ${isLast ? 'text-gray-600' : 'text-gray-400 hover:bg-dark-300'}`}
        >
          <ArrowDown size={14} />
        </button>
      </div>
      <div 
        onClick={() => onAddBlock(type)}
        className={`flex-1 flex items-center justify-between p-2 mb-2 rounded-md ${blockColorClass} cursor-pointer hover:brightness-125 transition-all group relative`}
        title={description}
      >
        <div className="flex items-center gap-2">
          <span>{getBlockIcon(type)}</span>
          <span className="text-sm font-medium">{type}</span>
        </div>
        <div className="flex items-center">
          {isCustom && onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-1 rounded hover:bg-red-900 text-red-400 mr-1"
              title="Remove custom block type"
            >
              <Trash2 size={14} />
            </button>
          )}
          <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className={`p-1 rounded hover:bg-dark-300 ${isDragging ? 'opacity-50' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <MoveHorizontal size={14} className="text-gray-500" />
          </div>
        </div>
        
        {/* Tooltip */}
        <div className="absolute left-full ml-2 bg-dark-300 text-gray-200 p-2 rounded shadow-lg text-xs w-48 z-10 invisible group-hover:visible">
          {description}
        </div>
      </div>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ 
  onAddBlock, 
  blockCount, 
  customBlockTypes,
  customBlockTooltips,
  onAddCustomBlockType,
  onRemoveCustomBlockType
}) => {
  const [isAddingCustomBlock, setIsAddingCustomBlock] = useState(false);
  const [newCustomBlockType, setNewCustomBlockType] = useState('');
  const [newCustomBlockTooltip, setNewCustomBlockTooltip] = useState('');
  const [blockTypes, setBlockTypes] = useState<BlockType[]>([...BLOCK_TYPES]);

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newOrder = [...blockTypes];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      setBlockTypes(newOrder);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < blockTypes.length - 1) {
      const newOrder = [...blockTypes];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      setBlockTypes(newOrder);
    }
  };

  const handleAddCustomBlock = () => {
    if (newCustomBlockType.trim()) {
      onAddCustomBlockType(newCustomBlockType.trim(), newCustomBlockTooltip.trim());
      setNewCustomBlockType('');
      setNewCustomBlockTooltip('');
      setIsAddingCustomBlock(false);
    }
  };

  return (
    <div className="w-64 bg-dark-500 border-r border-gray-700 p-4 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-6 text-gray-100">Task Constructor</h2>
      
      <div className="relative mb-6">
        {isAddingCustomBlock ? (
          <div className="bg-dark-400 p-2 rounded-md border border-gray-600">
            <input
              type="text"
              value={newCustomBlockType}
              onChange={(e) => setNewCustomBlockType(e.target.value)}
              placeholder="Enter block type name"
              className="w-full p-2 mb-2 bg-dark-300 border border-gray-600 rounded text-gray-200"
              autoFocus
            />
            <input
              type="text"
              value={newCustomBlockTooltip}
              onChange={(e) => setNewCustomBlockTooltip(e.target.value)}
              placeholder="Enter tooltip (optional)"
              className="w-full p-2 mb-2 bg-dark-300 border border-gray-600 rounded text-gray-200"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAddingCustomBlock(false)}
                className="p-1 rounded hover:bg-dark-300 text-gray-400"
              >
                <X size={18} />
              </button>
              <button
                onClick={handleAddCustomBlock}
                className="p-1 rounded hover:bg-green-700 text-green-400"
                disabled={!newCustomBlockType.trim()}
              >
                <Check size={18} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingCustomBlock(true)}
            className="w-full flex items-center justify-between bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <span className="flex items-center">
              <Plus size={18} className="mr-2" />
              Add Custom Block Type
            </span>
          </button>
        )}
      </div>
      
      <div className="mb-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <List size={18} className="mr-2 text-gray-300" />
            <h3 className="font-medium text-gray-200">Blocks</h3>
          </div>
        </div>
        <div className="text-sm text-gray-400 ml-6 mb-3">
          Total: {blockCount} block{blockCount !== 1 ? 's' : ''}
        </div>
        
        <div className="mt-2 border-t border-gray-700 pt-3 flex-1 flex flex-col">
          <p className="text-xs text-gray-400 mb-2">Drag blocks to workspace or reorder:</p>
          <div className="space-y-1 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            {/* Standard block types */}
            {blockTypes.map((type, index) => (
              <BlockTemplate 
                key={type} 
                type={type} 
                onAddBlock={onAddBlock}
                onMoveUp={() => handleMoveUp(index)}
                onMoveDown={() => handleMoveDown(index)}
                isFirst={index === 0}
                isLast={index === blockTypes.length - 1}
              />
            ))}
            
            {/* Custom block types */}
            {customBlockTypes.length > 0 && (
              <div className="border-t border-gray-700 my-2 pt-2">
                <p className="text-xs text-gray-400 mb-2">Custom Block Types:</p>
              </div>
            )}
            
            {customBlockTypes.map((type, index) => (
              <BlockTemplate 
                key={`custom-${type}`} 
                type={type} 
                onAddBlock={onAddBlock}
                onMoveUp={() => {}}
                onMoveDown={() => {}}
                isFirst={true}
                isLast={true}
                isCustom={true}
                tooltip={customBlockTooltips[type]}
                onRemove={() => onRemoveCustomBlockType(type)}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 pt-4 border-t border-gray-700">
        <p>Click on a block to add it to workspace</p>
        <p>Drag and drop blocks to reorder</p>
        <p>Click directly on content to edit</p>
        <p>Hover over blocks to see descriptions</p>
      </div>
    </div>
  );
};

export default Sidebar;