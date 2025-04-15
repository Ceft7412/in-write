import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, useColorScheme, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/src/constants/COLORS";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState, useEffect } from "react";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { foldersData } from "@/src/mock/NotesData";
import { CreateNoteProvider, useCreateNote } from "@/src/contexts/CreateNoteContext";
import ColorPickerPanel from "@/src/components/notes/create-note/ColorPickerPanel";
import DrawingToolsPanel from "@/src/components/notes/create-note/DrawingToolsPanel";
import FolderPickerPanel from "@/src/components/notes/create-note/FolderPickerPanel";
import NoteOptionsToolbar from "@/src/components/notes/create-note/NoteOptionsToolbar";
import TextFormattingToolbar from "@/src/components/notes/create-note/TextFormattingToolbar";
import BlockEditor from "@/src/components/notes/create-note/BlockEditor";
import NoteEditor from "@/src/components/notes/create-note/NoteEditor";
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

// Drawing brush options
const drawingColors = ['#000000', '#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF'];
const brushSizes = [2, 4, 6, 8, 10];

// Main component that uses the context
function CreateNoteContent() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const {
    // Note data
    title,
    selectedColor,
    selectedFolderId,
    isFavorite,
    
    // UI state
    showColorPicker,
    showFolderPicker,
    showTextFormatting,
    isAnyInputFocused,
    isTitleFocused,
    
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
    toggleTextFormatting,
    applyTextFormatting,
    setIsAnyInputFocused,
    setIsTitleFocused,
    setSelectedDrawingColor,
    setSelectedBrushSize,
    
    // Operations
    saveNote,
    shareNote,
    handleUndo,
    handleRedo,
    clearDrawing,
  } = useCreateNote();

  // Track the current text selection range
  const [currentSelectionRange, setCurrentSelectionRange] = useState<{start: number, end: number} | undefined>(undefined);

  // Handle discard
  const handleDiscard = () => {
    router.back();
  };
  
  // Handle save and navigate back
  const handleSaveNote = () => {
    if (!title.trim()) {
      // Don't save empty notes
      router.back();
      return;
    }

    saveNote();
    router.back();
  };

  // Get current folder name
  const currentFolder = useMemo(() => {
    if (!selectedFolderId) return "None";
    return foldersData.find(folder => folder.id === selectedFolderId)?.name || "None";
  }, [selectedFolderId]);

  // Handle keyboard show/hide
  const [keyboardShown, setKeyboardShown] = useState(false);
  
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardShown(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardShown(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // When text formatting toolbar is shown, dismiss keyboard
  useEffect(() => {
    // No longer dismiss keyboard to preserve selection
    // if (showTextFormatting) {
    //   Keyboard.dismiss();
    // }
  }, [showTextFormatting]);

  // Callback to receive selection range from BlockEditor
  const handleSelectionChange = (range: {start: number, end: number}) => {
    setCurrentSelectionRange(range);
  };

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
      marginBottom: 8,
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
    drawingCanvas: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    mainContentContainer: {
      flex: 1,
      paddingBottom: keyboardShown ? 0 : 60,
    },
    blockEditorContainer: {
      paddingBottom: toolbarHeight + 40,
    },
  }), [colorScheme, selectedColor, keyboardShown]);

  // Calculate the height of the toolbar area to ensure sufficient padding
  const toolbarHeight = 60; // Approximate height of the toolbar

  return (
    <View style={styles.container}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
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
                onPress={toggleFavorite}
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
                onPress={shareNote}
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
          
          <View style={[
            styles.mainContentContainer, 
            keyboardShown && { paddingBottom: toolbarHeight }
          ]} pointerEvents="box-none">
            {isDrawingMode ? (
              // Drawing canvas placeholder - in a real app, you'd use a proper drawing component
              <View style={styles.drawingCanvas}>
                <Text style={{
                  textAlign: 'center',
                  marginTop: 20,
                  color: colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text,
                }}>
                  Drawing Canvas
                  {'\n'}
                  (Pen color: {selectedDrawingColor}, Size: {selectedBrushSize})
                </Text>
              </View>
            ) : (
              // Block-based editor for notes
              <View style={styles.content}>
                {/* Title input */}
                <TextInput
                  style={styles.titleInput}
                  placeholder="Title"
                  placeholderTextColor={colorScheme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"}
                  value={title}
                  onChangeText={setTitle}
                  multiline={false}
                  maxLength={100}
                  onFocus={() => {
                    setIsAnyInputFocused(true);
                    setIsTitleFocused(true);
                  }}
                  onBlur={() => {
                    setIsTitleFocused(false);
                  }}
                />
                
                {/* Simple block editor */}
                <NoteEditor />
              </View>
            )}
          </View>
          
          {/* Bottom toolbar - only show when content is in focus, not title */}
          {!isTitleFocused && !showTextFormatting && (
            <NoteOptionsToolbar
              isDrawingMode={isDrawingMode}
              onToggleDrawingMode={toggleDrawingMode}
              onToggleColorPicker={toggleColorPicker}
              onToggleFolderPicker={toggleFolderPicker}
            />
          )}
          
          {/* Text formatting toolbar */}
          {showTextFormatting && (
            <TextFormattingToolbar
              onClose={toggleTextFormatting}
              onFormatText={applyTextFormatting}
              selectionRange={currentSelectionRange}
            />
          )}
          
          {/* Color picker popup */}
          {showColorPicker && (
            <ColorPickerPanel
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
            />
          )}
          
          {/* Folder picker popup */}
          {showFolderPicker && (
            <FolderPickerPanel
              folders={foldersData}
              selectedFolderId={selectedFolderId}
              onSelectFolder={setSelectedFolderId}
            />
          )}
          
          {/* Drawing tools popup */}
          {showDrawingTools && (
            <DrawingToolsPanel
              selectedDrawingColor={selectedDrawingColor}
              selectedBrushSize={selectedBrushSize}
              onSelectDrawingColor={setSelectedDrawingColor}
              onSelectBrushSize={setSelectedBrushSize}
              onClearDrawing={clearDrawing}
              onToggleDrawingMode={toggleDrawingMode}
            />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

// Define a wrapper component that provides the context
export default function CreateNote() {
  return (
    <CreateNoteProvider>
      <CreateNoteContent />
    </CreateNoteProvider>
  );
}
        