import React, { useState } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Sidebar from './components/Sidebar';
import BlockList from './components/BlockList';
import ControlPanel from './components/ControlPanel';
import PreviewModal from './components/PreviewModal';
import { Block, BlockType, FormatType, TaskConstructorState } from './types';
import { createBlock, generateOutput, BLOCK_TYPES } from './utils/blockUtils';

function App() {
  const [state, setState] = useState<TaskConstructorState>({
    blocks: [],
    formatType: 'HASHTAG',
    customBlockTypes: [],
    customBlockTooltips: {}
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Minimum drag distance in pixels
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddBlock = (type: BlockType) => {
    setState(prev => ({
      ...prev,
      blocks: [...prev.blocks, createBlock(type, prev.customBlockTooltips[type])]
    }));
  };

  const handleUpdateBlock = (id: string, content: string) => {
    setState(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => 
        block.id === id ? { ...block, content } : block
      )
    }));
  };

  const handleUpdateBlockTooltip = (id: string, tooltip: string) => {
    setState(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => 
        block.id === id ? { ...block, tooltip } : block
      )
    }));
  };

  const handleDeleteBlock = (id: string) => {
    setState(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== id)
    }));
  };

  const handleToggleCollapse = (id: string) => {
    setState(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => 
        block.id === id ? { ...block, isCollapsed: !block.isCollapsed } : block
      )
    }));
  };

  const handleBlockFormatTypeChange = (id: string, formatType: FormatType | undefined) => {
    setState(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => 
        block.id === id ? { ...block, formatType } : block
      )
    }));
  };

  const handleBlocksChange = (blocks: Block[]) => {
    setState(prev => ({
      ...prev,
      blocks
    }));
  };

  const handleFormatTypeChange = (formatType: FormatType) => {
    setState(prev => ({
      ...prev,
      formatType
    }));
  };

  const handleCopyToClipboard = () => {
    const output = generateOutput(state.blocks, state.formatType);
    navigator.clipboard.writeText(output)
      .then(() => {
        showNotification('Copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        showNotification('Failed to copy to clipboard', true);
      });
  };

  const handleExport = (format: 'md' | 'txt') => {
    const output = generateOutput(state.blocks, state.formatType);
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-export.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification(`Exported as ${format.toUpperCase()} file!`);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const showNotification = (message: string, isError = false) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    
    const { active, over } = event;
    
    // Handle template drag from sidebar
    if (active.data?.current?.isTemplate && over) {
      const type = active.data.current.type as BlockType;
      handleAddBlock(type);
      return;
    }
  };

  const handleAddCustomBlockType = (type: string, tooltip: string) => {
    if (!type.trim()) return;
    
    // Check if the type already exists
    if ([...BLOCK_TYPES, ...state.customBlockTypes].includes(type)) {
      showNotification(`Block type "${type}" already exists`, true);
      return;
    }
    
    setState(prev => ({
      ...prev,
      customBlockTypes: [...prev.customBlockTypes, type],
      customBlockTooltips: {
        ...prev.customBlockTooltips,
        [type]: tooltip
      }
    }));
    
    showNotification(`Added custom block type: ${type}`);
  };

  const handleRemoveCustomBlockType = (type: string) => {
    setState(prev => {
      const newCustomBlockTooltips = { ...prev.customBlockTooltips };
      delete newCustomBlockTooltips[type];
      
      return {
        ...prev,
        customBlockTypes: prev.customBlockTypes.filter(t => t !== type),
        customBlockTooltips: newCustomBlockTooltips
      };
    });
    
    showNotification(`Removed custom block type: ${type}`);
  };

  const allBlockTypes = [...BLOCK_TYPES, ...state.customBlockTypes];

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen overflow-hidden bg-dark-600 text-gray-200">
        <Sidebar 
          onAddBlock={handleAddBlock} 
          blockCount={state.blocks.length}
          customBlockTypes={state.customBlockTypes}
          customBlockTooltips={state.customBlockTooltips}
          onAddCustomBlockType={handleAddCustomBlockType}
          onRemoveCustomBlockType={handleRemoveCustomBlockType}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto p-6">
            {state.blocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p className="text-xl mb-4">No blocks added yet</p>
                <p>Add blocks from the sidebar to get started</p>
                <p className="mt-2 text-sm">You can also drag block templates from the sidebar</p>
              </div>
            ) : (
              <BlockList 
                blocks={state.blocks}
                globalFormatType={state.formatType}
                onBlocksChange={handleBlocksChange}
                onUpdateBlock={handleUpdateBlock}
                onUpdateBlockTooltip={handleUpdateBlockTooltip}
                onDeleteBlock={handleDeleteBlock}
                onToggleCollapse={handleToggleCollapse}
                onBlockFormatTypeChange={handleBlockFormatTypeChange}
              />
            )}
          </main>
        </div>
        
        <ControlPanel 
          formatType={state.formatType}
          onFormatTypeChange={handleFormatTypeChange}
          onCopyToClipboard={handleCopyToClipboard}
          onExport={handleExport}
          onPreview={handlePreview}
        />
        
        {showPreview && (
          <PreviewModal 
            content={generateOutput(state.blocks, state.formatType)}
            rawContent={generateOutput(state.blocks, state.formatType)}
            onClose={() => setShowPreview(false)}
          />
        )}
        
        {notification && (
          <div className="fixed bottom-4 right-4 bg-dark-300 text-white px-4 py-2 rounded-md shadow-lg border border-gray-600">
            {notification}
          </div>
        )}
      </div>
    </DndContext>
  );
}

export default App;