import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, useColorScheme, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/src/constants/COLORS";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { foldersData } from "@/src/mock/NotesData";
import { CreateNoteProvider, useCreateNote } from "@/src/contexts/CreateNoteContext";

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
  } = useCreateNote();

  // Handle discard
  const handleDiscard = () => {
    router.back();
  };
  
  // Handle save and navigate back
  const handleSaveNote = () => {
    if (!title.trim() && !content.trim()) {
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
      paddingHorizontal: 15,
      backgroundColor: colorScheme === "dark" 
        ? 'rgba(0,0,0,0.2)' 
        : 'rgba(255,255,255,0.9)',
    },
    toolbarScrollContent: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 5,
    },
    toolbarButton: {
      padding: 10,
      borderRadius: 20,
      marginHorizontal: 8,
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
    },
    toolbarButtonPressed: {
      backgroundColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    },
    toolbarButtonActive: {
      backgroundColor: colorScheme === "dark" ? COLORS.dark.accent + '30' : COLORS.light.accent + '30',
    },
    toolbarDivider: {
      width: 1,
      height: 30,
      backgroundColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      marginHorizontal: 8,
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
    toolbarIconGroup: {
      flexDirection: "row",
      alignItems: "center",
    },
    drawingCanvas: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    drawingToolsContainer: {
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
    drawingToolsTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text,
      marginBottom: 15,
    },
    drawingToolsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 15,
    },
    drawingColorOption: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginHorizontal: 5,
      borderWidth: 1,
      borderColor: colorScheme === "dark" ? COLORS.dark.border : COLORS.light.border,
    },
    drawingColorSelected: {
      borderWidth: 2,
      borderColor: colorScheme === "dark" ? COLORS.dark.accent : COLORS.light.accent,
    },
    brushSizeContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      marginTop: 10,
    },
    brushSizeOption: {
      height: 30,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 5,
    },
    brushSizeDot: {
      backgroundColor: colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text,
      borderRadius: 50,
    },
    brushSizeSelected: {
      backgroundColor: colorScheme === "dark" ? COLORS.dark.accent : COLORS.light.accent,
    },
    drawingActionsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },
    drawingActionButton: {
      padding: 10,
      borderRadius: 5,
      backgroundColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      flexDirection: "row",
      alignItems: "center",
    },
    drawingActionText: {
      color: colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text,
      marginLeft: 5,
    }
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
            // Regular note content
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
          )}
          
          {/* Bottom toolbar */}
          <View style={styles.toolbarContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.toolbarScrollContent}
            >
              <View style={styles.toolbarIconGroup}>
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
                    isDrawingMode && styles.toolbarButtonActive,
                    pressed && styles.toolbarButtonPressed
                  ]} 
                  onPress={toggleDrawingMode}
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
                  onPress={toggleColorPicker}
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
              </View>
              
              <View style={styles.toolbarDivider} />
              
              <View style={styles.toolbarIconGroup}>
                <Pressable 
                  style={({ pressed }) => [
                    styles.toolbarButton,
                    pressed && styles.toolbarButtonPressed
                  ]} 
                  onPress={toggleFolderPicker}
                >
                  <Feather name="folder" size={20} color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} />
                </Pressable>
              </View>
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
                    toggleFolderPicker();
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
                      toggleFolderPicker();
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
          
          {/* Drawing tools popup */}
          {showDrawingTools && (
            <View style={styles.drawingToolsContainer}>
              <Text style={styles.drawingToolsTitle}>Drawing Tools</Text>
              
              <Text style={{color: colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text, marginBottom: 5}}>Colors:</Text>
              <View style={styles.drawingToolsRow}>
                {drawingColors.map((color) => (
                  <Pressable
                    key={color}
                    style={[
                      styles.drawingColorOption,
                      { backgroundColor: color },
                      selectedDrawingColor === color && styles.drawingColorSelected,
                    ]}
                    onPress={() => setSelectedDrawingColor(color)}
                  />
                ))}
              </View>
              
              <Text style={{color: colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text, marginBottom: 5}}>Brush Size:</Text>
              <View style={styles.brushSizeContainer}>
                {brushSizes.map((size) => (
                  <Pressable
                    key={size}
                    style={[
                      styles.brushSizeOption,
                      { width: size * 2 + 20 }
                    ]}
                    onPress={() => setSelectedBrushSize(size)}
                  >
                    <View
                      style={[
                        styles.brushSizeDot,
                        { width: size, height: size },
                        selectedBrushSize === size && styles.brushSizeSelected,
                      ]}
                    />
                  </Pressable>
                ))}
              </View>
              
              <View style={styles.drawingActionsRow}>
                <Pressable style={styles.drawingActionButton} onPress={clearDrawing}>
                  <Feather name="trash-2" size={16} color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} />
                  <Text style={styles.drawingActionText}>Clear</Text>
                </Pressable>
                
                <Pressable style={styles.drawingActionButton} onPress={toggleDrawingMode}>
                  <Feather name="check" size={16} color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} />
                  <Text style={styles.drawingActionText}>Done</Text>
                </Pressable>
              </View>
            </View>
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
        