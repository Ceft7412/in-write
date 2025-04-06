
import { createContext, useContext, useMemo, useState, useEffect } from "react";
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

    // Track when there is selected note
    useEffect(() => {
        if(selectedNoteId){
            console.log("Selected Note ID", selectedNoteId)
        }
    }, [selectedNoteId])

    const toggleNoteSelection = (noteId: string) => {
        setSelectedNoteIds(prev => {
            if(prev.includes(noteId)){
                return prev.filter(id => id !== noteId)
            }

            return [...prev, noteId]
        })
    }

    // Get the selected individual note 
    const selectedNote = useMemo(() => {
        return notes.find(note => selectedNoteIds.includes(note.id.toString())) || null;
    }, [selectedNoteIds, notes])

    const selectAllNotes = (notes: Note[]) => {
        setSelectedNoteIds(notes.map(note => note.id.toString()))
    }

    const clearSelection = () => {
        setSelectedNoteIds([])
    }
    
    const toggleSelectionMode = () => {
        setIsSelectionMode(prev => !prev);
        if(isSelectionMode){
            clearSelection();
        }
    }

    return (
        <TabsContext.Provider value={{ setSelectedNoteIds, selectedNoteIds, isMoreMenuOpen, setIsMoreMenuOpen, noteView, setNoteView, notes, selectedNoteId, setSelectedNoteId, isSelectionMode, toggleNoteSelection, selectAllNotes, clearSelection, toggleSelectionMode }}>{children}</TabsContext.Provider>
    )
}

export const useTabs = () => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error("useTabs must be used within a TabsProvider");
    }
    return context;
}