import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Note } from '../types/Note';
import { shareContent } from '../components/ShareSheet';

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
  content: string;
  selectedColor: string;
  selectedFolderId: number | null;
  isFavorite: boolean;
  
  // UI state
  showColorPicker: boolean;
  showFolderPicker: boolean;
  isAnyInputFocused: boolean;
  
  // Drawing state
  isDrawingMode: boolean;
  showDrawingTools: boolean;
  selectedDrawingColor: string;
  selectedBrushSize: number;
  
  // Actions
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setSelectedColor: (color: string) => void;
  setSelectedFolderId: (folderId: number | null) => void;
  toggleFavorite: () => void;
  toggleColorPicker: () => void;
  toggleFolderPicker: () => void;
  toggleDrawingMode: () => void;
  setIsAnyInputFocused: (focused: boolean) => void;
  setSelectedDrawingColor: (color: string) => void;
  setSelectedBrushSize: (size: number) => void;
  
  // Operations
  saveNote: () => Partial<Note>;
  shareNote: () => void;
  handleUndo: () => void;
  handleRedo: () => void;
  clearDrawing: () => void;
}

export const CreateNoteContext = createContext<CreateNoteContextType | undefined>(undefined);

export const CreateNoteProvider = ({ children }: { children: ReactNode }) => {
  // Note data
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // UI state
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFolderPicker, setShowFolderPicker] = useState(false);
  const [isAnyInputFocused, setIsAnyInputFocused] = useState(false);
  
  // Drawing state
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [showDrawingTools, setShowDrawingTools] = useState(false);
  const [selectedDrawingColor, setSelectedDrawingColor] = useState(drawingColors[0]);
  const [selectedBrushSize, setSelectedBrushSize] = useState(brushSizes[1]);
  
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
    // Implement undo logic
  }, []);
  
  const handleRedo = useCallback(() => {
    console.log("Redo action");
    // Implement redo logic
  }, []);
  
  // Clear drawing
  const clearDrawing = useCallback(() => {
    console.log("Clear drawing");
    // Implement clear drawing logic
  }, []);
  
  // Save note
  const saveNote = useCallback(() => {
    const newNote: Partial<Note> = {
      title: title.trim(),
      content: content.trim(),
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
  }, [title, content, selectedColor, isFavorite, selectedFolderId]);
  
  // Share note
  const shareNote = useCallback(() => {
    const noteToShare = {
      title,
      content,
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
  }, [title, content, selectedColor, isFavorite, selectedFolderId]);
  
  return (
    <CreateNoteContext.Provider
      value={{
        // Note data
        title,
        content,
        selectedColor,
        selectedFolderId,
        isFavorite,
        
        // UI state
        showColorPicker,
        showFolderPicker,
        isAnyInputFocused,
        
        // Drawing state
        isDrawingMode,
        showDrawingTools,
        selectedDrawingColor,
        selectedBrushSize,
        
        // Actions
        setTitle,
        setContent,
        setSelectedColor,
        setSelectedFolderId,
        toggleFavorite,
        toggleColorPicker,
        toggleFolderPicker,
        toggleDrawingMode,
        setIsAnyInputFocused,
        setSelectedDrawingColor,
        setSelectedBrushSize,
        
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