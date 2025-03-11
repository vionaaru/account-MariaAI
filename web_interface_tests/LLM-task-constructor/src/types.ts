export type BlockType = 
  | 'CONTENT'
  | 'DOCS'
  | 'CODE'
  | 'QUESTION'
  | 'TASK'
  | 'EXAMPLE'
  | 'NOTE'
  | 'WARNING'
  | 'TIP'
  | 'LOG'
  | 'REFERENCE'
  | string; // Allow custom block types

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  isCollapsed?: boolean;
  formatType?: FormatType;
  tooltip?: string; // Add tooltip property
}

export type FormatType = 'HASHTAG' | 'TAG';

export interface TaskConstructorState {
  blocks: Block[];
  formatType: FormatType;
  customBlockTypes: string[];
  customBlockTooltips: Record<string, string>; // Map of custom block types to tooltips
}