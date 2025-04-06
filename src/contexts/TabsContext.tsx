import { createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";
import { Note } from "../types/Note";
import { notesData } from "../mock/NotesData";
interface TabsContextType {
    isMoreMenuOpen: boolean;
    setIsMoreMenuOpen: (isOpen: boolean) => void;
    noteView: "grid" | "list" | "table";
    setNoteView: (view: "grid" | "list" | "table") => void;
    notes: Note[];
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
}
export const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const TabsProvider = ({ children }: { children: React.ReactNode }) => {
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [notes, setNotes] = useState<Note[]>([]);
    const [noteView, setNoteView] = useState<"grid" | "list" | "table">("list");
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
    const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    // Initial Render
    useEffect(() => {
        setNotes(notesData)
    }, [])
    
    // Fast toggle note selection without extra logging or object spreading
    const toggleNoteSelection = useCallback((noteId: string) => {
        if (isSelectionMode) {
            setSelectedNoteIds(prev => {
                // If already selected, remove it
                if (prev.includes(noteId)) {
                    return prev.filter(id => id !== noteId);
                }
                // Otherwise add it
                return [...prev, noteId];
            });
        }
    }, [isSelectionMode]);

    // Get the selected individual note 
    const selectedNote = useMemo(() => {
        return notes.find(note => selectedNoteIds.includes(note.id.toString())) || null;
    }, [selectedNoteIds, notes])

    // Optimized to use a callback for better performance
    const selectAllNotes = useCallback((notes: Note[]) => {
        setSelectedNoteIds(notes.map(note => note.id.toString()))
    }, []);

    // Optimized to use a callback for better performance
    const clearSelection = useCallback(() => {
        setSelectedNoteIds([])
    }, []);
    
    // Optimized to use a callback for better performance
    const toggleSelectionMode = useCallback(() => {
        setIsSelectionMode(prev => !prev);
        if(isSelectionMode){
            clearSelection();
            setIsMoreMenuOpen(false);
        }
    }, [isSelectionMode, clearSelection, setIsMoreMenuOpen]);

    return (
        <TabsContext.Provider value={{ 
            setIsSelectionMode, 
            setSelectedNoteIds, 
            selectedNoteIds, 
            isMoreMenuOpen, 
            setIsMoreMenuOpen, 
            noteView, 
            setNoteView, 
            notes, 
            selectedNoteId, 
            setSelectedNoteId, 
            isSelectionMode, 
            toggleNoteSelection, 
            selectAllNotes, 
            clearSelection, 
            toggleSelectionMode 
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