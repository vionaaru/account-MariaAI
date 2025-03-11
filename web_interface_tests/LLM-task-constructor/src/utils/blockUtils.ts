import { Block, BlockType, FormatType } from '../types';

export const createBlock = (type: BlockType, tooltip?: string): Block => ({
  id: crypto.randomUUID(),
  type,
  content: '',
  isCollapsed: false,
  formatType: undefined, // Will use global format if undefined
  tooltip
});

export const getBlockIcon = (type: BlockType): string => {
  switch (type) {
    case 'CONTENT': return '📝';
    case 'DOCS': return '📄';
    case 'CODE': return '💻';
    case 'QUESTION': return '❓';
    case 'TASK': return '✅';
    case 'EXAMPLE': return '🔍';
    case 'NOTE': return '📌';
    case 'WARNING': return '⚠️';
    case 'TIP': return '💡';
    case 'LOG': return '🔄';
    case 'REFERENCE': return '🔗';
    default: return '📋';
  }
};

export const getBlockColor = (type: BlockType): string => {
  switch (type) {
    case 'CONTENT': return 'bg-blue-900/30 border-blue-700';
    case 'DOCS': return 'bg-gray-800/50 border-gray-600';
    case 'CODE': return 'bg-slate-800/50 border-slate-600';
    case 'QUESTION': return 'bg-purple-900/30 border-purple-700';
    case 'TASK': return 'bg-green-900/30 border-green-700';
    case 'EXAMPLE': return 'bg-amber-900/30 border-amber-700';
    case 'NOTE': return 'bg-cyan-900/30 border-cyan-700';
    case 'WARNING': return 'bg-red-900/30 border-red-700';
    case 'TIP': return 'bg-yellow-900/30 border-yellow-700';
    case 'LOG': return 'bg-orange-900/30 border-orange-700';
    case 'REFERENCE': return 'bg-indigo-900/30 border-indigo-700';
    default: return 'bg-gray-800/50 border-gray-600';
  }
};

export const getBlockDescription = (type: BlockType): string => {
  switch (type) {
    case 'CONTENT': return 'General content or information';
    case 'DOCS': return 'Documentation or instructional material';
    case 'CODE': return 'Code snippets or programming examples';
    case 'QUESTION': return 'Questions or inquiries that need answers';
    case 'TASK': return 'Action items or tasks to be completed';
    case 'EXAMPLE': return 'Examples or demonstrations of concepts';
    case 'NOTE': return 'Important notes or things to remember';
    case 'WARNING': return 'Warnings or cautionary information';
    case 'TIP': return 'Helpful tips or suggestions';
    case 'LOG': return 'Logs or records of events/changes';
    case 'REFERENCE': return 'References or links to external resources';
    default: return 'Custom block type';
  }
};

export const formatBlockContent = (block: Block, globalFormatType: FormatType): string => {
  if (!block.content.trim()) return '';
  
  // Use block-specific format if defined, otherwise use global format
  const formatType = block.formatType || globalFormatType;
  const tooltipText = block.tooltip ? `--${block.tooltip}--` : '';
  
  switch (formatType) {
    case 'HASHTAG':
      return `###### [!${block.type}] ######${tooltipText}\n${block.content}\n###### [/!${block.type}] ######\n`;
    case 'TAG':
      return `[!${block.type}]${tooltipText}\n${block.content}\n[/!${block.type}]\n`;
    default:
      return block.content;
  }
};

export const generateOutput = (blocks: Block[], globalFormatType: FormatType): string => {
  return blocks
    .map(block => formatBlockContent(block, globalFormatType))
    .join('\n');
};

export const BLOCK_TYPES: BlockType[] = [
  'CONTENT',
  'DOCS',
  'CODE',
  'QUESTION',
  'TASK',
  'EXAMPLE',
  'NOTE',
  'WARNING',
  'TIP',
  'LOG',
  'REFERENCE'
];