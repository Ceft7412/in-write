import { COLORS } from "@/src/constants/COLORS";
import { View, Text, StatusBar, useColorScheme, StyleSheet, Pressable } from "react-native";
import { useTabs } from "@/src/contexts/TabsContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Selection from "@/src/components/Selection";
import { useMemo, useState } from "react";
import Header from "@/src/components/Header";
import { FlatList } from "react-native";
import { foldersData } from "@/src/mock/NotesData";
import { Folder } from "@/src/types/Note";
import Feather from "@expo/vector-icons/Feather";
import { notesData } from "@/src/mock/NotesData";

export default function Folders() {
  const colorScheme = useColorScheme();
  const { 
    isSelectionMode, 
    selectedNoteIds, 
    selectedFolderIds, 
    toggleFolderSelection, 
    isInFolderSelectionMode 
  } = useTabs();
  
  // State to track expanded folders
  const [expandedFolderIds, setExpandedFolderIds] = useState<number[]>([]);

  // Toggle folder expansion
  const toggleFolderExpansion = (folderId: number) => {
    setExpandedFolderIds(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId) 
        : [...prev, folderId]
    );
  };

  // Get all folders for display, organizing them by hierarchy
  const organizedFolders = useMemo(() => {
    // First get all root folders (those with no parent)
    const rootFolders = foldersData.filter(folder => folder.parentFolderId === null);
    
    // For each expanded folder, include its direct children
    let result = [...rootFolders];
    
    expandedFolderIds.forEach(expandedId => {
      // Find the index of the expanded folder in our result array
      const expandedFolderIndex = result.findIndex(f => f.id === expandedId);
      
      if (expandedFolderIndex !== -1) {
        // Get all direct children of this folder
        const children = foldersData.filter(f => f.parentFolderId === expandedId);
        
        // Insert children after the parent
        if (children.length > 0) {
          result = [
            ...result.slice(0, expandedFolderIndex + 1),
            ...children,
            ...result.slice(expandedFolderIndex + 1)
          ];
        }
      }
    });
    
    return result;
  }, [expandedFolderIds]);

  const FolderStyles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === "dark" ? COLORS.dark.background : COLORS.light.background,
    },
    innerContainer: {
      flex: 1,
      backgroundColor: colorScheme === "dark" ? COLORS.dark.background : COLORS.light.background,
      paddingVertical: 15,
      paddingHorizontal: 20,
    },
    foldersContainer: {
      flex: 1,
      paddingVertical: 15,
      backgroundColor: colorScheme === "dark" ? COLORS.dark.background : COLORS.light.background,
    },
    folderItem: {
      padding: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: colorScheme === "dark" ? COLORS.dark.border : COLORS.light.border,
      alignItems: "center",
      gap: 10,
      borderRadius: 10,
      backgroundColor: colorScheme === "dark" ? COLORS.dark.secondaryBackground : COLORS.light.secondaryBackground,
    },
    folderSelected: {
      borderColor: COLORS.light.accent,
      backgroundColor: colorScheme === "dark" ? COLORS.dark.accent + '20' : COLORS.light.accent + '20',
    },
    childFolder: {
      marginLeft: 20, // Indent child folders
    },
    folderIcon: {
      width: 24,
      height: 24,
      borderRadius: 10,
      backgroundColor: 'transparent',
    },
    chevronIcon: {
      transform: [{ rotate: '0deg' }],
    },
    chevronIconExpanded: {
      transform: [{ rotate: '180deg' }],
    },
  }), [colorScheme]);

  function FolderItem({ folder, isChild = false }: { folder: Folder, isChild?: boolean }) {
    // Check if folder has subfolders
    const hasSubfolders = foldersData.some(f => f.parentFolderId === folder.id);
    // Check if folder has notes
    const hasNotes = notesData.some(note => note.folderId === folder.id);
    // Show chevron if folder has either subfolders or notes
    const showChevron = hasSubfolders || hasNotes;
    // Check if folder is selected
    const isSelected = selectedFolderIds.includes(folder.id.toString());
    // Check if folder is expanded
    const isExpanded = expandedFolderIds.includes(folder.id);

    const handleFolderPress = () => {
      if (isSelectionMode) {
        toggleFolderSelection(folder.id.toString());
      } else {
        // Handle normal folder click (e.g., open folder)
        console.log("Open folder", folder.id);
      }
    };

    const handleChevronPress = (e: any) => {
      e.stopPropagation();
      toggleFolderExpansion(folder.id);
    };

    return (
      <Pressable 
        style={[
          FolderStyles.folderItem,
          isChild && FolderStyles.childFolder,
          isSelected && FolderStyles.folderSelected
        ]}
        onPress={handleFolderPress}
        onLongPress={() => toggleFolderSelection(folder.id.toString())}
      >
        <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
          <View style={FolderStyles.folderIcon}>
            <Feather name="folder" size={24} color={folder.folderColor === null ? (colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text) : folder.folderColor} />
          </View>
          <Text>{folder.name}</Text>
        </View>
        
        {/* Show chevron down if there are subfolders or children: folders or notes  */}
        {showChevron && (
          <Pressable 
            style={{padding: 5}} 
            onPress={handleChevronPress}
          >
            <Feather 
              name="chevron-down" 
              size={20} 
              color={colorScheme === "dark" ? COLORS.dark.textSecondary : COLORS.light.textSecondary} 
              style={[
                FolderStyles.chevronIcon,
                isExpanded && FolderStyles.chevronIconExpanded
              ]}
            />
          </Pressable>
        )}
      </Pressable>
    );
  }


  const FolderView = useMemo(() => {
    return <View style={FolderStyles.foldersContainer}>
      {/* Folder List */}
      <FlatList
        data={organizedFolders}
        renderItem={({ item }) => (
          <FolderItem 
            folder={item} 
            isChild={item.parentFolderId !== null}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  }, [FolderStyles, selectedFolderIds, isSelectionMode, colorScheme, organizedFolders]); // Add dependencies to re-render when selection changes
  
  
  
  return (
      <SafeAreaView style={FolderStyles.container}>
      <StatusBar translucent backgroundColor={colorScheme === "dark" ? COLORS.dark.background : COLORS.light.background}/>
      <View style={FolderStyles.innerContainer}>

        {/* Header */}
        {!isSelectionMode ? (
          <Header title="Folders" onPress={() => {}}/>
        ) : (
          <Selection 
            selectedIds={selectedFolderIds}
            selectionType="folders"
          />
        )}

        {/* Notes */}
        <View style={{flex:1}}>
          {FolderView}
        </View>
      </View>
    </SafeAreaView> 
  );
}
