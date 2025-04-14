import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, useColorScheme, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/src/constants/COLORS";
import { StatusBar } from "expo-status-bar";
import { useState, useMemo, useRef } from "react";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { Note } from "@/src/types/Note";
import { foldersData } from "@/src/mock/NotesData";
import { shareContent } from "@/src/components/ShareSheet";

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

export default function CreateNote() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  
  // Note state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // UI state
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFolderPicker, setShowFolderPicker] = useState(false);
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const [isAnyInputFocused, setIsAnyInputFocused] = useState(false);
  
  // Create the new note
  const handleSaveNote = () => {
    if (!title.trim() && !content.trim()) {
      // Don't save empty notes
      router.back();
      return;
    }

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
    // Here you would actually save the note to your data store
    
    router.back();
  };

  // Handle discard
  const handleDiscard = () => {
    router.back();
  };
  
  // Handle share
  const handleShare = () => {
    const noteToShare: Partial<Note> = {
      title: title,
      content: content,
    };
    shareContent(noteToShare as Note);
  };
  
  // Handle undo/redo
  const handleUndo = () => {
    console.log("Undo action");
    // Implement undo logic
  };
  
  const handleRedo = () => {
    console.log("Redo action");
    // Implement redo logic
  };

  // Get current folder name
  const currentFolder = useMemo(() => {
    if (!selectedFolderId) return "None";
    return foldersData.find(folder => folder.id === selectedFolderId)?.name || "None";
  }, [selectedFolderId]);

  // Styles
  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: selectedColor,
    },
    safeArea: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 15,
      paddingHorizontal: 15,
    },
    headerLeftGroup: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerRightGroup: {
      flexDirection: "row",
      alignItems: "center",
    },
    actionButton: {
      padding: 8,
      marginHorizontal: 2,
    },
    actionButtonPressed: {
      backgroundColor: colorScheme === "dark" ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.05)",
      borderRadius: 20,
    },
    titleInput: {
      fontSize: 24,
      fontWeight: "bold",
      color: colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text,
      paddingVertical: 10,
    },
    contentInput: {
      fontSize: 16,
      color: colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text,
      textAlignVertical: "top",
      flex: 1,
      paddingBottom: 20,
    },
    toolbarContainer: {
      borderTopWidth: 1,
      borderTopColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      paddingVertical: 10,
      paddingHorizontal: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: colorScheme === "dark" 
        ? 'rgba(0,0,0,0.2)' 
        : 'rgba(255,255,255,0.9)',
    },
    toolbarButton: {
      padding: 8,
      borderRadius: 20,
      marginHorizontal: 5,
    },
    toolbarButtonPressed: {
      backgroundColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    },
    toolsContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    popupContainer: {
      position: "absolute",
      bottom: 70,
      left: 20,
      right: 20,
      backgroundColor: colorScheme === "dark" ? COLORS.dark.card : COLORS.light.card,
      borderRadius: 10,
      padding: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    popupTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text,
      marginBottom: 10,
    },
    colorOptions: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    colorOption: {
      width: 30,
      height: 30,
      borderRadius: 15,
      margin: 5,
      borderWidth: 1,
      borderColor: colorScheme === "dark" ? COLORS.dark.border : COLORS.light.border,
    },
    colorOptionSelected: {
      borderWidth: 2,
      borderColor: colorScheme === "dark" ? COLORS.dark.accent : COLORS.light.accent,
    },
    folderOptions: {
      marginTop: 10,
    },
    folderOption: {
      padding: 10,
      borderRadius: 5,
      marginVertical: 5,
      flexDirection: "row",
      alignItems: "center",
    },
    folderOptionPressed: {
      backgroundColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    },
    folderName: {
      color: colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text,
      marginLeft: 10,
    },
    folderIcon: {
      width: 20,
      height: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    doneButton: {
      backgroundColor: colorScheme === "dark" ? COLORS.dark.accent : COLORS.light.accent,
      paddingHorizontal: 15,
      paddingVertical: 6,
      borderRadius: 15,
      marginLeft: 5,
    },
    doneButtonText: {
      color: "#FFFFFF",
      fontWeight: "bold",
      fontSize: 14,
    },
    backButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    backButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text,
      marginLeft: 5,
    },
    toolbarScrollContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    toolbarDivider: {
      width: 1,
      height: "100%",
      backgroundColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    },
  }), [colorScheme, selectedColor]);

  return (
    <View style={styles.container}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          {/* Header with all needed icons */}
          <View style={styles.header}>
            <View style={styles.headerLeftGroup}>
              <Pressable 
                style={({ pressed }) => [
                  styles.backButton,
                  pressed && styles.actionButtonPressed
                ]} 
                onPress={handleDiscard}
              >
                <Feather 
                  name="chevron-left" 
                  size={22} 
                  color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} 
                />
                <Text style={styles.backButtonText}>Notes</Text>
              </Pressable>
            </View>
            
            <View style={styles.headerRightGroup}>
            <Pressable 
                style={({ pressed }) => [
                  styles.actionButton,
                  pressed && styles.actionButtonPressed
                ]} 
                onPress={handleUndo}
              >
                <Feather 
                  name="corner-up-left" 
                  size={20} 
                  color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} 
                />
              </Pressable>
              
              <Pressable 
                style={({ pressed }) => [
                  styles.actionButton,
                  pressed && styles.actionButtonPressed
                ]} 
                onPress={handleRedo}
              >
                <Feather 
                  name="corner-up-right" 
                  size={20} 
                  color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} 
                />
              </Pressable>
              <Pressable 
                style={({ pressed }) => [
                  styles.actionButton,
                  pressed && styles.actionButtonPressed
                ]} 
                onPress={() => setIsFavorite(!isFavorite)}
              >
                <Feather 
                  name="heart" 
                  size={22} 
                  color={isFavorite ? "#f28b82" : (colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text)} 
                />
              </Pressable>
              
              <Pressable 
                style={({ pressed }) => [
                  styles.actionButton,
                  pressed && styles.actionButtonPressed
                ]} 
                onPress={handleShare}
              >
                <Feather 
                  name="share" 
                  size={22} 
                  color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} 
                />
              </Pressable>
              
              <Pressable 
                style={({ pressed }) => [
                  styles.actionButton,
                  pressed && styles.actionButtonPressed
                ]} 
              >
                <Feather 
                  name="more-vertical" 
                  size={22} 
                  color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} 
                />
              </Pressable>
              
              {isAnyInputFocused && (
                <Pressable 
                  style={styles.doneButton} 
                  onPress={handleSaveNote}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </Pressable>
              )}
            </View>
          </View>
          
          <ScrollView style={styles.content}>
            {/* Title input */}
            <TextInput
              style={styles.titleInput}
              placeholder="Title"
              placeholderTextColor={colorScheme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"}
              value={title}
              onChangeText={setTitle}
              multiline={false}
              maxLength={100}
              onFocus={() => setIsAnyInputFocused(true)}
              onBlur={() => {
                // Only set to false if content is also not focused
                if (!content) setIsAnyInputFocused(false);
              }}
            />
            
            {/* Content input */}
            <TextInput
              style={styles.contentInput}
              placeholder="Start typing..."
              placeholderTextColor={colorScheme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"}
              value={content}
              onChangeText={setContent}
              multiline={true}
              textAlignVertical="top"
              onFocus={() => setIsAnyInputFocused(true)}
              onBlur={() => {
                // Only set to false if title is also not focused
                if (!title) setIsAnyInputFocused(false);
              }}
            />
          </ScrollView>
          
          {/* Bottom toolbar */}
          <View style={styles.toolbarContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolbarScrollContent}>
              <Pressable 
                style={({ pressed }) => [
                  styles.toolbarButton,
                  pressed && styles.toolbarButtonPressed
                ]} 
              >
                <Feather name="type" size={20} color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} />
              </Pressable>
              
              <Pressable 
                style={({ pressed }) => [
                  styles.toolbarButton,
                  pressed && styles.toolbarButtonPressed
                ]} 
              >
                <Feather name="link" size={20} color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} />
              </Pressable>
              
              <Pressable 
                style={({ pressed }) => [
                  styles.toolbarButton,
                  pressed && styles.toolbarButtonPressed
                ]} 
              >
                <Feather name="edit-2" size={20} color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} />
              </Pressable>
              
              <Pressable 
                style={({ pressed }) => [
                  styles.toolbarButton,
                  pressed && styles.toolbarButtonPressed
                ]} 
              >
                <Feather name="paperclip" size={20} color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} />
              </Pressable>
              
              <Pressable 
                style={({ pressed }) => [
                  styles.toolbarButton,
                  pressed && styles.toolbarButtonPressed
                ]} 
              >
                <Feather name="check-square" size={20} color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} />
              </Pressable>
              
              <Pressable 
                style={({ pressed }) => [
                  styles.toolbarButton,
                  pressed && styles.toolbarButtonPressed
                ]} 
                onPress={() => {
                  setShowColorPicker(!showColorPicker);
                  setShowFolderPicker(false);
                }}
              >
                <Feather name="droplet" size={20} color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} />
              </Pressable>
              
              
              
              <Pressable 
                style={({ pressed }) => [
                  styles.toolbarButton,
                  pressed && styles.toolbarButtonPressed
                ]} 
              >
                <Feather name="list" size={20} color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} />
              </Pressable>
              
              <View style={styles.toolbarDivider} />
              
              <Pressable 
                style={({ pressed }) => [
                  styles.toolbarButton,
                  pressed && styles.toolbarButtonPressed
                ]} 
                onPress={() => {
                  setShowFolderPicker(!showFolderPicker);
                  setShowColorPicker(false);
                }}
              >
                <Feather name="folder" size={20} color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} />
              </Pressable>
            </ScrollView>
          </View>
          
          {/* Color picker popup */}
          {showColorPicker && (
            <View style={styles.popupContainer}>
              <Text style={styles.popupTitle}>Background Color</Text>
              <View style={styles.colorOptions}>
                {colorOptions.map((color) => (
                  <Pressable
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.colorOptionSelected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>
            </View>
          )}
          
          {/* Folder picker popup */}
          {showFolderPicker && (
            <View style={styles.popupContainer}>
              <Text style={styles.popupTitle}>Select Folder</Text>
              <ScrollView style={styles.folderOptions}>
                <Pressable
                  style={({ pressed }) => [
                    styles.folderOption,
                    pressed && styles.folderOptionPressed,
                  ]}
                  onPress={() => {
                    setSelectedFolderId(null);
                    setShowFolderPicker(false);
                  }}
                >
                  <View style={styles.folderIcon}>
                    <Feather 
                      name="file" 
                      size={20} 
                      color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} 
                    />
                  </View>
                  <Text style={styles.folderName}>None</Text>
                </Pressable>
                
                {foldersData.map((folder) => (
                  <Pressable
                    key={folder.id}
                    style={({ pressed }) => [
                      styles.folderOption,
                      pressed && styles.folderOptionPressed,
                    ]}
                    onPress={() => {
                      setSelectedFolderId(folder.id);
                      setShowFolderPicker(false);
                    }}
                  >
                    <View style={styles.folderIcon}>
                      <Feather 
                        name="folder" 
                        size={20} 
                        color={folder.folderColor || (colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text)} 
                      />
                    </View>
                    <Text style={styles.folderName}>{folder.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
        