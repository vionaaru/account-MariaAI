import React from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import BlockItem from './BlockItem';
import { Block, FormatType } from '../types';

interface BlockListProps {
  blocks: Block[];
  globalFormatType: FormatType;
  onBlocksChange: (blocks: Block[]) => void;
  onUpdateBlock: (id: string, content: string) => void;
  onUpdateBlockTooltip: (id: string, tooltip: string) => void;
  onDeleteBlock: (id: string) => void;
  onToggleCollapse: (id: string) => void;
  onBlockFormatTypeChange: (id: string, formatType: FormatType | undefined) => void;
}

const BlockList: React.FC<BlockListProps> = ({ 
  blocks, 
  globalFormatType,
  onBlocksChange,
  onUpdateBlock,
  onUpdateBlockTooltip,
  onDeleteBlock,
  onToggleCollapse,
  onBlockFormatTypeChange
}) => {
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex(block => block.id === active.id);
      const newIndex = blocks.findIndex(block => block.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        onBlocksChange(arrayMove(blocks, oldIndex, newIndex));
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={blocks.map(block => block.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {blocks.map(block => (
            <BlockItem
              key={block.id}
              block={block}
              onUpdate={onUpdateBlock}
              onUpdateTooltip={onUpdateBlockTooltip}
              onDelete={onDeleteBlock}
              onToggleCollapse={onToggleCollapse}
              onFormatTypeChange={onBlockFormatTypeChange}
              globalFormatType={globalFormatType}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default BlockList;