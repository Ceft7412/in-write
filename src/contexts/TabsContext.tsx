import { createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";
import { Note, Folder } from "../types/Note";
import { notesData, NoteView, foldersData } from "../mock/NotesData";
import { BackHandler } from "react-native";

interface TabsContextType {
    isMoreMenuOpen: boolean;
    isViewMenuOpen: boolean;    
    setIsMoreMenuOpen: (isOpen: boolean) => void;
    setIsViewMenuOpen: (isOpen: boolean) => void;
    noteView: string;
    setNoteView: (view: string) => void;
    notes: Note[];
    filteredNotes: Note[];
    favoriteNotes: Note[];
    selectedNoteId: string | null;
    setSelectedNoteId: (noteId: string | null) => void;
    setSelectedNoteIds: (noteIds: string[]) => void;
    selectedNoteIds: string[];
    isSelectionMode: boolean;
    setIsSelectionMode: (isSelectionMode: boolean) => void;
    toggleNoteSelection: (noteId: string) => void;
    selectAllNotes: (notes: Note[]) => void;
    clearSelection: () => void;
    toggleSelectionMode: () => void;
    handleSelection: () => void;
    toggleNoteView: () => void;
    handleSetNoteView: (view: string) => void;
    // Folder selection
    selectedFolderIds: string[];
    setSelectedFolderIds: (folderIds: string[]) => void;
    toggleFolderSelection: (folderId: string) => void;
    selectAllFolders: (folders: Folder[]) => void;
    clearFolderSelection: () => void;
    isInFolderSelectionMode: () => boolean;
}
export const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const TabsProvider = ({ children }: { children: React.ReactNode }) => {
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
    const [notes, setNotes] = useState<Note[]>([]);
    const [noteView, setNoteView] = useState<string>(NoteView.list);
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
    const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>([]);

    // Initial Render
    useEffect(() => {
        setNotes(notesData)
    }, [])
    
    // Filter notes to only show non-favorite notes
    const filteredNotes = useMemo(() => {
        return notes.filter(note => note.isFavorite === false && note.isArchived === false && note.isTrashed === false);
    }, [notes]);
    
    // Filter notes to only show favorite notes
    const favoriteNotes = useMemo(() => {
        return notes.filter(note => note.isFavorite === true && note.isArchived === false && note.isTrashed === false);
    }, [notes]);

    // Toggle note selection with improved behavior
    const toggleNoteSelection = useCallback((noteId: string) => {
        if (!isSelectionMode) {
            // If not in selection mode, enter it and add this note
            setIsSelectionMode(true);
            setSelectedNoteIds([noteId]);
            return;
        }
        
        setSelectedNoteIds(prev => {
            // If already selected, remove it
            if (prev.includes(noteId)) {
                const newSelection = prev.filter(id => id !== noteId);
                // If no more selected notes, exit selection mode
                if (newSelection.length === 0) {
                    setIsSelectionMode(false);
                }
                return newSelection;
            }
            // Otherwise add it
            return [...prev, noteId];
        });
    }, [isSelectionMode]);

    // Selection clicked then menu more close
    const handleSelection = useCallback(() => {
        setIsMoreMenuOpen(false);
        setIsSelectionMode(true);
        // Clear any previously selected notes when entering selection mode
        setSelectedNoteIds([]);
    }, []);

    // Get the selected individual note 
    const selectedNote = useMemo(() => {
        return notes.find(note => selectedNoteIds.includes(note.id.toString())) || null;
    }, [selectedNoteIds, notes])

    // Optimized to use a callback for better performance
    const selectAllNotes = useCallback((notes: Note[]) => {
        setSelectedNoteIds(notes.map(note => note.id.toString()))
    }, []);

    // Toggle folder selection
    const toggleFolderSelection = useCallback((folderId: string) => {
        if (!isSelectionMode) {
            // If not in selection mode, enter it and add this folder
            setIsSelectionMode(true);
            setSelectedFolderIds([folderId]);
            return;
        }
        
        setSelectedFolderIds(prev => {
            // If already selected, remove it
            if (prev.includes(folderId)) {
                const newSelection = prev.filter(id => id !== folderId);
                // If no more selected folders, exit selection mode
                if (newSelection.length === 0) {
                    setIsSelectionMode(false);
                }
                return newSelection;
            }
            // Otherwise add it
            return [...prev, folderId];
        });
    }, [isSelectionMode]);

    // Select all folders
    const selectAllFolders = useCallback((folders: Folder[]) => {
        setSelectedFolderIds(folders.map(folder => folder.id.toString()));
    }, []);

    // Clear folder selection
    const clearFolderSelection = useCallback(() => {
        setSelectedFolderIds([]);
        if (selectedNoteIds.length === 0) {
            setIsSelectionMode(false);
        }
    }, [selectedNoteIds]);

    // Modified clear selection to clear both notes and folders
    const clearSelection = useCallback(() => {
        setSelectedNoteIds([]);
        setSelectedFolderIds([]);
        setIsSelectionMode(false);
    }, []);

    // Optimized to use a callback for better performance
    const toggleSelectionMode = useCallback(() => {
        setIsSelectionMode(prev => !prev);
        if(isSelectionMode){
            clearSelection();
            setIsMoreMenuOpen(false);
        }
    }, [isSelectionMode, clearSelection, setIsMoreMenuOpen]);

    const toggleNoteView = useCallback(() => {
        setIsViewMenuOpen(prev => !prev);
        setIsMoreMenuOpen(false);
    }, []);
    

    const handleSetNoteView = useCallback((view: string) => {
        setNoteView(view);
        setIsViewMenuOpen(false);
    }, []);

    // Check if in folder selection mode
    const isInFolderSelectionMode = useCallback(() => {
        return isSelectionMode && selectedFolderIds.length > 0;
    }, [isSelectionMode, selectedFolderIds]);

    // Handle back button press to cancel selection mode
    useEffect(() => {
        const backAction = () => {
            if (isSelectionMode) {
                clearSelection();
                return true; // Prevents default behavior (exit app)
            }
            return false; // Allows default behavior
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove(); // Cleanup on unmount
    }, [isSelectionMode, clearSelection]);

    return (
        <TabsContext.Provider value={{ 
            setIsSelectionMode, 
            setIsViewMenuOpen,
            setSelectedNoteIds, 
            selectedNoteIds, 
            isMoreMenuOpen, 
            isViewMenuOpen,
            setIsMoreMenuOpen, 
            noteView, 
            setNoteView, 
            notes,
            filteredNotes,
            favoriteNotes, 
            selectedNoteId, 
            setSelectedNoteId, 
            isSelectionMode, 
            toggleNoteSelection, 
            selectAllNotes, 
            clearSelection, 
            toggleSelectionMode,
            handleSelection,
            toggleNoteView,
            handleSetNoteView,
            // Folder selection
            selectedFolderIds,
            setSelectedFolderIds,
            toggleFolderSelection,
            selectAllFolders,
            clearFolderSelection,
            isInFolderSelectionMode
        }}>
            {children}
        </TabsContext.Provider>
    )
}

export const useTabs = () => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error("useTabs must be used within a TabsProvider");
    }
    return context;
}