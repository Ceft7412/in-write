import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Note } from '../types/Note';
import { Block, BlockType, RichTextElement, BlockBasedNote } from '../types/Block';
import { shareContent } from '../components/ShareSheet';
import { Keyboard } from 'react-native';
import * as Crypto from 'expo-crypto';

// Drawing brush options
const drawingColors = ['#000000', '#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF'];
const brushSizes = [2, 4, 6, 8, 10];

// Color options for note background
const colorOptions = [
  '#ffffff',
  '#f28b82',
  '#fbbc04',
  '#fff475',
  '#ccff90',
  '#a7ffeb',
  '#cbf0f8',
  '#aecbfa',
  '#d7aefb',
  '#fdcfe8',
];

interface CreateNoteContextType {
  // Note data
  title: string;
  blocks: Block[];
  selectedColor: string;
  selectedFolderId: number | null;
  isFavorite: boolean;
  
  // Block operations
  addBlock: (blockType: BlockType, afterBlockId?: string) => void;
  updateBlockContent: (blockId: string, content: RichTextElement[]) => void;
  deleteBlock: (blockId: string) => void;
  changeBlockType: (blockId: string, newType: BlockType) => void;
  
  // Text formatting
  formatText: (blockId: string, range: {start: number, end: number}, format: string) => void;
  activeFormatType: string | null;
  
  // UI state
  showColorPicker: boolean;
  showFolderPicker: boolean;
  showTextFormatting: boolean;
  isAnyInputFocused: boolean;
  isTitleFocused: boolean;
  focusedBlockId: string | null;
  
  // Drawing state
  isDrawingMode: boolean;
  showDrawingTools: boolean;
  selectedDrawingColor: string;
  selectedBrushSize: number;
  
  // Actions
  setTitle: (title: string) => void;
  setSelectedColor: (color: string) => void;
  setSelectedFolderId: (folderId: number | null) => void;
  toggleTextFormatting: () => void;
  applyTextFormatting: (formatType: string, selectionRange?: {start: number, end: number}) => void;
  toggleFavorite: () => void;
  toggleColorPicker: () => void;
  toggleFolderPicker: () => void;
  toggleDrawingMode: () => void;
  setIsAnyInputFocused: (focused: boolean) => void;
  setIsTitleFocused: (focused: boolean) => void;
  setFocusedBlockId: (blockId: string | null) => void;
  setSelectedDrawingColor: (color: string) => void;
  setSelectedBrushSize: (size: number) => void;
  
  // Operations
  saveNote: () => Partial<BlockBasedNote>;
  shareNote: () => void;
  handleUndo: () => void;
  handleRedo: () => void;
  clearDrawing: () => void;
}

export const CreateNoteContext = createContext<CreateNoteContextType | undefined>(undefined);

// Create a default empty block
const createEmptyBlock = (type: BlockType = 'paragraph'): Block => ({
  id: Crypto.randomUUID(),
  type,
  content: [{ text: '' }]
});

export const CreateNoteProvider = ({ children }: { children: ReactNode }) => {
  // Note data
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([createEmptyBlock()]);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Block editing
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(blocks[0].id);
  
  // UI state
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFolderPicker, setShowFolderPicker] = useState(false);
  const [showTextFormatting, setShowTextFormatting] = useState(false);
  const [isAnyInputFocused, setIsAnyInputFocused] = useState(false);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  
  // Drawing state
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [showDrawingTools, setShowDrawingTools] = useState(false);
  const [selectedDrawingColor, setSelectedDrawingColor] = useState(drawingColors[0]);
  const [selectedBrushSize, setSelectedBrushSize] = useState(brushSizes[1]);
  
  // Currently applied text format
  const [activeFormatType, setActiveFormatType] = useState<string | null>(null);
  
  // Block operations
  const addBlock = useCallback((blockType: BlockType = 'paragraph', afterBlockId?: string) => {
    const newBlock = createEmptyBlock(blockType);
    
    setBlocks(currentBlocks => {
      if (!afterBlockId) {
        // Add to the end if no reference block
        return [...currentBlocks, newBlock];
      }
      
      // Add after specified block
      const index = currentBlocks.findIndex(block => block.id === afterBlockId);
      if (index === -1) return [...currentBlocks, newBlock];
      
      const newBlocks = [...currentBlocks];
      newBlocks.splice(index + 1, 0, newBlock);
      return newBlocks;
    });
    
    return newBlock.id;
  }, []);

  
  
  const updateBlockContent = useCallback((blockId: string, content: RichTextElement[]) => {
    setBlocks(currentBlocks => 
      currentBlocks.map(block => 
        block.id === blockId ? { ...block, content } : block
      )
    );
  }, []);
  
  const deleteBlock = useCallback((blockId: string) => {
    setBlocks(currentBlocks => {
      // Prevent deleting the last block
      if (currentBlocks.length <= 1) return currentBlocks;
      return currentBlocks.filter(block => block.id !== blockId);
    });
  }, []);
  
  const changeBlockType = useCallback((blockId: string, newType: BlockType) => {
    setBlocks(currentBlocks => 
      currentBlocks.map(block => 
        block.id === blockId ? { ...block, type: newType } : block
      )
    );
  }, []);
  
  // Text formatting
  const formatText = useCallback((blockId: string, range: {start: number, end: number}, format: string) => {
    setBlocks(currentBlocks => {
      const blockIndex = currentBlocks.findIndex(block => block.id === blockId);
      if (blockIndex === -1) return currentBlocks;
      
      // Get the block to format
      const block = currentBlocks[blockIndex];
      
      // We need to determine which text elements contain the selection range
      // For simplicity in this implementation, we'll convert the block's content
      // into three sections: before selection, the selection itself, and after selection
      
      // Get all text and calculate character positions
      const allText = block.content.map(element => element.text).join('');
      if (range.start < 0 || range.end > allText.length || range.start === range.end) {
        return currentBlocks; // Invalid range
      }
      
      // Split into three parts
      const beforeSelection = allText.substring(0, range.start);
      const selection = allText.substring(range.start, range.end);
      const afterSelection = allText.substring(range.end);
      
      // Create a new content array with these three parts
      const newContent: RichTextElement[] = [];
      
      // Add text before selection (if any)
      if (beforeSelection) {
        newContent.push({ text: beforeSelection });
      }
      
      // Add the selected text with the specified formatting
      const selectedElement: RichTextElement = { 
        text: selection,
        annotations: {}
      };
      
      // Add the formatting specified
      switch (format) {
        case 'bold':
          selectedElement.annotations!.bold = true;
          break;
        case 'italic':
          selectedElement.annotations!.italic = true;
          break;
        case 'underline':
          selectedElement.annotations!.underline = true;
          break;
        case 'strikethrough':
          selectedElement.annotations!.strikethrough = true;
          break;
        // Add more format options as needed
      }
      
      newContent.push(selectedElement);
      
      // Add text after selection (if any)
      if (afterSelection) {
        newContent.push({ text: afterSelection });
      }
      
      // Create updated block with new content
      const updatedBlock = { ...block, content: newContent };
      
      // Create new blocks array with the updated block
      const newBlocks = [...currentBlocks];
      newBlocks[blockIndex] = updatedBlock;
      
      return newBlocks;
    });
  }, []);

  const toggleTextFormatting = useCallback(() => {
    // Only dismiss keyboard when showing text formatting toolbar, not when hiding it
    const willShow = !showTextFormatting;
    
    // No longer dismiss keyboard to preserve selection
    // if (willShow) {
    //   Keyboard.dismiss();
    // }
    
    setShowTextFormatting(!showTextFormatting);
    setShowColorPicker(false);
    setShowFolderPicker(false);
    setShowDrawingTools(false);
  }, [showTextFormatting]);

  // Apply text formatting
  const applyTextFormatting = useCallback((formatType: string, selectionRange?: {start: number, end: number}) => {
    console.log("Applying text formatting:", formatType);
    
    // Toggle the active format type
    setActiveFormatType(prevFormat => 
      prevFormat === formatType ? null : formatType
    );
    
    if (focusedBlockId) {
      // Apply the format to the focused block with the selection range
      formatText(
        focusedBlockId, 
        selectionRange || { start: 0, end: 0 }, // Use provided selection range or default
        formatType
      );
    }
  }, [focusedBlockId, formatText]);
  
  // Toggle favorite state
  const toggleFavorite = useCallback(() => {
    setIsFavorite(prev => !prev);
  }, []);
  
  // Toggle color picker
  const toggleColorPicker = useCallback(() => {
    setShowColorPicker(prev => !prev);
    setShowFolderPicker(false);
    setShowDrawingTools(false);
  }, []);
  
  // Toggle folder picker
  const toggleFolderPicker = useCallback(() => {
    setShowFolderPicker(prev => !prev);
    setShowColorPicker(false);
    setShowDrawingTools(false);
  }, []);
  
  // Toggle drawing mode
  const toggleDrawingMode = useCallback(() => {
    setIsDrawingMode(prev => !prev);
    setShowDrawingTools(prev => !prev);
    setShowColorPicker(false);
    setShowFolderPicker(false);
  }, []);
  
  // Handle undo/redo
  const handleUndo = useCallback(() => {
    console.log("Undo action");
    // Implement undo logic for blocks
  }, []);
  
  const handleRedo = useCallback(() => {
    console.log("Redo action");
    // Implement redo logic for blocks
  }, []);
  
  // Clear drawing
  const clearDrawing = useCallback(() => {
    console.log("Clear drawing");
    // Implement clear drawing logic
  }, []);
  
  // Save note
  const saveNote = useCallback(() => {
    const newNote: Partial<BlockBasedNote> = {
      title: title.trim(),
      blocks: blocks,
      backgroundColor: selectedColor,
      isFavorite: isFavorite,
      folderId: selectedFolderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isArchived: false,
      isTrashed: false,
    };
    
    console.log("Saving note:", newNote);
    return newNote;
  }, [title, blocks, selectedColor, isFavorite, selectedFolderId]);
  
  // Share note
  const shareNote = useCallback(() => {
    // Convert blocks to plain text for sharing
    const blocksText = blocks.map(block => {
      const text = block.content.map(element => element.text).join('');
      switch (block.type) {
        case 'heading_1':
          return `# ${text}\n`;
        case 'heading_2':
          return `## ${text}\n`;
        case 'heading_3':
          return `### ${text}\n`;
        case 'bulleted_list_item':
          return `• ${text}\n`;
        case 'numbered_list_item':
          return `1. ${text}\n`;
        case 'to_do':
          return `${block.metadata?.checked ? '✓' : '□'} ${text}\n`;
        case 'code':
          return `\`\`\`\n${text}\n\`\`\`\n`;
        case 'divider':
          return '---\n';
        default:
          return `${text}\n`;
      }
    }).join('\n');
    
    const noteToShare = {
      title,
      content: blocksText,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      backgroundColor: selectedColor,
      isFavorite,
      isArchived: false,
      isTrashed: false,
      id: 0,
      folderId: selectedFolderId,
    };
    
    shareContent(noteToShare);
  }, [title, blocks, selectedColor, isFavorite, selectedFolderId]);
  
  return (
    <CreateNoteContext.Provider
      value={{
        // Note data
        title,
        blocks,
        selectedColor,
        selectedFolderId,
        isFavorite,
        
        // Block operations
        addBlock,
        updateBlockContent,
        deleteBlock,
        changeBlockType,
        
        // Text formatting
        formatText,
        activeFormatType,
        
        // UI state
        showColorPicker,
        showFolderPicker,
        showTextFormatting,
        isAnyInputFocused,
        isTitleFocused,
        focusedBlockId,
        
        // Drawing state
        isDrawingMode,
        showDrawingTools,
        selectedDrawingColor,
        selectedBrushSize,
        
        // Actions
        setTitle,
        setSelectedColor,
        setSelectedFolderId,
        toggleFavorite,
        toggleColorPicker,
        toggleFolderPicker,
        toggleDrawingMode,
        setIsAnyInputFocused,
        setIsTitleFocused,
        setFocusedBlockId,
        setSelectedDrawingColor,
        setSelectedBrushSize,
        toggleTextFormatting,
        applyTextFormatting,

        // Operations
        saveNote,
        shareNote,
        handleUndo,
        handleRedo,
        clearDrawing,
      }}
    >
      {children}
    </CreateNoteContext.Provider>
  );
};

// Custom hook to use the context
export const useCreateNote = () => {
  const context = useContext(CreateNoteContext);
  if (context === undefined) {
    throw new Error('useCreateNote must be used within a CreateNoteProvider');
  }
  return context;
}; 