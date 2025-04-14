import { COLORS } from "@/src/constants/COLORS";
import { View, Text, StatusBar, useColorScheme, StyleSheet, Pressable } from "react-native";
import { useTabs } from "@/src/contexts/TabsContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Selection from "@/src/components/Selection";
import { useMemo } from "react";
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
    folderIcon: {
      width: 24,
      height: 24,
      borderRadius: 10,
      backgroundColor:'transparent',
    },
  }), [colorScheme]);

  function FolderItem({ folder }: { folder: Folder }) {
    // Check if folder has subfolders
    const hasSubfolders = foldersData.some(f => f.parentFolderId === folder.id);
    // Check if folder has notes
    const hasNotes = notesData.some(note => note.folderId === folder.id);
    // Show chevron if folder has either subfolders or notes
    const showChevron = hasSubfolders || hasNotes;
    // Check if folder is selected
    const isSelected = selectedFolderIds.includes(folder.id.toString());

    const handleFolderPress = () => {
      if (isSelectionMode) {
        toggleFolderSelection(folder.id.toString());
      } else {
        // Handle normal folder click (e.g., open folder)
        console.log("Open folder", folder.id);
      }
    };

    return (
      <Pressable 
        style={[
          FolderStyles.folderItem,
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
          <Pressable style={{padding: 3}} onPress={() => {}}>
            <Feather name="chevron-down" size={20} color={colorScheme === "dark" ? COLORS.dark.textSecondary : COLORS.light.textSecondary} />
          </Pressable>
        )}
      </Pressable>
    );
  }


  const FolderView = useMemo(() => {
    return <View style={FolderStyles.foldersContainer}>
      {/* Folder List */}
      <FlatList
        data={foldersData}
        renderItem={({ item }) => <FolderItem folder={item} />}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  }, [FolderStyles, selectedFolderIds, isSelectionMode, colorScheme]); // Add dependencies to re-render when selection changes



  
  
  
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
