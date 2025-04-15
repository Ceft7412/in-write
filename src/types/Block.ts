// Types for block-based content structure (similar to Notion)

export type BlockType = 
  | 'paragraph' 
  | 'heading_1' 
  | 'heading_2' 
  | 'heading_3' 
  | 'bulleted_list_item' 
  | 'numbered_list_item' 
  | 'to_do' 
  | 'code' 
  | 'image' 
  | 'divider';

export interface RichTextAnnotations {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  color?: string;
}

export interface RichTextElement {
  text: string;
  annotations?: RichTextAnnotations;
  href?: string; // for links
}

export interface Block {
  id: string;
  type: BlockType;
  content: RichTextElement[];
  metadata?: {
    checked?: boolean; // for to-do items
    level?: number; // for indentation
  };
}

export interface BlockBasedNote {
  id: string;
  title: string;
  blocks: Block[];
  backgroundColor: string;
  folderId: number | null;
  isFavorite: boolean;
  isArchived: boolean;
  isTrashed: boolean;
  createdAt: string;
  updatedAt: string;
} 