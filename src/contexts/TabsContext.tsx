
import { createContext, useContext, useState } from "react";

interface TabsContextType {
    isMoreMenuOpen: boolean;
    setIsMoreMenuOpen: (isOpen: boolean) => void;
    noteView: "grid" | "list" | "table";
    setNoteView: (view: "grid" | "list" | "table") => void;
}
export const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const TabsProvider = ({ children }: { children: React.ReactNode }) => {
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [noteView, setNoteView] = useState<"grid" | "list" | "table">("list");

    return (
        <TabsContext.Provider value={{ isMoreMenuOpen, setIsMoreMenuOpen, noteView, setNoteView }}>{children}</TabsContext.Provider>
    )
}

export const useTabs = () => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error("useTabs must be used within a TabsProvider");
    }
    return context;
}